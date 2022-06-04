import { SimpleObject } from '@Types/common';
import React, { createContext, useContext, useState } from 'react';

export type FilterContextType = {
  filter: SimpleObject<any>;
  setProperty: (property: string, value: any) => void;
};

export type Children = {
  children: React.ReactNode;
};

const FilterContext = createContext<FilterContextType>({ filter: {}, setProperty: () => {} });

export const FilterProvider = ({ children }: Children) => {
  const [filter, setFilter] = useState<SimpleObject<any>>({});

  const setProperty = (property: string, value: any) => {
    setFilter({
      ...filter,
      [property]: value,
    });
  };

  return <FilterContext.Provider value={{ filter, setProperty }}>{children}</FilterContext.Provider>;
};

export const useFilter = () => {
  const context = useContext(FilterContext);

  if (!context) throw new Error('FilterContext must be called from within the FilterContextProvider');

  return context;
};
