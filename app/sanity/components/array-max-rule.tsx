import type {ArrayOfObjectsInputProps} from 'sanity';

import {Card, Text} from '@sanity/ui';

function ArrayMaxRule(props: ArrayOfObjectsInputProps) {
  const validation = props?.schemaType?.validation;
  const valRules = Array.isArray(validation)
    ? (validation as any)?.[0]?._rules || []
    : [];
  const max = valRules.find((r: any) => r.flag === 'max')?.constraint;
  const total = props?.value?.length || 0;
  const id = props.id;

  if (!isNaN(max) && total >= max) {
    // When the max value is reached, disable the add button
    return (
      <>
        <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="primary">
          <Text size={1}>{`You reached the maximum of ${max} item${
            max > 1 ? 's' : ''
          }.`}</Text>
        </Card>
        {props.renderDefault({
          ...props,
          readOnly: true,
        })}
      </>
    );
  }

  return props.renderDefault({
    ...props,
  });
}

export default ArrayMaxRule;
