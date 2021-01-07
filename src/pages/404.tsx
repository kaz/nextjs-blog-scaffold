import type { PageConfig } from "next";
import Head from "next/head";
import styles from "../styles/pages/404.module.scss";

export const config: PageConfig = {
	unstable_runtimeJS: false,
};

const NotFound = () => {
	return (
		<main className={styles.notFound}>
			<Head>
				<title>Not Found | {process.env.NEXT_PUBLIC_BLOG_TITLE}</title>
			</Head>
			<h2>404</h2>
			<h3>Not Found</h3>
		</main>
	);
};
export default NotFound;
