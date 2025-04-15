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
      _id
    }
  `;

  const result = await client.fetch(query, params);

  if (result?._id && value) {
    return `A default document of type ${document?._type} already exists. (ID: ${result._id})`;
  }

  return true;
}
