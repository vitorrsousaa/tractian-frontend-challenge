import { delay } from "@/utils/delay";

import axios from "axios";

const { DEV: IS_DEVELOPMENT } = import.meta.env;

const VITE_API_RESPONSE_SLEEP_MS = Number(
	import.meta.env.VITE_API_RESPONSE_SLEEP_MS,
);

export const httpClient = axios.create({
	baseURL: "https://fake-api.tractian.com",
});

httpClient.interceptors.response.use(async (data) => {
	if (IS_DEVELOPMENT && VITE_API_RESPONSE_SLEEP_MS) {
		await delay(VITE_API_RESPONSE_SLEEP_MS);
	}

	return data;
});
