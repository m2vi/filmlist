import Full from '@components/Full';
import stats from '@utils/backend/statistics';
import { GetServerSideProps } from 'next';
import { TagCloud } from 'react-tagcloud';

const Page = ({ data = [] }) => {
  console.log(data);
  return (
    <Full>
      <TagCloud minSize={5} maxSize={100} tags={data} shuffle={false} disableRandomColor={false}></TagCloud>
    </Full>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      data: await stats.cast(),
    },
  };
};
