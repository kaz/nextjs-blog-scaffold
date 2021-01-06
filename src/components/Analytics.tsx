import React from "react";

const siteTag = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}')`;

const Analytics = () => {
	if (process.env.NODE_ENV != "production") {
		return <React.Fragment />;
	}
	if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
		return <React.Fragment />;
	}

	return (
		<React.Fragment>
			<script
				async={true}
				src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
			/>
			<script dangerouslySetInnerHTML={{ __html: siteTag }} />
		</React.Fragment>
	);
};
export default Analytics;
