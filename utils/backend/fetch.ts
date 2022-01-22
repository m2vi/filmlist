import cache from 'memory-cache';

export const cachedFetch = async (url: string, type: 'text' | 'json' = 'json') => {
  const cachedResponse = cache.get(url);
  if (cachedResponse) {
    return cachedResponse;
  } else {
    const hours = 24;
    const response = await fetch(url);
    if (type === 'json') {
      const data = await response.json();
      cache.put(url, data, hours * 1000 * 60 * 60);
      return data;
    } else if (type === 'text') {
      const data = await response.text();
      cache.put(url, data, hours * 1000 * 60 * 60);
      return data;
    } else {
      return null;
    }
  }
};
