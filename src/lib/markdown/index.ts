import katex from "rehype-katex";
import stringify from "rehype-stringify";
import footnotes from "remark-footnotes";
import gfm from "remark-gfm";
import math from "remark-math";
import parse from "remark-parse";
import remark2rehype from "remark-rehype";
import unified from "unified";
import extendLink from "./extendLink";
import numberedFootnote from "./numberedFootnote";
import plaintext from "./plaintext";

const getMarkdownProcessor = () =>
	unified()
		.use(parse)
		.use(gfm)
		.use(math)
		.use(footnotes)
		.use(numberedFootnote)
		.use(remark2rehype)
		.use(katex)
		.use(require("rehype-highlight"))
		.use(extendLink);

const descriptionLength = 100;
export const markdownToDescription = (md: string, length = descriptionLength) => {
	const plain = getMarkdownProcessor().use(plaintext).use(stringify).processSync(md).toString();
	if (plain.length <= length) {
		return plain;
	}
	return `${plain.substr(0, length - 1)}…`;
};

export const markdownToHtml = (md: string) => getMarkdownProcessor().use(stringify).processSync(md).toString();
