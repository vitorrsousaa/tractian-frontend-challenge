import useComponent from "@/store/component";
import { Icon } from "@/ui/icon";
import { cn } from "@/utils/cn";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ItemTree } from "./tree";

export function TreeNode({ node }: { node: ItemTree }) {
	const isComponent = Boolean(node.sensorType);
	const isAsset = Boolean((node.locationId || node.parentId) && !node.sensorId);
	const sensorIsEnergy = node.sensorType === "energy";

	const iconName = useMemo(
		() => (isComponent ? "crumpled_paper" : isAsset ? "cube" : "location"),
		[isComponent, isAsset],
	);

	const { select: selectComponent } = useComponent();

	const [showChildrens, setShowChildrens] = useState(node.isExpanded || false);

	const hasChildrens = Boolean(node.children && node.children.length > 0);

	const handleClick = useCallback(() => {
		if (hasChildrens) setShowChildrens(!showChildrens);
		else if (node.sensorType) {
			selectComponent(node as any);
		}
	}, [hasChildrens, node, selectComponent, showChildrens]);

	useEffect(() => {
		setShowChildrens(node.isExpanded || false);
	}, [node.isExpanded]);

	const shouldHiddenItem =
		(node.isBeingFiltered === false && node.isExpanded === false) ||
		(node.isBeingSearched === false && node.isExpanded === false);

	return (
		<div className={cn(shouldHiddenItem && "hidden")}>
			<button
				className="flex items-center gap-1 cursor-pointer hover:bg-blue-200"
				onClick={handleClick}
			>
				{hasChildrens && (
					<>
						{showChildrens ? (
							<Icon name="chevron_down" className="w-5 h-5 " />
						) : (
							<Icon name="chevron_right" className="w-5 h-5 " />
						)}
					</>
				)}
				<Icon name={iconName} className="text-blue-500 w-5 h-5" />
				<span className="truncate">{node.name}</span>
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
							<Icon
								name="dot_filled"
								className={cn(
									"w-5 h-5 ",
									node.status === "operating" && "text-green-500",
									node.status === "alert" && "text-red-500",
								)}
							/>
						)}
					</div>
				)}
			</button>

			{node.children && showChildrens && (
				<ul className="pl-6 space-y-2">
					{node.children.map((child) => (
						<TreeNode key={child.id} node={child} />
					))}
				</ul>
			)}
		</div>
	);
}
