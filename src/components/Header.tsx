import Link from "next/link";
import React from "react";
import styles from "../styles/header.module.scss";

const Header = () => {
	return (
		<header className={styles.header}>
			<h1>
				<Link href="/">{process.env.NEXT_PUBLIC_BLOG_TITLE}</Link>
			</h1>
		</header>
	);
};
export default Header;
