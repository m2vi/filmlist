import { Button } from '@components/Button';
import Full from '@components/Full';
import { Input } from '@components/Input';
import Title from '@components/Title';
import { Tab } from '@headlessui/react';
import { classNames } from '@utils/utils';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Insert = () => {
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
      <div className='w-full max-w-lg p-4 bg-primary-800 rounded-8'>
        <Tab.Group>
          <Tab.List className='flex text-center'>
            {Object.keys(categories).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-full py-2 text-base leading-5 font-medium text-white border-b',
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
              <Input className='mt-2' placeholder='Favoured' />
              <Input className='mt-2' placeholder='Watched' />
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
              <Input className='mt-2' placeholder='Position' />
              <Button className='mt-3'>Submit</Button>
            </Tab.Panel>
            <Tab.Panel>
              <Input className='mt-2' placeholder='Id' />
              <Input className='mt-2' placeholder='Type' />
              <Button className='mt-3'>Update</Button>
            </Tab.Panel>
            <Tab.Panel className='grid place-items-center h-full w-full'>
              <Button>Export</Button>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Full>
  );
};

export default Insert;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common', 'footer'])),
    },
  };
};
