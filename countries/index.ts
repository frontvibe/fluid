/* eslint perfectionist/sort-objects: 0 */
import type {I18nLocale, Localizations} from '../app/lib/type';

export const countries: Localizations = {
  default: {
    country: 'CA',
    currency: 'CAD',
    isoCode: 'en-ca',
    label: 'Canada (CAD $)',
    language: 'EN',
    languageLabel: 'English',
    salesChannel: 'hydrogen',
  },
  '/ca-fr': {
    country: 'CA',
    currency: 'CAD',
    isoCode: 'fr-ca',
    label: 'Canada - French (CAD $)',
    language: 'FR',
    languageLabel: 'French',
    salesChannel: 'hydrogen',
  },
  '/fr': {
    country: 'FR',
    currency: 'EUR',
    isoCode: 'fr-fr',
    label: 'France (EUR €)',
    language: 'FR',
    languageLabel: 'French',
    salesChannel: 'hydrogen',
  },
};

export const DEFAULT_LOCALE: I18nLocale = Object.freeze({
  ...countries.default,
  pathPrefix: '',
  default: true,
});

export function getAllLanguages() {
  const uniqueLanguages = [];
  const seenLanguages = new Set<string>();

  for (const key in countries) {
    const language = countries[key].language;
    // Remove duplicates to avoid having same language multiple times
    if (!seenLanguages.has(language)) {
      uniqueLanguages.push({
        id: language.toLocaleLowerCase(),
        title: countries[key].languageLabel,
      });
      seenLanguages.add(language);
    }
  }

  return uniqueLanguages;
}

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstPathPart =
    '/' + url.pathname.substring(1).split('/')[0].toLowerCase();

  return countries[firstPathPart]
    ? {
        ...countries[firstPathPart],
        pathPrefix: firstPathPart,
        default: false,
      }
    : {
        ...countries['default'],
        pathPrefix: '',
        default: true,
      };
}

export function getAllLocales() {
  return Object.keys(countries).map((key) => {
    if (key === 'default') {
      return {
        ...countries[key],
        pathPrefix: '',
        default: true,
      };
    }

    return {
      ...countries[key],
      pathPrefix: key,
      default: false,
    };
  });
}

export function getAllCountries() {
  return Object.keys(countries).map((key) => {
    return countries[key].country;
  });
}
