import { Dialog, Tab, Transition } from '@headlessui/react';
import { classNames } from '@utils/utils';
import { Fragment, useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import Listbox from './Listbox';

const Manage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const categories = {
    Insert: {},
    Delete: {},
    Move: {},
    Update: {},
    Backup: {},
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='fixed inset-0 z-10 overflow-y-auto' onClose={closeModal}>
        <div className='min-h-screen px-4 text-center'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-0' />
          </Transition.Child>
          <span className='inline-block h-screen align-middle' aria-hidden='true'>
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div className='border border-primary-700 inline-block w-full max-w-lg px-8 py-6 my-8 overflow-hidden text-left align-middle bg-primary-900-80 rounded-8 shadow-1 relative'>
              <Tab.Group>
                <Tab.List className='flex text-center border-b border-primary-600 h-8'>
                  {Object.keys(categories).map((category) => (
                    <Tab
                      key={category}
                      className={({ selected }) =>
                        classNames(
                          'w-full py-2 h-8 text-base leading-5 text-white border-b',
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
                    <Listbox />

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
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Manage;
