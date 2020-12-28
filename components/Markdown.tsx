import React from "react";
import ReactMarkdown from "react-markdown";

type Props = {
	children: string;
};

const Markdown = ({ children }: Props) => {
	return <ReactMarkdown allowDangerousHtml={true}>{children}</ReactMarkdown>;
};
export default Markdown;
