import { promises as fs } from "fs";
import path from "path";
import { getContent as getSitemapContent } from "../pages/sitemap.xml";

const ourDir = "./out";
const write = (dst: string) => (content: Parameters<typeof fs.writeFile>[1]) =>
	fs.writeFile(path.join(ourDir, dst), content);

Promise.all([getSitemapContent().then(write("sitemap.xml"))]).catch(e => console.trace(e));
