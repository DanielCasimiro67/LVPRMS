import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],server:{host:'127.0.0.1',port:4174,proxy:{'/api':process.env.VITE_API_PROXY_TARGET||'http://localhost:8000'},fs:{deny:['.env','.env.*','**/.git/**','**/tmp/**','**/.superpowers/**','**/docs/**','**/tests/**','**/scripts/**','**/AGENT.md']}},build:{rollupOptions:{input:'react.html'},outDir:'dist',emptyOutDir:true}});
