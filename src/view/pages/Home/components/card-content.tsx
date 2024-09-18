interface CardContentProps {
	children: React.ReactNode;
}

export function CardContent(props: CardContentProps) {
	const { children } = props;

	return <div className="p-2 flex flex-col gap-4 h-full">{children}</div>;
}
