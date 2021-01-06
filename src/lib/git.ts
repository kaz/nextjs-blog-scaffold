import path from "path";
import git from "simple-git";

export const getMtimeFromGit = async (file: string) => {
	try {
		const { latest } = await git(path.dirname(file)).log({ file: path.basename(file), maxCount: 1 });
		if (!latest) {
			return undefined;
		}
		return new Date(latest.date);
	} catch (e) {
		console.log("git log failed:", e);
	}
	return undefined;
};
