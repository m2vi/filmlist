import { humanFileSize } from '@m2vi/iva';
import { FDetails, RawDetails } from '@Types/downloads';
import { isMovie } from '@utils/helper/tmdb';
import { calculateAspectRatio, round } from './helper';

class Downloads {
  public formatInfo(details: RawDetails): FDetails | null {
    if (!details) return null;

    return {
      id: details?.id,
      type: isMovie(details.type) ? 'movie' : 'tv',

      avg_frame_rate: details.avg_frame_rate ? details.avg_frame_rate : null,
      bit_rate: details.bit_rate ? round(details.bit_rate / 1e6) : null,
      runtime: details.runtime ? Math.floor(details.runtime / 60) : null,
      size: { text: details.size ? humanFileSize(details.size, { si: true }) : null, value: details.size ? details.size : null },
      aspectRatio: calculateAspectRatio(details.resolution?.[0]!, details.resolution?.[1]!),
      resolution: `${details.resolution?.[0]}x${details.resolution?.[1]}`,
      audioCodec: details.audioCodec,
      videoCodec: details.videoCodec,

      releaser: details.releaser,
      source: details.source,

      fileName: details.fileName,
      fileType: details.fileType,
      path: details.path,
    };
  }
}

export const downloads = new Downloads();
export default downloads;
