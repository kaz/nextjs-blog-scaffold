import git from "simple-git";

export const getMtimeFromGit = async (file: string) => {
	try {
		const { latest } = await git(process.env.PROJECT_DIR).log({ file, maxCount: 1 });
		if (!latest) {
			return undefined;
		}
		return new Date(latest.date);
	} catch (e) {
		console.log("git log failed:", e);
	}
	return undefined;
};
