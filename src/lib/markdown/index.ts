import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkFootnotes from "remark-footnotes";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import unified from "unified";
import linkTarget from "./linkTarget";
import numberedFootnote from "./numberedFootnote";
import oEmbed from "./oEmbed";
import openGraph from "./openGraph";
import plaintext from "./plaintext";

const getMarkdownProcessor = () =>
	unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkMath)
		.use(remarkFootnotes)
		.use(numberedFootnote)
		.use(remarkRehype, { allowDangerousHtml: true });

const descriptionLength = 100;
export const markdownToDescription = async (md: string) => {
	const plain = (await getMarkdownProcessor().use(plaintext).use(rehypeStringify).process(md)).toString();
	if (plain.length <= descriptionLength) {
		return plain;
	}
	return `${plain.substr(0, descriptionLength - 1)}…`;
};

export const markdownToHtml = async (md: string) => {
	const html = await getMarkdownProcessor()
		.use(rehypeKatex)
		.use(require("rehype-highlight"))
		.use(oEmbed)
		.use(openGraph)
		.use(linkTarget)
		.use(rehypeRaw)
		.use(require("rehype-preset-minify"))
		.use(rehypeStringify)
		.process(md);
	return html.toString();
};
