import { lstat, mkdir, realpath } from "node:fs/promises";
import path from "node:path";
import { AgentError } from "./errors.mjs";

const SECRET_KEY_PATTERN = /(^|[_-])(api[_-]?key|access[_-]?token|refresh[_-]?token|password|passwd|secret|private[_-]?key|authorization|cookie|session)([_-]|$)/i;
const SAFE_IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

export function assertSafeIdentifier(value, field = "identifier") {
  if (typeof value !== "string" || !SAFE_IDENTIFIER_PATTERN.test(value)) {
    throw new AgentError("INVALID_IDENTIFIER", `${field} contains unsupported characters.`, {
      field,
      allowed: "letters, numbers, dot, underscore, and hyphen; maximum 128 characters"
    });
  }
  return value;
}

export function assertNoSecretLikeData(value, location = "input", seen = new WeakSet()) {
  if (value === null || value === undefined) return;
  if (typeof value !== "object") return;
  if (seen.has(value)) return;
  seen.add(value);

  for (const [key, child] of Object.entries(value)) {
    if (SECRET_KEY_PATTERN.test(key) && child !== "" && child !== null && child !== undefined) {
      throw new AgentError("SECRET_GUARD", "Secret-like material is not accepted by this interface.", {
        location: `${location}.${key}`,
        remediation: "Pass credentials through an approved runtime vault integration, never in job JSON."
      });
    }
    assertNoSecretLikeData(child, `${location}.${key}`, seen);
  }
}

export function resolveInside(workspaceRoot, relativePath = ".") {
  if (typeof workspaceRoot !== "string" || workspaceRoot.trim() === "") {
    throw new AgentError("INVALID_WORKSPACE", "A workspace root is required.");
  }
  if (typeof relativePath !== "string" || relativePath.includes("\0")) {
    throw new AgentError("INVALID_PATH", "The requested path is invalid.");
  }

  const root = path.resolve(workspaceRoot);
  const candidate = path.resolve(root, relativePath);
  const relation = path.relative(root, candidate);
  if (relation === "" || (!relation.startsWith("..") && !path.isAbsolute(relation))) {
    return candidate;
  }
  throw new AgentError("PATH_GUARD", "The requested path escapes the workspace root.", {
    workspace_root: root,
    requested_path: relativePath
  });
}

export async function ensureWorkspaceRoot(workspaceRoot) {
  const root = path.resolve(workspaceRoot);
  await mkdir(root, { recursive: true, mode: 0o750 });
  const stats = await lstat(root);
  if (!stats.isDirectory() || stats.isSymbolicLink()) {
    throw new AgentError("WORKSPACE_GUARD", "Workspace root must be a real directory, not a symbolic link.", { workspace_root: root });
  }
  return realpath(root);
}

export async function assertNoSymlinkSegments(workspaceRoot, targetPath) {
  const root = path.resolve(workspaceRoot);
  const target = path.resolve(targetPath);
  const relation = path.relative(root, target);
  if (relation.startsWith("..") || path.isAbsolute(relation)) {
    throw new AgentError("PATH_GUARD", "The target path escapes the workspace root.");
  }

  let current = root;
  for (const segment of relation.split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    try {
      const stats = await lstat(current);
      if (stats.isSymbolicLink()) {
        throw new AgentError("SYMLINK_GUARD", "Symbolic links are not allowed in agent write paths.", { path: current });
      }
    } catch (error) {
      if (error?.code === "ENOENT") break;
      throw error;
    }
  }
}

export function assertApproval(approvals, action, owner = "Bambu") {
  const match = Array.isArray(approvals)
    ? approvals.find((approval) => approval?.action === action && approval?.approved_by === owner && approval?.status === "approved")
    : undefined;

  if (!match) {
    throw new AgentError("APPROVAL_REQUIRED", `Explicit ${owner} approval is required for ${action}.`, {
      required_approval: { action, approved_by: owner, status: "approved", approved_at: "ISO-8601 timestamp" }
    }, 403);
  }
  if (Number.isNaN(Date.parse(match.approved_at))) {
    throw new AgentError("INVALID_APPROVAL", "Approval is missing a valid approved_at timestamp.", { action });
  }
  return match;
}
