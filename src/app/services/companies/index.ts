import { httpClient } from "../httpClient";

export type Company = {
	id: string;
	name: string;
};

async function getAllCompanies() {
	const { data } = await httpClient.get<Company[]>("/companies");

	return data;
}

export const companiesServices = {
	getAll: getAllCompanies,
};
