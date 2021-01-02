import Link from "next/link";
import React from "react";
import style from "../styles/header.module.scss";

const Header = () => {
	return (
		<div className={style.Header}>
			<h1>
				<Link href="/">{process.env.NEXT_PUBLIC_BLOG_TITLE}</Link>
			</h1>
		</div>
	);
};
export default Header;
