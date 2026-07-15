# Stacked pull request note

This hardening branch is based on `zte/ZTE-20260715-0002/brand-builder-foundation` because the foundation pull request is still open.

Review order:

1. Merge PR #1 into `main`.
2. Retarget this hardening pull request to `main` if GitHub does not update it automatically.
3. Confirm CI and review checks still pass.
4. Merge the hardening pull request.

No production deployment is attached to either branch.
