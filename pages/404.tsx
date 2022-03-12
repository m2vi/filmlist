import Full from '@components/Full';
import Title from '@components/Title';
import Link from 'next/link';

const Error = () => {
  return (
    <Full className='flex justify-center items-center text-center'>
      <Title title='404' />
      <Link href='/browse'>
        <a className='flex font-bold text-3xl'>404</a>
      </Link>
    </Full>
  );
};

export default Error;
