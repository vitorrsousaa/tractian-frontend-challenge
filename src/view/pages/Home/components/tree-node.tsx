import { Icon } from "@/ui/icon";
import { ItemTree } from "./tree";
import { cn } from "@/utils/cn";
import { useMemo } from "react";

export function TreeNode({
	node,
	selectedNodeCallback,
}: { node: ItemTree; selectedNodeCallback: (node: ItemTree) => void }) {
	const isComponent = Boolean(node.sensorType);
	const isAsset = Boolean((node.locationId || node.parentId) && !node.sensorId);
	const sensorIsEnergy = node.sensorType === "energy";

	const iconName = useMemo(
		() => (isComponent ? "component" : isAsset ? "asset" : "location"),
		[isComponent, isAsset],
	);

	return (
		<li>
			<div
				className="flex items-center gap-1 cursor-pointer hover:bg-blue-200"
				onClick={() => {
					isComponent && selectedNodeCallback(node);
				}}
			>
				<Icon name={iconName} />
				<span>{node.name}</span>
				{isComponent && (
					<div>
						{sensorIsEnergy ? (
							<Icon
								name="thunderbolt"
								className={cn(
									node.status === "operating" && "fill-green-500",
									node.status === "alert" && "fill-red-500",
								)}
							/>
						) : (
							<div
								className={cn(
									"w-2 h-2 rounded-full",
									node.status === "operating" && "bg-green-500",
									node.status === "alert" && "bg-red-500",
								)}
							/>
						)}
					</div>
				)}
			</div>

			{node.children && (
				<ul className="pl-6 space-y-2">
					{node.children.map((child) => (
						<TreeNode
							key={child.id}
							node={child}
							selectedNodeCallback={selectedNodeCallback}
						/>
					))}
				</ul>
			)}
		</li>
	);
}
