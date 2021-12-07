import { GetServerSideProps } from 'next';

const logout = () => null;

export default logout;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.cookies.token) {
    res.setHeader('Set-Cookie', 'token=deleted; Max-Age=0; path=/');
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: '/error?error=Cookie was not set',
      permanent: false,
    },
  };
};
