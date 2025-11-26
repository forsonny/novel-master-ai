<a name="readme-top"></a>

<div align="center">
  <img src="./images/logo.png?raw=true" alt="Novel Master logo" width="280" />
</div>

<p align="center">
  <b>Novel Master</b>: An AI-powered writing studio that plans, drafts, and revises full-length novels directly from your IDE.
</p>

<p align="center">
  <a href="https://discord.gg/novelmasterai"><img src="https://dcbadge.limes.pink/api/server/https://discord.gg/novelmasterai?style=flat" alt="Discord"></a>
  ·
  <a href="https://docs.novel-master.dev">Documentation</a>
  ·
  <a href="https://github.com/novel-master/novel-master/issues">Issue Tracker</a>
</p>

---

## Why Novel Master?

Novel Master is the successor to Task Master, rebuilt specifically for fiction and narrative projects. It keeps the automation power of the original MCP/CLI tooling, but reframes every workflow around novel development:

- **NRD → Manuscript Pipeline** – Parse Novel Requirement Documents (NRDs) into story arcs, chapters, and scenes.
- **Narrative-aware AI prompts** – Expansion, research, and update flows speak the language of pacing, POV, and character arcs.
- **Context-rich automation** – Tags isolate outlines, drafts, revisions, and beta-reader feedback so multiple agents (or humans) can work in parallel.
- **Manuscript generation** – Convert task trees into chapter/scene markdown, track word counts, and compile a full manuscript when ready.

---

## Feature Overview

- ��� **Narrative Planning** – Convert NRDs into hierarchical tasks (arcs → chapters → scenes → revision passes).
- ��� **Worldbuilding Research** – Built-in research tool now focuses on lore, genre conventions, and continuity guards.
- ��� **Tagged Workflows** – Ship outlines, drafts, and revisions simultaneously using tag-specific task contexts.
- ��� **Continuity Reporting** – Complexity analysis now reports pacing density, POV load, and emotional intensity instead of engineering metrics.
- ��� **Fully Scriptable** – Everything is available through both the MCP server (for Cursor/Windsurf/Q CLI) and the `novel-master` CLI.

---

## Quick Start (CLI)

```bash
npm install -g novel-master-ai
novel-master init --name "My Novel" --description "Solarpunk mystery" --yes
```

After initialization you will find:

```
novel-master/
  .novelmaster/
    docs/        # NRD templates, outline examples, TDD-style writing loops
    tasks/       # Tagged task lists (master tag by default)
    config.json  # Narrative defaults (models, pacing preferences)
  context/       # Novel-writing reference materials (NRD schema, genre best practices, narrative techniques)
```

### 1. Write or import an NRD

Place your high-level requirements in `.novelmaster/docs/nrd.txt` (or use one of the genre templates). An NRD usually contains:

- Premise + logline
- Character roster + arcs
- World/lore constraints
- Chapter-level beats or act structure

### 2. Parse the NRD into story arcs

```bash
novel-master parse-prd .novelmaster/docs/nrd.txt --num-tasks 8 --tag outline
```

This produces top-level tasks representing acts or major arcs within the `outline` tag.

### 3. Expand chapters into scenes

```bash
novel-master expand --id 3 --num 6 --tag outline --research
```

Each subtask now represents a scene/beat with POV, tension level, and worldbuilding reminders.

### 4. Generate manuscript files

```bash
novel-master generate --tag draft
```

The generator now:

- Maps parent tasks → chapter files (`chapters/chapter-03.md`)
- Adds beat sections (one per subtask) plus POV/tension metadata
- Preserves anything you write between `<!-- novel-master:draft:start -->` markers
- Produces `.novelmaster/manuscript/<tag>/manuscript-summary.json` (targets, drafted words, status)
- Compiles everything into `.novelmaster/manuscript/<tag>/compiled/manuscript-<tag>.md`

Re-running the command refreshes the managed sections while keeping your draft text intact.

### 5. Iterate with tags

- `outline` – structural planning
- `draft` – first-pass writing (manuscript generation enabled)
- `rev-1`, `rev-2` – revision passes
- `beta-feedback` – incorporate external notes without touching prior contexts

Switch contexts at any time:
```bash
novel-master use-tag draft
```

