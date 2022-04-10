import { Tab } from '@headlessui/react';
import { UserClient } from '@utils/user/client';
import QueryString from 'qs';
import { basicFetch } from '@utils/helper/fetch';
import AsyncCarousel from '@components/Carousel/async';
import { useTranslation } from 'next-i18next';
import { Fragment } from 'react';

const Carousel = ({ id, type, locale, user }: { id: number; type: number; locale: string; user: UserClient }) => {
  const { t } = useTranslation();
  const tabs = [
    {
      key: 'similar',
      route: 'similarity',
    },
    {
      key: 'recommendations',
      route: 'recommendations',
    },
  ];

  return (
    <div className='w-full px-2 py-16 sm:px-0'>
      <Tab.Group>
        <Tab.List className='flex justify-start items-center w-full pr-1'>
          {tabs.map(({ key }, i) => {
            return (
              <Tab key={i}>
                {({ selected }) => {
                  if (selected) return <Fragment />;

                  return <span className='text-3xl leading-none font-bold hover:text-primary-200'>{t(`details.${key}`).toString()}</span>;
                }}
              </Tab>
            );
          })}
        </Tab.List>
        <Tab.Panels className='mt-3'>
          {tabs.map(({ route }, i) => {
            return (
              <Tab.Panel key={i}>
                <AsyncCarousel
                  func={async () => {
                    const items = await basicFetch(`/api/${route}?${QueryString.stringify({ id, type, locale, user: user.id })}`);

                    return {
                      items,
                      key: null,
                      length: items.length,
                      query: {},
                      tmdb: true,
                    };
                  }}
                />
              </Tab.Panel>
            );
          })}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Carousel;
