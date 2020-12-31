import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

export default class extends Document {
	render() {
		return (
			<Html lang={process.env.NEXT_PUBLIC_LANG}>
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
