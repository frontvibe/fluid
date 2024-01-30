import {
  StringInputProps,
  useFormValue,
  SanityDocument,
  StringSchemaType,
} from 'sanity';
import get from 'lodash.get';

type Props = StringInputProps<StringSchemaType & {options?: {field?: string}}>;

export const PlaceholderStringInput = (props: Props) => {
  const {schemaType} = props;

  const path = schemaType?.options?.field;
  const doc = useFormValue([]) as SanityDocument;

  const proxyValue = path ? (get(doc, path) as string) : '';

  return props.renderDefault({
    ...props,
    elementProps: {...props.elementProps, placeholder: proxyValue},
  });
};
