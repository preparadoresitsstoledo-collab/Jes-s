# CLAUDE.md

## Subagent Model Strategy

When spawning subagents via the Agent tool, assign models based on task complexity:

### Haiku — fast, cheap tasks
Use `"model": "haiku"` for:
- File searches and pattern matching (`find`, `grep`, locating symbols)
- Reading files to extract specific information
- Quick lookups (function signatures, config values, imports)
- Listing directory contents or repository structure
- Any task answerable in under 200 words without reasoning

### Sonnet — standard development work
Use `"model": "sonnet"` (default) for:
- Writing or editing code
- Implementing features, bug fixes, refactors
- Generating tests or documentation
- Multi-file changes that require understanding context
- Any task that involves producing output, not just reading

### Opus — critical decisions
Use `"model": "opus"` for:
- Architecture reviews and design decisions
- Security audits and vulnerability analysis
- Evaluating trade-offs between competing approaches
- Code reviews on complex or high-risk PRs
- Anything where a wrong answer has significant consequences

### Quick reference

| Task type | Model |
|---|---|
| Search / read / locate | haiku |
| Write code / implement | sonnet |
| Review / architecture / security | opus |

### Example usage

```
# Fast lookup
Agent(subagent_type="Explore", model="haiku", prompt="Find all files that import X")

# Code implementation
Agent(subagent_type="general-purpose", model="sonnet", prompt="Implement feature Y in file Z")

# Architecture review
Agent(subagent_type="general-purpose", model="opus", prompt="Review the database schema design and flag risks")
```
