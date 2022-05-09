import { FDetails } from '@Types/downloads';
import path from 'path';

const Status = ({
  file_details,
  file_date_added,
}: {
  file_details: FDetails | null | undefined;
  file_date_added: number | null | undefined;
}) => {
  if (!file_details) return null;

  return (
    <div className='absolute top-0 right-0 p-1 flex z-10'>
      <div className='p-1 rounded-5 text-sm leading-none backdrop-blur-sm' style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
        {path.parse(file_details?.path).root}
      </div>
    </div>
  );
};

export default Status;
