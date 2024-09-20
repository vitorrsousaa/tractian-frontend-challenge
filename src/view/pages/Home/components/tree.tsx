import { TreeNode } from "./tree-node";

export type ItemTree = {
  id: string;
  name: string;
  parentId: string | null;
  sensorId?: string | null;
  sensorType?: string | null;
  status?: string | null;
  gatewayId?: string | null;
  locationId?: string | null;
  children: ItemTree[];
  isAsset?: boolean;
};

interface TreeProps {
  data: ItemTree[];
}

export function Tree(props: TreeProps) {
  const { data } = props;

  return (
    <ul className="space-y-2 pl-2">
      {data.map((item: any) => (
        <TreeNode
          key={item.id}
          node={item}
        />
      ))}
    </ul>
  );
}
