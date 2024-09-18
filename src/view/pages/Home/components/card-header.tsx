export interface CardHeaderProps {
	children: string;
}

export function CardHeader(props: CardHeaderProps) {
	const { children } = props;
	return (
		<header className="mt-2 ml-2">
			<strong className="uppercase">{children}</strong>
		</header>
	);
}
