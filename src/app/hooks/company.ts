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
