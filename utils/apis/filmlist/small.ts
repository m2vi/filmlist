import { sortByKey } from '@m2vi/iva';
import { FilmlistGenres, FilmlistProductionCompany, PersonsCredits, ProviderProps } from '@Types/filmlist';
import { ItemProps } from '@Types/items';
import db from '@utils/db/main';
import { getUniqueListBy } from '@utils/helper';

import SeedRandom from 'seed-random';
import { shuffle } from 'shuffle-seed';
import sift from 'sift';
import _, { sample } from 'underscore';
import cache from '../cache';
import genres from '../genres';

class FilmlistSm {
  async genres(): Promise<FilmlistGenres> {
    await db.init();
    const data = await db.itemSchema.find().select('genre_ids backdrop_path ratings').lean<ItemProps[]>();
    let g: FilmlistGenres = [];
    const base = genres.array;

    for (let i = 0; i < base.length; i++) {
      const { id, name, ...props } = base[i];

      const items = sortByKey(_.filter(data, sift({ genre_ids: id })), 'ratings.tmdb.vote_count').reverse();
      const backdrop_path = sample(items.slice(0, 50))?.backdrop_path?.en;

      g.push({
        id: id,
        name: name.toLowerCase(),
        backdrop_path: backdrop_path ? backdrop_path : null,
        items: items.length,
        ...props,
      });
    }

    return sortByKey(g, 'key');
  }

  async providers(): Promise<ProviderProps[]> {
    await db.init();
    const data = await db.itemSchema.find().select('watchProviders').lean<ItemProps[]>();

    let providers: ProviderProps[] = [];

    for (let i = 0; i < data.length; i++) {
      const { watchProviders } = data[i];
      if (!watchProviders) continue;

      for (let i = 0; i < watchProviders.length; i++) {
        const { provider_id, provider_name, logo_path } = watchProviders[i];

        providers.push({ id: provider_id, name: provider_name, logo_path });
      }
    }

    const unique = getUniqueListBy(providers, 'id');

    for (let i = 0; i < unique.length; i++) {
      const provider = unique[i];

      const items = sortByKey(_.filter(data, sift({ 'watchProviders.provider_id': provider.id })), 'popularity').reverse();

      unique[i] = { ...provider, items: items.length };
    }

    return sortByKey(unique, 'items').reverse();
  }

  async productionCompanies() {
    await db.init();
    const data = await db.itemSchema.find().select('production_companies backdrop_path popularity').lean<ItemProps[]>();
    let companies: FilmlistProductionCompany[] = [];

    for (let i = 0; i < data.length; i++) {
      const { production_companies } = data[i];
      if (!production_companies) return;
      for (let i = 0; i < production_companies.length; i++) {
        const c = production_companies[i];

        companies.push(c);
      }
    }

    companies = getUniqueListBy(companies, 'id');

    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];

      const items = sortByKey(_.filter(data, sift({ 'production_companies.id': company.id })), 'popularity').reverse();

      companies[i] = { ...company, backdrop_path: items[0]?.backdrop_path?.en! ? items[0]?.backdrop_path?.en! : null, items: items.length };
    }

    return sortByKey(companies, 'items').reverse();
  }

  async browseGenre(seed: string) {
    const rng = SeedRandom(seed);
    const g = await cache.get<FilmlistGenres>('genres');
    const ids = shuffle(
      g.filter(({ items }) => items > 20),
      rng()
    );

    return ids.slice(0, 5);
  }

  async persons(): Promise<PersonsCredits> {
    await db.init();
    const items = await db.itemSchema.find().select('credits');
    let credits = [] as PersonsCredits;

    for (let i = 0; i < items.length; i++) {
      const { credits: base } = items[i];

      if (!base) continue;

      for (let i = 0; i < base?.cast.length!; i++) {
        if (!base?.cast?.[i]?.id) continue;

        const { id, name, profile_path, popularity } = base?.cast?.[i]!;

        credits.push({ id: id!, name: name!, profile_path: profile_path!, popularity: popularity! });
      }

      for (let i = 0; i < base?.crew.length!; i++) {
        if (!base?.cast?.[i]?.id) continue;
        const { id, name, profile_path, popularity } = base?.crew?.[i]!;

        credits.push({ id: id!, name: name!, profile_path: profile_path!, popularity: popularity! });
      }
    }

    return getUniqueListBy(sortByKey(credits, 'popularity').reverse(), 'name');
  }
}

export const fsm = new FilmlistSm();
export default fsm;
