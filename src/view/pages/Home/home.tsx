import { useGetAllCompanies } from "@/hooks/company";
import { Button } from "@/ui/button";
import { Icon } from "@/ui/icon";
import { useParams } from "react-router-dom";

export function Home() {
  const { company } = useParams<{ company: string }>();

  const { companies } = useGetAllCompanies();

  const selectedCompany = companies.find(
    (comp) => comp.name.toLowerCase() === company,
  );

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



      {selectedCompany ? (
        <div className="flex flex-row w-full gap-2 h-full">
          <div className=" w-1/2 border border-border rounded-md">search</div>
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
