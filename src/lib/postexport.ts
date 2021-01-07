import { config } from "dotenv";
import { promises as fs } from "fs";
import path from "path";
import { getContent as getSitemapContent } from "../pages/sitemap.xml";

const ourDir = "./out";
config({ path: ".env.local" });

const write = (fileName: string) => async (content: Parameters<typeof fs.writeFile>[1]) => {
	const dest = path.join(ourDir, fileName);
	await fs.rmdir(dest, { recursive: true });
	return fs.writeFile(dest, content);
};

Promise.all([getSitemapContent().then(write("sitemap.xml"))]).catch(e => console.trace(e));
