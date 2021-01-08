# Next.js Blog Scaffold

This is a template repository for creating markdown-based static blog powered by Next.js.

## Demo

https://nextjs-blog-scaffold.vercel.app/

## Features

- Truly static
	- Generated pages do not need any runtime javascript.
- Uses pure-markdown
	- You can easily migrate from other SSGs.
- Include articles from extenal sources
	- You can list your articles in same place.
	- https://github.com/kaz/nextjs-blog-scaffold/tree/master/articles/external
- OGP-aware link
	- Automatically fetch metadata from URL located in articles, and prints rich link card.
- oEmbed
	- Automatically detect oEmbed-compatible URL and embed rich content.
- SEO
	- Generates appropriate metadata for search engines.
- Statically generated sitemaps
	- Restriction: `sitemap.xml` cannot work in some PaaS provider, such like Vercel. Works properly on static exporting.

Check it out in [demo blog](https://nextjs-blog-scaffold.vercel.app/)!

## Usage

Click the green "User this template" button to get yours.

- Config: https://github.com/kaz/nextjs-blog-scaffold/blob/master/.env.local
- Articles: https://github.com/kaz/nextjs-blog-scaffold/tree/master/articles
- Extenal articles: https://github.com/kaz/nextjs-blog-scaffold/tree/master/articles/extenal
