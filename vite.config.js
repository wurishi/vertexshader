import { defineConfig } from 'vite';
import { port, hmr, base } from './src/proxy'

export default defineConfig({
    server: {
        port,
        hmr,
        watch: {
            usePolling: true,
        }
    },
    base,
});
