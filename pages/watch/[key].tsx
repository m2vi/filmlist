import { useRouter } from 'next/router';

const Handler = () => {
  const { key } = useRouter().query;

  return (
    <div>
      <video src={`/api/watch/${key}`}></video>
    </div>
  );
};

export default Handler;
