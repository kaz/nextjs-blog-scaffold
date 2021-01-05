import cheerio from "cheerio";
import fetch from "cross-fetch";
import yaml from "js-yaml";
import Store from "./store";

type OgpAttrs = {
	title: string;
	date: Date;
	tags: string[];
};
type ExternalAttrs = OgpAttrs & {
	url: string;
	site: string;
	overwriteTagsWithOgp: boolean;
};
export type External = Omit<ExternalAttrs, "date" | "overwriteTagsWithOgp"> & {
	type: "external";
	date: string;
};

const ogp = async (url: string): Promise<Partial<OgpAttrs>> => {
	const resp = await fetch(url);
	if (!resp.ok) {
		throw new Error(`fetch failed: status=${resp.status}, url=${resp.url}`);
	}
	const $ = cheerio.load(await resp.text());

	const tags: string[] = [];
	$(`meta[property="article:tag"]`).each((_, elm) => {
		const tag = $(elm).attr("content");
		if (tag) {
			tags.push(tag);
		}
	});

	const date = $(`meta[property="article:published_time"]`).attr("content");

	return {
		title: $(`meta[property="og:title"]`).attr("content"),
		date: date ? new Date(date) : undefined,
		tags,
	};
};

const store = new Store<External>({
	getSourceDir() {
		return "./articles/external";
	},
	getFilter() {
		return ent => ent.endsWith(".yml") || ent.endsWith(".yaml");
	},
	getId(t) {
		return t.url;
	},
	async parse(raw) {
		const data = yaml.load(raw);
		if (typeof data != "object") {
			throw new Error("parse failed: unexpected format");
		}

		const attrs: Partial<ExternalAttrs> = data;
		if (!attrs.url) {
			throw new Error("parse failed: `url` did not exist");
		}

		const ogpAttrs = await ogp(attrs.url);

		const title = attrs.title || ogpAttrs.title;
		if (!title) {
			throw new Error("parse failed: cannot determine `title`");
		}

		const date = attrs.date || ogpAttrs.date;
		if (!date) {
			throw new Error("parse failed: cannot determine `date`");
		}

		return {
			type: "external",
			url: attrs.url,
			site: attrs.site || new URL(attrs.url).hostname,
			title,
			date: date.toISOString(),
			tags: (!attrs.overwriteTagsWithOgp && attrs.tags ? attrs.tags : []).concat(ogpAttrs.tags || []),
		};
	},
});

export const getExternals = () => store.getAll();
