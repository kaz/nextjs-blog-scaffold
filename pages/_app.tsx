import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import "../styles/app.scss";

const App = ({ Component, pageProps }: AppProps) => (
	<React.Fragment>
		<Head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="initial-scale=1.0, width=device-width" />
		</Head>
		<header>
			<h1>
				<a href="/">{process.env.NEXT_PUBLIC_BLOG_TITLE}</a>
			</h1>
		</header>
		<main>
			<Component {...pageProps} />
		</main>
	</React.Fragment>
);

export default App;
