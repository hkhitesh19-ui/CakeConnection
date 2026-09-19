import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General rule: allow all, block private pages
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cart/', '/checkout/', '/my-account/', '/account/', '/wp-admin/', '/api/'],
      },
      // ✅ AI crawlers — explicitly allowed for GEO (Generative Engine Optimization)
      // These bots index your content for ChatGPT, Perplexity, Claude, Google AI Overviews
      // ⚠️ If using Cloudflare: disable "Block AI Bots" / "AI Scrapers and Crawlers" in dashboard
      {
        userAgent: [
          'GPTBot',           // OpenAI ChatGPT
          'OAI-SearchBot',    // OpenAI search
          'ChatGPT-User',     // ChatGPT browsing
          'ClaudeBot',        // Anthropic Claude
          'Claude-SearchBot', // Claude search
          'PerplexityBot',    // Perplexity AI
          'Perplexity-User',  // Perplexity browsing
          'Google-Extended',  // Google Gemini / AI Overviews training
          'Bingbot',          // Microsoft Copilot / Bing
          'Applebot-Extended',// Apple AI
          'Amazonbot',        // Amazon Alexa
          'meta-externalagent', // Meta AI
          'cohere-ai',        // Cohere AI
        ],
        allow: '/',
      },
    ],
    sitemap: 'https://cakeconnection.in/sitemap.xml',
  }
}

