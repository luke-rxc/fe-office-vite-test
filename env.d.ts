/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta" />

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_ENV: string;
  readonly VITE_MANAGER_API_URL: string;
  readonly VITE_PARTNER_API_URL: string;
  readonly VITE_CDN_URL: string;
  readonly VITE_SERVICE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
