---
name: triage-issue
description: Triage a bug or issue by exploring the codebase to find root cause, then create a plan with a TDD-based fix plan. Use when user reports a bug, mentions "triage", or wants to investigate and plan a fix for a problem.
---

# Triage Issue

Investigate a reported problem, find its root cause, and create a plan with a TDD fix plan. This is a mostly hands-off workflow - minimize questions to the user.

## Process

### 1. Capture the problem

Get a brief description of the issue from the user. If they haven't provided one, ask ONE question: "What's the problem you're seeing?"

Do NOT ask follow-up questions yet. Start investigating immediately.

### 2. Explore and diagnose

Use the Agent tool with subagent_type=Explore to deeply investigate the codebase. Your goal is to find:

- **Where** the bug manifests (entry points, UI, API responses)
- **What** code path is involved (trace the flow)
- **Why** it fails (the root cause, not just the symptom)
- **What** related code exists (similar patterns, tests, adjacent modules)

Look at:

- Related source files and their dependencies
- Existing tests (what's tested, what's missing)
- Recent changes to affected files (`git log` on relevant files)
- Error handling in the code path
- Similar patterns elsewhere in the codebase that work correctly

### 3. Identify the fix approach

Based on your investigation, determine:

- The minimal change needed to fix the root cause
- Which modules/interfaces are affected
- What behaviors need to be verified via tests
- Whether this is a regression, missing feature, or design flaw

### 4. Design TDD fix plan

Create a concrete, ordered list of RED-GREEN cycles. Each cycle is one vertical slice:

- **RED**: Describe a specific test that captures the broken/missing behavior, and specify that it must be run before the fix is applied to confirm it fails
- **GREEN**: Describe the minimal code change to make that test pass

Rules:

- Tests verify behavior through public interfaces, not implementation details
- One test at a time, vertical slices (NOT all tests first, then all code)
- The RED step must explicitly include running the newly written test before applying the fix, so the failing behavior is observed first
- Each test should survive internal refactors
- Include a final refactor step if needed
- **Durability**: Only suggest fixes that would survive radical codebase changes. Describe behaviors and contracts, not internal structure. Tests assert on observable outcomes (API responses, UI state, user-visible effects), not internal state. A good suggestion reads like a spec; a bad one reads like a diff.

### 5. Create the plan

Create a plan that adheres to the rules in `@.github/skills/create-implementation-plan/SKILL.md`.

The implementation plan must include:

- A clear problem description covering actual behavior, expected behavior, and reproduction steps when applicable
- A root cause analysis describing the code path involved, why the current behavior fails, and any contributing factors
- A TDD fix plan expressed as ordered RED-GREEN cycles, with any planned refactor called out at the end
- Acceptance criteria, including that new tests pass and existing relevant tests still pass

After creating the plan, print the location of the plan and a one-line summary of the root cause. Stop/kill any processes you started for exploration.
