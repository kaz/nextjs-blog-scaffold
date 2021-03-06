import Link from "next/link";
import type { Entry } from "../lib/datasource";
import type { Article } from "../lib/datasource/articles";
import type { External } from "../lib/datasource/external";
import { relativeUrlFromSlug } from "../lib/utils";
import styles from "../styles/components/ArticleList.module.scss";

const ArticleItem = ({ item }: { item: Article }) => (
	<li>
		<div>{item.date.slice(0, 10)}</div>
		<Link href={relativeUrlFromSlug(item.slug)}>{item.title}</Link>
	</li>
);
const ExternalItem = ({ item }: { item: External }) => (
	<li>
		<div>{item.date.slice(0, 10)}</div>
		<a rel="noopener noreferrer" target="_blank" href={item.url}>
			{item.title}
			<small>Published in {item.publisher}</small>
		</a>
	</li>
);

type Props = {
	entries: Entry[];
};
const Entries = ({ entries }: Props) => {
	return (
		<ul className={styles.articles}>
			{entries.map(entry => {
				if (entry.type == "article") {
					return <ArticleItem key={entry.slug} item={entry} />;
				}
				if (entry.type == "external") {
					return <ExternalItem key={entry.url} item={entry} />;
				}
				// Exhaustive Check
				const _: never = entry;
				return _;
			})}
		</ul>
	);
};
export default Entries;
