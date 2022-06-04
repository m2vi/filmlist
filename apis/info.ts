import fileSize from 'filesize';
import { FDetails, RawDetails } from '@Types/info';
import { calculateAspectRatio, getResolution, round } from '@helper/info';

class Info {
  public format(details: RawDetails | undefined): FDetails | null {
    if (!details) return null;

    return {
      id: details.id,
      type: details.type,

      avg_frame_rate: details.avg_frame_rate,
      bit_rate: details.bit_rate ? round(details.bit_rate / 1e6) : null,
      runtime: details.runtime ? Math.floor(details.runtime / 60) : null,
      size: { text: details.size ? fileSize(details.size) : null, value: details.size ? details.size : null },
      rsize: { text: details.rsize ? fileSize(details.rsize) : null, value: details.rsize ? details.rsize : null },
      aspectRatio: calculateAspectRatio(
        details.resolution?.[0] ? details.resolution?.[0] : 0,
        details.resolution?.[1] ? details.resolution?.[1] : 0
      ),
      resolution: `${details.resolution?.[0]}x${details.resolution?.[1]}`,
      resolution_name: getResolution(details.resolution)! ? getResolution(details.resolution)! : null,
      audioCodec: details.audioCodec,
      videoCodec: details.videoCodec,
      subtitleCodec: details.subtitleCodec,

      releaser: details.releaser,
      source: details.source,

      fileName: details.fileName,
      fileType: details.fileType,
      disk: details.disk ? details.disk : null,
      path: details.path,
      date_added: details.date_added,
    };
  }
}

export const info = new Info();
export default info;
