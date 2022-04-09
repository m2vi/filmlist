import Tab from '@components/Tab';
import { GetTabResponse } from '@Types/filmlist';
import cache from '@utils/apis/cache';
import filmlist from '@utils/apis/filmlist';
import genres from '@utils/apis/genres';
import user from '@utils/user';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Handler = (props: { data: GetTabResponse; name: string }) => <Tab {...props} />;

Handler.layout = true;

export default Handler;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = user.getIdFromRequest(context.req);
  const provider = parseInt(context.query.id?.toString()!);
  const providers = await cache.providers.get();

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      name: providers.find(({ id }) => id === provider)?.name,
      data: await filmlist.getTab({
        user: id,
        locale: context.locale!,
        start: 0,
        end: 80,
        tab: 'key',
        custom_config: {
          filter: {
            'watchProviders.provider_id': provider,
          },
        },
      }),
    },
  };
};
