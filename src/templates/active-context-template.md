# 🟢 Active Context Snapshot Template

The **Master Orchestrator** MUST generate this file as `docs/activeContext.md` **after every completed user request**. The goal is to provide a quick, machine-readable **and** human-friendly snapshot of the project's current working context so that future chat sessions can immediately resume from the right state.

---

## 📌 Metadata
| Field | Description |
|-------|-------------|
| `createdAt` | ISO 8601 timestamp when the snapshot was generated |
| `workflowId` | UUID for the current workflow/run |
| `currentMode` | One of: `Initializing` \| `Planning` \| `Developing` \| `Documenting` \| `Bug-Fixing` \| `Brainstorming` |
| `activeFeature` | Feature key the agent is primarily focusing on, if any |
| `activeTaskId` | Task slug (`T-XXX`) currently in progress, if any |
| `status` | `pending` \| `in-progress` \| `awaiting-review` \| `done` |
| `nextStepSuggestion` | A concise, one-sentence recommendation for what to do next |

## 🗒 Snapshot Example
```yaml
createdAt: 2024-05-29T10:45:31Z
workflowId: 2d1d2d90-8b4e-4e7b-8d0a-c4239bdb7c4e
currentMode: Developing
activeFeature: F03_User_Authentication
activeTaskId: T-102
status: in-progress
nextStepSuggestion: "Write unit tests for password reset flow."
```

---

## 🔄 Update Rules
1. **Overwrite** – Always regenerate the entire file; do not append.
2. **Single Source of Truth** – Other agents/modes MUST read this file to seed context before mode detection.
3. **Reset** – When project is reset/initialized, this file SHOULD be deleted and recreated by `Initializing` mode. 