import yaml from "js-yaml";
import { getMetadata } from "../meta";
import Store from "./store";

type ExternalAttrs = {
	url: string;
	publisher: string;
	title: string;
	tags: string[];
	date: Date;
};
export type External = Omit<ExternalAttrs, "date"> & {
	type: "external";
	date: string;
};

const store = new Store<External>({
	getSourceDir() {
		if (!process.env.EXTERNAL_DIR) {
			throw new Error("EXTERNAL_DIR is undefined");
		}
		return process.env.EXTERNAL_DIR;
	},
	getSelector() {
		return fileName => fileName.endsWith(".yml") || fileName.endsWith(".yaml");
	},
	async parse(raw) {
		const attrs = yaml.load(raw) as Partial<ExternalAttrs>;
		if (!attrs || !attrs.url) {
			throw new Error("parse failed: `url` did not exist");
		}

		const metadata = await getMetadata(attrs.url);
		if (!attrs.publisher) {
			attrs.publisher = metadata.publisher || new URL(metadata.url).hostname;
		}
		if (!attrs.title) {
			attrs.title = metadata.title || new URL(metadata.url).pathname;
		}
		if (!attrs.date) {
			attrs.date = new Date(metadata.date || "");
		}

		return {
			type: "external",
			url: metadata.url,
			publisher: attrs.publisher,
			title: attrs.title,
			tags: attrs.tags || [],
			date: attrs.date.toISOString(),
		};
	},
});

export const getExternals = () => store.getAll();
