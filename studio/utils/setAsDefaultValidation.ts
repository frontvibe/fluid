import {ValidationContext} from 'sanity';
import {projectDetails} from '../project.details';

export async function validateDefaultStatus(
  value: boolean | undefined,
  context: ValidationContext,
) {
  const {apiVersion} = projectDetails;
  const {document, getClient} = context;
  const client = getClient({apiVersion});
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
      name
    }
  `;

  const result = await client.fetch(query, params);

  if (result?.name && value) {
    return `A default template already exists. (${result.name})`;
  }

  return true;
}
