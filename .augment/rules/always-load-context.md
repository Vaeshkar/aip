---
title: Load Project Context Automatically
type: always
---

# 🧠 Automatic Context Loading

**CRITICAL: This rule is automatically included in EVERY user prompt.**

Before responding to ANY user request, you MUST read these files in this exact order:

## 1️⃣ Read AI-Optimized Memory First (.aicf/ folder)

**Priority: CRITICAL - Read these FIRST for fast context loading**

Read in this order:
1. `.aicf/index.aicf` - Project overview, current state, quick stats
2. `.aicf/work-state.aicf` - Recent sessions, current work, active tasks
3. `.aicf/conversations.aicf` - Conversation history (pipe-delimited format)
4. `.aicf/decisions.aicf` - Key decisions with impact scores
5. `.aicf/technical-context.aicf` - Architecture, patterns, tech stack
6. `.aicf/design-system.aicf` - UI/UX rules and design decisions

**Format:** These files use AICF format (AI Context Format by Digital Liquids) - pipe-delimited structured data optimized for AI-to-AI communication.

**Why First:** AICF files are 5x more efficient to parse than markdown (100 tokens vs 500 tokens for same information).

## 2️⃣ Read Human-Readable Documentation (.ai/ folder)

**Priority: HIGH - Read these for detailed context**

Read as needed:
- `.ai/project-overview.md` - High-level project description
- `.ai/architecture.md` - System architecture and design
- `.ai/code-style.md` - **CRITICAL: Q4 2025 TypeScript standards - MUST follow 100%**
- `.ai/design-system.md` - UI/UX guidelines and component library
- `.ai/conversation-log.md` - Detailed conversation history (human-readable)
- `.ai/known-issues.md` - Current bugs and limitations
- `.ai/next-steps.md` - Planned work and priorities

**Format:** Standard markdown prose for human readability.

## 3️⃣ Session Workflow

### **At START of session:**
1. ✅ Read `.aicf/` files (AI-optimized memory)
2. ✅ Read `.ai/` files (human-readable docs)
3. ✅ Understand current project state
4. ✅ Ready to help user

### **At END of session:**
1. 🚨 **MANDATORY:** Update `.aicf/` files with new conversation, decisions, insights
2. 🚨 **MANDATORY:** Update `.ai/conversation-log.md` with detailed session summary
3. 🚨 **MANDATORY:** Update other `.ai/` files if architecture/design/issues changed

**See `.aicf/README.md` for AICF format specification.**

---

## 📋 Key Rules

### **Code Quality (CRITICAL)**
- **ALWAYS follow `.ai/code-style.md` 100%** - No shortcuts, no "I'll refactor later"
- Dennis prioritizes quality over speed: "Better to do it right first time than spend hours cleaning up"
- Q4 2025 TypeScript standards: strict mode, no `any`, explicit return types, functions <50 lines, Result<T,E> error handling

### **Memory Management**
- `.aicf/` = AI-to-AI communication (fast, structured, pipe-delimited)
- `.ai/` = AI-to-Human communication (detailed, prose, markdown)
- Both systems must be kept in sync at end of every session

### **Project Context**
- This is a toy store AI system (SaaS for VEDES network)
- User is Dennis van Leeuwen (26-year advertising veteran, WBS Coding School student, ADHD/dyslexic/Asperger's)
- Dennis prefers architecture-first development, systems thinking, big-picture strategy

---

## 🎯 Success Criteria

You have successfully loaded context when you can answer:
- ✅ What was the last conversation about?
- ✅ What are the current high-priority tasks?
- ✅ What are the most recent critical decisions?
- ✅ What is the current project architecture?
- ✅ What code quality standards must be followed?

If you cannot answer these questions, **STOP and read the files above.**

---

**This rule ensures continuous memory across all AI sessions. No more "Read .ai-instructions first" - it happens automatically!** 🚀

