# 0001. Record decisions as ADRs

- **Status:** Accepted
- **Date:** 2026-11-23

## Context

Decisions get made in conversations and reviews, then the reasons are lost. A future change needs to know
why something is the way it is before undoing it.

## Decision

Record every decision that shapes the code, the tools or the process as a short Markdown file in `docs/adr/`,
named `NNNN-short-title.md`, with these sections:

- **Status** (Proposed, Accepted, Superseded by NNNN) and **Date**
- **Context:** the problem and the forces.
- **Decision:** what we do, in the active voice.
- **Consequences:** what gets easier, what gets harder, and when to revisit.
- **Sources:** links to the docs the decision relies on, so it can be rechecked when they change.

ADRs are never edited to change their meaning or deleted; a changed decision is a new ADR that supersedes the
old one. Each one is added to the table in [the index](./) and the docs sidebar.

## Consequences

- Small overhead per decision; reasons stay next to the code and appear on the docs site.
- Reviews can point at an ADR instead of re-arguing it.
