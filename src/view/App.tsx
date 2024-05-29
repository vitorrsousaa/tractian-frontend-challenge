import { QueryClientProvider } from "@/libs/query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { Browser } from "./router/browser";

function App() {
	return (
		<>
			<QueryClientProvider>
				<Browser />

				<Toaster />
				<ReactQueryDevtools />
			</QueryClientProvider>
		</>
	);
}

export default App;
