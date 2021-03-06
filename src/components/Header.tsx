import Link from "next/link";
import styles from "../styles/components/Header.module.scss";

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
