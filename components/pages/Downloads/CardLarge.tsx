/* eslint-disable @next/next/no-img-element */
import { moment } from '@apis/moment';
import { convertMinutes, removeDuplicates } from '@helper/main';
import { FrontendItemProps } from '@Types/items';
import { iso6392 } from 'iso-639-2';
import Link from 'next/link';

const CardLarge = ({ poster_path, details, name, type, id_db }: FrontendItemProps) => {
  const subtitles = details?.subtitleCodec
    ?.map((track) => {
      return iso6392.find((val) => [val.iso6392B, val.iso6392T, val.iso6391].includes(track?.language!))?.name?.toString();
    })
    ?.filter((val) => val);

  return (
    <div className='block py-8 overflow-hidden'>
      <div className='mr-4 float-left w-200 block'>
        <Link href={`/${type ? 'movie' : 'tv'}/[id]`} as={`/${type ? 'movie' : 'tv'}/${id_db}`}>
          <a>
            <img
              src={`https://image.tmdb.org/t/p/w342${poster_path}`}
              alt=''
              className='rounded-5'
              style={{
                height: '267px',
                width: '178px',
                border: '0.4px solid hsla(0, 0%, 13.5%, 0.2)',
                boxShadow: '0px 8.25px 9px rgba(0, 0, 0, 0.25)',
              }}
            />
          </a>
        </Link>
      </div>
      <div className='block' style={{ marginLeft: '220px' }}>
        <Link href={`/${type ? 'movie' : 'tv'}/[id]`} as={`/${type ? 'movie' : 'tv'}/${id_db}`}>
          <a>
            <h2 className='leading-none text-2xl text-white'>{name}</h2>
          </a>
        </Link>
        <span className='text-white text-opacity-60 text-tiny leading-22'>{details?.path}</span>
        <p className='mb-3 text-xs italic leading-5 text-white text-opacity-30'>
          Eingetragen am <span className='text-accent-hover'>{moment(details?.date_added).format('DD.MM.YYYY')}</span> um{' '}
          <span className='text-accent-hover'>{moment(details?.date_added).format('HH:mm [Uhr]')}</span>
        </p>
        <div className='flex flex-wrap'>
          <div className='w-1/2'>
            <ul className='p-0 text-white leading-6 list-none'>
              <li>
                <span className='inline-block w-75 font-bold'>Größe</span>
                {details?.rsize?.text?.replace(/\./g, ',')}
              </li>
              <li>
                <span className='inline-block w-75 font-bold'>Codec</span>
                {details?.videoCodec?.name
                  ?.replace(/ *\([^)]*\) */g, '')
                  ?.split('/')?.[0]
                  ?.trim()}
              </li>
              <li>
                <span className='inline-block w-75 font-bold'>Source</span>
                {details?.source ? details?.source : 'Unkown source'}
              </li>
              {/*     <li className='whitespace-nowrap'>
                <span>Releaser</span>
                {details?.releaser}
              </li> */}
              <li className='overflow-hidden overflow-ellipsis whitespace-nowrap'>
                <span className='inline-block w-75 font-bold'>Sprache</span>
                {details?.audioCodec
                  ?.map((track) => {
                    const language = iso6392.find((val) => [val.iso6392B, val.iso6392T, val.iso6391].includes(track?.language!));

                    return `${language?.name ? language?.name : track?.language} ${track?.key?.toUpperCase()}`;
                  })
                  .join(', ')}
              </li>
              <li className='overflow-hidden overflow-ellipsis whitespace-nowrap'>
                <span className='inline-block w-75 font-bold'>Untertitel</span>
                {subtitles?.length! > 0 ? removeDuplicates(subtitles!).join(', ') : '-'}
              </li>
            </ul>
          </div>
          <div className='w-1/2'>
            <ul className='p-0 text-white leading-6 list-none'>
              <li>
                <span className='inline-block w-75 font-bold'>Auflösung</span>
                {details?.resolution}
              </li>
              <li>
                <span className='inline-block w-75 font-bold'>Laufzeit</span>
                {convertMinutes(details?.runtime!)}
              </li>
              <li>
                <span className='inline-block w-75 font-bold'>Bitrate</span>
                {`${details?.bit_rate?.toString()?.replace(/\./g, ',')} MB/s`}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardLarge;
