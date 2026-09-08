import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Jengo",
  description: "The CodeIgniter 4 Powerhouse",

  themeConfig: {
    logo: '/logo.png', // We can add a logo later

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Packages', link: '/packages/base' }
    ],

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
            { text: 'Database Automation', link: '/guide/database' }
          ]
        }
      ],
      '/packages/': [
        {
          text: 'Ecosystem',
          items: [
            { text: 'jengo/base', link: '/packages/base' },
            { text: 'jengo/auth', link: '/packages/auth' },
            { text: 'jengo/api', link: '/packages/api' },
            { text: 'jengo/ai', link: '/packages/ai' },
            { text: 'jengo/pdf', link: '/packages/pdf' },
            { text: 'jengo/schema', link: '/packages/schema' },
            { text: 'jengo/inertia', link: '/packages/inertia' },
            { text: '@jengo/vite', link: '/packages/vite-plugin' }
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
