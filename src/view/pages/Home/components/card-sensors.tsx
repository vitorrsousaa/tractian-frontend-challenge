import { Icon } from "@/ui/icon";

interface CardSensorProps {
	children?: string | null;
}

export function CardSensor(props: CardSensorProps) {
	const { children } = props;

	return (
		<div className="flex flex-col gap-2 w-full">
			<strong>Sensor</strong>
			<span className="text-muted-foreground flex items-center gap-1">
				<Icon name="sensor" />
				{children}
			</span>
		</div>
	);
}

export function CardReceptor(props: CardSensorProps) {
	const { children } = props;

	return (
		<div className="flex flex-col gap-2 w-full">
			<strong>Receptor</strong>
			<span className="text-muted-foreground flex items-center gap-1">
				<Icon name="router" />
				{children}
			</span>
		</div>
	);
}
