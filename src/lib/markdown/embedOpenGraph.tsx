import ReactDOMServer from "react-dom/server";
import type { Plugin, Transformer } from "unified";
import type { Node } from "unist";
import { getMetadata, Metadata } from "../meta";
import { isElement, map } from "./helper";

const plugin: Plugin = () => transformer;
const transformer: Transformer = tree => map(tree, mapFn);

const mapFn = async (node: Node) => {
	if (!isElement(node)) {
		return node;
	}
	if (node.tagName != "p") {
		return node;
	}
	if (node.children.length != 1) {
		return node;
	}

	const child = node.children[0];
	if (!isElement(child)) {
		return node;
	}
	if (child.tagName != "a") {
		return node;
	}
	if (!child.properties) {
		return node;
	}

	const href = child.properties["href"];
	if (typeof href != "string") {
		return node;
	}

	try {
		const metadata = await getMetadata(href);
		if (!metadata.title) {
			return node;
		}

		return {
			type: "raw",
			value: ReactDOMServer.renderToString(<LinkCard meta={metadata} />),
		};
	} catch (e) {
		console.log("[WARNING] failed to get metadata:", e);
	}
	return node;
};

type Props = {
	meta: Metadata;
};
const LinkCard = ({ meta }: Props) => {
	const url = new URL(meta.url);
	return (
		<div className="linkCard">
			<a href={meta.local ? url.pathname : meta.url} target={meta.local ? undefined : "_blank"}>
				<div>
					<big>{meta.title}</big>
					<small>{url.hostname}</small>
					<span>{meta.description}</span>
				</div>
				{meta.image && <img src={meta.image} />}
			</a>
		</div>
	);
};

module.exports = plugin;
export default plugin;
