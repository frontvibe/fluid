import {defineField} from 'sanity'

export default defineField({
  name: 'overlayOpacity',
  type: 'rangeSlider',
  options: {
    min: 0,
    max: 100,
    suffix: '%',
  },
  validation: (Rule: any) => Rule.min(0).max(100),
})
