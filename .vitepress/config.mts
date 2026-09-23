import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Jengo",
  description: "The CodeIgniter 4 Powerhouse",

  themeConfig: {
    logo: '/logo.png', // We can add a logo later

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Packages', items: [
        { text: "Base", link: "/packages/base/" },
        { text: "Schema", link: "/packages/schema/" },
        { text: "Storage", link: "/packages/storage/" },
        { text: "Authentication", link: "/packages/auth/" },
        { text: "API", link: "/packages/api/" },
        { text: "Broadcasting", link: "/packages/broadcasting/" },
        { text: "Artificial Intelligence(AI)", link: "/packages/ai/" },
        { text: "PDF", link: "/packages/pdf/" },
        { text: "Inertia.js", link: "/packages/inertia/" },
        { text: "Vite", link: "/packages/vite-plugin/" },
      ] }
    ],

    search: {
      provider: "local"
    },

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'The Installer', link: '/guide/installer' }
          ]
        },
        {
          text: 'Core Features',
          items: [
            { text: 'The Gatekeeper (Auth)', link: '/guide/auth' },
            { text: 'The Vault (API)', link: '/guide/api' },
            { text: 'Database & Schemas', link: '/guide/database' }
          ]
        }
      ],
      '/packages/': [
        {
          text: 'Foundational & Core',
          collapsed: false,
          items: [
            { text: 'jengo/base', link: '/packages/base/', items: [
              { text: 'Helpers & Utilities', link: '/packages/base/helpers' },
              { text: 'Command Variant Architecture', link: '/packages/base/command-variants' },
              { text: 'Resource Generators', link: '/packages/base/generators' },
              { text: 'Core Libraries', link: '/packages/base/libraries' },
              { text: 'The Setup Hub', link: '/packages/base/setup' },
              { text: 'Data Mappings', link: '/packages/base/mapping/', items: [
                { text: 'Direct Entity Mapping', link: '/packages/base/mapping/direct-mapping' },
                { text: 'The Central Mapper Engine', link: '/packages/base/mapping/mapper-engine' },
                { text: 'Bi-Directional Synchronization', link: '/packages/base/mapping/syncing' },
                { text: 'PHP 8 Mapping Attributes', link: '/packages/base/mapping/attributes/', items: [
                  { text: 'Property-Level Attributes', link: '/packages/base/mapping/attributes/property-attributes' },
                  { text: 'Class-Level Dynamic Mapping', link: '/packages/base/mapping/attributes/class-attributes' },
                  { text: 'Attribute Reference', link: '/packages/base/mapping/attributes/reference' }
                ] },
                { text: 'Custom Transformers', link: '/packages/base/mapping/transformers' },
                { text: 'Performance Architecture', link: '/packages/base/mapping/performance' }
              ] }
            ] },
            { text: 'jengo/schema', link: '/packages/schema/', items: [
              { text: 'Installation', link: '/packages/schema/installation' },
              { text: 'Defining Schemas', link: '/packages/schema/defining-schemas' },
              { text: 'The Fluent Query API', link: '/packages/schema/querying' },
              { text: 'Filtering & Conditions', link: '/packages/schema/filtering' },
              { text: 'Relationship Derivation', link: '/packages/schema/relationships' },
              { text: 'Search', link: '/packages/schema/search' },
              { text: 'Pagination & Infinite Scrolling', link: '/packages/schema/pagination' },
              { text: 'Virtual Schemas', link: '/packages/schema/virtual-schemas' },
              { text: 'Open Query Mode', link: '/packages/schema/open-query-mode' },
              { text: 'Spark CLI Commands', link: '/packages/schema/cli' },
              { text: 'AI Agent Integration', link: '/packages/schema/ai-integration' }
            ] },
            { text: 'jengo/storage', link: '/packages/storage/', items: [
              { text: 'Installation', link: '/packages/storage/installation' },
              { text: 'Configuration', link: '/packages/storage/configuration' },
              { text: 'Basic File Operations', link: '/packages/storage/file-operations' },
              { text: 'Directory Management', link: '/packages/storage/directories' },
              { text: 'URLs & Signed URLs', link: '/packages/storage/signed-urls' },
              { text: 'Chunked Multipart Uploads', link: '/packages/storage/chunked-uploads' },
              { text: 'Frontend Client', link: '/packages/storage/frontend-client/', items: [
                { text: 'Vanilla TypeScript Usage', link: '/packages/storage/frontend-client/vanilla-usage' },
                { text: 'Framework Adapters', link: '/packages/storage/frontend-client/adapters/', items: [
                  { text: 'React', link: '/packages/storage/frontend-client/adapters/react' },
                  { text: 'Vue 3', link: '/packages/storage/frontend-client/adapters/vue' },
                  { text: 'Svelte', link: '/packages/storage/frontend-client/adapters/svelte' }
                ] },
                { text: 'Direct Cloud Transfers', link: '/packages/storage/frontend-client/direct-cloud' }
              ] },
              { text: 'Direct Pre-Signed Uploads', link: '/packages/storage/direct-uploads' },
              { text: 'Image Transformation Pipeline', link: '/packages/storage/image-processing' },
              { text: 'UploadedFile Integration', link: '/packages/storage/uploaded-file' },
              { text: 'Testing with Storage::fake()', link: '/packages/storage/testing' },
              { text: 'CLI Spark Commands', link: '/packages/storage/cli' }
            ] },
            { text: 'jengo/auth', link: '/packages/auth/', items: [
              { text: 'Installation', link: '/packages/auth/installation' },
              { text: 'Route Publishing', link: '/packages/auth/routes' },
              { text: 'Quick Start', link: '/packages/auth/quick-start' },
              { text: 'Protecting Endpoints', link: '/packages/auth/protecting-endpoints' },
              { text: 'Authorization with Vima', link: '/packages/auth/vima/', items: [
                { text: 'Roles and Permissions', link: '/packages/auth/vima/roles-permissions' },
                { text: 'Synchronizing to Database', link: '/packages/auth/vima/syncing' },
                { text: 'Generating TypeScript Mappings', link: '/packages/auth/vima/typescript-maps' },
                { text: 'Checking Permissions & Policies', link: '/packages/auth/vima/checking' },
                { text: 'Fluent Grants and Explicit Denies', link: '/packages/auth/vima/grants-deny' }
              ] },
              { text: 'Declarative PHP 8 Attributes', link: '/packages/auth/attributes' },
              { text: 'Response Modifiers', link: '/packages/auth/response-modifiers' },
              { text: 'Custom Notification Senders', link: '/packages/auth/notifications' },
              { text: 'Custom Guards', link: '/packages/auth/guards' },
              { text: 'CLI Commands', link: '/packages/auth/cli' }
            ] },
            { text: 'jengo/api', link: '/packages/api/', items: [
              { text: 'Installation', link: '/packages/api/installation' },
              { text: 'Defining Resource Configurations', link: '/packages/api/resource-config' },
              { text: 'Registering Resources', link: '/packages/api/registering' },
              { text: 'Routes & Swagger Documentation', link: '/packages/api/routing' },
              { text: 'Query Parameters', link: '/packages/api/query-parameters' },
              { text: 'Relational Mutations & Bulk Writes', link: '/packages/api/mutations' },
              { text: 'Lifecycle Hooks', link: '/packages/api/lifecycle-hooks' },
              { text: 'CLI Commands', link: '/packages/api/cli' }
            ] }
          ]
        },
        {
          text: 'Real-Time & Networking',
          collapsed: false,
          items: [
            { text: 'jengo/broadcasting', link: '/packages/broadcasting/', items: [
              { text: 'Installation', link: '/packages/broadcasting/installation' },
              { text: 'Configuration', link: '/packages/broadcasting/configuration' },
              { text: 'The Broadcasting Mental Model', link: '/packages/broadcasting/mental-model' },
              { text: 'Practical Application Guides', link: '/packages/broadcasting/guides/', items: [
                { text: 'Order / Delivery Tracker', link: '/packages/broadcasting/guides/order-tracker' },
                { text: 'Background Job Progress Bar', link: '/packages/broadcasting/guides/export-progress' },
                { text: 'Collaborative Kanban Board', link: '/packages/broadcasting/guides/kanban-board' },
                { text: 'Flash Sale Stock Counter', link: '/packages/broadcasting/guides/stock-counter' },
                { text: 'Live Interactive Polling Room', link: '/packages/broadcasting/guides/polling-room' }
              ] },
              { text: 'Local Development WebSocket Server', link: '/packages/broadcasting/dev-server' },
              { text: 'Frontend Client', link: '/packages/broadcasting/frontend-client/', items: [
                { text: 'SSE Setup', link: '/packages/broadcasting/frontend-client/sse-setup' },
                { text: 'WebSockets Setup', link: '/packages/broadcasting/frontend-client/ws-setup' },
                { text: 'React Integration', link: '/packages/broadcasting/frontend-client/react' },
                { text: 'Vue 3 Integration', link: '/packages/broadcasting/frontend-client/vue' },
                { text: 'Svelte Integration', link: '/packages/broadcasting/frontend-client/svelte' }
              ] },
              { text: 'Testing with Broadcast::fake()', link: '/packages/broadcasting/testing' },
              { text: 'Production Readiness Roadmap', link: '/packages/broadcasting/roadmap' }
            ] }
          ]
        },
        {
          text: 'Enterprise & Media',
          collapsed: false,
          items: [
            { text: 'jengo/ai', link: '/packages/ai/', items: [
              { text: 'Installation', link: '/packages/ai/installation' },
              { text: 'Configuration', link: '/packages/ai/configuration' },
              { text: 'Quick Start', link: '/packages/ai/quick-start' },
              { text: 'Multi-Turn Conversations', link: '/packages/ai/conversations' },
              { text: 'Schema-First Structured Output', link: '/packages/ai/structured-output' },
              { text: 'Tool Calling & Autonomous Agents', link: '/packages/ai/tool-calling' },
              { text: 'Streaming & Server-Sent Events', link: '/packages/ai/streaming' },
              { text: 'Vector Embeddings & Search', link: '/packages/ai/embeddings' },
              { text: 'Prompt Templates', link: '/packages/ai/prompt-templates' },
              { text: 'Testing with Ai::fake()', link: '/packages/ai/testing' },
              { text: 'Supported Providers & Models', link: '/packages/ai/providers' }
            ] },
            { text: 'jengo/pdf', link: '/packages/pdf/', items: [
              { text: 'Installation', link: '/packages/pdf/installation' },
              { text: 'Configuration', link: '/packages/pdf/configuration' },
              { text: 'Quick Start', link: '/packages/pdf/quick-start' },
              { text: 'Pre-Built Document Builders', link: '/packages/pdf/document-builders/', items: [
                { text: 'Commercial Invoice', link: '/packages/pdf/document-builders/invoice' },
                { text: 'Quotation / Project Proposal', link: '/packages/pdf/document-builders/quotation' },
                { text: 'Payment Receipt & Voucher', link: '/packages/pdf/document-builders/receipt' },
                { text: 'Employee Payslip', link: '/packages/pdf/document-builders/payslip' }
              ] },
              { text: 'Schema-Driven Data Reports', link: '/packages/pdf/schema-reports' },
              { text: 'Interactive Browser Preview', link: '/packages/pdf/preview' },
              { text: 'Preview Filtering & Slide-Over Drawer', link: '/packages/pdf/filtering/', items: [
                { text: 'Filter Types & Factory', link: '/packages/pdf/filtering/filter-types' },
                { text: 'The onFilter Handler', link: '/packages/pdf/filtering/on-filter' },
                { text: 'Schema Report Auto-Filters', link: '/packages/pdf/filtering/schema-auto-filters' },
                { text: 'State Synchronization & Downloads', link: '/packages/pdf/filtering/state-sync' }
              ] },
              { text: 'Vector Utilities', link: '/packages/pdf/vector-utilities' },
              { text: 'Testing with Pdf::fake()', link: '/packages/pdf/testing' },
              { text: 'Global Helper', link: '/packages/pdf/global-helper' }
            ] }
          ]
        },
        {
          text: 'Frontend & Tooling',
          collapsed: false,
          items: [
            { text: 'jengo/inertia', link: '/packages/inertia/', items: [
              { text: 'Basic Usage', link: '/packages/inertia/basic-usage' },
              { text: 'Inertia v3 Features', link: '/packages/inertia/v3-features' },
              { text: 'History & Navigation Control', link: '/packages/inertia/history-control' },
              { text: 'Shared Data', link: '/packages/inertia/shared-data' },
              { text: 'The Client Side', link: '/packages/inertia/client-side' },
              { text: 'SSR Support', link: '/packages/inertia/ssr' },
              { text: 'Exception Handling & Error Pages', link: '/packages/inertia/error-pages' }
            ] },
            { text: '@jengo/vite', link: '/packages/vite-plugin/', items: [
              { text: 'How it Works', link: '/packages/vite-plugin/how-it-works' },
              { text: 'Configuration', link: '/packages/vite-plugin/configuration' },
              { text: 'Frontend Usage in CodeIgniter', link: '/packages/vite-plugin/frontend-usage' }
            ] }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jengophp' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present JengoPHP'
    }
  },
  base: '/jengophp.com/'
})
