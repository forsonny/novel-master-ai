# Example Cursor AI Interactions

Here are some common interactions with Cursor AI when using Novel Master:

## Starting a new novel

```
I've just initialized a new project with Novel Master. I have an NRD at .novelmaster/docs/nrd.txt.
Can you help me parse it and set up the initial story arcs?
```

## Working on chapters

```
What's the next chapter I should work on? Please consider dependencies and priorities.
```

## Expanding a specific chapter

```
I'd like to expand chapter 4 into scenes. Can you help me understand what needs to be done and how to approach it?
```

## Viewing multiple chapters

```
Can you show me chapters 1, 3, and 5 so I can understand their relationship?
```

```
I need to see the status of chapters 44, 55, and their scenes. Can you show me those?
```

```
Show me chapters 10, 12, and 15 and give me some batch actions I can perform on them.
```

## Managing scenes

```
I need to regenerate the scenes for chapter 3 with a different approach. Can you help me clear and regenerate them?
```

## Handling story changes

```
I've decided to change the POV structure from third-person to first-person. Can you update all future chapters to reflect this change?
```

## Completing work

```
I've finished drafting chapter 2. All scenes are complete and the pacing feels right.
Please mark it as complete and tell me what I should work on next.
```

## Reorganizing story structure

```
I think scene 5.2 would fit better as part of chapter 7. Can you move it there?
```

(Agent runs: `novel-master move --from=5.2 --to=7.3`)

```
Chapter 8 should actually be a scene of chapter 4. Can you reorganize this?
```

(Agent runs: `novel-master move --from=8 --to=4.1`)

```
I just merged the main branch and there's a conflict in tasks.json. My co-writer created chapters 10-15 on their branch while I created chapters 10-12 on my branch. Can you help me resolve this by moving my chapters?
```

(Agent runs:

```bash
novel-master move --from=10 --to=16
novel-master move --from=11 --to=17
novel-master move --from=12 --to=18
```

)

## Analyzing narrative complexity

```
Can you analyze the pacing and complexity of our chapters to help me understand which ones need to be broken down further?
```

## Viewing complexity report

```
Can you show me the complexity report in a more readable format?
```

### Breaking Down Complex Chapters

```
Chapter 5 seems complex. Can you break it down into scenes?
```

(Agent runs: `novel-master expand --id=5 --num=6 --tag outline`)

```
Please break down chapter 5 using research-backed generation for worldbuilding details.
```

(Agent runs: `novel-master expand --id=5 --research`)

### Updating Chapters with Research

```
We need to update chapter 15 based on the latest research about medieval combat techniques. Can you research this and update the chapter?
```

(Agent runs: `novel-master update-task --id=15 --prompt="Update based on latest medieval combat research" --research`)

### Adding Chapters with Research

```
Please add a new chapter about the protagonist's backstory, research the best narrative techniques for flashback sequences.
```

(Agent runs: `novel-master add-task --prompt="Add chapter about protagonist's backstory using flashback techniques" --research`)

## Research-Driven Writing

### Getting Fresh Information

```
Research the latest best practices for writing science fiction worldbuilding.
```

(Agent runs: `novel-master research "Latest best practices for writing science fiction worldbuilding"`)

### Research with Story Context

```
I'm working on chapter 15 which involves a heist scene. Can you research current best practices for writing heist sequences?
```

(Agent runs: `novel-master research "Best practices for writing heist sequences" --id=15 --files=.novelmaster/manuscript/chapters/chapter-015.md`)

### Research Before Writing

```
Before I draft chapter 8 (which involves medieval combat), can you research the latest historical accuracy requirements for sword fighting scenes?
```

(Agent runs: `novel-master research "Historical accuracy for medieval sword fighting scenes" --id=8`)

### Research and Update Pattern

```
Research the latest recommendations for writing multi-POV novels and update our POV structure chapter with the findings.
```

(Agent runs:

1. `novel-master research "Best practices for writing multi-POV novels" --id=12`
2. `novel-master update-subtask --id=12.3 --prompt="Updated with latest POV findings: [research results]"`)

### Research for Continuity

```
I'm having issues with timeline consistency in chapter 20. Can you research common timeline problems in novels and solutions?
```

(Agent runs: `novel-master research "Common timeline consistency problems in novels and solutions" --id=20 --files=.novelmaster/manuscript/chapters/chapter-020.md`)

