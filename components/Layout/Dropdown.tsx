import { Menu, Transition } from '@headlessui/react';
import { Fragment, MouseEvent, MouseEventHandler } from 'react';
import Image from 'next/image';
import api from '@utils/frontend/api';
import { DiscordUser } from '@utils/types';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Dropdown = () => {
  const { reload } = useRouter();
  const user = api.jwt.decode() as DiscordUser;
  const avatar = `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png?size=128`;

  return (
    <div className='flex justify-end'>
      <Menu as='div' className='relative h-full'>
        <div className='h-full flex justify-center'>
          <Menu.Button className='inline-flex justify-center h-7 w-7 bg-primary-800 text-sm font-medium rounded' as='button'>
            <Image
              src={avatar}
              alt='Avatar'
              height='35px'
              width='35px'
              className='rounded no-drag'
              onClick={(e) => {
                if (e.shiftKey) {
                  api
                    .clearCache('items')
                    .then(() => reload())
                    .catch(console.log);
                }
              }}
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <div className='absolute right-0 w-200 mt-3 p-1 origin-top-right bg-primary-800 divide-y divide-primary-700 rounded-5 border border-primary-700'>
            <Menu.Items>
              <div className='px-3 py-1'>
                <Menu.Item>
                  {({ active }) => (
                    <Link href='/dashboard' passHref prefetch={false}>
                      <a
                        className={`${
                          active ? ' text-primary-200 opacity-80' : 'text-primary-100'
                        } group flex rounded-md items-center w-full px-2 py-1 text-sm cursor-pointer hover:bg-primary-900`}
                      >
                        Dashboard
                      </a>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => {
                    return (
                      <div
                        className={`${
                          active ? ' text-primary-200 opacity-80' : 'text-primary-100'
                        } group flex rounded-md items-center w-full px-2 py-1 text-sm cursor-pointer hover:bg-primary-900`}
                      >
                        Manage
                      </div>
                    );
                  }}
                </Menu.Item>
              </div>
            </Menu.Items>
            <Menu.Items>
              <div className='px-3 py-1'>
                <Menu.Item>
                  {({ active }) => (
                    <Link href='/logout' prefetch={false}>
                      <a
                        className={`${
                          active ? ' text-primary-200 opacity-80' : 'text-primary-100'
                        } group flex rounded-md items-center w-full px-2 py-1 text-sm cursor-pointer hover:bg-primary-900`}
                      >
                        Log out
                      </a>
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </div>
        </Transition>
      </Menu>
    </div>
  );
};

export default Dropdown;
