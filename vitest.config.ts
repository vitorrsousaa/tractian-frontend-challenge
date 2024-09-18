import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "happy-dom",
		exclude: [
			"**/node_modules/**",
			"**/dist/**",
			"**/cypress/**",
			"**/.{idea,git,cache,output,temp}/**",
			"**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
			"**/html/**",
			"**/coverage/**",
		],
		reporters: ["basic"],
		coverage: {
			provider: "v8",
		},
		globals: true,
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
			"@/assets": path.resolve(__dirname, "./src/view/assets"),
		},
	},
});
