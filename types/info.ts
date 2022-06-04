export interface RawDetails {
  id: number;
  type: string;
  fileName: string;
  source: string | null;
  fileType: string | null;
  audioCodec: CodecType[];
  videoCodec: CodecType;
  subtitleCodec: CodecType[];
  resolution: number[] | null;
  aspectRatio: string | null;
  size: number | undefined;
  rsize: number | null;
  runtime: number | undefined;
  avg_frame_rate: number | null;
  bit_rate: number | undefined;
  releaser: string | null;
  disk: string | null;
  path: string;
  file_tags: Record<string, string | number> | undefined;
  date_added: number;
}

export interface FDetails {
  id: number;
  type: string;
  fileName: string;
  source: string | null;
  fileType: string | null;
  audioCodec: CodecType[];
  videoCodec: CodecType;
  subtitleCodec: CodecType[];
  resolution: string;
  resolution_name: string | null;
  aspectRatio: number[] | null;
  size: { text: string | null; value: number | null };
  rsize: { text: string | null; value: number | null };
  runtime: number | null;
  avg_frame_rate: number | null;
  bit_rate: number | null;
  releaser: string | null;
  disk: string | null;
  path: string;
  date_added: number;
}

export type CodecType = {
  key: string | undefined;
  name: string | undefined;
  profile: string | number | null;
  language: string | null;
} | null;

export interface Filter {
  id: number;
  type: number;
  disk?: string;
  tags?: string[];
}
