import katex from "rehype-katex";
import raw from "rehype-raw";
import stringify from "rehype-stringify";
import footnotes from "remark-footnotes";
import gfm from "remark-gfm";
import math from "remark-math";
import parse from "remark-parse";
import remark2rehype from "remark-rehype";
import unified from "unified";
import embedOpenGraph from "./embedOpenGraph";
import embedTweet from "./embedTweet";
import linkTarget from "./linkTarget";
import numberedFootnote from "./numberedFootnote";
import plaintext from "./plaintext";

const getMarkdownProcessor = () =>
	unified()
		.use(parse)
		.use(gfm)
		.use(math)
		.use(footnotes)
		.use(numberedFootnote)
		.use(remark2rehype, { allowDangerousHtml: true });

const descriptionLength = 100;
export const markdownToDescription = async (md: string) => {
	const plain = (await getMarkdownProcessor().use(plaintext).use(stringify).process(md)).toString();
	if (plain.length <= descriptionLength) {
		return plain;
	}
	return `${plain.substr(0, descriptionLength - 1)}…`;
};

export const markdownToHtml = async (md: string) => {
	const html = await getMarkdownProcessor()
		.use(katex)
		.use(require("rehype-highlight"))
		.use(embedTweet)
		.use(embedOpenGraph)
		.use(linkTarget)
		.use(raw)
		.use(stringify)
		.process(md);
	return html.toString();
};
