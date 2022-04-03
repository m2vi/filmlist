export interface SimilarityConfig {
  weighting?: {
    collection?: number;
    credits?: number;
    genre_ids?: number;
    keywords?: number;
    origin?: number;
    plot?: number;
  };
}

export interface SimilarityResultObject {
  [key: string]: number;
}
