import type { GetStaticProps, PageConfig } from "next";
import Head from "next/head";
import Entries from "../components/Entries";
import { Entry, getEntriesByTag } from "../lib/datasource";
import styles from "../styles/pages/index.module.scss";

type Props = {
	entries: Entry[];
};

export const config: PageConfig = {
	unstable_runtimeJS: false,
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	return { props: { entries: await getEntriesByTag() } };
};

const Index = ({ entries }: Props) => {
	return (
		<main className={styles.index}>
			<Head>
				<title>{process.env.NEXT_PUBLIC_BLOG_TITLE}</title>
			</Head>
			<Entries entries={entries} />
		</main>
	);
};
export default Index;
