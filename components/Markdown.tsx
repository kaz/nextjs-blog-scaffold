import Katex from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import footnotes from "remark-footnotes";
import gfm from "remark-gfm";
import math from "remark-math";

type Props = {
	children: string;
};

type Plugins = Parameters<typeof ReactMarkdown>[0]["plugins"];
const plugins: Plugins = [gfm, math, footnotes];

type Renderers = Parameters<typeof ReactMarkdown>[0]["renderers"];
const renderers: Renderers = {
	inlineMath({ value }) {
		return <Katex>{value}</Katex>;
	},
	math({ value }) {
		return <Katex block={true}>{value}</Katex>;
	},
	footnoteDefinition({ identifier, label, children }) {
		return (
			<div id={`def-${identifier}`}>
				<a href={`#def-${identifier}`}>{label}</a>
				{children}
			</div>
		);
	},
	footnoteReference({ identifier, label }) {
		return (
			<sup id={`ref-${identifier}`}>
				<a href={`#def-${identifier}`}>{label}</a>
			</sup>
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
