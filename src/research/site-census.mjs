import { lookup } from "node:dns/promises";
import { hostname as getHostname } from "node:os";
import { Agent } from "node:http";
import https from "node:https";
import http from "node:http";
import { AgentError } from "../agent/errors.mjs";
import { createEvidenceRecord } from "../../apps/studio/contracts.js";

const PRIVATE_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^::1$/,
  /^fc00:/i,
  /^fd00:/i,
  /^fe80:/i,
  /^::ffff:127\./i,
  /^::ffff:10\./i,
  /^::ffff:192\.168\./i
];

const LOCALHOST_NAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "ip6-localhost",
  "ip6-loopback",
  "broadcasthost"
]);

const BLOCKED_PORTS = new Set([22, 25, 465, 587, 2525, 3306, 5432, 6379, 27017, 9200]);
const ALLOWED_PORTS = new Set([80, 443, 8080, 8443]);

export { BLOCKED_PORTS, ALLOWED_PORTS };

export const CRAWL_LIMITS = {
  max_pages: 25,
  max_depth: 3,
  request_timeout_ms: 10000,
  max_response_size_bytes: 5 * 1024 * 1024,
  max_concurrent_requests: 3,
  rate_limit_ms: 500,
  max_redirects: 3
};

export function validateUrl(input) {
  if (!input || typeof input !== "string") {
    throw new AgentError("INVALID_URL", "URL must be a non-empty string.", { received: input });
  }
  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    throw new AgentError("INVALID_URL", "URL is not valid.", { received: input });
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new AgentError("INVALID_URL", "Only http and https protocols are allowed.", { protocol: parsed.protocol });
  }
  const hostname = parsed.hostname.toLowerCase();
  if (LOCALHOST_NAMES.has(hostname)) {
    throw new AgentError("SSRF_BLOCKED", "Localhost hostnames are blocked.", { hostname });
  }
  if (hostname.endsWith(".local") || hostname.endsWith(".internal")) {
    throw new AgentError("SSRF_BLOCKED", "Internal TLDs are blocked.", { hostname });
  }
  const port = parsed.port ? Number(parsed.port) : parsed.protocol === "https:" ? 443 : 80;
  if (BLOCKED_PORTS.has(port)) {
    throw new AgentError("SSRF_BLOCKED", "Blocked port.", { port });
  }
  if (!ALLOWED_PORTS.has(port) && port !== 80 && port !== 443) {
    throw new AgentError("SSRF_BLOCKED", "Port is not in the allowed list.", { port, allowed: [...ALLOWED_PORTS] });
  }
  return {
    url: parsed.href,
    protocol: parsed.protocol,
    hostname,
    port,
    pathname: parsed.pathname,
    search: parsed.search
  };
}

export async function resolveAndCheckHost(hostname) {
  try {
    const addresses = await lookup(hostname, { all: true });
    for (const addr of addresses) {
      const ip = addr.address;
      if (PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(ip))) {
        throw new AgentError("SSRF_BLOCKED", "Resolved to a private IP address.", { hostname, ip });
      }
    }
    return addresses.map((a) => a.address);
  } catch (error) {
    if (error instanceof AgentError) throw error;
    throw new AgentError("DNS_RESOLUTION_FAILED", "Could not resolve hostname.", { hostname, error: error.message });
  }
}

export async function safeFetch(url, options = {}) {
  const validated = validateUrl(url);
  await resolveAndCheckHost(validated.hostname);
  const timeout = options.timeout_ms || CRAWL_LIMITS.request_timeout_ms;
  const maxSize = options.max_response_size_bytes || CRAWL_LIMITS.max_response_size_bytes;
  const maxRedirects = options.max_redirects ?? CRAWL_LIMITS.max_redirects;

  return new Promise((resolve, reject) => {
    const protocol = validated.protocol === "https:" ? https : http;
    const agent = new Agent({
      rejectUnauthorized: true,
      maxSockets: 1
    });

    const req = protocol.get(validated.url, {
      agent,
      timeout,
      headers: {
        "User-Agent": "PauliBrandStudio/0.3.0 (research-crawler; contact@pauli.effect)",
        "Accept": "text/html,application/xhtml+xml,application/xml,text/css,application/javascript;q=0.9,*/*;q=0.1",
        "Accept-Language": "en,es-MX;q=0.5"
      }
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        if (maxRedirects <= 0) {
          reject(new AgentError("REDIRECT_LIMIT_EXCEEDED", "Maximum redirects exceeded.", { url, redirects: CRAWL_LIMITS.max_redirects }));
          response.destroy();
          return;
        }
        let redirectUrl;
        try {
          redirectUrl = new URL(response.headers.location, validated.url).href;
        } catch {
          reject(new AgentError("INVALID_REDIRECT", "Redirect URL is invalid.", { location: response.headers.location }));
          response.destroy();
          return;
        }
        try {
          validateUrl(redirectUrl);
        } catch (error) {
          reject(error);
          response.destroy();
          return;
        }
        safeFetch(redirectUrl, { ...options, max_redirects: maxRedirects - 1 }).then(resolve).catch(reject);
        response.destroy();
        return;
      }
      if (response.statusCode < 200 || response.statusCode >= 300) {
        reject(new AgentError("FETCH_FAILED", `HTTP ${response.statusCode}`, { url: validated.url, status: response.statusCode }));
        response.destroy();
        return;
      }
      const contentType = response.headers["content-type"] || "";
      let body = "";
      let bodySize = 0;
      let truncated = false;
      response.on("data", (chunk) => {
        bodySize += chunk.length;
        if (bodySize > maxSize) {
          truncated = true;
          response.destroy();
          reject(new AgentError("RESPONSE_TOO_LARGE", "Response exceeded size limit.", { url: validated.url, size: bodySize, limit: maxSize }));
          return;
        }
        body += chunk.toString("utf8");
      });
      response.on("end", () => {
        if (!truncated) {
          resolve({
            url: validated.url,
            status: response.statusCode,
            headers: response.headers,
            body,
            content_type: contentType,
            size: bodySize
          });
        }
      });
      response.on("error", (error) => {
        reject(new AgentError("FETCH_ERROR", "Error reading response.", { url: validated.url, error: error.message }));
      });
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new AgentError("REQUEST_TIMEOUT", "Request timed out.", { url: validated.url, timeout }));
    });
    req.on("error", (error) => {
      reject(new AgentError("FETCH_ERROR", "Request failed.", { url: validated.url, error: error.message }));
    });
  });
}

