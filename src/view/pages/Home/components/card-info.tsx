import motor from "@/assets/motor.png";
import { Icon } from "@/ui/icon";

interface CardInfoProps {
	name: string;
	sensorType: string | null;
}

export function CardInfo(props: CardInfoProps) {
	const { name, sensorType } = props;

	const isMotor = name.toLowerCase().includes("motor");

	return (
		<div className="flex flex-row gap-6">
			<div>
				{isMotor ? (
					<img src={motor} />
				) : (
					<div className="w-80 h-56 bg-blue-100 flex items-center flex-col border-dashed border border-blue-500 justify-center text-primary rounded-md text-sm">
						<Icon name="inbox" />
						<span>Adicionar imagem do ativo</span>
					</div>
				)}
			</div>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<strong>Tipo de Equipamento</strong>
					<span className="text-muted-foreground">
						{isMotor ? "Motor elétrico (Trifásico)" : "Sensor"}
					</span>
				</div>
				<hr />
				<div className="flex flex-col gap-2">
					<strong>Responsáveis</strong>
					<span className="text-muted-foreground flex items-center gap-1">
						<span className="h-6 w-6 rounded-full bg-primary text-sm text-white flex items-center justify-center">
							{sensorType === "energy" ? "E" : "M"}
						</span>
						{sensorType === "energy" ? "Elétrica" : "Mecânica"}
					</span>
				</div>
			</div>
		</div>
	);
}
