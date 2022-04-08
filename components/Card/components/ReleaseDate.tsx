import { moment } from '@utils/apis/moment';

const ReleaseDate = ({ release_date }: { release_date: number }) => {
  return (
    <span
      className='font-medium leading-5 opacity-80 text-base overflow-hidden overflow-ellipsis whitespace-nowrap'
      title={moment(release_date).format('YYYY-MM-DD')}
    >
      {moment(release_date).format('YYYY')}
    </span>
  );
};

export default ReleaseDate;
