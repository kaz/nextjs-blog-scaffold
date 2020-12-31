import Katex from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import footnotes from "remark-footnotes";
import gfm from "remark-gfm";
import math from "remark-math";
import orderFootnotes from "remark-plugin-order-footnotes";

type Props = {
	children: string;
};

type Plugins = Parameters<typeof ReactMarkdown>[0]["plugins"];
const plugins: Plugins = [gfm, math, footnotes, orderFootnotes];

type Renderers = Parameters<typeof ReactMarkdown>[0]["renderers"];
const renderers: Renderers = {
	inlineMath({ value }) {
		return <Katex>{value}</Katex>;
	},
	math({ value }) {
		return <Katex block={true}>{value}</Katex>;
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
				<div>
					<a href={`#fnref-${identifier}`}>{label}</a>.
				</div>
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
