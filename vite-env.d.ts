/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_NOAA_API_URL: string
  readonly VITE_NASA_API_URL: string
  readonly VITE_WORLDCLIM_API_URL: string
  readonly VITE_CMIP6_API_URL: string
  readonly VITE_ERA5_API_URL: string
  readonly VITE_USER_CONTRIBUTED_API_URL: string
  readonly VITE_NOAA_API_KEY: string
  readonly VITE_USE_MOCK_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
