import { QUERY_KEYS } from "@/config/queryKeys";
import { companiesServices } from "@/services/companies";
import { useQuery } from "@tanstack/react-query";

export function useGetAllCompanies() {
	const { data, isError, isPending, isLoading, isFetching } = useQuery({
		queryFn: companiesServices.getAll,
		queryKey: QUERY_KEYS.COMPANY,
	});

	return {
		companies: data ?? [],
		isErrorCompanies: isError,
		isLoadingCompanies: isPending || isLoading || isFetching,
	};
}

export function useGetLocationsByCompany(companyId?: string) {
	const { data, isError, isPending, isLoading, isFetching } = useQuery({
		queryFn: () => companiesServices.getLocationsByCompany(companyId || ""),
		queryKey: QUERY_KEYS.LOCATIONS(companyId || ""),
		enabled: !!companyId,
	});

	return {
		locations: data ?? [],
		isErrorLocations: isError,
		isLoadingLocations: isPending || isLoading || isFetching,
	};
}
export function useGetAssetsByCompany(companyId?: string) {
	const { data, isError, isPending, isLoading, isFetching } = useQuery({
		queryFn: () => companiesServices.getAssetsByCompany(companyId || ""),
		queryKey: QUERY_KEYS.ASSETS(companyId || ""),
		enabled: !!companyId,
	});

	return {
		assets: data ?? [],
		isErrorAssets: isError,
		isLoadingAssets: isPending || isLoading || isFetching,
	};
}
