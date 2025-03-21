import type {SanityDocument, StringInputProps, StringSchemaType} from 'sanity';

import {LockIcon} from '@sanity/icons';
import {Box, Text, TextInput, Tooltip} from '@sanity/ui';
import get from 'lodash.get';
import {useFormValue} from 'sanity';

type Props = StringInputProps<StringSchemaType & {options?: {field?: string}}>;

function ProxyStringInput(props: Props) {
  const {schemaType} = props;

  const path = schemaType?.options?.field;
  const doc = useFormValue([]) as SanityDocument;

  const proxyValue = path ? (get(doc, path) as string) : '';

  return (
    <Tooltip
      content={
        <Box padding={2}>
          <Text muted size={1}>
            This value is set in Shopify (<code>{path}</code>)
          </Text>
        </Box>
      }
      portal
    >
      <TextInput iconRight={LockIcon} readOnly={true} value={proxyValue} />
    </Tooltip>
  );
}

export default ProxyStringInput;
