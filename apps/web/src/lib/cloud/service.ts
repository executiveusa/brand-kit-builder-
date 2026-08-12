import { supabase } from './client'
import type { CloudOrganization, CloudProject, CloudWorkOrderReceipt } from './contracts'

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
  const { data, error } = await client
    .from('brand_studio_organizations')
    .select('id,name,slug')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as CloudOrganization[]
}

export async function createOrganization(name: string): Promise<CloudOrganization> {
  const client = requireClient()
  const user = await getCloudUser()
  if (!user) throw new Error('Sign in before creating a studio workspace.')
  const slug = slugify(name)
  if (!slug) throw new Error('Organization name must contain letters or numbers.')
  const { data, error } = await client
    .from('brand_studio_organizations')
    .insert({ name: name.trim(), slug, created_by: user.id })
    .select('id,name,slug')
    .single()
  if (error) throw error
  return data as CloudOrganization
}

export async function listProjects(organizationId: string): Promise<CloudProject[]> {
  const client = requireClient()
  const { data, error } = await client
    .from('brand_studio_projects')
    .select('id,organization_id,name,slug,canonical_manifest_path,canonical_manifest_hash')
    .eq('organization_id', organizationId)
    .neq('lifecycle_status', 'archived')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as CloudProject[]
}

export async function createProject(organization: CloudOrganization, name: string): Promise<CloudProject> {
  const client = requireClient()
  const user = await getCloudUser()
  if (!user) throw new Error('Sign in before creating a project.')
  const slug = slugify(name)
  if (!slug) throw new Error('Project name must contain letters or numbers.')
  const canonicalManifestPath = `studio/projects/${organization.slug}/${slug}/manifest.json`
  const { data, error } = await client
    .from('brand_studio_projects')
    .insert({
      organization_id: organization.id,
      name: name.trim(),
      slug,
      canonical_manifest_path: canonicalManifestPath,
      created_by: user.id,
    })
    .select('id,organization_id,name,slug,canonical_manifest_path,canonical_manifest_hash')
    .single()
  if (error) throw error
  return data as CloudProject
}

export async function createWorkOrder(project: CloudProject, intent: string): Promise<CloudWorkOrderReceipt> {
  const client = requireClient()
  const user = await getCloudUser()
  if (!user) throw new Error('Sign in before creating a work order.')

  const { data: session, error: sessionError } = await client
    .from('brand_studio_sessions')
    .insert({
      organization_id: project.organization_id,
      project_id: project.id,
      user_id: user.id,
      channel: 'web',
      metadata: { surface: 'polish-outcome-composer' },
    })
    .select('id')
    .single()
  if (sessionError) throw sessionError

  const { data, error } = await client
    .from('brand_studio_work_orders')
    .insert({
      organization_id: project.organization_id,
      project_id: project.id,
      session_id: session.id,
      requested_by: user.id,
      intent: intent.trim(),
      normalized_request: {
        source: 'web',
        intent: intent.trim(),
        canonical_manifest_path: project.canonical_manifest_path,
      },
      status: 'queued',
    })
    .select('id,status,intent,created_at')
    .single()
  if (error) throw error
  return data as CloudWorkOrderReceipt
}
