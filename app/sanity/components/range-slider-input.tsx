import type {ChangeEvent, CSSProperties} from 'react';
import type {NumberInputProps} from 'sanity';

import {Flex, TextInput, useTheme} from '@sanity/ui';
import _ from 'lodash';
import React, {lazy, useCallback, useMemo, useState} from 'react';
import {set} from 'sanity';

const debounce = _.debounce;

const RangeSlider = lazy(() =>
  import('@shopify/polaris').then((module) => ({default: module.RangeSlider})),
);

type RangeSliderInputProps = NumberInputProps & {
  schemaType: {
    options?: {
      max?: number;
      min?: number;
      step?: number;
      suffix?: string;
    };
  };
};

export function RangeSliderInput(
  props: RangeSliderInputProps,
): React.JSX.Element {
  const {schemaType, value, onChange} = props;
  const {options} = schemaType;
  const suffix = options?.suffix;
  const min = options?.min;
  const max = options?.max;
  const step = options?.step || 1;
  const [rangeValue, setRangeValue] = useState(value || 0);

  const emitSetValue = useCallback(
    (nextValue: number) => {
      onChange(set(nextValue));
    },
    [onChange],
  );

  const debouncedSliderChange = useMemo(
    () => debounce(emitSetValue, 100),
    [emitSetValue],
  );

  const handleRangeSliderChange = useCallback(
    (sliderValue: number) => {
      setRangeValue(sliderValue);
      debouncedSliderChange(sliderValue);
    },
    [debouncedSliderChange, setRangeValue],
  );
  const {sanity: sanityTheme} = useTheme();

  return (
    <Flex
      align={'center'}
      gap={4}
      style={
        {
          '--p-color-bg-fill-brand': sanityTheme.color.dark
            ? sanityTheme.color.base.focusRing
            : sanityTheme.color.base.fg,
          '--p-color-bg-surface': sanityTheme.color.dark
            ? sanityTheme.color.base.border
            : '#fff',
          '--p-color-border': sanityTheme.color.base.border,
        } as CSSProperties
      }
    >
      <div
        style={{
          flex: '1',
        }}
      >
        <RangeSlider
          label="Slider"
          labelHidden
          max={max || 100}
          min={min || 0}
          onChange={handleRangeSliderChange}
          output
          step={step}
          value={rangeValue}
        />
      </div>
      <NumberInput
        max={max}
        min={min}
        onChange={onChange}
        setValue={setRangeValue}
        step={step}
        suffix={suffix || ''}
        value={rangeValue}
      />
    </Flex>
  );
}

function NumberInput(props: {
  max?: number;
  min?: number;
  onChange: RangeSliderInputProps['onChange'];
  setValue: (value: number) => void;
  step: number;
  suffix?: string;
  value: number;
}) {
  const {suffix, min, max, value, setValue, onChange, step} = props;

  const emitSetValue = useCallback(
    (nextValue: number) => onChange(set(nextValue)),
    [onChange],
  );

  const debouncedInputChange = useMemo(
    () => debounce(emitSetValue, 100),
    [emitSetValue],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.currentTarget.value ? parseFloat(e.currentTarget.value) : 0);
      debouncedInputChange(
        e.currentTarget.value ? parseFloat(e.currentTarget.value) : 0,
      );
    },
    [setValue, debouncedInputChange],
  );

  return (
    <TextInput
      iconRight={<p>{suffix}</p>}
      max={max}
      min={min}
      onChange={handleInputChange}
      step={step}
      style={{
        maxWidth: '8rem',
      }}
      type="number"
      value={value}
    />
  );
}

NumberInput.defaultProps = {
  suffix: '',
  min: 0,
  max: 100,
};
