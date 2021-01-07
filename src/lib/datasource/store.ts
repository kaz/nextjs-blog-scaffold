import { promises as fs } from "fs";
import path from "path";

interface Storable {
	type: string;
	tags: string[];
	date: string;
}
interface DataSource<T extends Storable> {
	getSourceDir(): string;
	getSelector(): (fileName: string) => boolean;
	selectFileByKey?(key: string): string;
	parse(raw: string, filePath: string): Promise<T>;
}

export default class<T extends Storable> {
	private source;
	private cache;

	constructor(source: DataSource<T>) {
		this.source = source;
		this.cache = new Map<string, T>();
	}

	async read(fileName: string) {
		const filePath = path.join(this.source.getSourceDir(), fileName);
		const raw = await fs.readFile(filePath, "utf-8");
		const data = await this.source.parse(raw, filePath);
		this.cache.set(fileName, data);
		return data;
	}
	async getAll() {
		const fileNames = (await fs.readdir(this.source.getSourceDir())).filter(this.source.getSelector());
		if (this.cache.size == fileNames.length && !fileNames.some(fileName => !this.cache.has(fileName))) {
			return Array.from(this.cache.values());
		}
		return Promise.all(fileNames.map(fileName => this.read(fileName)));
	}
	async get(key: string) {
		if (!this.source.selectFileByKey) {
			throw new Error("not supported");
		}
		return this.read(this.source.selectFileByKey(key));
	}
}
