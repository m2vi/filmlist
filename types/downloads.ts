export interface RawDetails {
  id: number;
  type: string;
  fileName: string;
  source: string | null;
  fileType: string | null;
  audioCodec: { key: string; name: string } | null;
  videoCodec: { key: string; name: string } | null;
  resolution: number[] | null;
  aspectRatio: string | null;
  size: number | undefined;
  runtime: number | undefined;
  avg_frame_rate: number | null;
  bit_rate: number | undefined;
  releaser: string | null;
  path: string;
  file_tags: Record<string, string | number> | undefined;
}

export type CodecType = { key: string | undefined; name: string | undefined } | null;

export interface FDetails {
  id: number;
  type: string;
  fileName: string;
  source: string | null;
  fileType: string | null;
  audioCodec: CodecType;
  videoCodec: CodecType;
  resolution: string;
  aspectRatio: number[] | null;
  size: { text: string | null; value: number | null };
  runtime: number | null;
  avg_frame_rate: number | null;
  bit_rate: number | null;
  releaser: string | null;
  path: string;
}
