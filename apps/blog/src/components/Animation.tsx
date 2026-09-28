import { Player } from '@remotion/player';
import { compositions, type CompositionId, type Theme } from 'animations/compositions';
import { useEffect, useState } from 'react';

function useSiteTheme(): Theme {
	const [theme, setTheme] = useState<Theme>('dark');

	useEffect(() => {
		const root = document.documentElement;
		// BaseHead's pre-paint script sets data-theme only for dark; light leaves it off.
		const read = () => setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
		read();
		const observer = new MutationObserver(read);
		observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
		return () => observer.disconnect();
	}, []);

	return theme;
}

interface Props {
	id: CompositionId;
	label: string;
}

export default function Animation({ id, label }: Props) {
	const theme = useSiteTheme();
	const [mounted, setMounted] = useState(false);
	const { component, durationInFrames, fps, width, height } = compositions[id];
	const frame = { width: '100%', aspectRatio: `${width} / ${height}` };

	// The player reaches for browser APIs, so it can only mount on the client; the
	// placeholder holds its box so hydration does not shift the post.
	useEffect(() => setMounted(true), []);
	if (!mounted) return <div style={frame} aria-hidden="true" />;

	return (
		<Player
			component={component}
			inputProps={{ theme }}
			durationInFrames={durationInFrames}
			fps={fps}
			compositionWidth={width}
			compositionHeight={height}
			style={frame}
			aria-label={label}
			autoPlay
			initiallyMuted
			loop
			clickToPlay={false}
			acknowledgeRemotionLicense
		/>
	);
}
