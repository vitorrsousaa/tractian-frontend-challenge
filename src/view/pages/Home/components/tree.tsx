import { TreeNode } from "./tree-node";

export type ItemTree = {
	id: string;
	name: string;
	children?: ItemTree[];
	status?: string | null;
	sensorType: string | null;
	locationId?: string | null;
	sensorId?: string | null;
	parentId?: string | null;
	gatewayId?: string | null;
};

interface TreeProps {
	data: ItemTree[];
	selectedNodeCallback: (node: ItemTree) => void;
}

export function Tree(props: TreeProps) {
	const { data, selectedNodeCallback } = props;

	return (
		<ul className="space-y-2 pl-2">
			{data.map((item: any) => (
				<TreeNode
					key={item.id}
					node={item}
					selectedNodeCallback={selectedNodeCallback}
				/>
			))}
		</ul>
	);
}
