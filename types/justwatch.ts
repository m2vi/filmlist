export interface GetUrlFromBaseProps {
  params: {
    id: number;
    type: number;
    provider: string;
  };
  all_providers: ProviderProps[];
  url: string;
}

export interface ProviderProps {
  id?: number;
  key?: string;
  name?: string;
  logo?: string;
  url?: string;
  type?: string;
}
