import Carousel from '@components/Carousel';
import CarouselAsync from '@components/CarouselAsync';
import Title from '@components/Title';
import backend from '@utils/backend/api';
import frontend from '@utils/frontend/api';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

const Home = ({ ...props }) => {
  const { locale } = useRouter();

  return (
    <div className='pt-10 w-full flex justify-center'>
      <Title title='Browse' />
      <div className='w-full items-center py-11 px-120 max-w-screen-2xl'>
        {props.init.map((tab: any, index: number) => {
          if (index === 2) {
            return (
              <Fragment key={index}>
                <CarouselAsync
                  name='trending'
                  func={async () =>
                    await frontend.getTMDBTab({
                      tab: 'trending',
                      type: 'all',
                      locale: locale!,
                      page: 0,
                    })
                  }
                />
                <Carousel section={tab} href={tab.route} />
              </Fragment>
            );
          }
          return <Carousel section={tab} href={tab.route} key={index} />;
        })}

        {Array.from({ length: 5 }).map((v, i) => {
          return (
            <CarouselAsync
              name={undefined}
              func={async () => {
                return await frontend.getBrowseGenre({
                  locale: locale!,
                  index: i,
                  seed: props.seed,
                });
              }}
              href='/genre/[id]'
              key={i}
            />
          );
        })}
      </div>
    </div>
  );
};

Home.layout = true;

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const base_props = { locale: context.locale!, start: 0, end: 20 };

  const tabs = await Promise.all([
    backend.getTab({ ...base_props, tab: 'my list' }),
    backend.getTab({ ...base_props, tab: 'latest' }),
    backend.getTab({ ...base_props, tab: 'soon' }),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common', 'footer'])),
      seed: context?.query?.seed ? context?.query?.seed : Math.random(),
      init: tabs,
    },
  };
};
