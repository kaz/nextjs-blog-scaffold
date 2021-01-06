module.exports = {
	trailingSlash: true,
	reactStrictMode: true,

	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.node = {
				fs: "empty",
				child_process: "empty",
			};
		}
		return config;
	},
};
