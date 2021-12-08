import { IoLogoGithub } from 'react-icons/io5';

const Footer = () => {
  return (
    <div className='max-w-screen-2xl w-full px-11 my-4 flex items-center justify-between'>
      <span className='text-xs text-primary-300 l-1'>© 2021 m2vi &#123;{process.env.BUILD_ID}&#125;</span>
      <div>
        <a href='https://github.com/m2vi/filmlist'>
          <IoLogoGithub style={{ height: '17.5px', width: '17.5px' }} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
