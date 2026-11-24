# 0009. Actions allow list, SHA pins, image-pinned tools

- **Status:** Accepted
- **Date:** 2026-11-23

## Context

GitHub Actions run with repo access. A moved tag or a compromised third-party action could run arbitrary code
in CI.

## Decision

- **Allow list** (repo setting): GitHub-owned actions plus, by name, `anthropics/claude-code-action`,
  `oven-sh/setup-bun` (used by it), `ossf/scorecard-action` and `googleapis/release-please-action`. Anything
  else is raised before it's added.
- **Every action is pinned to a full commit SHA** with a version comment; the repo setting that requires SHA
  pinning is on.
- **Third-party CLIs** (gitleaks, actionlint) run with `docker run` from images pinned by tag + digest in
  `.github/docker/<tool>/Dockerfile`, not as actions.
- `permissions: {}` at the top of every workflow, with per-job grants; no `pull_request_target`; nothing with
  secrets runs on fork PRs; Claude review runs only on the owner's PRs and can't push.
- **Dependabot** updates npm packages, the pinned actions and the Docker images weekly; each bump is a PR.
- OpenSSF Scorecard publishes results (README badge); CodeQL uses GitHub's default setup.

## Consequences

- Updates arrive as reviewable PRs instead of silently through moving tags.
- Adding a new third-party action needs an allow-list change first.

## Sources

- https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions
- https://github.com/ossf/scorecard-action
