import {
  useGetAllCompanies,
  useGetAssetsByCompany,
  useGetLocationsByCompany,
} from "@/hooks/company";
import { Button } from "@/ui/button";
import { Icon } from "@/ui/icon";
import { Spinner } from "@/ui/spinner";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

type ItemTree = {
  id: string;
  name: string;
  children?: ItemTree[];
  status?: string | null;
  sensorType: string | null;
  locationId?: string | null;
  sensorId?: string | null;
};

const tree: ItemTree[] = [
  {
    id: "1",
    name: "Production Area - Raw Material",
    sensorType: null,
    children: [
      {
        id: "1-2",
        name: "Charcoal Storage Sector",
        sensorType: null,
        children: [
          {
            id: "1-2-1",
            name: "Conveyor Belt Assembly",
            sensorType: null,
            locationId: "1-2",
            children: [
              {
                id: "1-2-1-1",
                name: "Motor TC01 Coal Unloading AF02",
                sensorType: null,
                locationId: "1-2-1",
                children: [
                  {
                    id: "1-2-1-1-1",
                    name: "Motor RT Coal AF01",
                    sensorType: "motor",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "1-3",
        name: "Machinery House",
        sensorType: null,
        children: [
          {
            id: "1-3-1",
            name: "motors h12d",
            sensorType: null,
            locationId: "1-3",
            children: [
              {
                id: "1-3-1-1",
                name: "motor h12d - stage 1",
                sensorType: "motor",
              },
              {
                id: "1-2-1-1",
                name: "motor h12d - stage 2",
                sensorType: "motor",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Empty Machine house",
    sensorType: null,
  },
  { id: "3", name: "Fan external", status: "operating", sensorType: "fan" },
];

function TreeNode({ node }: { node: ItemTree }) {
  const isComponent = Boolean(node.sensorType);
  const isAsset = Boolean(node.locationId && !node.sensorId);

  return (
    <li>
      <div className="flex items-center gap-1">
        <Icon
          name={isComponent ? "component" : isAsset ? "asset" : "location"}
        />
        <span>{node.name}</span>
        {/* {item.status && (
          <span className="ml-2 text-green-500">&#x2022; {item.status}</span>
        )} */}
      </div>

      {node.children && (
        <ul className="pl-6 space-y-2">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

function Tree({ data }: { data: ItemTree[] }) {
  return (
    <ul className="space-y-2 pl-2">
      {data.map((item: any) => (
        <TreeNode key={item.id} node={item} />
      ))}
    </ul>
  );
}

export function Home() {
  const { company } = useParams<{ company: string }>();

  const { companies } = useGetAllCompanies();

  const selectedCompany = companies.find(
    (comp) => comp.name.toLowerCase() === company,
  );

  const { locations, isLoadingLocations } = useGetLocationsByCompany(selectedCompany?.id);

  const { assets, isLoadingAssets } = useGetAssetsByCompany(selectedCompany?.id);

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
    })

    assets.forEach((asset) => {
      const newItem: ItemTree = {
        id: asset.id,
        name: asset.name,
        sensorType: asset.sensorType,
        status: asset.status,
        children: [],
        sensorId: asset.sensorId,
        locationId: asset.locationId,
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

  const loadingTree = useMemo(() => Boolean((isLoadingAssets || isLoadingLocations)), [isLoadingAssets, isLoadingLocations]);

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
            <Button variant="secondary">
              <Icon name="thunderbolt" />
              Sensor de energia
            </Button>
            <Button variant="secondary">
              {" "}
              <Icon name="exclamationCircle" />
              Crítico
            </Button>
          </div>
        )}
      </div>

      {selectedCompany ? loadingTree ? (<div><Spinner /></div>) : (
        <div className="flex flex-row w-full gap-2 h-full">
          <div className=" w-1/2 border border-border rounded-md">
            <Tree data={tree3} />
          </div>
          <div className="flex flex-col gap-2 w-full border border-border rounded-md">
            <header className="mt-2 ml-2">
              <strong className="uppercase">motor rt coal af01</strong>
            </header>
            <hr />
            <div className="p-2 flex flex-col gap-4 h-full">
              <div className="flex flex-row">
                <div>imagem</div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <strong>Tipo de Equipamento</strong>
                    <span className="text-muted-foreground">
                      Motor elétrico trifásico
                    </span>
                  </div>
                  <hr />
                  <div className="flex flex-col gap-2">
                    <strong>Responsáveis</strong>
                    <span className="text-muted-foreground">Elétrica</span>
                  </div>
                </div>
              </div>
              <hr />
              <div className="flex flex-row w-full justify-between">
                <div className="flex flex-col gap-2 w-full">
                  <strong>Sensor</strong>
                  <span className="text-muted-foreground">Elétrica</span>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <strong>Receptor</strong>
                  <span className="text-muted-foreground">Elétrica</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <span>Selecione uma compania no botão acima</span>
        </div>
      )}
    </div>
  );
}