### Research Genre Comparisons

```
We need to choose between first-person and third-person POV for our thriller. Can you research the current recommendations for our genre?
```

(Agent runs: `novel-master research "First-person vs third-person POV in thriller novels 2024" --tree`)

## Tag Management for Novel Workflows

### Creating Tags for Draft Phases

```
I'm starting work on the first draft. Can you create a matching task tag?
```

(Agent runs: `novel-master add-tag draft --description="First draft writing phase"`)

### Creating Named Tags

```
Create a new tag called 'rev-1' for our first revision pass.
```

(Agent runs: `novel-master add-tag rev-1 --description="First revision pass"`)

### Switching Tag Contexts

```
Switch to the 'draft' tag so I can work on first-draft chapters.
```

(Agent runs: `novel-master use-tag draft`)

### Copying Chapters Between Tags

```
I need to copy the current outline to a new 'draft' tag for writing.
```

(Agent runs: `novel-master add-tag draft --copy-from-current --description="First draft writing"`)

### Managing Multiple Contexts

```
Show me all available tags and their current status.
```

(Agent runs: `novel-master tags --show-metadata`)

### Tag Cleanup

```
I've finished the 'outline' phase and moved to draft. Can you clean up the outline tag?
```

(Agent runs: `novel-master delete-tag outline`)

### Working with Tag-Specific Chapters

```
List all chapters in the 'draft' tag context.
```

(Agent runs: `novel-master use-tag draft` then `novel-master list`)

### Phase-Based Writing Workflow

```
I'm switching to work on the 'rev-1' revision phase. Can you set up the chapter context for this?
```

(Agent runs:

1. `novel-master use-tag rev-1`
2. `novel-master list` to show chapters in the new context)

### Parallel Revision Development

```
I need to work on both character development and pacing simultaneously. How should I organize the chapters?
```

(Agent suggests and runs:

1. `novel-master add-tag rev-1-character --description="Character development revision"`
2. `novel-master add-tag rev-1-pacing --description="Pacing revision"`
3. `novel-master use-tag rev-1-character` to start with character work)

## Character Arc Management

### Adding Character-Focused Tags

```
I want to create a tag for working on the protagonist's character arc across multiple chapters.
```

(Agent runs: `novel-master add-tag character-protagonist --description="Protagonist character arc development"`)

### Working on Character Arcs

```
Switch to the protagonist character tag and show me all chapters related to their development.
```

(Agent runs: `novel-master use-tag character-protagonist` then `novel-master list`)

## Worldbuilding Research

### Researching Historical Context

```
I'm writing a historical fiction novel set in 1920s Paris. Can you research the social and cultural context of that era?
```

(Agent runs: `novel-master research "1920s Paris social and cultural context" --save-to-file=worldbuilding-1920s-paris.md`)

### Researching Scientific Concepts

```
Chapter 12 involves quantum mechanics. Can you research the basics of quantum entanglement for my worldbuilding?
```

(Agent runs: `novel-master research "Quantum entanglement basics for fiction writers" --id=12`)

## Manuscript Generation

### Generating Chapter Files

```
Please generate manuscript chapter files from the current outline.
```

(Agent runs: `novel-master generate --tag outline`)

### Regenerating After Changes

```
I've updated several chapters. Can you regenerate the manuscript files to reflect the changes?
```

(Agent runs: `novel-master generate --tag draft`)

### Compiling Final Manuscript

```
I'm ready to compile the final manuscript. Can you generate the complete manuscript file?
```

(Agent runs: `novel-master generate --tag final`)

## Pacing and Structure Analysis

### Analyzing Pacing

```
Can you analyze the pacing of chapters 10-15 to see if they're too fast or too slow?
```

(Agent runs: `novel-master analyze-complexity --ids=10,11,12,13,14,15`)

### Checking Chapter Lengths

```
Show me the word count targets and current progress for all chapters.
```

(Agent runs: `novel-master list --show-metadata`)

## Continuity Checks

### Checking Character Consistency

```
I want to make sure the protagonist's personality is consistent across chapters 5, 12, and 20. Can you help me review this?
```

(Agent runs: `novel-master show 5,12,20` to review character details)

### Timeline Verification

```
Can you help me verify that the timeline is consistent across chapters 8-12?
```

(Agent runs: `novel-master show 8,9,10,11,12` to review timeline markers)
