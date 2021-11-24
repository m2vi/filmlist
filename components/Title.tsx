import Head from 'next/head';

const Title = ({ title }: { title: string }) => {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
};

export default Title;
