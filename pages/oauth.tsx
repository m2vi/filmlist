import { Button } from '@components/Button';
import Full from '@components/Full';
import Head from 'next/head';
import { IoLogoDiscord } from 'react-icons/io5';

const Auth = () => {
  const handleClick = () => window.location.replace('/api/oauth');

  return (
    <Full className='flex justify-center items-center'>
      <Head>
        <title>OAuth</title>
      </Head>
      <Button icon={<IoLogoDiscord className='h-4 w-4' />} className='btn-discord' onClick={handleClick}>
        Log in with Discord
      </Button>
    </Full>
  );
};

export default Auth;
