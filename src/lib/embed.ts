import fetch from "node-fetch";

interface Provider {
	isEmbeddable(url: string): boolean;
	getEmbedHTML(url: string): Promise<string>;
}

const twitterProvider: Provider = {
	isEmbeddable(url: string) {
		return /^https:\/\/twitter\.com\//.test(url);
	},
	async getEmbedHTML(url: string) {
		const resp = await fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`);
		if (!resp.ok) {
			throw new Error(`fetch failed: status=${resp.status}, url=${resp.url}`);
		}

		const { html }: { html?: string } = await resp.json();
		if (!html) {
			throw new Error(`unexpected response: url=${resp.url}`);
		}
		return html;
	},
};

const providers = [twitterProvider];

export const getEmbedHTML = async (url: string) => {
	const provider = providers.find(provider => provider.isEmbeddable(url));
	if (!provider) {
		return;
	}
	return provider.getEmbedHTML(url);
};
