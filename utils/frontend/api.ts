import jwt from 'jsonwebtoken';
import cookies from 'js-cookie';
import { DiscordUser, FrontendItemProps, ItemProps, NotificationItemProps } from '@utils/types';
import { ParsedUrlQuery } from 'querystring';
import moment from 'moment';
import { basicFetch } from '@utils/fetch';
import _ from 'underscore';

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

  async fetchMoreData(query: ParsedUrlQuery, locale: string | undefined, start: number) {
    try {
      const res = await (
        await fetch(
          `/api/manage/tab?tab=${query.tab ? query.tab : 'none'}&locale=${locale}&start=${start}&end=${start + 75}${
            query.id ? `&includeGenres=${query.id}` : ''
          }`
        )
      ).json();

      return res.items ? res.items : [];
    } catch (error) {
      return [];
    }
  }

  private toNotifications(items: FrontendItemProps[] = [], locale: string = 'en') {
    return items
      .filter(({ release_date }) => new Date().getTime() - release_date < 1000 * 60 * 60 * 24 * 30 * 6)
      .map(({ _id, name, release_date, backdrop_path }) => {
        return {
          _id,
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
}

export const api = new Api();

export default api;
