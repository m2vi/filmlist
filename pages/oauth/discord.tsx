import { Button } from '@components/Button';
import Full from '@components/Full';
import Head from 'next/head';
import { IoLogoDiscord } from 'react-icons/io5';

const Auth = () => {
  const handler = (e: any) => window.location.replace(`/api/auth/provider/${e.currentTarget.value}`);

  return (
    <Full className='flex justify-center items-center'>
      <Head>
        <title>OAuth</title>
      </Head>
      <div className='grid grid-flow-row gap-2 max-w-xs px-4 w-full'>
        <Button icon={<IoLogoDiscord className='h-4 w-4' />} className='btn-discord w-full' value='discord' onClick={handler}>
          Log in with Discord
        </Button>
      </div>
    </Full>
  );
};

export default Auth;
