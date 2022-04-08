import genres from '@utils/apis/genres';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Fragment } from 'react';

const GenreIds = ({ ids }: { ids: number[] }) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col mt-5'>
      <span className='text-base text-primary-300 mb-1 l-1'>{t('collection.genres').toString()}</span>
      <span className='text-xl text-primary-200'>
        {ids.map((id, index) => {
          return (
            <Fragment key={index}>
              <Link href='/genre/[id]' as={`/genre/${id}`} prefetch={false}>
                <a className='text-xl text-primary-200 hover:text-accent'>
                  {t(`pages.filmlist.menu.${genres.getName(id).toLowerCase()}`).toString()}
                </a>
              </Link>

              <span>{ids.length > index + 1 ? ', ' : ''}</span>
            </Fragment>
          );
        })}
      </span>
    </div>
  );
};

export default GenreIds;
