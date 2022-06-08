import cache from '@apis/cache';
import main from '@apis/main';
import user from '@apis/user';
import Tab from '@components/Tab';
import { FilmlistProductionCompany, GetTabResponse } from '@Types/items';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Handler = (props: { data: GetTabResponse; name: string }) => <Tab {...props} />;

Handler.layout = true;

export default Handler;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = user.getIdFromRequest(context.req);

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      name: (await cache.get<FilmlistProductionCompany[]>('companies')).find(({ id }) => id === parseInt(context.query.id?.toString()!))
        ?.name,
      data: await main.getTab({
        user: id,
        locale: context.locale!,
        start: 0,
        end: 80,
        tab: 'company',
        custom_config: {
          filter: {
            'production_companies.id': parseInt(context.query.id?.toString()!),
          },
        },
        purpose: 'items_l',
      }),
    },
  };
};
