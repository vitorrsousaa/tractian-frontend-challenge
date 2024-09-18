import { Link, Outlet, useParams } from "react-router-dom";
import logo from "@/assets/LOGO_TRACTIAN.svg";
import { Icon } from "@/ui/icon";
import { Button } from "@/ui/button";
import { useGetAllCompanies } from "@/hooks/company";
import { Spinner } from "@/ui/spinner";

export function Dashboard() {
  const { companies, isErrorCompanies, isLoadingCompanies } =
    useGetAllCompanies();

  const { company: companyParam } = useParams();

  return (
    <div className="flex flex-col items-center justify-center">
      <header className="bg-blue-900 w-full flex items-center h-12 px-4 justify-between">
        <img src={logo} alt="logo" />
        <div className="flex gap-2">
          {isLoadingCompanies ? (
            <Spinner />
          ) : isErrorCompanies ? (
            <button className="text-white">X</button>
          ) : (
            companies.map((company) => (
              <Link key={company.id} to={`/${company.name.toLowerCase()}`}>
                <Button
                  variant={companyParam === company.name.toLowerCase() ? 'tertiary' : 'primary'}
                >
                  <Icon name="gold" />
                  <span>{company.name} Unit</span>
                </Button>
              </Link>
            ))
          )}
        </div>
      </header>
      <main className="flex flex-col items-center bg-gray-300 w-full min-h-screen p-2">
        <div className="flex flex-col p-2 w-full min-h-screen bg-white rounded-sm border-border border">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
