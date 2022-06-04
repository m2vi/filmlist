import React, { createContext, useContext, useState } from 'react';

export type QueryContextType = {
  query: string;
  update: (overwrite: string) => void;
};

export type Children = {
  children: React.ReactNode;
};

const QueryContext = createContext<QueryContextType>({ query: '', update: () => {} });

export const QueryProvider = ({ children }: Children) => {
  const [query, setQuery] = useState<string>('');

  const update = (overwrite: string) => {
    setQuery(overwrite);
  };

  return <QueryContext.Provider value={{ query, update }}>{children}</QueryContext.Provider>;
};

export const useQuery = () => {
  const context = useContext(QueryContext);

  if (!context) throw new Error('QueryContext must be called from within the QueryContextProvider');

  return context;
};
