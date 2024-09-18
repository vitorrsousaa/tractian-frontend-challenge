interface CardProps {
	children: React.ReactNode;
}

export function Card(props: CardProps) {
	const { children } = props;

	return <>{children}</>;
}
