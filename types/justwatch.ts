import { ProviderProps } from './filmlist';

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
