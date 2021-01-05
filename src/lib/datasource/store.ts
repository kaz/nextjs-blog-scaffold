import { promises as fs } from "fs";
import path from "path";

interface Storable {
	type: string;
	date: string;
}
interface DataSource<T extends Storable> {
	getSourceDir(): string;
	getFilter(): (ent: string) => boolean;
	getId(t: T): string;
	parse(raw: string): Promise<T>;
}

export default class<T extends Storable> {
	private source;
	private cache;

	constructor(source: DataSource<T>) {
		this.source = source;
		this.cache = new Map<string, T>();
	}

	async read(filePath: string) {
		const raw = await fs.readFile(path.join(this.source.getSourceDir(), filePath), "utf-8");
		const data = await this.source.parse(raw);
		this.cache.set(this.source.getId(data), data);
		return data;
	}
	async getAll() {
		if (this.cache.size) {
			return Array.from(this.cache.values());
		}
		return Promise.all(
			(await fs.readdir(this.source.getSourceDir())).filter(this.source.getFilter()).map(f => this.read(f)),
		);
	}
	async get(key: string) {
		if (!this.cache.size) {
			await this.getAll();
		}
		return this.cache.get(key);
	}
}
