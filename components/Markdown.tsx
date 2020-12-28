import React from "react";
import ReactMarkdown from "react-markdown";
import footnotes from "remark-footnotes";
import gfm from "remark-gfm";

type Props = {
	children: string;
};

type Plugins = Parameters<typeof ReactMarkdown>[0]["plugins"];
const plugins: Plugins = [footnotes, gfm];

type Renderers = Parameters<typeof ReactMarkdown>[0]["renderers"];
const renderers: Renderers = {
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
