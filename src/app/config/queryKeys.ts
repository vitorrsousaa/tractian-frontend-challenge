export const QUERY_KEYS = {
	COMPANY: ["COMPANY"],
	LOCATIONS: (companyId: string) => ["LOCATION", { companyId }],
	ASSETS: (companyId: string) => ["ASSETS", { companyId }],
};
