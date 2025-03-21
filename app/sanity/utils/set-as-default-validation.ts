import type {ValidationContext} from 'sanity';

import {SANITY_API_VERSION} from '../constants';

export async function validateDefaultStatus(
  value: boolean | undefined,
  context: ValidationContext,
) {
  const {document, getClient} = context;
  const client = getClient({apiVersion: SANITY_API_VERSION});
  const id = document?._id.replace(/^drafts\./, '');
  const params = {
    draft: `drafts.${id}`,
    published: id,
    type: document?._type,
  };
  const query = `
    *[!(_id in [$draft, $published]) &&
      _type == $type &&
      default == true
    ][0] {

    }
  `;

  const result = await client.fetch(query, params);

  if (result?.name && value) {
    return `A default template already exists. (${result.name})`;
  }

  return true;
}
