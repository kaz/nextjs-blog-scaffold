import katex from "katex";
import "katex/dist/katex.min.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import footnotes from "remark-footnotes";
import gfm from "remark-gfm";
import math from "remark-math";
import orderFootnotes from "remark-plugin-order-footnotes";

type Props = {
	children: string;
};

type Plugins = Parameters<typeof ReactMarkdown>[0]["plugins"];
const plugins: Plugins = [gfm, math, [footnotes, { inlineNotes: true }], orderFootnotes];

type Renderers = Parameters<typeof ReactMarkdown>[0]["renderers"];
const renderers: Renderers = {
	code: ({ language, value }) => {
		return (
			<SyntaxHighlighter
				language={language || "text"}
				children={value}
				customStyle={{ padding: null, background: null }}
			/>
		);
	},
	inlineMath({ value }) {
		return <span dangerouslySetInnerHTML={{ __html: katex.renderToString(value, { displayMode: false }) }} />;
	},
	math({ value }) {
		return <div dangerouslySetInnerHTML={{ __html: katex.renderToString(value, { displayMode: true }) }} />;
	},
	footnoteReference({ identifier, label }) {
		return (
			<sup id={`fnref-${identifier}`}>
				<a href={`#fndef-${identifier}`}>{label}</a>
			</sup>
		);
	},
	footnoteDefinition({ identifier, label, children }) {
		return (
			<div className="footnote" id={`fndef-${identifier}`}>
				<a href={`#fnref-${identifier}`}>{label}</a>
				<div>{children}</div>
			</div>
		);
	},
};

const Markdown = ({ children }: Props) => {
	return (
		<ReactMarkdown plugins={plugins} renderers={renderers} allowDangerousHtml={true}>
			{children}
		</ReactMarkdown>
	);
};
export default Markdown;