---

## Quick Start (Cursor / MCP)

1. **Install** from Cursor → Settings → MCP → Add Server → `npx -y novel-master-ai`
2. **Configure** API keys inside `.cursor/mcp.json`:
```jsonc
{
  "mcpServers": {
    "novel-master-ai": {
      "command": "npx",
      "args": ["-y", "novel-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_KEY",
        "OPENAI_API_KEY": "YOUR_KEY",
        "PERPLEXITY_API_KEY": "YOUR_KEY",
        "NOVEL_MASTER_TOOLS": "standard"
      }
    }
  }
}
```
3. **Use MCP tools** directly from chat:
   - `parse_prd` – generate arcs/chapters from an NRD
   - `expand_task` – create scenes or revision passes
   - `research` – gather lore or genre references
   - `generate` – materialize manuscript files

Each tool now reports narrative-specific telemetry (tokens, cost, model) so you can budget drafting sessions.

---

## Requirements

- Node.js 18+
- At least one LLM provider key (Anthropic / OpenAI / Gemini / Perplexity / xAI / OpenRouter / Claude Code CLI)
- Optional: local Git + editor integration for tagged workflows

Configure provider priorities with:
```bash
novel-master models --set-main claude-3-5-sonnet
novel-master models --set-research perplexity-sonar
novel-master models --set-fallback gpt-4o
```

---

## Narrative Workflow Cheat Sheet

| Stage | Command / Tool | Output |
| --- | --- | --- |
| Capture NRD | `novel-master parse-prd` | Story arcs + chapter shells |
| Analyze pacing | `novel-master analyze-complexity --tag outline` | POV distribution, tension spikes |
| Expand chapters | `novel-master expand --id 2 --num 5 --research` | Scenes with POV + emotional goals |
| Draft scenes | `novel-master update-subtask --id 2.3 --append` | Append timestamped writing notes |
| Generate manuscript | `novel-master generate --tag draft` | Chapters + scene anchors + summary + compiled `.md` |
| Revise | `novel-master add-tag rev-1 --copy-from=draft` + `expand_all` | Revision checklist |

---

## Advanced Topics

- **Worldbuilding Research** – Add `--files lore/*.md` or `--context` text to `research` for richer references.
- **POV Isolation** – Use `add-tag character-nora --copy-from=draft --filter="POV=Nora"` to focus on a specific character arc.
- **Timeline Slices** – Create tags like `timeline-2025` to explore alternate chronology without risking the main draft.
- **Automation Loop** – `.novelmaster/docs/novel-automation-workflow.md` explains how to chain MCP tool calls so an agent can autonomously move from NRD to finished manuscript.

## Reference Materials

Novel Master includes comprehensive reference materials in the `context/` directory:

- **`nrd-schema-reference.txt`** – Complete NRD schema with required sections, validation rules, and best practices
- **`genre-best-practices.txt`** – Genre-specific conventions, pacing guidelines, and research needs for Fantasy, SF, Thriller, Literary Fiction, Romance, Mystery, Horror, and YA
- **`narrative-techniques-reference.txt`** – Story structures (Three-Act, Hero's Journey, Save the Cat), POV techniques, pacing strategies, character development, and revision techniques
- **`outline-templates-guide.txt`** – Outline templates and patterns for different story structures, scene breakdowns, and outline best practices

These references help Novel Master's AI understand narrative conventions and generate appropriate story structures. They're also available for your reference when creating NRDs and planning your novel.

---

## Contributing

Novel Master welcomes contributions focused on storytelling features: new NRD templates, better pacing analyzers, manuscript exporters, or editor integrations. See `CONTRIBUTING.md` for setup instructions and run:

```bash
npm install
npm run dev
npm test
```

---

## Attribution

Novel Master is derived from [Claude Task Master](https://github.com/eyaltoledano/claude-task-master) by Eyal Toledano. The original project provided the foundation for the MCP server architecture and task management system, which has been adapted and extended for novel writing workflows.

---

## License

Novel Master is released under MIT + Commons Clause. You can use and modify it freely, but you cannot sell Novel Master itself or offer it as a hosted service. Full details are in `LICENSE`.

<p align="center">✒️ Happy writing!</p>
