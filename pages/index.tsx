import Head from "next/head";
import React from "react";
import style from "../styles/index.module.scss";

const Index = () => (
	<React.Fragment>
		<Head>
			<title>{process.env.NEXT_PUBLIC_BLOG_TITLE}</title>
		</Head>
		<div className={style.scope}>
			<ul>
				<li>
					<div>2020/12/28</div>
					<a href="#">AAA</a>
				</li>
				<li>
					<div>2020/9/9</div>
					<a href="#">BBB</a>
				</li>
			</ul>
		</div>
	</React.Fragment>
);

export default Index;
