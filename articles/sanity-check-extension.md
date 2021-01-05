---
slug: sanity-check-extension
title: Sanity check (extension)
date: 3000-01-01 00:00:03
tags: [sanity-check]
---

## Link Targets

- External Link
  - https://nextjs.org/
- Internal Link (Absolute URL)
  - http://localhost:3000/post/sanity-check-extension/
- Internal Link (Relative URL)
  - [/post/sanity-check-extension/](/post/sanity-check-extension/)

## Dangerous HTML

<button id="button">CLICK HERE!</button>
<script>
document.querySelector("#button").addEventListener("click", () => {
  alert("Hi!");
});
</script>
