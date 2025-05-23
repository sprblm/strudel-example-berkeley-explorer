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
            port: 5176,
            fs: {
                allow: ['..']
            },
            middlewares: [
                (req, res, next) => {
                    // Force proper MIME type for vector tiles
                    if (req.url.endsWith('.pbf')) {
                        res.setHeader('Content-Type', 'application/x-protobuf');
                        res.removeHeader('Content-Disposition'); // Prevent download
                        // Override any existing content-type to ensure it's set
                        const _writeHead = res.writeHead;
                        res.writeHead = function(status, headers) {
                            if (headers) {
                                headers['Content-Type'] = 'application/x-protobuf';
                            }
                            return _writeHead.apply(this, arguments);
                        };
                        console.log('Serving vector tile:', req.url);
                    }
                    next();
                }
            ]
        },
        // Configure build settings
        build: {
            // Ensure large files are properly handled
            chunkSizeWarningLimit: 2000,
            rollupOptions: {
                output: {
                    manualChunks: {
                        // Split vendor modules
                        vendor: ['react', 'react-dom', '@deck.gl/core', '@deck.gl/layers', 'mapbox-gl']
                    }
                }
            }
        },
        // Configure resolve aliases if needed
        resolve: {
            alias: {
                // Add any necessary aliases here
            }
        }
    };
});
