import { execSync } from 'child_process';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('child_process');

const mockExecSync = vi.mocked(execSync);

beforeEach(() => {
	vi.resetAllMocks();
});

// import after mock is set up
const { getGitInfo } = await import('./git');

describe('getGitInfo', () => {
	it('returns formatted date and short hash from git', () => {
		mockExecSync
			.mockReturnValueOnce(Buffer.from('05/28/26 14:32'))
			.mockReturnValueOnce(Buffer.from('b7fc21a'));

		const result = getGitInfo('/some/repo');

		expect(result).toEqual({ lastUpdated: '05/28/26 14:32', commitHash: 'b7fc21a' });
	});

	it('passes the cwd to execSync', () => {
		mockExecSync
			.mockReturnValueOnce(Buffer.from('05/28/26 14:32'))
			.mockReturnValueOnce(Buffer.from('abc1234'));

		getGitInfo('/my/project');

		expect(mockExecSync).toHaveBeenCalledWith(
			expect.stringContaining('git log'),
			expect.objectContaining({ cwd: '/my/project' }),
		);
	});

	it('returns empty strings when git is not available', () => {
		mockExecSync.mockImplementation(() => {
			throw new Error('git not found');
		});

		expect(getGitInfo('/no/git')).toEqual({ lastUpdated: '', commitHash: '' });
	});

	it('returns empty strings when cwd is not a git repo', () => {
		mockExecSync.mockImplementation(() => {
			const err = new Error('not a git repository');
			(err as any).status = 128;
			throw err;
		});

		expect(getGitInfo('/tmp/not-a-repo')).toEqual({ lastUpdated: '', commitHash: '' });
	});

	it('trims whitespace from git output', () => {
		mockExecSync
			.mockReturnValueOnce(Buffer.from('  05/28/26 14:32\n'))
			.mockReturnValueOnce(Buffer.from('  b7fc21a\n'));

		const { lastUpdated, commitHash } = getGitInfo('/repo');

		expect(lastUpdated).toBe('05/28/26 14:32');
		expect(commitHash).toBe('b7fc21a');
	});
});
