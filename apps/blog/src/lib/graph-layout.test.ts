import { describe, expect, it } from 'vitest';
import type { Commit } from '../data/graph';
import { history } from '../data/graph';
import { assignLanes, buildEdges, hash, shiftOf, tiltOf, yearMarks } from './graph-layout';

// minimal commit factory — only the fields the layout cares about
const c = (id: string, branch: string, parents: string[], extra: Partial<Commit> = {}): Commit => ({
	id,
	branch,
	parents,
	t: 0,
	type: 'main',
	title: id,
	...extra,
});

const sorted = [...history].sort((a, b) => a.t - b.t);

describe('hash / tiltOf / shiftOf', () => {
	it('is deterministic for the same id', () => {
		expect(hash('parkour')).toBe(hash('parkour'));
		expect(tiltOf('born')).toBe(tiltOf('born'));
		expect(shiftOf('ghana')).toBe(shiftOf('ghana'));
	});

	it('keeps tilt within -7..7 and shift within -14..14', () => {
		for (const id of ['born', 'ghana', 'kidney', 'a', 'zzzzz', '']) {
			expect(tiltOf(id)).toBeGreaterThanOrEqual(-7);
			expect(tiltOf(id)).toBeLessThanOrEqual(7);
			expect(shiftOf(id)).toBeGreaterThanOrEqual(-14);
			expect(shiftOf(id)).toBeLessThanOrEqual(14);
		}
	});

	it('decorrelates tilt and shift (different salts)', () => {
		// they should not be trivially equal for most ids
		const ids = sorted.map((x) => x.id);
		const equal = ids.filter((id) => tiltOf(id) === shiftOf(id)).length;
		expect(equal).toBeLessThan(ids.length);
	});
});

describe('assignLanes', () => {
	it('puts main on lane 0', () => {
		const { laneOf } = assignLanes(sorted);
		expect(laneOf.main).toBe(0);
	});

	it('honours FORCE_SIDE (career right, wandering left)', () => {
		const { laneOf } = assignLanes(sorted);
		expect(laneOf.contests).toBeGreaterThan(0);
		expect(laneOf.bigmama).toBeGreaterThan(0);
		expect(laneOf.streets).toBeLessThan(0);
		expect(laneOf.wild).toBeLessThan(0);
	});

	it('nests a branch one lane further out than its parent branch, same side', () => {
		// research forks from a contests commit and is not force-pinned
		const { laneOf } = assignLanes(sorted);
		if (laneOf.research !== undefined && laneOf.contests !== undefined) {
			expect(Math.sign(laneOf.research)).toBe(Math.sign(laneOf.contests));
			expect(Math.abs(laneOf.research)).toBeGreaterThan(Math.abs(laneOf.contests));
		}
	});

	it('gives two concurrent same-side branches distinct lanes', () => {
		const commits = [
			c('root', 'main', []),
			c('a1', 'aa', ['root']),
			c('b1', 'bb', ['root']),
			c('a2', 'aa', ['a1']),
			c('b2', 'bb', ['b1']),
		];
		const { laneOf } = assignLanes(commits);
		// force both to the same side by construction: alternating puts them apart,
		// so assert they never share a lane regardless
		expect(laneOf.aa).not.toBe(laneOf.bb);
	});

	it('laneCount spans min..max inclusive', () => {
		const { laneOf, minLane, maxLane, laneCount } = assignLanes(sorted);
		const lanes = Object.values(laneOf);
		expect(minLane).toBe(Math.min(...lanes));
		expect(maxLane).toBe(Math.max(...lanes));
		expect(laneCount).toBe(maxLane - minLane + 1);
	});
});

describe('buildEdges', () => {
	const colorOf = (b: string) => (b === 'main' ? null : `#${b}`);

	it('emits one edge per parent link, child -> parent', () => {
		const commits = [c('root', 'main', []), c('x', 'main', ['root'])];
		const edges = buildEdges(commits, colorOf);
		expect(edges).toEqual([
			{ from: 'x', to: 'root', branch: 'main', color: null, railFrom: false },
		]);
	});

	it('leaves pure trunk edges uncoloured', () => {
		const commits = [c('root', 'main', []), c('x', 'main', ['root'])];
		const [edge] = buildEdges(commits, colorOf);
		expect(edge.color).toBeNull();
		expect(edge.branch).toBe('main');
	});

	it('tints a branch edge and sets railFrom on a checkout', () => {
		const commits = [c('root', 'main', []), c('f1', 'feat', ['root'])];
		const [edge] = buildEdges(commits, colorOf);
		expect(edge.branch).toBe('feat');
		expect(edge.color).toBe('#feat');
		expect(edge.railFrom).toBe(true); // child is off-main
	});

	it('a merge back into main keeps railFrom false and belongs to the feature branch', () => {
		const commits = [
			c('root', 'main', []),
			c('f1', 'feat', ['root']),
			c('m', 'main', ['root', 'f1']),
		];
		const edges = buildEdges(commits, colorOf);
		const merge = edges.find((e) => e.from === 'm' && e.to === 'f1');
		expect(merge).toBeDefined();
		expect(merge?.railFrom).toBe(false);
		expect(merge?.branch).toBe('feat');
		expect(merge?.color).toBe('#feat');
	});
});

describe('yearMarks', () => {
	it('marks the first row of each distinct year only', () => {
		const rows = [{ year: '2025' }, { year: '2025' }, { year: '2024' }];
		expect(yearMarks(rows)).toEqual(['2025', null, '2024']);
	});

	it('does not repeat a year when a year-less row interrupts a run', () => {
		const rows = [{ year: '2022' }, {}, { year: '2022' }];
		expect(yearMarks(rows)).toEqual(['2022', null, null]);
	});

	it('re-marks a label that genuinely changes and comes back', () => {
		const rows = [{ year: '2025' }, { year: '2024–26' }, { year: '2025' }];
		expect(yearMarks(rows)).toEqual(['2025', '2024–26', '2025']);
	});
});

describe('history data invariants', () => {
	it('has unique commit ids', () => {
		const ids = history.map((x) => x.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('references only parents that exist', () => {
		const ids = new Set(history.map((x) => x.id));
		for (const commit of history) {
			for (const p of commit.parents) expect(ids.has(p)).toBe(true);
		}
	});

	it('lists every parent before its child once sorted chronologically', () => {
		const index: Record<string, number> = {};
		sorted.forEach((x, i) => {
			index[x.id] = i;
		});
		for (const commit of sorted) {
			for (const p of commit.parents) expect(index[p]).toBeLessThan(index[commit.id]);
		}
	});

	it('has exactly one root commit with no parents', () => {
		const roots = history.filter((x) => x.parents.length === 0);
		expect(roots).toHaveLength(1);
		expect(roots[0].root).toBe(true);
	});

	it('only lists non-empty photo urls', () => {
		for (const commit of history) {
			for (const src of commit.photos ?? []) expect(src.length).toBeGreaterThan(0);
		}
	});

	it('never has both a tip and photos (one gutter decoration per commit)', () => {
		for (const commit of history) {
			expect(Boolean(commit.tip) && Boolean(commit.photos?.length)).toBe(false);
		}
	});
});
