import { execSync } from 'child_process';

export interface GitInfo {
	lastUpdated: string;
	commitHash: string;
}

export function getGitInfo(cwd = process.cwd()): GitInfo {
	try {
		const lastUpdated = execSync('git log -1 --format=%cd --date=format:"%m/%d/%y %H:%M"', { cwd })
			.toString()
			.trim();
		const commitHash = execSync('git log -1 --format=%h', { cwd })
			.toString()
			.trim();
		return { lastUpdated, commitHash };
	} catch {
		return { lastUpdated: '', commitHash: '' };
	}
}
