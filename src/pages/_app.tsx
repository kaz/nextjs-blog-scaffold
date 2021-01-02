import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import Header from "../components/Header";
import "../styles/_global.scss";

const App = ({ Component, pageProps }: AppProps) => (
	<React.Fragment>
		<Head>
			<meta charSet="utf-8" />
			<meta name="format-detection" content="telephone=no" />
			<meta name="viewport" content="initial-scale=1.0, width=device-width" />
		</Head>
		<Header />
		<Component {...pageProps} />
	</React.Fragment>
);
export default App;
