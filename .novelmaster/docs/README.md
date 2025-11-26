# Novel Master Docs Folder

This directory contains everything an AI agent (or human writer) needs to shepherd a manuscript from concept to final draft. Treat it as the *single source of truth* for your novel:

- `nrd*.txt` files – Novel Requirement Documents (templates + actual project NRDs)
- `research/` – Research dumps, lore explorations, and continuity investigations
- `tasks/` (generated) – Tagged task lists for each phase (`outline`, `draft`, `rev-1`, ...)
- `reports/` (generated) – Pacing + complexity reports used by expansion commands

## Workflow Overview

1. **Capture the NRD** – Describe premise, cast, world rules, and act-level beats.
2. **Parse the NRD** – `novel-master parse-prd .novelmaster/docs/nrd.txt --tag outline`
3. **Analyze pacing** – `novel-master analyze-complexity --tag outline --research`
4. **Expand chapters** – `novel-master expand --id <chapter> --num <scenes> --research`
5. **Generate manuscript** – `novel-master generate --tag draft`
6. **Iterate via tags** – Promote the `outline` tag into `draft`, `rev-1`, `beta-feedback`, etc.

## File Naming Conventions

| File | Purpose |
| --- | --- |
| `prd.txt` | Primary NRD for the project. Rename to match your title. |
| `nrd-starter.txt` | Minimal template for new ideas. |
| `task-template-importing-nrd.txt` | Example of how to structure NRDs imported from other systems. |
| `research/YYYY-MM-DD_*.md` | Saved research responses with context + prompt. |
| `reports/task-complexity-report_<tag>.json` | Generated pacing reports for the specified tag. |

## Creating a New NRD

Copy `nrd-starter.txt` and fill in:

- Title, genre, target length
- Themes + tone
- POV plan + emotional arcs
- Act/Chapter outline with stakes + hooks
- Key characters (motifs, goals, secrets)
- World rules + constraints
- Research hooks (what the AI should look up before expanding)

## Parsing & Tags

- `novel-master parse-prd file --tag outline` creates the initial story-arc tasks.
- `novel-master add-tag draft --copy-from outline` carries outline tasks forward for drafting.
- `novel-master add-tag rev-1 --copy-from draft --description "First revision"` spins up a revision context.

Always keep the NRD synced with discoveries. When you change major beats, update the NRD and rerun `parse-prd --append` to merge new arcs into the current tag.

## Research Notes

Drop any research prompts or outputs into `research/` with the naming pattern `YYYY-MM-DD_topic.md`. Include:

```
# Prompt
# Findings
# Follow-ups
# Impact on manuscript
```

The `research` MCP/CLI tool automatically writes into this folder when you pass `--save`.

## Manuscript Generation

The generator reads tasks under the active tag and creates files inside `.novelmaster/manuscript/<tag>/`:

- `chapters/chapter-01.md` – Front matter + metadata + scene/beat sections. Everything between the draft markers is yours to edit.
- `manuscript-summary.json` – Aggregate word-count targets vs. drafted words, status counts, and chapter metadata.
- `compiled/manuscript-<tag>.md` – Concatenated draft output (always generated unless `--no-compile` is passed).

Regenerate whenever tasks change; the generator preserves manual writing inside the draft anchors:

```
<!-- novel-master:draft:start -->
...your prose...
<!-- novel-master:draft:end -->
```

## Automation Recipes

- **Dual-Agent Drafting** – Keep `outline` read-only, let an AI agent own `draft`, and a human own `rev-1`.
- **Character Drilldowns** – `novel-master add-tag character-nora --filter "POV=Nora"` to isolate a character arc.
- **Timeline Forks** – Clone the draft tag into `timeline-alt` to explore alternate endings.

When in doubt: update the NRD, regenerate tasks, and let the MCP tools propagate changes downstream.
