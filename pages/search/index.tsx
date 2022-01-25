import search from '@utils/backend/search';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { performance } from 'perf_hooks';
import { useEffect } from 'react';
import SearchComponent from '@components/Search';

const Search = ({ log, ...props }: any) => {
  useEffect(() => console.log(log), [log]);

  return <SearchComponent {...props} />;
};

Search.layout = true;

export default Search;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const start = performance.now();
  const query = context.query.q?.toString();
  const props = {
    ...(await serverSideTranslations(context.locale!, ['common', 'footer'])),
    results: query ? await search.get(query, { locale: context.locale! }) : [],
  };

  return {
    props: {
      ...props,
      log: {
        query: query ? query : null,
        locale: context.locale ? context.locale : null,
        time: performance.now() - start,
        results: {
          count: props.results.length,
          items: props.results,
        },
      },
    },
  };
};
