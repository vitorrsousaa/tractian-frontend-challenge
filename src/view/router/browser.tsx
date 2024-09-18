import { ROUTES } from "@/config/routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Dashboard } from "../layout/dashboard";

export function Browser() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="*" element={<>Page Not found</>} />
				<Route element={<Dashboard />}>
					<Route path={ROUTES.HOME} element={<Home />} />
					<Route path={ROUTES.ASSETS} element={<Home />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
