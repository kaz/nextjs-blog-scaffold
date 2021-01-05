import ogs from "open-graph-scraper";
import type { Plugin, Transformer } from "unified";
import type { Node } from "unist";
import { isElement, map } from "./utils";

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
		const { result } = await ogs({ url: href });
		if (!result.success) {
			throw new Error(`scrape failed: ${result.error}`);
		}
		if (!result.ogTitle) {
			return node;
		}

		const value = `
			<a class="linkCard" href="${href}">
				<div>
					<big>${result.ogTitle}</big>
					<small>${result.ogUrl || result.requestUrl}</small>
					<span>${result.ogDescription || ""}</span>
				</div>
				${result.ogImage ? `<img src="${result.ogImage.url}" />` : ""}
			</a>
		`;
		return { type: "raw", value };
	} catch (e) {
		console.log("[WARNING] failed to parse ogp metadata:", e);
	}
	return node;
};

module.exports = plugin;
export default plugin;
