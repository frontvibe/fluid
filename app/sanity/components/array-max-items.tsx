import type {
  ArrayInputFunctionsProps,
  ArrayOfPrimitivesInputProps,
} from 'sanity';

import React from 'react';
import {ArrayOfPrimitivesFunctions} from 'sanity';

function ArrayFunctions(props: ArrayInputFunctionsProps<any, any>) {
  const valRules = props?.schemaType?.validation?.[0]?._rules || [];
  const max = valRules.find((r: any) => r.flag === 'max')?.constraint;
  const total = props?.value?.length || 0;

  if (!isNaN(max) && total >= max) {
    return null;
  }

  return <ArrayOfPrimitivesFunctions {...props} />;
}

const ArrayMaxItems: React.FC<ArrayOfPrimitivesInputProps> = (
  props: ArrayOfPrimitivesInputProps,
) => {
  return props.renderDefault({...props, arrayFunctions: ArrayFunctions});
};

export default ArrayMaxItems;
