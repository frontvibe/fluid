export const getIntValue = (value: string) =>
  `coalesce(
    ${value}[_key == $language][0].value,
    ${value}[_key == $defaultLanguage][0].value,
  )` as const;
