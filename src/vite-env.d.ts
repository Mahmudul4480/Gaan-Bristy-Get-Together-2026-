/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYMENT_NOTIFY_WEBHOOK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
