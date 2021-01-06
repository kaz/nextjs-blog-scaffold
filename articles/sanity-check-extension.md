---
title: Sanity check (extension)
tags: [sanity-check]
date: 3000-01-03 00:00:00
---

## Link Targets

- External Link
  - https://nextjs.org/
- Internal Link (Absolute URL)
  - http://localhost:3000/post/sanity-check/
- Internal Link (Relative URL)
  - [/post/sanity-check-plugin/](/post/sanity-check-plugin/)

## Dangerous HTML

<button id="button">CLICK HERE!</button>
<script>
document.querySelector("#button").addEventListener("click", () => {
  alert("Hi!");
});
</script>

## OGP (Remote)

This is [inline link](https://ogp.me/), so won't be transformed to rich content block.

https://ogp.me/

## OGP (Local / absolute and related links)

http://localhost:3000/post/sanity-check/

[/post/sanity-check-plugin/](/post/sanity-check-plugin/)

## oEmbed (Twitter)

https://twitter.com/reactjs/status/1341072021099327489
