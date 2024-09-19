import {
  useGetAllCompanies,
  useGetAssetsByCompany,
  useGetLocationsByCompany,
} from "@/hooks/company";
import { Button } from "@/ui/button";
import { Icon } from "@/ui/icon";
import { Spinner } from "@/ui/spinner";
import { cn } from "@/utils/cn";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "./components/card";
import { CardContent } from "./components/card-content";
import { CardHeader } from "./components/card-header";
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

  const tree7 = useMemo(() => {
    const childs = new Map();
    const parents = new Map();

    locations.forEach((location) => {
      const newItem = {
        id: location.id,
        name: location.name,
        parentId: location.parentId,
        children: [],
      };

      // elemento é um pai de outro elemento
      const isParent = !location.parentId;
      const elementAlreadyAdded = childs.has(location.id);
      // se ele é um parent, eu adiciono ele no root
      if (isParent) {
        // esse elemento qe é um api já foi adicionado?
        if (elementAlreadyAdded) {
          // pode ser que ele tenha sido adicionado usando o fakeElement
          // se ele já foi adicionado, eu preciso atualizar os dados dele
          const element = childs.get(location.id);
          element.name = location.name;
          return;
        } else {
          childs.set(location.id, newItem);
          return;
        }
      }

      // se ele não é um parent, eu preciso adicionar ele dentro de outro elemento

      // o pai dele, já foi adicionado?
      const parentAlreadyAdded = childs.has(location.parentId);

      // se o pai já foi adicionado, eu adiciono ele dentro do pai
      if (parentAlreadyAdded) {
        const parent = childs.get(location.parentId);
        parent.children.push(newItem);
        return;
      }

      // se o pai não foi adicionado, eu crio um fake para o pai, e adiciono o filho dentro do fake
      const fakeElement = {
        id: location.parentId,
        name: "",
        children: [newItem],
      };

      childs.set(location.parentId, fakeElement);

      const paramChild = {
        id: location.id,
        parentId: location.parentId,
        name: location.name,
        children: [],
      };

      parents.set(location.id, paramChild);
    });

    assets.forEach((asset) => {
      const newItem = {
        id: asset.id,
        name: asset.name,
        sensorType: asset.sensorType,
        status: asset.status,
        children: [],
        sensorId: asset.sensorId,
        locationId: asset.locationId,
        parentId: asset.parentId || asset.locationId,
        gatewayId: asset.gatewayId,
      };

      // esse asset, vai ser adicionado na raiz?
      const shouldAddedOnRoot = !asset.locationId && !asset.parentId;
      if (shouldAddedOnRoot) {
        childs.set(asset.id, newItem);
        return;
      }

      // esse elemento já foi adicionado no map de parents?
      const elementAlreadyAdded = parents.has(asset.id);
      if (elementAlreadyAdded) {
        const element = parents.get(asset.id);
        element.name = asset.name;
        element.sensorType = asset.sensorType;
        element.status = asset.status;
        element.sensorId = asset.sensorId;
        element.parentId = asset.parentId || asset.locationId;
        element.gatewayId = asset.gatewayId;
      } else {
        parents.set(asset.id, newItem);
      }

      // ele tem locationId?
      const assetIsChildOfLocation = asset.locationId;

      const childrensAlreadyAdded = elementAlreadyAdded
        ? parents.get(asset.id).children
        : [];

      const newItemWithAlreadyAddedChildren = {
        id: asset.id,
        name: asset.name,
        sensorType: asset.sensorType,
        status: asset.status,
        children: childrensAlreadyAdded,
        sensorId: asset.sensorId,
        locationId: asset.locationId,
        parentId: asset.parentId || asset.locationId,
        gatewayId: asset.gatewayId,
      };

      if (assetIsChildOfLocation) {
        // essa location esta na raiz?
        const thisLocationIsOnRoot = childs.has(asset.locationId);
        if (thisLocationIsOnRoot) {
          const location = childs.get(asset.locationId);
          location.children.push(newItemWithAlreadyAddedChildren);
          // adicionar o elemento no map de parents
          parents.set(asset.id, newItemWithAlreadyAddedChildren);
          return;
        }
        // se não ta na raiz, ele é children de algum outro elemento
        const thisAssetIsGrandChild = parents.has(asset.locationId);
        if (thisAssetIsGrandChild) {
          const findedParent = parents.get(asset.locationId);
          const findedGrandParent = childs.get(findedParent.parentId);
          findedParent.children = [newItemWithAlreadyAddedChildren];
          findedGrandParent.children = [findedParent];

          // se ele é um filho de um grandParent, eu preciso adicionar ele no map de parents
          parents.set(asset.id, newItemWithAlreadyAddedChildren);
          return;
        }

        return;
      }

      // se chegou aqui, é porque tem um parentId
      const thisParentIsOnRoot = childs.has(asset.parentId);
      if (thisParentIsOnRoot) {
        const parent = childs.get(asset.parentId);
        parent.children.push(newItemWithAlreadyAddedChildren);
        // adicionar o elemento no map de parents

        parents.set(asset.id, newItemWithAlreadyAddedChildren);
        return;
      }

      // se nao ta na raiz, ele é children de outro elemento
      const thisAssetIsGrandChild = parents.has(asset.parentId);

      if (thisAssetIsGrandChild) {
        const findedParent = parents.get(asset.parentId);

        const thisParentWasUpdated = findedParent.parentId.length > 0;

        if (thisParentWasUpdated) {
          const findedGrandParent = parents.get(findedParent.parentId);
          const findedGreatGradson = childs.get(findedGrandParent.parentId);
          findedParent.children = [newItemWithAlreadyAddedChildren];
          findedGrandParent.children = [findedParent];
          findedGreatGradson.children = [findedGrandParent];

          return;
        }

        findedParent.children.push(newItemWithAlreadyAddedChildren);
        return;
      }

      const fakeElement = {
        id: asset.parentId,
        parentId: "",
        name: "",
        children: [newItemWithAlreadyAddedChildren],
      };

      parents.set(asset.parentId, fakeElement);

      return;
    });
    return Array.from(childs.values());
  }, [locations, assets]);

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
            <div className="w-1/2 border border-border rounded-md overflow-y-auto max-h-screen">
              <Tree data={tree7} selectedNodeCallback={setSelectedComponent} />
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
