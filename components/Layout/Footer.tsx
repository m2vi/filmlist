import { IoLogoGithub } from 'react-icons/io5';

const Footer = () => {
  return (
    <div className='max-w-screen-2xl w-full px-11 my-4 flex items-center justify-between'>
      <span className='text-sm text-primary-300 l-1'>© 2021 m2vi &#123;{process.env.BUILD_ID}&#125;</span>
      <div>
        <a href='https://github.com/m2vi/filmlist' aria-label='GitHub' rel='noopener'>
          <IoLogoGithub className='h-4 w-4' />
        </a>
      </div>
    </div>
  );
};

export default Footer;
