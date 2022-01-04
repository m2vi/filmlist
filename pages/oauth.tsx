import { Button } from '@components/Button';
import Full from '@components/Full';
import Head from 'next/head';
import { IoLogoDiscord } from 'react-icons/io5';
// import AppleLogo from '@public/icons/apple.svg';
import GoogleLogo from '@public/icons/google.svg';
import { rr } from '@utils/utils';
const Auth = () => {
  const handler = (e: any) => window.location.replace(`/api/oauth/${e.currentTarget.value}`);

  return (
    <Full className='flex justify-center items-center'>
      <Head>
        <title>OAuth</title>
      </Head>
      <div className='grid grid-cols-1 auto-rows-auto gap-2 max-w-xxs w-full'>
        {/*         <Button icon={<AppleLogo className='h-4 w-4' />} className='btn-apple w-full' value='apple' onClick={handler}>
          Log in with Apple
        </Button> */}
        <Button icon={<IoLogoDiscord className='h-4 w-4' />} className='btn-discord w-full' value='discord' onClick={handler}>
          Log in with Discord
        </Button>
        <Button icon={<GoogleLogo className='h-4 w-4' />} className='btn-google w-full' value='google' onClick={rr}>
          Log in with Google
        </Button>
      </div>
    </Full>
  );
};

export default Auth;
