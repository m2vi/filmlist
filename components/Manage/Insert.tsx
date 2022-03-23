import { Button } from '@components/Button';
import { Input } from '@components/Input';
import manage from '@utils/frontend/manage';
import { createRef, Fragment, useRef } from 'react';

const Insert = () => {
  const IdRef = createRef<HTMLInputElement>();
  const TypeRef = createRef<HTMLInputElement>();
  const StateRef = createRef<HTMLInputElement>();

  const submit = () => {
    if (!IdRef.current || !TypeRef.current || !StateRef.current) return console.log('dd');

    const id = IdRef.current.value;
    const type = IdRef.current.value;
    const state = StateRef.current.value;

    manage.insert({ id_db: id, type, state });
  };

  return (
    <Fragment>
      <Input className='mt-2' placeholder='Id' ref={IdRef} />
      <Input className='mt-2' placeholder='Type' ref={TypeRef} />
      <Input className='mt-2' placeholder='State' ref={StateRef} />

      <Button className='mt-3' onClick={submit}>
        Submit
      </Button>
    </Fragment>
  );
};

export default Insert;
