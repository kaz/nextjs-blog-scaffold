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

const htmlize = async (dirName: string) => {
	const dirPath = path.join(ourDir, dirName);
	const src = path.join(dirPath, "index.html");
	const dest = path.join(ourDir, `${dirName}.html`);

	await fs.copyFile(src, dest);
	return fs.rmdir(dirPath, { recursive: true });
};

const jobs = [htmlize("404"), getSitemapContent().then(write("sitemap.xml"))];
Promise.all(jobs).catch(e => console.trace(e));
