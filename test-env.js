import { loadEnv } from 'vite';
const env = loadEnv('development', process.cwd(), '');
console.log("Key length:", env.GEMINI_API_KEY ? env.GEMINI_API_KEY.length : 0);
