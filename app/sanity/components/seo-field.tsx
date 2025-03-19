import type {StringFieldProps} from 'sanity';

import {Badge, Card, Flex, Text} from '@sanity/ui';

function SeoTitle(props: StringFieldProps) {
  const {children, title, description, value = ''} = props;
  const maxLength = 70;

  return (
    <Card>
      <Card paddingY={2}>
        <Text size={1} weight="semibold">
          {title}
        </Text>
      </Card>
      <Card paddingBottom={2} paddingTop={1}>
        <Text muted size={1}>
          {description}
        </Text>
      </Card>
      <Card>{children}</Card>
      <Flex justify={'flex-end'} paddingTop={1}>
        <Badge
          mode="outline"
          size={1}
          tone={value.length > maxLength ? 'critical' : 'primary'}
        >
          {value?.length} / {maxLength}
        </Badge>
      </Flex>
    </Card>
  );
}

export default SeoTitle;
