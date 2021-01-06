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
	getFilter() {
		return ent => ent.endsWith(".yml") || ent.endsWith(".yaml");
	},
	getId(t) {
		return t.url;
	},
	async parse(raw) {
		const data = yaml.load(raw);
		if (!data || typeof data != "object") {
			throw new Error("parse failed: unexpected format");
		}

		const attrs: Partial<ExternalAttrs> = data;
		if (!attrs.url) {
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
