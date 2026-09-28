import type { Commit } from '../data/graph';

// FNV-ish string hash -> stable 16-bit int (same value across rebuilds).
export const hash = (s: string): number => {
	let h = 0;
	for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) & 0xffff;
	return h;
};

// deterministic per-id decorations so photos look casually pinned without
// shifting on every build. tilt ~ -7..7 deg, horizontal nudge ~ -14..14 px.
export const tiltOf = (id: string): number => (hash(id) % 15) - 7;
export const shiftOf = (id: string): number => (hash(`~${id}`) % 29) - 14;

// Pin every branch to a deliberate side (1 = right, -1 = left) so the two gutters
// stay balanced. Career branches live on the right; wandering/personal/oss on the
// left. `research` is intentionally absent: it forks from a `contests` commit, so
// the nesting logic must place it one lane further out on the same side.
const FORCE_SIDE: Record<string, number> = {
	contests: 1,
	bigmama: 1,
	lisptc: 1,
	streets: -1,
	wild: -1,
	freelance: -1,
	ventures: -1,
	oss: -1,
};

export type LaneLayout = {
	laneOf: Record<string, number>;
	minLane: number;
	maxLane: number;
	laneCount: number;
};

// main holds lane 0. A branch off main alternates right (+) / left (-); a branch
// off another branch stays on that parent's side, one lane further out. Concurrent
// branches on the same side take the lowest free magnitude so they never collide.
// Expects `commits` pre-sorted chronologically (parents before their children).
export function assignLanes(commits: Commit[]): LaneLayout {
	const indexOf: Record<string, number> = {};
	commits.forEach((c, i) => {
		indexOf[c.id] = i;
	});

	type Span = { branch: string; start: number; end: number };
	const spans: Record<string, Span> = {};
	for (const c of commits) {
		if (c.branch === 'main') continue;
		if (!spans[c.branch])
			spans[c.branch] = { branch: c.branch, start: indexOf[c.id], end: indexOf[c.id] };
		spans[c.branch].end = indexOf[c.id];
	}
	// extend each span up to the merge commit that consumes its tip
	for (const c of commits) {
		if (c.parents.length < 2) continue;
		for (const p of c.parents) {
			const pb = commits[indexOf[p]].branch;
			if (pb !== 'main' && spans[pb]) spans[pb].end = Math.max(spans[pb].end, indexOf[c.id]);
		}
	}

	const laneOf: Record<string, number> = { main: 0 };
	const freeOn: Record<string, number[]> = { '1': [], '-1': [] };
	let altSide = 1;
	for (const s of Object.values(spans).sort((a, b) => a.start - b.start)) {
		const first = commits[s.start];
		const parentBranch = first.parents.length ? commits[indexOf[first.parents[0]]].branch : 'main';
		let sign: number;
		let minMag: number;
		if (FORCE_SIDE[s.branch] !== undefined) {
			sign = FORCE_SIDE[s.branch];
			minMag = 1;
		} else if (parentBranch === 'main' || laneOf[parentBranch] === undefined) {
			sign = altSide;
			altSide = -altSide;
			minMag = 1;
		} else {
			sign = Math.sign(laneOf[parentBranch]) || altSide;
			minMag = Math.abs(laneOf[parentBranch]) + 1;
		}
		const free = freeOn[String(sign)];
		let m = minMag;
		while (free[m] !== undefined && free[m] > s.start) m++;
		free[m] = s.end;
		laneOf[s.branch] = sign * m;
	}

	const lanes = Object.values(laneOf);
	const minLane = Math.min(...lanes);
	const maxLane = Math.max(...lanes);
	return { laneOf, minLane, maxLane, laneCount: maxLane - minLane + 1 };
}

export type Edge = {
	from: string;
	to: string;
	branch: string;
	color: string | null;
	railFrom: boolean;
};

// child -> parent edges, tinted with the colour of whichever branch they belong to
// (pure trunk edges stay null). `railFrom` marks which end sits on the coloured
// branch — the child on a checkout, the parent on a merge.
export function buildEdges(commits: Commit[], colorOf: (branch: string) => string | null): Edge[] {
	const branchOf: Record<string, string> = {};
	for (const c of commits) branchOf[c.id] = c.branch;
	return commits.flatMap((c) =>
		c.parents.map((p) => {
			const parentBranch = branchOf[p];
			const b = c.branch !== 'main' ? c.branch : parentBranch !== 'main' ? parentBranch : null;
			const branch = b ?? 'main';
			return {
				from: c.id,
				to: p,
				branch,
				color: b ? colorOf(branch) : null,
				railFrom: c.branch !== 'main',
			};
		}),
	);
}

// One label per distinct year in render order. Commits without a year (branch
// episodes) don't reset the run, so a year isn't repeated when one interrupts it.
export function yearMarks(rows: { year?: string }[]): (string | null)[] {
	let seen = '';
	return rows.map((r) => {
		if (r.year && r.year !== seen) {
			seen = r.year;
			return r.year;
		}
		return null;
	});
}
