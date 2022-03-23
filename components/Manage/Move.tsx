import { Button } from '@components/Button';
import { Input } from '@components/Input';
import manage from '@utils/frontend/manage';
import { createRef, Fragment, useRef } from 'react';

const Move = () => {
  const IdRef = createRef<HTMLInputElement>();
  const TypeRef = createRef<HTMLInputElement>();
  const PositionRef = createRef<HTMLInputElement>();

  const submit = () => {
    if (!IdRef.current || !TypeRef.current || !PositionRef.current) return;

    const id = IdRef.current.value;
    const type = TypeRef.current.value;
    const position = PositionRef.current.value;

    manage.move({ id_db: id, type, position });
  };

  return (
    <Fragment>
      <Input className='mt-2' placeholder='Id' ref={IdRef} />
      <Input className='mt-2' placeholder='Type' ref={TypeRef} />
      <Input className='mt-2' placeholder='Position' ref={PositionRef} />

      <Button className='mt-3' onClick={submit}>
        Submit
      </Button>
    </Fragment>
  );
};

export default Move;
