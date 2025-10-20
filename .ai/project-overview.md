# Project Overview

> **📋 QUICK CONTEXT FOR AI:**
>
> This file provides essential project context. Read the "Quick Reference" section first for immediate context, then dive into details as needed.

---

## 🎯 Quick Reference (AI: Read This First!)

**Project:** AIP (AI-Protocol)
**Type:** Protocol Specification + TypeScript Library
**Language:** TypeScript
**Status:** Alpha Development

**What it does (one sentence):**
AIP is a universal, vendor-neutral protocol for connecting AI systems (LLMs, agents) with external services, data sources, and capabilities.

**Current focus:**
Core protocol implementation (v1.0.0) - Server, Client, HTTP transport, and AICF integration

**Key files to know:**
- `docs/AIP-SPECIFICATION.md` - Complete protocol specification
- `schema/aip-schema.ts` - TypeScript type definitions
- `src/server/AIPServer.ts` - Server implementation
- `src/client/AIPClient.ts` - Client implementation
- `src/transport/HTTPTransport.ts` - HTTP transport layer
- `examples/server.ts` - Example server with tools and context
- `examples/client.ts` - Example client usage

**Conventions:**
- **Modules:** CommonJS (for now, ESM later)
- **File naming:** PascalCase for classes, camelCase for utilities
- **Variable naming:** camelCase
- **Testing:** Jest (to be implemented)

**Workflow:**
- Design specification → Implement TypeScript types → Build core library → Create examples
- Follow Q4 2025 TypeScript standards (strict mode, no `any`, explicit types)
- Test with example server/client before adding new features

---

## 📖 Detailed Overview (For Humans & Deep Dives)

### Problem Statement

**The Challenge:**
[What problem does this project solve? Who experiences it? Why is it a problem?]

**The Solution:**
[How does your project solve it? What makes it unique? Who benefits?]

### What This Project Does

**Key Features:**
- Feature 1: [Description]
- Feature 2: [Description]
- Feature 3: [Description]

**Important Limitations:**
- [What is out of scope]
- [What this project doesn't handle]
- [What users should not expect]

### Architecture

**High-Level Structure:**
```
[Describe or diagram your system architecture]
```

**Technology Stack:**
- **Language:** [Primary language and version]
- **Framework:** [Framework if applicable]
- **Database:** [Database if applicable]
- **Tools:** [Build tools, testing frameworks, etc.]

### Key Components

**List your main components/modules here:**
- Component 1: [Brief description]
- Component 2: [Brief description]
- Component 3: [Brief description]

### Current Goals

**Short-term (This Week/Month):**
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

**Long-term (This Quarter/Year):**
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

---

## 📚 Additional Resources

**Related Documentation:**
- See `conversation-log.md` for project history
- See `technical-decisions.md` for architecture decisions
- See `next-steps.md` for current priorities
- See `code-style.md` for coding standards
- See `design-system.md` for design patterns

**External Links:**
- Repository: [URL]
- Documentation: [URL]
- Issue Tracker: [URL]

---

**💡 Tip:** Keep the "Quick Reference" section at the top updated - it's the first thing AI assistants will read when they need project context!
