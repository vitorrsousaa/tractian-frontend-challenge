import {
  useGetAllCompanies,
  useGetAssetsByCompany,
  useGetLocationsByCompany,
} from "@/hooks/company";
import { Asset, Location } from "@/services/companies";
import useComponent from "@/store/component";
import { Button } from "@/ui/button";
import { Icon } from "@/ui/icon";
import { Spinner } from "@/ui/spinner";
import { cn } from "@/utils/cn";
import { useCallback, useMemo, useReducer } from "react";
import { useParams } from "react-router-dom";
import { Card } from "./components/card";
import { CardContent } from "./components/card-content";
import { CardHeader } from "./components/card-header";
import { CardInfo } from "./components/card-info";
import { CardReceptor, CardSensor } from "./components/card-sensors";
import { Search } from "./components/search";
import { ItemTree, Tree } from "./components/tree";

export interface TreeNodeMap {
  [id: string]: ItemTree;
}

export function Home() {
  const { company } = useParams<{ company: string }>();

  const { companies } = useGetAllCompanies();

  const [sensorfilter, toggleSensorFilter] = useReducer((prev) => !prev, false);
  const [statusfilter, toggleStatusFilter] = useReducer((prev) => !prev, false);

  // const [filter, setFilter] = useState<{
  //   sensor: "energy" | "all";
  //   status: "alert" | "all";
  // }>({
  //   sensor: "all",
  //   status: "all",
  // });

  const selectedCompany = companies.find(
    (comp) => comp.name.toLowerCase() === company,
  );

  const { locations, isLoadingLocations } = useGetLocationsByCompany(
    selectedCompany?.id,
  );

  const { assets, isLoadingAssets } = useGetAssetsByCompany({
    companyId: selectedCompany?.id,
    // filters: {
    //   sensor: filter.sensor,
    //   status: filter.status,
    // },
  });

  const loadingTree = useMemo(
    () => Boolean(isLoadingAssets || isLoadingLocations),
    [isLoadingAssets, isLoadingLocations],
  );

  const buildTree = (locations: Location[], assets: Asset[]) => {
    const locationMap: TreeNodeMap = {};
    const assetMap: TreeNodeMap = {};

    locations.forEach(
      (location) => (locationMap[location.id] = { ...location, children: [] }),
    );
    assets.forEach(
      (asset) => (assetMap[asset.id] = { ...asset, children: [] }),
    );

    locations.forEach((location) => {
      if (location.parentId)
        locationMap[location.parentId]?.children.push(locationMap[location.id]);
    });

    assets.forEach((asset) => {
      if (asset.parentId) {
        if (assetMap[asset.parentId])
          assetMap[asset.parentId]?.children.push(assetMap[asset.id]);
      } else if (asset.locationId) {
        locationMap[asset.locationId]?.children.push(assetMap[asset.id]);
      }
    });

    const rootLocations = Object.values(locationMap).filter(
      (location) => !location.parentId,
    );

    const rootAssets = Object.values(assetMap).filter(
      (asset) => !asset.parentId && !asset.locationId,
    );

    return [...rootLocations, ...rootAssets];
  };

  const tree8 = useMemo(
    () => buildTree(locations, assets),
    [locations, assets],
  );

  function filterTree(
    tree: ItemTree[],
    filter: { sensor: boolean; status: boolean },
  ) {
    return tree.map((item) => {
      const sensorFilterIsActivated =
        filter.sensor && item.sensorType === "energy";
      const statusFilterIsActivated = filter.status && item.status === "alert";

      const isBeingFiltered = sensorFilterIsActivated || statusFilterIsActivated;

      item.isBeingFiltered = isBeingFiltered;
      item.isExpanded = isBeingFiltered;

      if (Object.values(filter).every((value) => value === false)) {
        delete item.isBeingFiltered;
      }

      if (item.children) {
        filterTree(item.children, filter);

        const hasChildrenBeingFiltered = item.children.some(
          (child) => child.isExpanded,
        );

        if (hasChildrenBeingFiltered) {
          item.isExpanded = true;
        }
      }

      return item;
    });
  }

  const filteredTree = useMemo(() => {
    return filterTree(tree8, { sensor: sensorfilter, status: statusfilter });
  }, [tree8, sensorfilter, statusfilter, filterTree]);

  console.log(filteredTree);

  const handleFilterBySensor = useCallback(() => {
    toggleSensorFilter();

  }, []);

  const handleFilterByStatus = useCallback(() => {
    toggleStatusFilter();

  }, []);

  const { component } = useComponent();

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
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
              variant={!sensorfilter ? "secondary" : "tertiary"}
              onClick={handleFilterBySensor}
            >
              <Icon
                name="thunderbolt"
                className={cn(!sensorfilter ? "fill-primary" : "fill-white")}
              />
              Sensor de energia
            </Button>
            <Button
              onClick={handleFilterByStatus}
              variant={!statusfilter ? "secondary" : "tertiary"}
            >
              <Icon
                name="exclamationCircle"
                className={cn(!statusfilter ? "fill-primary" : "fill-white")}
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
            <div className="w-[550px] border border-border rounded-md overflow-y-auto max-h-screen min-h-[calc(100vh-64px)]">
              <Search />
              <Tree data={tree8} />
            </div>
            <div className="flex flex-col gap-2 w-full border border-border rounded-md">
              {component ? (
                <Card>
                  <CardHeader>{component.name}</CardHeader>
                  <hr />
                  <CardContent>
                    <CardInfo
                      name={component.name}
                      sensorType={component.sensorType}
                    />
                    <hr />
                    <div className="flex flex-row w-full justify-between">
                      <CardSensor>{component.sensorId}</CardSensor>
                      <CardReceptor>{component.gatewayId}</CardReceptor>
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
