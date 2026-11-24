# 0008. Squash merge, Conventional Commit titles, release-please

- **Status:** Accepted
- **Date:** 2026-11-23

## Context

Releases and the changelog should come from history without hand edits, and history on `main` should be one
readable line per change.

## Decision

- **Squash merge only** (repo setting + ruleset). The PR title becomes the commit title on `main`.
- **PR titles are Conventional Commits**, enforced by a required `pr-title` check with a table test of good and
  bad titles. Dependabot titles use `chore(deps)` / `chore(deps-dev)`. Types: [CONTRIBUTING.md](https://github.com/benweese/home-budget/blob/main/CONTRIBUTING.md).
- **release-please** opens a release PR (version bump + `CHANGELOG.md`) from those titles and publishes a GitHub
  Release when it merges. One version for the whole repo, starting at 0.0.0, so the first `feat` makes 0.1.0;
  before 1.0, `feat` bumps the minor and `fix` the patch.
- It uses a fine-grained token scoped to this repo, because PRs opened with `GITHUB_TOKEN` don't trigger CI.
  The job fails loudly if the token is missing.

## Consequences

- Only the PR title has to be right; branch commits don't matter.
- A squashed branch can't be reused after merge; follow-ups start from `main`.
- Never edit `CHANGELOG.md` or the version by hand.
- The token expires yearly and must be renewed.

## Sources

- https://www.conventionalcommits.org/ · https://github.com/googleapis/release-please-action
