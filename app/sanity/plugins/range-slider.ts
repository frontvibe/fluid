import {defineType} from 'sanity';

import {RangeSliderInput} from '../components/range-slider-input';

export default defineType({
  name: 'rangeSlider',
  type: 'number',
  components: {
    input: RangeSliderInput,
  },
});
