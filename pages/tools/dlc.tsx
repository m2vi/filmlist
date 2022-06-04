import dlc from '@clients/dlc.client';
import { Button } from '@components/Button';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { createRef, useState } from 'react';

const Handler = () => {
  const [links, setLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const textareaRef = createRef<HTMLTextAreaElement>();

  const get = () => {
    if (!textareaRef.current) return;
    setLoading(true);
    dlc
      .paste(textareaRef.current.value)
      .then(setLinks)
      .catch(console.error)
      .then(() => setLoading(false));
  };

  return (
    <div className='h-full w-full px-120 py-8 flex flex-col'>
      <Head>
        <title>DLC Decryptor</title>
      </Head>
      <div className='mb-4'>
        <h1 className='text-4xl font-bold mb-1'>DLC Decryptor</h1>
        <span className='text-primary-200'>
          This little tool uses{' '}
          <a href='http://dcrypt.it/' className='text-accent hover:text-accent-hover' target='_blank' rel='noreferrer'>
            dcrypt.it
          </a>{' '}
          to decrypt DLC files. It&apos;s actually unnecessary, but when I copy something from the page mentioned above, an extra line break
          is added, which pisses me off.
        </span>
      </div>

      <div className='mt-4'>
        <span className='text-primary-200'>Encrypted content:</span>
        <textarea
          className='w-full border border-primary-700 bg-primary-800 h-200 p-3 mt-2 placeholder:text-primary-300 resize-none'
          ref={textareaRef}
        ></textarea>
      </div>

      <div className='mt-4 py-2 w-full flex justify-center'>
        <Button onClick={get} loading={loading}>
          Decrypt
        </Button>
      </div>

      <div className='mt-4'>
        <span className='text-primary-200'>Links:</span>
        <textarea
          className='w-full border border-primary-700 bg-primary-800 h-300 p-3 mt-2 placeholder:text-primary-300 resize-none'
          value={links.join('\n')}
          readOnly
        ></textarea>
      </div>
    </div>
  );
};

export default Handler;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
    },
  };
};
