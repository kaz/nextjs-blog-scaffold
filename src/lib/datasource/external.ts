import cheerio from "cheerio";
import fetch from "cross-fetch";
import yaml from "js-yaml";
import Store from "./store";

type RawExternal = {
	url: string;
	site: string;
	title: string;
	date: Date;
	tags: string[];
};
export type External = Omit<RawExternal, "date"> & {
	date: string;
};

const ogp = async (url: string): Promise<Partial<RawExternal>> => {
	const resp = await fetch(url);
	if (!resp.ok) {
		throw new Error(`fetch failed: ${await resp.text()}`);
	}
	const $ = cheerio.load(await resp.text());

	const extArticle: Partial<RawExternal> = { url };

	const site = $(`meta[property="og:site_name"]`).text();
	if (site) {
		extArticle.site = site;
	}

	const title = $(`meta[property="og:title"]`).text();
	if (site) {
		extArticle.title = title;
	}

	const date = $(`meta[property="article:published_time"]`).text();
	if (site) {
		extArticle.date = new Date(date);
	}

	const tags = $(`meta[property="article:tag"]`);
	if (tags.length) {
		extArticle.tags = tags.toArray().map(elm => $(elm).text());
	}

	return extArticle;
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
		const data = yaml.safeLoad(raw);
		if (typeof data != "object") {
			throw new Error("parse failed: unexpected format");
		}

		const extArticle: Partial<RawExternal> = data;
		if (!extArticle.url) {
			throw new Error("parse failed: `url` did not exist");
		}

		const ogpArticle = await ogp(extArticle.url);

		const site = extArticle.site || ogpArticle.site;
		if (!site) {
			throw new Error("parse failed: cannot determine `site`");
		}

		const title = extArticle.title || ogpArticle.title;
		if (!title) {
			throw new Error("parse failed: cannot determine `title`");
		}

		const date = extArticle.date || ogpArticle.date;
		if (!date) {
			throw new Error("parse failed: cannot determine `date`");
		}

		const tags = extArticle.tags || ogpArticle.tags;
		if (!tags) {
			throw new Error("parse failed: cannot determine `tags`");
		}

		return {
			url: extArticle.url,
			site,
			title,
			date: date.toISOString(),
			tags,
		};
	},
});

export const getExternals = () => store.getAll();
