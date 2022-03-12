import Full from '@components/Full';
import Title from '@components/Title';
import Link from 'next/link';

const Error = ({ statusCode }: { statusCode: number }) => {
  return (
    <Full className='flex justify-center items-center text-center'>
      <Title title={statusCode.toString()} />
      <Link href='/browse'>
        <a className='flex font-bold text-3xl'>{statusCode}</a>
      </Link>
    </Full>
  );
};

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
