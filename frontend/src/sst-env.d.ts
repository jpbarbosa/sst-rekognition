/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_REGION: string
  readonly VITE_API_BUCKET_NAME: string
  readonly VITE_API_IDENTITY_POOL_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}