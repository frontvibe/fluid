import type {MouseEventHandler} from 'react';
import {
  ArrayOfPrimitivesFunctions,
  type ArrayOfObjectsInputProps,
  type BooleanSchemaType,
  type FileSchemaType,
  type NumberSchemaType,
  type ObjectSchemaType,
  type ReferenceSchemaType,
  type StringSchemaType,
} from 'sanity';

import {useCallback, useState} from 'react';
import {Stack, Button, Dialog, Box, Card, Heading, Flex} from '@sanity/ui';
import {AddIcon} from '@sanity/icons';
import {randomKey} from '@sanity/util/content';

type Schema =
  | BooleanSchemaType
  | FileSchemaType
  | NumberSchemaType
  | ObjectSchemaType
  | StringSchemaType
  | ReferenceSchemaType;

const SectionsListInput = (
  props: ArrayOfObjectsInputProps & {
    type?: 'section' | 'footer';
  },
) => {
  const {onInsert} = props;
  const [open, setOpen] = useState(false);
  const onClose = useCallback(() => setOpen(false), []);
  const onOpen = useCallback(() => setOpen(true), []);
  const type = props.type || 'section';

  const onSelectItem = useCallback((schema: Schema) => {
    const key = randomKey(12);
    onInsert({
      items: [
        {
          _type: schema.name,
          _key: key,
        } as any,
      ],
      position: 'after',
      referenceItem: -1,
      open: true,
    });
    onClose();
  }, []);

  return (
    <>
      <Stack space={3}>
        {props.renderDefault({
          ...props,
          arrayFunctions: (props: any) => {
            return <ArrayFunctions type={type} onOpen={onOpen} {...props} />;
          },
        })}
      </Stack>

      {open && (
        <Dialog
          header={`Select a ${type}`}
          id="dialog-sections"
          width={4}
          onClose={onClose}
          zOffset={1000}
        >
          <Box padding={1}>
            <Flex wrap={'wrap'} gap={[3]} padding={4} justify={'center'}>
              {props.schemaType.of.map((schema, index) => {
                return (
                  <PreviewCard
                    key={index}
                    schema={schema}
                    onClick={() => onSelectItem(schema)}
                  />
                );
              })}
            </Flex>
          </Box>
        </Dialog>
      )}
    </>
  );
};

function ArrayFunctions(props: any) {
  const valRules = props?.schemaType?.validation?.[0]?._rules || [];
  const max = valRules.find((r: any) => r.flag === 'max')?.constraint;
  const total = props?.value?.length || 0;

  if (!isNaN(max) && total >= max) {
    return null;
  }

  return (
    <Button
      onClick={props.onOpen}
      icon={AddIcon}
      mode="ghost"
      text={`Add ${props.type}`}
    />
  );
}

type PreviewProps = {
  onClick: MouseEventHandler<HTMLDivElement> | undefined;
  schema: Schema;
};

function PreviewCard(props: PreviewProps) {
  const {onClick, schema} = props;

  return (
    <Card
      role="button"
      shadow={1}
      padding={3}
      onClick={onClick}
      style={{cursor: 'pointer'}}
    >
      <Stack padding={2} space={[3]}>
        <Heading as="h5" size={1}>
          {schema.title}
        </Heading>
        <div
          style={{
            height: '125px',
          }}
        >
          <img
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            src={`/static/assets/${schema.name}.jpg`}
            alt={schema.title}
            onError={(i: any) => (i.target.style.display = 'none')}
          />
        </div>
      </Stack>
    </Card>
  );
}

export default SectionsListInput;
