import { Dispatch, SetStateAction } from 'react';
import { Button } from './Button';
import Portal from './Portal';

export interface InfoBarProps {
  name: string;
  setState: Dispatch<SetStateAction<boolean>>;
}

const InfoBar = ({ name, setState }: InfoBarProps) => {
  return (
    <Portal>
      <div className='absolute bottom-0 left-0 right-0 bg-accent flex items-center justify-center z-50'>
        <div className='max-w-screen-2xl w-full px-120 py-3'>
          <div className='flex items-center justify-between'>
            <div>
              <p>
                <b>{name}</b> has not yet been saved to the database, do you want to <b>save it</b>?
              </p>
            </div>
            <div className='flex items-center justify-end h-full'>
              <Button color='tertiary' size='middle'>
                Open Dialog
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default InfoBar;
