import {defineField} from 'sanity';

import ProxyStringInput from '../../../components/shopify/proxy-string';

export default defineField({
  name: 'proxyString',
  title: 'Title',
  type: 'string',
  components: {
    input: ProxyStringInput,
  },
});
