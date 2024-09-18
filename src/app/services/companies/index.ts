import { httpClient } from "../httpClient";

export type Company = {
	id: string;
	name: string;
};

export type Location = {
	id: string;
	name: string;
	parentId: string;
};

export type Asset = {
	id: string;
	locationId: string | null;
	parentId: string | null;
	name: string;
	sensorType: string | null;
	status: string | null;
  sensorId: string | null;
};

async function getAllCompanies() {
	const { data } = await httpClient.get<Company[]>("/companies");

	return data;
}

async function getLocationsByCompany(companyId: string) {
	const { data } = await httpClient.get<Location[]>(
		`/companies/${companyId}/locations`,
	);

	return data;
}

async function getAssetsByCompany(companyId: string) {
	const { data } = await httpClient.get<Asset[]>(
		`/companies/${companyId}/assets`,
	);

	return data;
}

export const companiesServices = {
	getAll: getAllCompanies,
	getLocationsByCompany,
	getAssetsByCompany,
};
