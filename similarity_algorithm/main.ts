import { ItemProps } from "@utils/types";

export interface SimilarityOptions {
  weight: {
    keywords: number;
    genre_ids: number;
    credits: {
      cast: number;
      director: number;
      novel: number;
    };
    origin: number;
    collection: number;
  };
}

const boolToInt = (val: boolean): number => {
  return val ? 1 : 0;
};

export function calcSimilarity(base: ItemProps, compareWith: ItemProps): number {
  const { keywords, genre_ids, credits, original_language, collection } = base;

  const languageMatch = boolToInt(original_language === compareWith.original_language);

  return 0;
}
