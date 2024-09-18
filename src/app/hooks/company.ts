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
export function useGetAssetsByCompany({
	companyId,
	filters,
}: {
	companyId?: string;
	filters: { sensor: "all" | "energy"; status: "all" | "alert" };
}) {
	const { data, isError, isPending, isLoading, isFetching } = useQuery({
		queryFn: () => companiesServices.getAssetsByCompany(companyId || ""),
		queryKey: QUERY_KEYS.ASSETS(companyId || ""),
		enabled: !!companyId,
	});

	const originalData = data ?? [];

	const hasFilter = filters.sensor !== "all" || filters.status !== "all";

	const filteredData = hasFilter
		? originalData.filter((data) => {
				const isComponent = Boolean(data.sensorType);

				return (
					!isComponent ||
					data.status === filters.status ||
					data.sensorType === filters.sensor
				);
			})
		: originalData;

	return {
		assets: filteredData,
		isErrorAssets: isError,
		isLoadingAssets: isPending || isLoading || isFetching,
	};
}