export function extractSitemapUrls(baseUrl, robotsTxt) {
  if (!robotsTxt) return [];
  const lines = robotsTxt.split("\n");
  const sitemapUrls = [];
  for (const line of lines) {
    const match = line.match(/^sitemap:\s*(.+)$/i);
    if (match) {
      try {
        const sitemapUrl = new URL(match[1].trim(), baseUrl).href;
        sitemapUrls.push(sitemapUrl);
      } catch {}
    }
  }
  return sitemapUrls;
}

export function extractUrlsFromSitemap(sitemapXml) {
  if (!sitemapXml) return [];
  const urls = [];
  const locPattern = /<loc>([^<]+)<\/loc>/gi;
  let match;
  while ((match = locPattern.exec(sitemapXml)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
}

export function extractPageUrls(html, baseUrl) {
  if (!html) return [];
  const urls = new Set();
  const linkPattern = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = linkPattern.exec(html)) !== null) {
    try {
      const resolved = new URL(match[1], baseUrl);
      if (resolved.protocol === "http:" || resolved.protocol === "https:") {
        urls.add(resolved.href);
      }
    } catch {}
  }
  return [...urls];
}

export function extractColors(html) {
  if (!html) return [];
  const colors = new Set();
  const hexPattern = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
  const rgbPattern = /rgba?\([^)]+\)/gi;
  let match;
  while ((match = hexPattern.exec(html)) !== null) {
    colors.add(match[0].toLowerCase());
  }
  while ((match = rgbPattern.exec(html)) !== null) {
    colors.add(match[0].replace(/\s/g, ""));
  }
  return [...colors].slice(0, 50);
}

export function extractFontFamilies(html) {
  if (!html) return [];
  const fonts = new Set();
  const pattern = /font-family\s*:\s*([^;}\n]+)/gi;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const raw = match[1];
    const cleaned = raw.replace(/['"]/g, "");
    const families = cleaned.split(",").map((f) => f.trim()).filter(Boolean);
    for (const family of families) {
      fonts.add(family);
    }
  }
  return [...fonts];
}

export function extractTitle(html) {
  const match = html?.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}

export function extractMetaDescription(html) {
  const match = html?.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  return match ? match[1].trim() : null;
}

export function extractHeadings(html) {
  if (!html) return [];
  const headings = [];
  const pattern = /<(h[1-6])[^>]*>([^<]+)<\/h[1-6]>/gi;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    headings.push({ tag: match[1].toLowerCase(), text: match[2].trim() });
  }
  return headings.slice(0, 50);
}

export function extractLogoCandidates(html, baseUrl) {
  if (!html) return [];
  const candidates = [];
  const imgPattern = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgPattern.exec(html)) !== null) {
    const src = match[1];
    if (src.toLowerCase().includes("logo") || src.toLowerCase().includes("brand")) {
      try {
        candidates.push({ src: new URL(src, baseUrl).href, type: "img" });
      } catch {}
    }
  }
  const svgPattern = /<svg[^>]*>[\s\S]*?<\/svg>/gi;
  while ((match = svgPattern.exec(html)) !== null) {
    if (match[0].toLowerCase().includes("logo") || match[0].length < 5000) {
      candidates.push({ src: "inline-svg", type: "svg", snippet: match[0].slice(0, 200) });
    }
  }
  return candidates.slice(0, 10);
}

