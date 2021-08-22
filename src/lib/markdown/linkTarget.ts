import type { Element, Root } from "hast";
import type { Plugin, Transformer } from "unified";
import { isLocalUrl } from "../utils";

const transformer: Transformer<Root> = async tree => {
	const { selectAll } = await import("unist-util-select");

	const nodes = selectAll("element[tagName=a]", tree) as Element[];
	nodes.forEach(node => {
		if (!node.properties) {
			return;
		}

		const href = node.properties["href"];
		if (typeof href != "string") {
			return;
		}
		if (isLocalUrl(href)) {
			return;
		}

		node.properties.rel = "noopener noreferrer";
		node.properties.target = "_blank";
	});

	return tree;
};

const plugin: Plugin<any, Root> = () => transformer;
export default plugin;
