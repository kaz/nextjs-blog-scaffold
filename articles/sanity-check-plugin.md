---
title: Sanity check (plugin)
tags: [sanity-check]
date: 3000-01-02 00:00:00
---

Installed plugins

- [remark-gfm](https://www.npmjs.com/package/remark-gfm)
- [remark-math](https://www.npmjs.com/package/remark-math)
- [remark-footnotes](https://www.npmjs.com/package/remark-footnotes)

## Tables (remark-gfm)

| foo | bar |
| --- | --- |
| baz | bim |

## Task list items (remark-gfm)

- [x] foo
  - [ ] bar
  - [x] baz
- [ ] bim

## Strikethrough (remark-gfm)

~~Hi~~ Hello, world!

## Autolinks (remark-gfm)

www.commonmark.org

## Math (remark-math)

This is inline equation: $\left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)$

$$
{1 +  \frac{q^2}{(1-q)}+\frac{q^6}{(1-q)(1-q^2)}+\cdots }= \prod_{j=0}^{\infty}\frac{1}{(1-q^{5j+2})(1-q^{5j+3})}, \quad\quad \text{for }\lvert q\rvert<1.
$$

## Footnotes reference (remark-footnotes)

This[^footnote] is footnote[^1].
A footnote referenced multiple[^footnote] times should have same number!

## Footnotes definition (remark-footnotes)

[^1]: numbered footnote

    with multi paragraph

[^footnote]: Hi there!
