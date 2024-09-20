import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		open: true,
	},
	resolve: {
		alias: {
			"@/config": path.resolve(__dirname, "./src/app/config"),
			"@/pages": path.resolve(__dirname, "./src/view/pages"),
			"@/ui": path.resolve(__dirname, "./src/view/ui"),
			"@/components": path.resolve(__dirname, "./src/view/components"),
			"@/contexts": path.resolve(__dirname, "./src/app/contexts"),
			"@/hooks": path.resolve(__dirname, "./src/app/hooks"),
			"@/libs": path.resolve(__dirname, "./src/app/libs"),
			"@/services": path.resolve(__dirname, "./src/app/services"),
			"@/utils": path.resolve(__dirname, "./src/app/utils"),
			"@/storage": path.resolve(__dirname, "./src/app/storage"),
			"@/store": path.resolve(__dirname, "./src/app/store"),
			"@/assets": path.resolve(__dirname, "./src/view/assets"),
		},
	},
});
