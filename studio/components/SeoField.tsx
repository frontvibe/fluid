import {Badge, Card, Flex, Text} from '@sanity/ui';

import {StringFieldProps} from 'sanity';

export const SeoTitle = (props: StringFieldProps) => {
  const {children, title, description, value = ''} = props;
  const maxLength = 70;

  return (
    <Card>
      <Card paddingY={2}>
        <Text size={1} weight="semibold">
          {title}
        </Text>
      </Card>
      <Card paddingTop={1} paddingBottom={2}>
        <Text size={1} muted>
          {description}
        </Text>
      </Card>
      <Card>{children}</Card>
      <Flex paddingTop={1} justify={'flex-end'}>
        <Badge
          mode="outline"
          tone={value.length > maxLength ? 'critical' : 'primary'}
          size={1}
        >
          {value?.length} / {maxLength}
        </Badge>
      </Flex>
    </Card>
  );
};
