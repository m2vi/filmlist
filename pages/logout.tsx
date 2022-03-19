import user from '@utils/user/api';
import jwt from 'jsonwebtoken';
import { GetServerSideProps } from 'next';

const logout = () => null;

export default logout;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.cookies.token) {
    const content: any = jwt.decode(req.cookies.token);
    user.history.setSessionEnd(content.sessionId);

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
