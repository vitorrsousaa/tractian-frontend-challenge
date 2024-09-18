import {
	useGetAllCompanies,
	useGetAssetsByCompany,
	useGetLocationsByCompany,
} from "@/hooks/company";
import { Button } from "@/ui/button";
import { Icon } from "@/ui/icon";
import { Spinner } from "@/ui/spinner";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { cn } from "@/utils/cn";
import { Card } from "./components/card";
import { CardHeader } from "./components/card-header";
import { CardContent } from "./components/card-content";
import { CardInfo } from "./components/card-info";
import { CardReceptor, CardSensor } from "./components/card-sensors";
import { ItemTree, Tree } from "./components/tree";

export function Home() {
	const { company } = useParams<{ company: string }>();

	const { companies } = useGetAllCompanies();

	const [filter, setFilter] = useState<{
		sensor: "energy" | "all";
		status: "alert" | "all";
	}>({
		sensor: "all",
		status: "all",
	});

	const selectedCompany = companies.find(
		(comp) => comp.name.toLowerCase() === company,
	);

	const { locations, isLoadingLocations } = useGetLocationsByCompany(
		selectedCompany?.id,
	);

	const { assets, isLoadingAssets } = useGetAssetsByCompany({
		companyId: selectedCompany?.id,
		filters: {
			sensor: filter.sensor,
			status: filter.status,
		},
	});

	// PENSAR EM ESTRUTURAR A RECURSAO
	// EU POSSO BUSCAR TODO MUNDO QUE É MEU FILHO, E JÁ ADICIONO ESSA GALERA DENTRO DA ARVORE
	const tree3 = useMemo(() => {
		const root: ItemTree[] = [];
		const itemsById: Record<string, ItemTree> = {};

		locations.forEach((location) => {
			const newItem: ItemTree = {
				id: location.id,
				sensorType: null,
				name: location.name,
				children: [],
			};

			if (!location.parentId) {
				root.push(newItem);
			}

			itemsById[location.id] = newItem;
		});

		locations.forEach((location) => {
			if (location.parentId && itemsById[location.parentId]) {
				itemsById[location.parentId].children!.push(itemsById[location.id]);
			}
		});

		assets.forEach((asset) => {
			const newItem: ItemTree = {
				id: asset.id,
				name: asset.name,
				sensorType: asset.sensorType,
				status: asset.status,
				children: [],
				sensorId: asset.sensorId,
				locationId: asset.locationId,
				parentId: asset.parentId,
				gatewayId: asset.gatewayId,
			};

			// Add asset to root
			if (!asset.locationId && !asset.parentId) {
				root.push(newItem);
			}

			itemsById[asset.id] = newItem;
		});

		// Add assets to locations
		assets.forEach((asset) => {
			const newItem = itemsById[asset.id];

			if (asset.locationId && itemsById[asset.locationId]) {
				itemsById[asset.locationId].children!.push(newItem);
			} else if (asset.parentId && itemsById[asset.parentId]) {
				itemsById[asset.parentId].children!.push(newItem);
			}
		});

		return root;
	}, [locations, assets]);

	// Se tiver um sensor type, ele é um component
	// Se não tiver location ou parentId, ele deve ser posicionado na raiz da arvore, sem conexão com location ou asset
	// Se ele tiver location e não tiver um sensorId, significa que esse asset tem um location como parent
	// Se esse item tiver parentId e não tem um sensorId, significa que esse asset tem um asset como parent
	// se ele tiver um sensor type, é um componente. Se tiver um location ou parentId, ele tem um location ou parent

	const loadingTree = useMemo(
		() => Boolean(isLoadingAssets || isLoadingLocations),
		[isLoadingAssets, isLoadingLocations],
	);

	const [selectedComponent, setSelectedComponent] = useState<ItemTree | null>(
		null,
	);

	const handleFilterBySensor = useCallback(() => {
		setFilter((prevState) => ({
			status: "all",
			sensor: prevState.sensor === "all" ? "energy" : "all",
		}));
	}, []);

	const handleFilterByStatus = useCallback(() => {
		setFilter((prevState) => ({
			sensor: "all",
			status: prevState.status === "all" ? "alert" : "all",
		}));
	}, []);

	return (
		<div className="flex flex-col items-center justify-center gap-4 w-full ">
			<div className="flex justify-between items-center w-full">
				<div>
					<strong>Ativos</strong>{" "}
					{selectedCompany && (
						<span className="text-muted-foreground">
							{selectedCompany.name} Unit
						</span>
					)}
				</div>

				{selectedCompany && (
					<div className="flex gap-2">
						<Button
							variant={filter.sensor === "all" ? "secondary" : "tertiary"}
							onClick={handleFilterBySensor}
						>
							<Icon
								name="thunderbolt"
								className={cn(
									filter.sensor === "all" ? "fill-primary" : "fill-white",
								)}
							/>
							Sensor de energia
						</Button>
						<Button
							onClick={handleFilterByStatus}
							variant={filter.status === "all" ? "secondary" : "tertiary"}
						>
							<Icon
								name="exclamationCircle"
								className={cn(
									filter.status === "all" ? "fill-primary" : "fill-white",
								)}
							/>
							Crítico
						</Button>
					</div>
				)}
			</div>

			{selectedCompany ? (
				loadingTree ? (
					<div>
						<Spinner />
					</div>
				) : (
					<div className="flex flex-row w-full gap-2 h-full">
						<div className=" w-1/2 border border-border rounded-md">
							<Tree data={tree3} selectedNodeCallback={setSelectedComponent} />
						</div>
						<div className="flex flex-col gap-2 w-full border border-border rounded-md">
							{selectedComponent ? (
								<Card>
									<CardHeader>{selectedComponent.name}</CardHeader>
									<hr />
									<CardContent>
										<CardInfo
											name={selectedComponent.name}
											sensorType={selectedComponent.sensorType}
										/>
										<hr />
										<div className="flex flex-row w-full justify-between">
											<CardSensor>{selectedComponent.sensorId}</CardSensor>
											<CardReceptor>{selectedComponent.gatewayId}</CardReceptor>
										</div>
									</CardContent>
								</Card>
							) : (
								<div className="flex mt-8 items-center justify-center">
									Selecione um ativo no painel ao lado
								</div>
							)}
						</div>
					</div>
				)
			) : (
				<div>
					<span>Selecione uma compania no botão acima</span>
				</div>
			)}
		</div>
	);
}
