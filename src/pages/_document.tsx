import Document, { Head, Html, Main, NextScript } from "next/document";
import Analytics from "../components/Analytics";

export default class extends Document {
	render() {
		return (
			<Html lang={process.env.NEXT_PUBLIC_LANG}>
				<Head />
				<body>
					<Main />
					<NextScript />
					<Analytics />
				</body>
			</Html>
		);
	}
}
