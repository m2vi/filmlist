import { Button } from '@components/Button';
import { Input } from '@components/Input';
import manage from '@utils/frontend/manage';
import { createRef, Fragment } from 'react';

const Insert = () => {
  const IdRef = createRef<HTMLInputElement>();
  const TypeRef = createRef<HTMLInputElement>();

  const submit = () => {
    if (!IdRef.current || !TypeRef.current) return;

    const id = IdRef.current.value;
    const type = TypeRef.current.value;

    manage.update({ id_db: id, type });
  };

  return (
    <Fragment>
      <Input className='mt-2' placeholder='Id' ref={IdRef} />
      <Input className='mt-2' placeholder='Type' ref={TypeRef} />

      <Button className='mt-3' onClick={submit}>
        Submit
      </Button>
    </Fragment>
  );
};

export default Insert;
