import {
  ArrayOfObjectsInputProps,
  PortableTextInput,
  type PortableTextInputProps,
} from 'sanity';
import {handlePaste} from './utils/handlePaste';

const CustomPortableTextInput = (inputProps: ArrayOfObjectsInputProps) => {
  return (
    <PortableTextInput
      {...(inputProps as unknown as PortableTextInputProps)}
      onPaste={handlePaste}
    />
  );
};

export default CustomPortableTextInput;
