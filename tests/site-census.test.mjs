import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateUrl,
  resolveAndCheckHost,
  extractSitemapUrls,
  extractUrlsFromSitemap,
  extractPageUrls,
  extractColors,
  extractFontFamilies,
  extractTitle,
  extractMetaDescription,
  extractHeadings,
  extractLogoCandidates,
  extractTechnicalMetadata,
  createSiteCensusResult,
  createPageEvidence,
  CRAWL_LIMITS,
  BLOCKED_PORTS,
  ALLOWED_PORTS
} from "../src/research/site-census.mjs";
import { AgentError } from "../src/agent/errors.mjs";

test("validateUrl accepts valid https URL", () => {
  const result = validateUrl("https://example.com/page");
  assert.equal(result.hostname, "example.com");
  assert.equal(result.protocol, "https:");
  assert.equal(result.port, 443);
});

test("validateUrl accepts valid http URL", () => {
  const result = validateUrl("http://example.com");
  assert.equal(result.hostname, "example.com");
  assert.equal(result.protocol, "http:");
  assert.equal(result.port, 80);
});

test("validateUrl rejects non-http protocols", () => {
  assert.throws(() => validateUrl("file:///etc/passwd"), /Only http and https/);
  assert.throws(() => validateUrl("ftp://example.com"), /Only http and https/);
});

test("validateUrl rejects localhost", () => {
  assert.throws(() => validateUrl("http://localhost"), /Localhost/);
  assert.throws(() => validateUrl("http://localhost.localdomain"), /Localhost/);
});

test("validateUrl rejects internal TLDs", () => {
  assert.throws(() => validateUrl("http://app.internal"), /Internal TLDs/);
  assert.throws(() => validateUrl("http://service.local"), /Internal TLDs/);
});

test("validateUrl rejects blocked ports", () => {
  assert.throws(() => validateUrl("http://example.com:22"), /Blocked port/);
  assert.throws(() => validateUrl("http://example.com:3306"), /Blocked port/);
  assert.throws(() => validateUrl("http://example.com:5432"), /Blocked port/);
});

test("validateUrl rejects invalid URLs", () => {
  assert.throws(() => validateUrl("not-a-url"), /URL is not valid/);
  assert.throws(() => validateUrl(""), /non-empty string/);
  assert.throws(() => validateUrl(null), /non-empty string/);
});

test("crawl limits enforce bounded crawl", () => {
  assert.ok(CRAWL_LIMITS.max_pages <= 50, "Max pages should be bounded");
  assert.ok(CRAWL_LIMITS.max_depth <= 5, "Max depth should be bounded");
  assert.ok(CRAWL_LIMITS.request_timeout_ms <= 30000, "Timeout should be reasonable");
  assert.ok(CRAWL_LIMITS.max_response_size_bytes <= 10 * 1024 * 1024, "Max size should be bounded");
  assert.ok(CRAWL_LIMITS.max_concurrent_requests <= 5, "Concurrency should be bounded");
  assert.ok(CRAWL_LIMITS.rate_limit_ms >= 200, "Rate limit should prevent hammering");
});

test("extractSitemapUrls finds Sitemap directives in robots.txt", () => {
  const robots = "User-agent: *\nDisallow: /private\nSitemap: https://example.com/sitemap.xml\nSitemap: https://example.com/sitemap-2.xml";
  const urls = extractSitemapUrls("https://example.com", robots);
  assert.equal(urls.length, 2);
  assert.ok(urls.includes("https://example.com/sitemap.xml"));
  assert.ok(urls.includes("https://example.com/sitemap-2.xml"));
});

test("extractSitemapUrls returns empty for no sitemaps", () => {
  assert.deepEqual(extractSitemapUrls("https://example.com", "User-agent: *\nDisallow: /"), []);
  assert.deepEqual(extractSitemapUrls("https://example.com", ""), []);
});

test("extractUrlsFromSitemap parses XML sitemap", () => {
  const xml = '<?xml version="1.0"?><urlset><url><loc>https://example.com/</loc></url><url><loc>https://example.com/about</loc></url></urlset>';
  const urls = extractUrlsFromSitemap(xml);
  assert.equal(urls.length, 2);
  assert.ok(urls.includes("https://example.com/"));
  assert.ok(urls.includes("https://example.com/about"));
});

test("extractPageUrls finds anchor links in HTML", () => {
  const html = '<a href="/about">About</a><a href="https://example.com/contact">Contact</a><a href="https://other.com">Other</a>';
  const urls = extractPageUrls(html, "https://example.com");
  assert.ok(urls.includes("https://example.com/about"));
  assert.ok(urls.includes("https://example.com/contact"));
  assert.ok(urls.some((u) => u.startsWith("https://other.com")));
});

test("extractPageUrls handles empty HTML", () => {
  assert.deepEqual(extractPageUrls("", "https://example.com"), []);
  assert.deepEqual(extractPageUrls(null, "https://example.com"), []);
});

test("extractColors finds hex and rgb colors", () => {
  const html = '<style>.x { color: #FF0000; background: #fff; } .y { color: rgba(0,0,0,0.5); }</style>';
  const colors = extractColors(html);
  assert.ok(colors.includes("#ff0000"));
  assert.ok(colors.includes("#fff"));
  assert.ok(colors.some((c) => c.includes("rgba")));
});

test("extractColors limits to 50 results", () => {
  let html = "<style>";
  for (let i = 0; i < 100; i++) html += `.x${i} { color: #${i.toString(16).padStart(6, "0")}; }`;
  html += "</style>";
  const colors = extractColors(html);
  assert.ok(colors.length <= 50);
});

