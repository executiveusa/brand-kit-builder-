export type CloudOrganization = {
  id: string
  name: string
  role: 'owner' | 'admin' | 'editor' | 'reviewer' | 'viewer'
  slug: string
}

export type CloudProject = {
  id: string
  organization_id: string
  name: string
  icm_path: string | null
  status: 'active' | 'paused' | 'archived'
}

export type CloudWorkspaceContext = {
  userId: string
  email: string | null
  organization: CloudOrganization
  project: CloudProject
}

export type CloudWorkOrderReceipt = {
  id: string
  organization_id: string
  project_id: string
  status: 'queued' | 'planned' | 'running' | 'needs_approval' | 'completed' | 'failed' | 'canceled'
  intent: string
  requires_approval: boolean
  created_at: string
}
