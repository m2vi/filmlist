export function validateEnv<T extends string = string>(key: keyof NodeJS.ProcessEnv, defaultValue?: T, warnDefault = false): T {
  const value = process.env[key] as T | undefined;

  if (!value) {
    if (typeof defaultValue !== 'undefined') {
      if (warnDefault) {
        const message = `validateEnv is using a default value for ${key} and has this warning enabled.`;
        console.warn(message);
      }

      return defaultValue;
    } else {
      throw new Error(`${key} is not defined in environment variables`);
    }
  }

  return value;
}

export const stringToBoolean = (string: string) => {
  switch (string.toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true;

    case 'false':
    case 'no':
    case '0':
    case null:
      return false;

    default:
      return Boolean(string);
  }
};

export const isReleased = (release_date: any) => {
  if (typeof release_date === 'number') {
    return Math.sign(new Date().getTime() - release_date) === 1;
  } else {
    return false;
  }
};
