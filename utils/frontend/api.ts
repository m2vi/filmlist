import jwt from 'jsonwebtoken';
import cookies from 'js-cookie';
import {
  DiscordUser,
  FrontendItemProps,
  GetBrowseGenreProps,
  GetTabProps,
  GetTMDBTabProps,
  ItemProps,
  NotificationItemProps,
  ProviderEntryProps,
  TransitionOptions,
} from '@utils/types';
import moment from 'moment';
import { basicFetch } from '@utils/fetch';
import _ from 'underscore';
import momentDurationFormatSetup from 'moment-duration-format';
import qs from 'qs';
import { i18n } from 'next-i18next';
import genres from '@utils/tmdb/genres';
import QueryString from 'qs';
import { Url } from 'url';
import notifications from '@utils/notifications/api';

momentDurationFormatSetup(moment as any);

class Jwt {
  decode() {
    const cookie = cookies.get('token');
    if (!cookie) return false;
    return jwt.decode(cookie) as DiscordUser;
  }
}

export class Api {
  jwt: Jwt;
  constructor() {
    this.jwt = new Jwt();
  }

  getTitle(query: any, data: any) {
    const m = i18n?.t('pages.filmlist.default');

    if (data.purpose === 'company') {
      return `${data.name} – ${m}`;
    } else if (query.tab) {
      return `${i18n?.t(`pages.filmlist.menu.${query.tab}`)} – ${m}`;
    } else if (query.id) {
      return `${i18n?.t(`pages.filmlist.menu.${genres.getName(parseInt(query.id)).toLowerCase()}`)} – ${m}`;
    } else if (query.year) {
      return `${query.year} – ${m}`;
    } else if (query.lang) {
      return `${i18n?.t(`pages.filmlist.menu.${query.lang}`)}`;
    }

    return `${m}`;
  }

  async getTab({ custom_config, ...props }: GetTabProps) {
    const params = qs.stringify({ custom_config: custom_config && JSON.stringify(custom_config), ...props });
    const data = await basicFetch(`/api/manage/tab?${params}`);

    return data;
  }

  async getTMDBTab({ ...props }: GetTMDBTabProps) {
    const params = qs.stringify({ ...props });
    const data = await basicFetch(`/api/manage/tmdb_tab?${params}`);

    return data;
  }

  streamableOnProvider(name: string, providers: ProviderEntryProps | null): boolean {
    if (!providers) return false;
    const results = _.find(providers?.providers!, { name });
    return Boolean(results);
  }

  justwatch(qs: string) {
    return `/api/watch/redirect?${qs}`;
  }

  async fetchMoreData(data: any, items: any[]) {
    try {
      if (data?.purpose === 'company') {
        const res = await basicFetch(`/api/manage/items/company/${data?.id}/${items.length / 20}?locale=${data?.locale}`);

        return res?.items ? res?.items : [];
      } else if (data?.purpose === 'tmdb-tab') {
        const res = await this.getTMDBTab({ ...(data.query ? data.query : {}), page: items?.length / 20 + 1 });
        return res?.items ? res?.items : [];
      } else {
        const res = await this.getTab({ ...(data.query ? data.query : {}), start: items.length, end: items.length + 70 });
        return res?.items ? res?.items : [];
      }
    } catch (error) {
      return [];
    }
  }

  private toNotifications(items: FrontendItemProps[] = [], locale: string = 'en') {
    return items
      .filter(({ release_date }) => new Date().getTime() - release_date < 1000 * 60 * 60 * 24 * 30 * 6)
      .map(({ id_db, name, release_date, backdrop_path, type }) => {
        return {
          url: `/${type ? 'movie' : 'tv'}/${id_db}`,
          name,
          backdrop_path,
          release_date: moment(release_date).locale(locale).fromNow(),
        };
      });
  }

  async getNotifications(locale: string = 'en'): Promise<NotificationItemProps[]> {
    const { items } = await basicFetch(`/api/manage/tab?tab=notifications&locale=${locale}&start=0&end=15`);

    return this.toNotifications(items, locale);
  }

  getDirector({ credits }: ItemProps) {
    if (!credits) return null;
    const director = _.find(credits?.crew, {
      job: 'Director',
    });

    if (!director) return null;
    return director;
  }

  getMainCrew(item: ItemProps) {
    if (!item?.credits) return null;
    const { credits } = item;

    const find = (job: string) => _.filter(credits.crew, { job });

    if (find('Novel').length > 0) {
      return {
        job: 'Novel',
        crew: find('Novel'),
      };
    } else if (find('Director').length > 0) {
      return {
        job: 'Director',
        crew: find('Director'),
      };
    } else if (find('Creator').length > 0) {
      return {
        job: 'Creator',
        crew: find('Creator'),
      };
    } else {
      return null;
    }
  }

  duration(minutes: number, locale: string) {
    moment.locale(locale);
    return moment.duration(minutes, 'minutes').format('h[h] mm[m]');
  }

  async getBrowseGenre({ locale, seed, index }: GetBrowseGenreProps) {
    const data = await basicFetch(`/api/manage/browse_genre?locale=${locale}&seed=${seed}&index=${index}`);

    return data;
  }

  async update(id: any, type: any, router_reload: () => void): Promise<void> {
    const result = await basicFetch(`/api/db/update?${QueryString.stringify({ id, type })}`);

    notifications.info(`Updated ${id}:${type} successfully`);
  }
}

export const api = new Api();

export default api;
