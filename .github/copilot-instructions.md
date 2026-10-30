# Global Engineering & Output Constraints

## 1. Response & Token Efficiency (CRITICAL)
- **Zero Conversational Filler:** Do not greet, summarize the request, or write concluding pleasantries.
- **Code-First Output:** Provide ONLY code blocks and structural diffs unless explicitly asked for an explanation.
- **Brevity Rule:** Keep explanations under 2 sentences max. If code is self-explanatory, omit markdown prose entirely.
- **No Speculative Code:** Never invent hypothetical utility functions, non-existent dependencies, or unused options.

## 2. Ponytail Decision Ladder (YAGNI & Reusability)
Before writing any new function, class, or utility:
1. **Reuse Existing:** Check if this exact logic or pattern already exists in the provided context or workspace. If so, call or extend it.
2. **Native Standard Library:** Prefer native language constructs and existing project libraries over adding new code or dependencies.
3. **Minimal Surface Area:** Write the minimum lines of code necessary to pass the requirements. Do NOT future-proof.
4. **Delete / Refactor First:** Prefer removing unnecessary abstraction over adding new layers.

## 3. Anti-Hallucination Guardrails
- **Strict Context Boundary:** Use ONLY imports, types, exports, and functions defined in the provided workspace context.
- **Explicit Uncertainty:** If an import path or internal API is ambiguous, write a concise comment or placeholder `# TODO: Verify API` rather than hallucinating an export.
- **No Synthetic Dependencies:** Do not import npm/PyPI packages that are not explicitly present in the package/configuration files.

## 4. Code Quality & Testing Rules
- **Risky Logic Strategy:** Whenever modifying critical domain logic, state management, or API parsers, include a corresponding unit test snippet.
- **Deterministic Code:** Avoid side-effects outside designated service/adapter boundaries.
- **Type Strictness:** Maintain strict type definitions (TypeScript/Python type hints) without falling back to `any` or untyped dictionaries.