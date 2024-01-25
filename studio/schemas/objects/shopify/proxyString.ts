import {defineField} from 'sanity';
import {ProxyStringInput} from '../../../components/shopify/ProxyString';

export default defineField({
  name: 'proxyString',
  title: 'Title',
  type: 'string',
  components: {
    input: ProxyStringInput,
  },
});
