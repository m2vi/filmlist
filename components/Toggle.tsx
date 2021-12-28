import { Switch } from '@headlessui/react';

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: any }) => {
  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      className={`${enabled ? 'bg-accent' : 'bg-primary-700'}
relative inline-flex flex-shrink-0 h-toggle-h items-center w-toggle-w border-2 border-transparent rounded-40 cursor-pointer transition-colors ease-in-out duration-200 `}
    >
      <span
        aria-hidden='true'
        className={`${enabled ? 'translate-x-toggle-w-2' : 'translate-x-0'}
  pointer-events-none inline-block h-toggle-h-2 w-toggle-h-2  rounded-40 bg-white transform transition ease-in-out duration-200`}
      />
    </Switch>
  );
};

export default Toggle;
