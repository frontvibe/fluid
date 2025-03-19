import {defineField} from 'sanity';

export default defineField({
  name: 'link',
  type: 'reference',
  to: [
    {type: 'home'},
    {type: 'page'},
    {type: 'product'},
    {type: 'collection'},
    {type: 'blogPost'},
  ],
});
