import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import generouted from '@generouted/react-router/plugin';
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    var env = loadEnv(mode, process.cwd());
    return {
        plugins: [react(), generouted()],
        base: env.VITE_BASE_URL,
        server: {
            port: 5175,
            strictPort: true,
        },
    };
});
