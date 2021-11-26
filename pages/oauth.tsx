import { Button } from '@components/Button';
import Full from '@components/Full';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import nProgress from 'nprogress';
import { useEffect } from 'react';
import { IoLogoDiscord } from 'react-icons/io5';

const Auth = () => {
  const Router = useRouter();
  const handleClick = () => window.location.replace('/api/oauth');

  useEffect(() => {
    nProgress.remove();
    if (Router.query.e) {
      console.log(Router.query.e);

      window.history.replaceState(null, '', '/oauth');
    }
  }, [Router]);

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
