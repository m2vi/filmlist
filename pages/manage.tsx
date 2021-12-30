import { Button } from '@components/Button';
import Full from '@components/Full';
import { Input } from '@components/Input';
import Title from '@components/Title';
import Toggle from '@components/Toggle';
import { Tab } from '@headlessui/react';
import { classNames } from '@utils/utils';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';

const Manage = () => {
  const [enabled, setEnabled] = useState(true);
  const categories = {
    Insert: {},
    Delete: {},
    Move: {},
    Update: {},
    Backup: {},
  };
  return (
    <Full className='flex justify-center items-center'>
      <Title title='Manage' />
      <div className='w-full max-w-lg p-4 bg-primary-900-80 border border-primary-700 rounded-15'>
        <Tab.Group>
          <Tab.List className='flex text-center border-b border-primary-600 h-8'>
            {Object.keys(categories).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-full py-2 h-8 text-base leading-5 font-medium text-white border-b',
                    selected ? 'text-white border-accent' : 'text-primary-300 border-transparent hover:text-white'
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className='mt-4 h-400'>
            <Tab.Panel>
              <Input className='mt-2' placeholder='Id' />
              <Input className='mt-2' placeholder='Type' />
              <div className='flex justify-between  items-center mt-2'>
                <span className='text-lg ml-2'>Favoured</span>
                <Toggle enabled={enabled} onChange={setEnabled} />
              </div>
              <div className='flex justify-between items-center mt-2'>
                <span className='text-lg ml-2'>Watched</span>
                <Toggle enabled={enabled} onChange={setEnabled} />
              </div>

              <Button className='mt-3'>Submit</Button>
            </Tab.Panel>
            <Tab.Panel>
              <Input className='mt-2' placeholder='Id' />
              <Input className='mt-2' placeholder='Type' />
              <Button className='mt-3'>Submit</Button>
            </Tab.Panel>
            <Tab.Panel>
              <Input className='mt-2' placeholder='Id' />
              <Input className='mt-2' placeholder='Type' />
              <Input className='mt-2' placeholder='Position' type='number' />
              <Button className='mt-3'>Submit</Button>
            </Tab.Panel>
            <Tab.Panel>
              <Input className='mt-2' placeholder='Id' />
              <Input className='mt-2' placeholder='Type' />
              <Button className='mt-3'>Update</Button>
            </Tab.Panel>
            <Tab.Panel className='grid place-items-center h-full w-full'>
              <a href='/api/action/backup' download={true}>
                <Button>Export</Button>
              </a>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Full>
  );
};

Manage.layout = true;

export default Manage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common', 'footer'])),
    },
  };
};
