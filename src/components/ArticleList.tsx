import Link from "next/link";
import { Entry } from "../lib/datasource";
import { Article } from "../lib/datasource/articles";
import { External } from "../lib/datasource/external";
import styles from "../styles/components/ArticleList.module.scss";

const ArticleItem = ({ item }: { item: Article }) => (
	<li key={item.slug}>
		<div>{item.date.slice(0, 10)}</div>
		<Link href={`/post/${item.slug}`}>{item.title}</Link>
	</li>
);
const ExternalItem = ({ item }: { item: External }) => (
	<li key={item.url}>
		<div>{item.date.slice(0, 10)}</div>
		<a target="_blank" href={item.url}>
			{item.title}
			<small>Published in {item.site}</small>
		</a>
	</li>
);

type Props = {
	entries: Entry[];
};
const ArticleList = ({ entries }: Props) => (
	<ul className={styles.articles}>
		{entries.map(entry => {
			if (entry.type == "article") {
				return <ArticleItem item={entry} />;
			}
			if (entry.type == "external") {
				return <ExternalItem item={entry} />;
			}
			// Exhaustive Check
			const _: never = entry;
			return _;
		})}
	</ul>
);
export default ArticleList;
