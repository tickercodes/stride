/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly PUBLIC_GOOGLE_SCRIPT_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
