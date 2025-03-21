import {defineField} from 'sanity';

export default defineField({
  name: 'anchor',
  description: 'The ID of the element to scroll to, without the #.',
  type: 'string',
});