export function extractTechnicalMetadata(html, response) {
  const meta = {
    content_type: response?.content_type || null,
    server: response?.headers?.server || null,
    powered_by: response?.headers?.["x-powered-by"] || null,
    has_viewport: /<meta[^>]+name=["']viewport["']/i.test(html || ""),
    has_responsive_css: /@media/i.test(html || ""),
    framework_hints: []
  };
  if (/__next|_next\//i.test(html || "")) meta.framework_hints.push("Next.js");
  if (/__nuxt|_nuxt\//i.test(html || "")) meta.framework_hints.push("Nuxt");
  if (/react/i.test(html || "")) meta.framework_hints.push("React");
  if (/vue/i.test(html || "")) meta.framework_hints.push("Vue");
  if (/angular/i.test(html || "")) meta.framework_hints.push("Angular");
  if (/svelte/i.test(html || "")) meta.framework_hints.push("Svelte");
  if (/wordpress|wp-content/i.test(html || "")) meta.framework_hints.push("WordPress");
  if (/shopify/i.test(html || "")) meta.framework_hints.push("Shopify");
  if (/webflow/i.test(html || "")) meta.framework_hints.push("Webflow");
  if (/squarespace/i.test(html || "")) meta.framework_hints.push("Squarespace");
  return meta;
}

export function createSiteCensusResult(input = {}) {
  return {
    schema_version: "1.0",
    census_version: "1.0.0",
    project_id: input.project_id || null,
    start_url: input.start_url || null,
    started_at: input.started_at || new Date().toISOString(),
    completed_at: input.completed_at || null,
    pages_crawled: Array.isArray(input.pages_crawled) ? input.pages_crawled : [],
    page_count: input.pages_crawled?.length || 0,
    sitemaps_found: Array.isArray(input.sitemaps_found) ? input.sitemaps_found : [],
    colors_extracted: Array.isArray(input.colors_extracted) ? input.colors_extracted : [],
    fonts_extracted: Array.isArray(input.fonts_extracted) ? input.fonts_extracted : [],
    logo_candidates: Array.isArray(input.logo_candidates) ? input.logo_candidates : [],
    technical_metadata: input.technical_metadata || null,
    evidence: Array.isArray(input.evidence) ? input.evidence : [],
    errors: Array.isArray(input.errors) ? input.errors : []
  };
}

export function createPageEvidence(projectId, pageUrl, pageData) {
  return createEvidenceRecord({
    evidence_id: `census-${Buffer.from(pageUrl).toString("hex").slice(0, 16)}`,
    project_id: projectId,
    claim: `Page crawled: ${pageUrl}`,
    source_url: pageUrl,
    source_type: "website",
    confidence: 1.0,
    verification_state: "verified",
    usable_for_public_claims: true
  });
}

export async function performSiteCensus(projectId, startUrl, options = {}) {
  const validated = validateUrl(startUrl);
  const limits = { ...CRAWL_LIMITS, ...options.limits };
  const result = createSiteCensusResult({
    project_id: projectId,
    start_url: validated.url,
    started_at: new Date().toISOString()
  });

  try {
    const robotsResponse = await safeFetch(`${validated.protocol}//${validated.hostname}/robots.txt`, limits);
    const sitemapUrls = extractSitemapUrls(validated.url, robotsResponse.body);
    result.sitemaps_found = sitemapUrls;

    const startResponse = await safeFetch(validated.url, limits);
    const pageData = {
      url: validated.url,
      title: extractTitle(startResponse.body),
      description: extractMetaDescription(startResponse.body),
      headings: extractHeadings(startResponse.body),
      colors: extractColors(startResponse.body),
      fonts: extractFontFamilies(startResponse.body),
      logos: extractLogoCandidates(startResponse.body, validated.url),
      technical: extractTechnicalMetadata(startResponse.body, startResponse)
    };
    result.pages_crawled.push(pageData);
    result.evidence.push(createPageEvidence(projectId, validated.url, pageData));

    result.colors_extracted = pageData.colors;
    result.fonts_extracted = pageData.fonts;
    result.logo_candidates = pageData.logos;
    result.technical_metadata = pageData.technical;

    const pageUrls = extractPageUrls(startResponse.body, validated.url).slice(0, limits.max_pages - 1);
    for (const pageUrl of pageUrls) {
      if (result.pages_crawled.length >= limits.max_pages) break;
      try {
        const validatedPage = validateUrl(pageUrl);
        if (validatedPage.hostname !== validated.hostname) continue;
        await new Promise((r) => setTimeout(r, limits.rate_limit_ms));
        const pageResponse = await safeFetch(pageUrl, limits);
        const subPageData = {
          url: pageUrl,
          title: extractTitle(pageResponse.body),
          description: extractMetaDescription(pageResponse.body),
          headings: extractHeadings(pageResponse.body),
          colors: extractColors(pageResponse.body),
          fonts: extractFontFamilies(pageResponse.body),
          logos: extractLogoCandidates(pageResponse.body, pageUrl),
          technical: extractTechnicalMetadata(pageResponse.body, pageResponse)
        };
        result.pages_crawled.push(subPageData);
        result.evidence.push(createPageEvidence(projectId, pageUrl, subPageData));
      } catch (error) {
        result.errors.push({ url: pageUrl, error: error.message || String(error) });
      }
    }
  } catch (error) {
    result.errors.push({ url: validated.url, error: error.message || String(error) });
  }

  result.completed_at = new Date().toISOString();
  result.page_count = result.pages_crawled.length;
  return result;
}

export { safeFetch as fetch };
