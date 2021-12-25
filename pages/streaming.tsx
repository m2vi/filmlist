import Full from '@components/Full';
import Title from '@components/Title';

const Streaming = () => {
  return (
    <Full className='pt-10 flex justify-center'>
      <Title title='Streaming' />
      <main className='w-full overflow-y-scroll dD5d-item max-w-screen-2xl px-11 pt-11' id='scrollableDiv' style={{ overflowX: 'hidden' }}>
        <div
          className='w-full p-0 grid gap-2 auto-rows-auto place-items-center !overflow-x-hidden '
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            overflowX: 'hidden',
          }}
        ></div>
      </main>
    </Full>
  );
};

export default Streaming;
