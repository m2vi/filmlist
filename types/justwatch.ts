export interface ProviderProps {
  id?: number;
  name: string;
  logo_path: string;
  items?: number;

  key?: string;
  url?: string;
}

export interface GetUrlFromBaseProps {
  params: {
    id: number;
    type: number;
    provider: string;
  };
  all_providers: ProviderProps[];
  url: string;
}

export interface BaseProviderProps {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}
