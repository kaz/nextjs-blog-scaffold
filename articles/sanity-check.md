---
slug: sanity-check
title: Sanity check
date: 3000-01-01 00:00:00
tags: [misc]
---

[GitHub Flavored Markdown Spec]: https://github.github.com/gfm/
src: [GitHub Flavored Markdown Spec] Version 0.29-gfm (2019-04-06)

## Thematic breaks

***
---
___

## ATX headings

# foo
## foo
### foo
#### foo
##### foo
###### foo

## Setext headings

Foo *bar*
=========

Foo *bar*
---------

## Indented code blocks

    a simple
      indented code block

## Fenced code blocks

```
<
 >
```

~~~
<
 >
~~~

## HTML blocks

<div>

*Markdown*
</div>

## Link reference definitions

[foo]: /url "title"

[foo]

## Paragraphs

aaa
bbb

ccc
ddd

## Block quotes

> # Foo
> bar
> baz

## Lists

- foo
- bar
+ baz

1. foo
2. bar
3) baz

## Code spans

`foo`

## Emphasis and strong emphasis

***strong emph***
***strong** in emph*
***emph* in strong**
**in strong *emph***
*in emph **strong***

## Links

[link](/uri "title")

## Images

![foo](https://raw.githubusercontent.com/dcurtis/markdown-mark/master/svg/markdown-mark.svg "title")

## Autolinks

<http://foo.bar.baz>

## Raw HTML

<marquee>Hoge</marquee>

## Hard line breaks

foo\
baz

## Soft line breaks

foo
baz

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

This[^1] is footnote[^footnote].

## Footnotes definition (remark-footnotes)

[^1]: numbered footnote
[^footnote]: generic footnote
