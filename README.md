# 📘 Advanced React Patterns Playbook

A technical repository demonstrating advanced architectural patterns in React and Next.js, focused on code maintainability, separation of concerns, and integration testing.

## 🎯 Purpose
This playbook serves as a practical guide to understanding when, how, and why to use specific React patterns. It aims to evolve frontend development from basic component implementation to professional architectural decisions suitable for complex enterprise applications.

## 🏗️ Patterns Explored

### 1. Compound Components (`/components/patterns/01-compound-components`)
* **Concept:** A pattern where two or more components work together to accomplish a task, sharing implicit internal state via `React Context` while delegating UI layout control to the consumer.
* **Real-world Scenario:** Interactive UI primitives with complex shared state and high layout flexibility—such as Modals, Multi-select Dropdowns, Tabs, Accordions, and self-governed Steppers.
* **Architectural Trade-offs (Avoiding Over-engineering):**
  * **When to use:** Only when sub-components need implicit state communication *and* consumers need structural freedom (e.g., reordering triggers/windows or injecting `data-testid`/`ref` attributes directly onto inner nodes without prop tunneling).
  * **When NOT to use:** Do not apply this pattern to rigid layouts (Headers, Footers) or business modules (`UserProfile`). For static components that only need DOM access for testing or styling, prefer a **Prop-driven** approach with `forwardRef` and **`slotProps`** (e.g., `buttonProps`) to maintain high abstraction without boilerplate.
  * **Explicit Identifiers over Magic:** Prefer explicit `name`/`value` props over `React.Children.map` index injection so wrapper elements (`<div>`, Fragments) do not break component communication.

### 2. Logic Extraction with Custom Hooks (`/components/patterns/02-custom-hooks`)
* **Concept:** Decoupling stateful business logic, side effects, and asynchronous orchestration into dedicated Custom Hooks, leaving UI components as pure, declarative presentation layers.
* **Real-world Scenario:** Debounced search inputs (`useUserSearch`), rate-limited checkout forms (`useCouponCheckout` composing `useRateLimit`), and multi-step workflows where async race conditions (`AbortController`) and derived state must be isolated from JSX.
* **Architectural Trade-offs (Avoiding Fragmentation):**
  * **When to extract:** When coordinating multiple effects/timers, handling async race conditions, sharing stateful behavior across different layouts, or isolating complex domain rules.
  * **When NOT to extract:** Avoid creating single-line wrapper hooks (e.g., wrapping a lone `useState` boolean) that fragment readability without reducing complexity.
  * **React 19 & State Hygiene:** Derive state during render rather than triggering synchronous `setState` cascading renders inside `useEffect`, and expose domain-specific actions (`updateCode`, `removeCoupon`) instead of raw state setters.

### 3. Server vs. Client Components (`/src/components/patterns/03-server-client`)
* **Concept:** [To be filled]
* **Real-world Scenario:** [To be filled]
* **Pros & Cons:** [To be filled]

## 🧪 Testing Strategy
All complex UI flows in this playbook are validated using **Integration Tests** with `Vitest` and `React Testing Library`, ensuring that the components behave correctly from an end-user perspective.

---
*Built as part of a continuous technical growth initiative.*