---
title: Sanity check
image: markdown-mark.svg
tags: [sanity-check]
date: 3000-01-01 00:00:00
---

src: [CommonMark Spec](https://spec.commonmark.org/0.29/) Version 0.29 (2019-04-06)

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

![foo](markdown-mark.svg "title")

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