test("extractFontFamilies finds font-family declarations", () => {
  const html = '<style>.x { font-family: "Inter", sans-serif; } .y { font-family: Georgia, serif; }</style>';
  const fonts = extractFontFamilies(html);
  assert.ok(fonts.includes("Inter"));
  assert.ok(fonts.includes("sans-serif"));
  assert.ok(fonts.includes("Georgia"));
  assert.ok(fonts.includes("serif"));
});

test("extractTitle finds the page title", () => {
  assert.equal(extractTitle("<html><head><title>Test Page</title></head></html>"), "Test Page");
  assert.equal(extractTitle("<title>Hello World</title>"), "Hello World");
  assert.equal(extractTitle("<html><head></head></html>"), null);
});

test("extractMetaDescription finds meta description", () => {
  const html = '<meta name="description" content="A test page about brands.">';
  assert.equal(extractMetaDescription(html), "A test page about brands.");
  assert.equal(extractMetaDescription("<html></html>"), null);
});

test("extractHeadings finds H1-H6", () => {
  const html = "<h1>Main Title</h1><h2>Section</h2><h3>Subsection</h3>";
  const headings = extractHeadings(html);
  assert.equal(headings.length, 3);
  assert.equal(headings[0].tag, "h1");
  assert.equal(headings[0].text, "Main Title");
});

test("extractHeadings limits to 50 results", () => {
  let html = "";
  for (let i = 0; i < 100; i++) html += `<h2>Heading ${i}</h2>`;
  const headings = extractHeadings(html);
  assert.ok(headings.length <= 50);
});

test("extractLogoCandidates finds logo images", () => {
  const html = '<img src="/logo.png" alt="Logo"><img src="/brand-mark.svg" alt="Brand"><img src="/photo.jpg" alt="Photo">';
  const logos = extractLogoCandidates(html, "https://example.com");
  assert.ok(logos.length >= 2);
  assert.ok(logos.some((l) => l.src.includes("logo")));
  assert.ok(logos.some((l) => l.src.includes("brand")));
});

test("extractLogoCandidates resolves relative URLs", () => {
  const html = '<img src="/images/logo.png" alt="Logo">';
  const logos = extractLogoCandidates(html, "https://example.com");
  assert.equal(logos[0].src, "https://example.com/images/logo.png");
});

test("extractTechnicalMetadata detects framework hints", () => {
  const html = '<html><head><script src="/_next/static/chunk.js"></script></head></html>';
  const meta = extractTechnicalMetadata(html, { content_type: "text/html", headers: { server: "nginx" } });
  assert.ok(meta.framework_hints.includes("Next.js"));
  assert.equal(meta.server, "nginx");
  assert.equal(meta.content_type, "text/html");
});

test("extractTechnicalMetadata detects viewport meta", () => {
  const html = '<meta name="viewport" content="width=device-width, initial-scale=1">';
  const meta = extractTechnicalMetadata(html, {});
  assert.equal(meta.has_viewport, true);
});

test("extractTechnicalMetadata detects responsive CSS", () => {
  const html = '<style>@media (max-width: 768px) { .x { display: none; } }</style>';
  const meta = extractTechnicalMetadata(html, {});
  assert.equal(meta.has_responsive_css, true);
});

test("createSiteCensusResult produces valid structure", () => {
  const result = createSiteCensusResult({ project_id: "test-1", start_url: "https://example.com" });
  assert.equal(result.schema_version, "1.0");
  assert.equal(result.project_id, "test-1");
  assert.equal(result.start_url, "https://example.com");
  assert.ok(Array.isArray(result.pages_crawled));
  assert.ok(Array.isArray(result.evidence));
  assert.ok(Array.isArray(result.errors));
});

test("createPageEvidence produces EvidenceRecord", () => {
  const evidence = createPageEvidence("test-1", "https://example.com", { title: "Test" });
  assert.equal(evidence.project_id, "test-1");
  assert.equal(evidence.source_url, "https://example.com");
  assert.equal(evidence.source_type, "website");
  assert.equal(evidence.verification_state, "verified");
  assert.equal(evidence.usable_for_public_claims, true);
});

test("SSRF protection: resolveAndCheckHost blocks private IPs", async () => {
  await assert.rejects(() => resolveAndCheckHost("localhost"), AgentError);
});

test("blocked ports include common database and email ports", () => {
  assert.ok(BLOCKED_PORTS.has(22), "SSH should be blocked");
  assert.ok(BLOCKED_PORTS.has(3306), "MySQL should be blocked");
  assert.ok(BLOCKED_PORTS.has(5432), "PostgreSQL should be blocked");
  assert.ok(BLOCKED_PORTS.has(6379), "Redis should be blocked");
});

test("allowed ports include only web ports", () => {
  assert.ok(ALLOWED_PORTS.has(80));
  assert.ok(ALLOWED_PORTS.has(443));
  assert.ok(!ALLOWED_PORTS.has(22));
  assert.ok(!ALLOWED_PORTS.has(3306));
});

test("extractPageUrls deduplicates URLs", () => {
  const html = '<a href="/about">About</a><a href="/about">About Again</a>';
  const urls = extractPageUrls(html, "https://example.com");
  const unique = [...new Set(urls)];
  assert.equal(urls.length, unique.length);
});

test("extractColors handles empty HTML", () => {
  assert.deepEqual(extractColors(""), []);
  assert.deepEqual(extractColors(null), []);
});

test("extractFontFamilies handles empty HTML", () => {
  assert.deepEqual(extractFontFamilies(""), []);
  assert.deepEqual(extractFontFamilies(null), []);
});
