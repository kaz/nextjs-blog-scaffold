import Link from "next/link";
import React from "react";
import { Entry } from "../lib/datasource";
import styles from "../styles/components/ArticleList.module.scss";

type Props = {
	entries: Entry[];
};

const ArticleList = ({ entries }: Props) => {
	const printEntries = (entry: Entry) => {
		if (entry.type == "article") {
			return (
				<li key={entry.slug}>
					<div>{entry.date.slice(0, 10)}</div>
					<Link href={`/post/${entry.slug}`}>{entry.title}</Link>
				</li>
			);
		}
		if (entry.type == "external") {
			return (
				<li key={entry.url}>
					<div>{entry.date.slice(0, 10)}</div>
					<a target="_blank" href={entry.url}>
						{entry.title}
					</a>
				</li>
			);
		}
		// Exhaustive Check
		const _: never = entry;
		return _;
	};
	return <ul className={styles.articles}>{entries.map(printEntries)}</ul>;
};
export default ArticleList;
