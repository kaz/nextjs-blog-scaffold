import { promises as fs } from "fs";
import path from "path";

const ourDir = "./out";

export const exportStatic = async (fileName: string, contentPromise: Promise<string>) => {
	const dest = path.join(ourDir, fileName);
	await fs.rmdir(dest, { recursive: true });
	return fs.writeFile(dest, await contentPromise);
};
