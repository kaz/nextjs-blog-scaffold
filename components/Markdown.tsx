import "highlight.js/styles/github.css";
import "katex/dist/katex.css";
import katex from "rehype-katex";
import stringify from "rehype-stringify";
import footnotes from "remark-footnotes";
import gfm from "remark-gfm";
import math from "remark-math";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import unified from "unified";
import style from "../styles/markdown.module.scss";

const render = (md: string): string =>
	unified()
		.use(markdown)
		.use(gfm)
		.use(math)
		.use(footnotes, { inlineNotes: true })
		.use(remark2rehype)
		.use(katex)
		.use(require("rehype-highlight"))
		.use(stringify)
		.processSync(md)
		.toString();

type Props = {
	children: string;
};

const Markdown = ({ children }: Props) => {
	return <article className={style.Markdown} dangerouslySetInnerHTML={{ __html: render(children) }} />;
};
export default Markdown;
