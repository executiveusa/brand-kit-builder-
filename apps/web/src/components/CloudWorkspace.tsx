import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Check, Cloud, LogOut } from 'lucide-react'
import { cloudConfig, supabase } from '../lib/cloud/client'
import type { CloudOrganization, CloudProject, CloudWorkOrderReceipt } from '../lib/cloud/contracts'
import {
  createOrganization,
  createProject,
  createWorkOrder,
  getCloudUser,
  listOrganizations,
  listProjects,
  sendMagicLink,
  signOutCloudUser,
} from '../lib/cloud/service'

type CloudWorkspaceProps = {
  intent: string
}

export function CloudWorkspace({ intent }: CloudWorkspaceProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [organizations, setOrganizations] = useState<CloudOrganization[]>([])
  const [organizationId, setOrganizationId] = useState('')
  const [projects, setProjects] = useState<CloudProject[]>([])
  const [projectId, setProjectId] = useState('')
  const [newOrganization, setNewOrganization] = useState('')
  const [newProject, setNewProject] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState<CloudWorkOrderReceipt | null>(null)

  const activeOrganization = useMemo(
    () => organizations.find((organization) => organization.id === organizationId) ?? null,
    [organizationId, organizations],
  )
  const activeProject = useMemo(
    () => projects.find((project) => project.id === projectId) ?? null,
    [projectId, projects],
  )

  const refreshOrganizations = useCallback(async () => {
    const nextOrganizations = await listOrganizations()
    setOrganizations(nextOrganizations)
    setOrganizationId((current) => current || nextOrganizations[0]?.id || '')
  }, [])

  const refreshUser = useCallback(async () => {
    if (!cloudConfig.enabled) return
    const user = await getCloudUser()
    setUserEmail(user?.email ?? null)
    if (user) await refreshOrganizations()
    else {
      setOrganizations([])
      setProjects([])
      setOrganizationId('')
      setProjectId('')
    }
  }, [refreshOrganizations])

  useEffect(() => {
    if (!cloudConfig.enabled || !supabase) return
    void refreshUser().catch((caught: unknown) => setError(caught instanceof Error ? caught.message : 'Unable to read cloud session.'))
    const { data } = supabase.auth.onAuthStateChange(() => {
      void refreshUser().catch((caught: unknown) => setError(caught instanceof Error ? caught.message : 'Unable to refresh cloud session.'))
    })
    return () => data.subscription.unsubscribe()
  }, [refreshUser])

  useEffect(() => {
    if (!organizationId || !cloudConfig.enabled) {
      setProjects([])
      setProjectId('')
      return
    }
    void listProjects(organizationId)
      .then((nextProjects) => {
        setProjects(nextProjects)
        setProjectId((current) => nextProjects.some((project) => project.id === current) ? current : nextProjects[0]?.id || '')
      })
      .catch((caught: unknown) => setError(caught instanceof Error ? caught.message : 'Unable to read projects.'))
  }, [organizationId])

  async function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await sendMagicLink(email.trim())
      setMessage('Check your email for the secure sign-in link.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to send sign-in link.')
    } finally {
      setBusy(false)
    }
  }

  async function submitOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const organization = await createOrganization(newOrganization)
      setNewOrganization('')
      await refreshOrganizations()
      setOrganizationId(organization.id)
      setMessage('Workspace created. Now create its first project.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create workspace.')
    } finally {
      setBusy(false)
    }
  }

  async function submitProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!activeOrganization) return
    setBusy(true)
    setError('')
    try {
      const project = await createProject(activeOrganization, newProject)
      setNewProject('')
      const nextProjects = await listProjects(activeOrganization.id)
      setProjects(nextProjects)
      setProjectId(project.id)
      setMessage('Project created. Cloud work orders can now be queued from the outcome above.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create project.')
    } finally {
      setBusy(false)
    }
  }

  async function saveWorkOrder() {
    if (!activeProject || !intent.trim()) return
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const nextReceipt = await createWorkOrder(activeProject, intent)
      setReceipt(nextReceipt)
      setMessage('Work order queued in the cloud operating layer. Execution remains a later factory phase.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create work order.')
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    setBusy(true)
    setError('')
    try {
      await signOutCloudUser()
      setReceipt(null)
      setMessage('Signed out.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to sign out.')
    } finally {
      setBusy(false)
    }
  }

  if (!cloudConfig.enabled) {
    return (
      <aside className="cloud-workspace cloud-workspace-offline" aria-label="Cloud operating layer status">
        <div className="cloud-heading"><Cloud aria-hidden="true" /><strong>Cloud operating layer</strong><span className="truth-badge">Not configured</span></div>
        <p>This build stays in local preview mode until a Supabase URL and publishable key are supplied through deployment environment settings. No secret or service-role key belongs in the browser.</p>
      </aside>
    )
  }

  if (!userEmail) {
    return (
      <aside className="cloud-workspace" aria-label="Cloud operating layer sign in">
        <div className="cloud-heading"><Cloud aria-hidden="true" /><strong>Continue in the cloud</strong><span className="truth-badge">RLS protected</span></div>
        <p>Sign in only when you want this project and its work-order history to persist across sessions.</p>
        <form className="cloud-inline-form" onSubmit={submitEmail}>
          <label htmlFor="cloud-email">Email</label>
          <input id="cloud-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          <button type="submit" disabled={busy}>{busy ? 'Sending…' : 'Email sign-in link'}</button>
        </form>
        {message && <p className="cloud-message" role="status">{message}</p>}
        {error && <p className="cloud-error" role="alert">{error}</p>}
      </aside>
    )
  }

  return (
    <aside className="cloud-workspace" aria-label="Cloud operating workspace">
      <div className="cloud-heading">
        <Cloud aria-hidden="true" />
        <strong>Cloud workspace</strong>
        <span className="truth-badge">Signed in</span>
        <button className="cloud-signout" type="button" onClick={signOut} disabled={busy}><LogOut size={14} aria-hidden="true" /> Sign out</button>
      </div>
      <p className="cloud-account">{userEmail}</p>

      {organizations.length === 0 ? (
        <form className="cloud-inline-form" onSubmit={submitOrganization}>
          <label htmlFor="new-organization">Create your workspace</label>
          <input id="new-organization" required value={newOrganization} onChange={(event) => setNewOrganization(event.target.value)} placeholder="Company or organization" />
          <button type="submit" disabled={busy}>Create workspace</button>
        </form>
      ) : (
        <>
          <label className="cloud-select-label" htmlFor="organization-select">Workspace</label>
          <select id="organization-select" value={organizationId} onChange={(event) => setOrganizationId(event.target.value)}>
            {organizations.map((organization) => <option key={organization.id} value={organization.id}>{organization.name}</option>)}
          </select>

          {projects.length === 0 ? (
            <form className="cloud-inline-form" onSubmit={submitProject}>
              <label htmlFor="new-project">Create the first project</label>
              <input id="new-project" required value={newProject} onChange={(event) => setNewProject(event.target.value)} placeholder="Brand or project name" />
              <button type="submit" disabled={busy}>Create project</button>
            </form>
          ) : (
            <>
              <label className="cloud-select-label" htmlFor="project-select">Project</label>
              <select id="project-select" value={projectId} onChange={(event) => setProjectId(event.target.value)}>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
              <div className="cloud-save-row">
                <div>
                  <span className="micro">Canonical brand truth</span>
                  <p>{activeProject?.canonical_manifest_path}</p>
                </div>
                <button type="button" onClick={saveWorkOrder} disabled={busy || !intent.trim()}>
                  {busy ? 'Working…' : 'Queue this outcome'}
                </button>
              </div>
            </>
          )}
        </>
      )}

      {receipt && (
        <div className="cloud-receipt" role="status">
          <Check size={16} aria-hidden="true" />
          <div><strong>Work order {receipt.status}</strong><span>{receipt.id}</span></div>
        </div>
      )}
      {message && <p className="cloud-message" role="status">{message}</p>}
      {error && <p className="cloud-error" role="alert">{error}</p>}
    </aside>
  )
}
