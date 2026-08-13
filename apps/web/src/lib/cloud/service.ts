import { supabase } from './client'
import type { CloudOrganization, CloudProject, CloudWorkOrderReceipt } from './contracts'

type OrganizationRpcRow = {
  id: string
  name: string
  role: CloudOrganization['role']
}

function requireClient() {
  if (!supabase) throw new Error('Cloud mode is not configured for this build.')
  return supabase
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function getCloudUser() {
  const client = requireClient()
  const { data, error } = await client.auth.getUser()
  if (error) throw error
  return data.user
}

export async function sendMagicLink(email: string) {
  const client = requireClient()
  const { error } = await client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  })
  if (error) throw error
}

export async function signOutCloudUser() {
  const client = requireClient()
  const { error } = await client.auth.signOut()
  if (error) throw error
}

export async function listOrganizations(): Promise<CloudOrganization[]> {
  const client = requireClient()
  const { data, error } = await client.rpc('brand_studio_list_organizations')
  if (error) throw error
  return ((data ?? []) as OrganizationRpcRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    role: row.role,
    slug: slugify(row.name),
  }))
}

export async function createOrganization(name: string): Promise<CloudOrganization> {
  const client = requireClient()
  if (!slugify(name)) throw new Error('Organization name must contain letters or numbers.')
  const { data, error } = await client.rpc('brand_studio_create_organization', { p_name: name.trim() })
  if (error) throw error
  const row = (data?.[0] ?? null) as OrganizationRpcRow | null
  if (!row) throw new Error('Organization creation returned no receipt.')
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    slug: slugify(row.name),
  }
}

export async function listProjects(organizationId: string): Promise<CloudProject[]> {
  const client = requireClient()
  const { data, error } = await client.rpc('brand_studio_list_projects', {
    p_organization_id: organizationId,
  })
  if (error) throw error
  return (data ?? []) as CloudProject[]
}

export async function createProject(organization: CloudOrganization, name: string): Promise<CloudProject> {
  const client = requireClient()
  const slug = slugify(name)
  if (!slug) throw new Error('Project name must contain letters or numbers.')
  const icmPath = `studio/projects/${organization.slug}/${slug}/`
  const { data, error } = await client.rpc('brand_studio_create_project', {
    p_organization_id: organization.id,
    p_name: name.trim(),
    p_icm_path: icmPath,
  })
  if (error) throw error
  const row = data?.[0]
  if (!row) throw new Error('Project creation returned no receipt.')
  return row as CloudProject
}

export async function createWorkOrder(project: CloudProject, intent: string): Promise<CloudWorkOrderReceipt> {
  const client = requireClient()
  const trimmedIntent = intent.trim()
  if (!trimmedIntent) throw new Error('Describe the outcome before creating a work order.')
  const idempotencyKey = `${project.id}:${slugify(trimmedIntent).slice(0, 72)}:${trimmedIntent.length}`
  const { data, error } = await client.rpc('brand_studio_create_work_order', {
    p_organization_id: project.organization_id,
    p_project_id: project.id,
    p_intent: trimmedIntent,
    p_idempotency_key: idempotencyKey,
    p_requires_approval: false,
  })
  if (error) throw error
  const row = data?.[0]
  if (!row) throw new Error('Work-order creation returned no receipt.')
  return row as CloudWorkOrderReceipt
}
