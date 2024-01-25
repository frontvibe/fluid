import {SanityClient, SlugValue, ValidationContext} from 'sanity';
import {projectDetails} from '../project.details';

export type SlugInt = {
  _key: string;
  _type: string;
  value: SlugValue;
};

const slugRegexErrorMessage =
  'Slug can only contain alphanumeric characters and dashes. Make sure to remove any spaces or special characters.';

export function slugRegex(slug?: SlugValue) {
  const urlHandleRegex = /^[a-zA-Z0-9-]+$/;

  if (slug?.current) {
    return urlHandleRegex.test(slug.current);
  }

  return false;
}

export async function isUnique(args: {
  slug?: string;
  context: ValidationContext;
}) {
  const {slug, context} = args;
  const {document, getClient} = context;
  const {apiVersion} = projectDetails;
  const client = getClient({apiVersion});
  const id = document?._id.replace(/^drafts\./, '');
  const params = {
    draft: `drafts.${id}`,
    published: id,
    type: document?._type,
    slug,
  };
  const query = `
    !defined(
      *[!(_id in [$draft, $published]) &&
      _type == $type &&
      slug.current == $slug][0]._id
    )
    `;
  const result = await client.fetch(query, params);

  return result;
}

export function validateSlug(slug?: SlugValue) {
  if (!slugRegex(slug)) {
    return slugRegexErrorMessage;
  }

  return true;
}

export async function validateIntSlug(args: {
  slugArray?: SlugInt[];
  context: ValidationContext;
}) {
  const {slugArray, context} = args;
  const {apiVersion} = projectDetails;
  const {document, getClient} = context;
  const client = getClient({apiVersion});
  const documentId = document?._id.replace(/^drafts\./, '');

  async function validate() {
    const promises = slugArray?.map(async (slug) => {
      return await checkSlugIsUnique(slug, client, document?._type, documentId);
    });

    if (!promises) {
      return [];
    }

    const results = await Promise.all(promises);

    return results;
  }

  const errors = await validate();

  if (errors.length > 0) {
    return errors[0];
  }

  return true;
}

async function checkSlugIsUnique(
  slug: SlugInt,
  client: SanityClient,
  type?: string,
  documentId?: string,
) {
  if (!slugRegex(slug.value)) {
    return slugRegexErrorMessage;
  }

  const params = {
    draft: `drafts.${documentId}`,
    published: documentId,
    language: slug._key,
    handle: slug.value.current,
    type,
  };

  const query = `
    !defined(
      *[!(_id in [$draft, $published]) &&
      _type == $type &&
      (slug[_key == $language][0].value.current == $handle)][0]._id
    )`;

  const result = await client.fetch(query, params);

  if (!result) {
    return `The slug "${slug.value.current}" is already used. Please choose another one.`;
  }

  return true;
}
