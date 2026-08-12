export type CloudOrganization = {
  id: string
  name: string
  slug: string
}

export type CloudProject = {
  id: string
  organization_id: string
  name: string
  slug: string
  canonical_manifest_path: string
  canonical_manifest_hash: string | null
}

export type CloudWorkspaceContext = {
  userId: string
  email: string | null
  organization: CloudOrganization
  project: CloudProject
}

export type CloudWorkOrderReceipt = {
  id: string
  status: 'queued' | 'planned' | 'running' | 'needs_approval' | 'completed' | 'failed' | 'canceled'
  intent: string
  created_at: string
}
