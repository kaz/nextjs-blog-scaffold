import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import CanonicalUrlContext from "../components/CanonicalUrlContext";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/_global.scss";

const App = ({ Component, pageProps, router }: AppProps) => {
	const canonicalUrl = `${process.env.NEXT_PUBLIC_BLOG_URL}${router.asPath}`;

	return (
		<CanonicalUrlContext.Provider value={canonicalUrl}>
			<Head>
				<meta charSet="utf-8" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link rel="icon" href={process.env.NEXT_PUBLIC_AUTHOR_IMAGE} />
				<link rel="canonical" href={canonicalUrl} />
			</Head>
			<Header />
			<Component {...pageProps} />
			<Footer />
		</CanonicalUrlContext.Provider>
	);
};
export default App;
