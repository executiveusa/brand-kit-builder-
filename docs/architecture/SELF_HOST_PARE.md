# Self-host PARÉ

PARÉ is designed to be installed for an organization, not rented as a mandatory subscription.

## Ownership boundary
The customer should control:
- repository or delivered source archive;
- domain and DNS;
- hosting/runtime account;
- runtime secrets;
- ICM project files and approved brand manifests;
- database/object storage if optional cloud services are enabled;
- Postiz instance/accounts when social publishing is enabled;
- Darya/OpenHands worker runtime when autonomous execution is enabled;
- backups and rollback targets.

Pauli may operate any of these on the customer's behalf, but continued use must not depend on Pauli owning the account.

## Minimal deployment
Requirements:
- Docker Engine + Compose-compatible runtime, or Coolify/Portainer equivalent;
- TLS reverse proxy such as Caddy/Traefik/Coolify proxy;
- owner-generated `PARE_API_TOKEN` stored outside Git.

1. Clone or copy the approved PARÉ release.
2. Copy `.env.pare.example` into the owner's secret/runtime configuration. Do not commit the real values.
3. Generate a strong API token with the owner's secret manager/password generator.
4. Bind PARÉ to loopback/private networking when a reverse proxy terminates TLS.
5. Start the approved image/compose project.
6. Verify `GET /health`.
7. Verify authenticated `GET /v1/capabilities` and `GET /v1/workflows`.
8. Verify a `POST /v2/plan` dry run before enabling any external worker/publisher.

The repository's production Docker image serves the compiled web app and REST API from one PARÉ service.

## Optional Darya/OpenHands worker
Configure only after the worker runtime exists and is protected by the owner's network/auth boundary:
```text
DARYA_WORKER_URL
DARYA_WORKER_TOKEN
```

PARÉ sends bounded `pare-worker.v1` requests. Darya executes; approved ICM files/manifests remain canonical.

Test the adapter with non-production work before permitting consequential tools on the worker.

## Optional Postiz
Host Postiz separately and configure:
```text
POSTIZ_BASE_URL
POSTIZ_API_KEY
```

PARÉ uses the Postiz public API as a process boundary. Scheduling/publishing fails closed unless the corresponding work order contains recorded human approval evidence.

Reconcile uncertain provider state before retrying a schedule/publish request to avoid duplicate posts.

## Data layout
Canonical portable brand truth:
```text
studio/projects/<tenant>/<project>/
```

The default compose file bind-mounts that directory so container replacement does not erase project intelligence.

Production operators may replace the bind mount with a dedicated persistent volume if they also maintain a tested export/restore path that preserves the ICM directory layout.

## Backup
Minimum backup set:
1. `studio/projects/` including `_ledger/`;
2. owner runtime configuration names and a secure secret-manager backup (not plaintext in the project archive);
3. external Postiz database/media backup when enabled;
4. external Darya/OpenHands state only if the chosen worker requires durable state;
5. exact PARÉ release commit/image digest.

Recommended: encrypted daily project backup + pre-upgrade snapshot.

## Upgrade
1. Record current commit/image digest.
2. Export/backup `studio/projects/`.
3. Build/pull the new candidate.
4. Run interface/runtime/web tests.
5. Start a preview/staging instance against a copy of project data.
6. Verify health, authenticated capabilities, workflow plan, approval rejection and representative brand artifact reads.
7. Promote only with owner approval.

## Rollback
Container/runtime rollback:
1. stop candidate;
2. restore previous image/commit;
3. restore project-data snapshot only if the candidate performed a documented compatible data mutation;
4. verify `/health`, capabilities and one representative project receipt.

No release may introduce an irreversible project-data migration without a separate explicit human approval and migration rollback plan.

## Reverse proxy
Terminate HTTPS at the owner's reverse proxy. Do not expose an unauthenticated PARÉ API directly to the internet.

Suggested topology:
```text
Internet
  → owner TLS reverse proxy
    → PARÉ :8788
       ├─ web UI (public/static)
       └─ /v1 + /v2 API (Bearer auth)

private/trusted network
  ├─ Darya/OpenHands worker (optional)
  └─ Postiz (optional)
```

## Exit / handoff test
An installation is sovereign only if another competent operator can:
- start it from the delivered source/docs;
- read the canonical brand truth without Pauli services;
- replace runtime credentials;
- back up and restore project data;
- point PARÉ at another compatible worker/publishing service;
- continue using approved brand assets after ending a Pauli maintenance agreement.

If any of those fail, the installation has hidden lock-in and is not ready for client handoff.
