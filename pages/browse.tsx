import CarouselAsync from '@components/CarouselAsync';
import Title from '@components/Title';
import frontend from '@utils/frontend/api';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

const Home = ({ ...props }) => {
  const { locale } = useRouter();

  return (
    <div className='pt-10 w-full flex justify-center'>
      <Title title='Browse' />
      <div className='w-full items-center py-11 px-120 max-w-screen-2xl'>
        <CarouselAsync name='my list' func={async () => await frontend.getTab({ tab: 'my list', locale: locale!, start: 0, end: 20 })} />
        <CarouselAsync name='latest' func={async () => await frontend.getTab({ tab: 'latest', locale: locale!, start: 0, end: 20 })} />
        <CarouselAsync name='popular' func={async () => await frontend.getTab({ tab: 'popular', locale: locale!, start: 0, end: 20 })} />
        <CarouselAsync name='soon' func={async () => await frontend.getTab({ tab: 'soon', locale: locale!, start: 0, end: 20 })} />

        {Array.from({ length: 5 }).map((v, i) => {
          return (
            <CarouselAsync
              name='...'
              func={async () => {
                return await frontend.getBrowseGenre({ locale: locale!, index: i, seed: props.seed });
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
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common', 'footer'])),
      seed: context?.query?.seed ? context?.query?.seed : new Date().getTime(),
    },
  };
};
