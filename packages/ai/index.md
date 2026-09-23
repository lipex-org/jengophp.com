# jengo/ai

`jengo/ai` is an enterprise-grade, multi-provider generative AI SDK, autonomous agent engine, and vector search toolkit engineered specifically for **CodeIgniter 4** and the **Jengo Framework**.

---

## What's Inside

| Section | Description |
| :--- | :--- |
| [Key Capabilities](#key-capabilities) | A summary of everything the package ships with. |
| [Installation](./installation) | Install via Composer and publish the config. |
| [Configuration](./configuration) | Provider credentials, models, and generation defaults. |
| [Quick Start](./quick-start) | Fire your first prompts via the `ai()` helper or `Ai` facade. |
| [Multi-Turn Conversations](./conversations) | Role-based message histories and dialog context. |
| [Schema-First Structured Output](./structured-output) | Strict JSON schema enforcement mapped to PHP types. |
| [Tool Calling & Autonomous Agents](./tool-calling) | PHP 8 attribute discovery, fluent tools, and agentic loops. |
| [Streaming & Server-Sent Events](./streaming) | Real-time token streaming with native CI4 SSE. |
| [Vector Embeddings & Search](./embeddings) | Embeddings, cosine similarity, and batch generation. |
| [Prompt Templates](./prompt-templates) | Reusable parameterized prompt templates. |
| [Testing with `Ai::fake()`](./testing) | In-memory fake with assertions and sequenced responses. |
| [Supported Providers & Models](./providers) | Driver identifiers, models, and tool-calling support. |

---

## Key Capabilities

- **Multi-Provider Driver Engine**: Seamlessly switch between **OpenAI**, **Anthropic Claude**, **Google Gemini**, **DeepSeek**, **Groq**, **OpenRouter** (300+ models with unified tool calling), and **Ollama** (offline local LLMs).
- **Native CI4 Dot-Notation `.env` Support**: Zero custom environment variable hacks. Configures cleanly using CodeIgniter 4's built-in `ai.providers.<driver>.<key>` dot-notation system with zero runtime overhead.
- **Fluent Request & Multi-Turn Chat Builder**: Intuitive, chainable API supporting single prompts, conversational dialogs, role histories (`system`, `user`, `assistant`, `tool`), temperature, top-p, and token budgets.
- **Schema-First Structured JSON Outputs**: Strict JSON schema enforcement with type validation (`->schema([...])->asArray()`, `->asObject()`) for reliable AI-driven data extraction and workflow automation.
- **Autonomous Tool Calling & Reflection Discovery**: Define custom tools manually or auto-discover methods via PHP 8 `#[AiTool]` and `#[AiParameter]` attributes. Supports multi-turn recursive execution loops with automatic result feeding.
- **Real-Time Token Streaming & Native SSE**: Stream LLM tokens in real time with a one-line CodeIgniter 4 Server-Sent Events (SSE) controller response (`->stream()->toSseResponse()`).
- **Vector Embeddings & Semantic Search**: Generate high-dimensional vector embeddings and calculate cosine similarity using `VectorMath` for RAG and semantic retrieval.
- **Parameterized Prompt Templates**: Reusable template engine supporting `{variable}` interpolation and role casting.
- **Zero-Cost Testing Double (`Ai::fake()`)**: Comprehensive in-memory fake with recorded request inspection, sequenced responses, tool call simulation, and rich PHPUnit assertions (`assertPromptSent`, `assertModel`, `assertDriver`, `assertToolCalled`).
