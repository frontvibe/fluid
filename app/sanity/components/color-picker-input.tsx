import type {FormEvent} from 'react';
import type {ObjectInputProps} from 'sanity';

import {Box, Card, Dialog, Flex, Text, TextInput} from '@sanity/ui';
import _ from 'lodash';
import {lazy, useCallback, useEffect, useMemo, useState} from 'react';
import {set} from 'sanity';

interface HSColor {
  /** The color */
  hue: number;
  /** Saturation of the color */
  saturation: number;
}
interface HSBColor extends HSColor {
  /** Brightness of the color */
  brightness: number;
}

const hexaRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;

const ColorPicker = lazy(() =>
  import('@shopify/polaris').then((module) => ({default: module.ColorPicker})),
);

function useColorUtils() {
  const [utils, setUtils] = useState<any>(null);

  useEffect(() => {
    import('@shopify/polaris').then((module) => {
      setUtils({
        hexToRgb: module.hexToRgb,
        hsbToRgb: module.hsbToRgb,
        rgbToHex: module.rgbToHex,
        rgbToHsb: module.rgbToHsb,
      });
    });
  }, []);

  return utils;
}

interface ColorType {
  hex: string;
  hsl: {
    h: number;
    l: number;
    s: number;
  };
  rgb: {
    b: number;
    g: number;
    r: number;
  };
}

function isColorType(value: unknown): value is ColorType {
  if (!value || typeof value !== 'object') return false;
  const color = value as ColorType;

  return (
    typeof color.hex === 'string' &&
    hexaRegex.test(color.hex) &&
    typeof color.hsl?.h === 'number' &&
    typeof color.hsl?.s === 'number' &&
    typeof color.hsl?.l === 'number' &&
    typeof color.rgb?.r === 'number' &&
    typeof color.rgb?.g === 'number' &&
    typeof color.rgb?.b === 'number'
  );
}

const debounce = _.debounce;

function parseColorPickerValue(value: unknown): boolean {
  return isColorType(value);
}

export function ColorPickerInput(props: ObjectInputProps) {
  const {onChange, value} = props;
  const [isDialogOpen, setDialogOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setDialogOpen(!isDialogOpen);
  }, [setDialogOpen, isDialogOpen]);

  return !value || parseColorPickerValue(value) ? (
    <>
      <Flex align="center" gap={3}>
        <div
          onClick={toggleDialog}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleDialog();
            }
          }}
          tabIndex={0}
          role="button"
          style={{
            cursor: 'pointer',
            border: '1px solid',
            borderColor: 'var(--card-border-color)',
            height: '2.5rem',
            width: '2.5rem',
            borderRadius: '9999px',
            overflow: 'hidden',
            backgroundColor: props.value?.hex || 'transparent',
            backgroundImage: props.value?.hex
              ? 'none'
              : "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAvSURBVHgBrY2xDQAwDMJIj+H/d+CZtCNbhsYbyJJLUiMgmRMHA/9C9SMP28uJUbg7LQqVKef1WwAAAABJRU5ErkJggg==')",
          }}
        />
        <Text
          style={{
            textTransform: props.value?.hex ? 'uppercase' : 'none',
          }}
        >
          {props.value?.hex || 'Choose a color'}
        </Text>
      </Flex>
      {isDialogOpen && (
        <ColorPickerDialog
          onChange={onChange}
          toggleDialog={toggleDialog}
          value={value}
        />
      )}
    </>
  ) : (
    <Flex>
      <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="critical">
        <Text align="center" size={[2, 2, 3]}>
          Invalid initial value
        </Text>
      </Card>
    </Flex>
  );
}

function ColorPickerDialog(props: {
  onChange: ObjectInputProps['onChange'];
  toggleDialog: () => void;
  value: ObjectInputProps['value'];
}) {
  const {toggleDialog, onChange, value} = props;
  const colorUtils = useColorUtils();
  const [color, setColor] = useState<HSBColor>({
    hue: typeof value?.hsl.h === 'undefined' ? 0 : value?.hsl.h,
    brightness: typeof value?.hsl.l === 'undefined' ? 1 : value?.hsl.l,
    saturation: typeof value?.hsl.s === 'undefined' ? 0 : value?.hsl.s,
  });

  const [hexInputValue, setHexInputValue] = useState<string>('');

  useEffect(() => {
    if (colorUtils) {
      setHexInputValue(colorUtils.rgbToHex(colorUtils.hsbToRgb(color)));
    }
  }, [colorUtils, color]);

  const emitSetColor = useCallback(
    (nextColor: HSBColor) => {
      if (!colorUtils) return;
      const rgb = colorUtils.hsbToRgb(nextColor);
      const hex = colorUtils.rgbToHex(rgb);

      onChange(
        set({
          hex,
          hsl: {
            h: nextColor.hue,
            s: nextColor.saturation,
            l: nextColor.brightness,
          },
          rgb: {
            r: rgb.red,
            g: rgb.green,
            b: rgb.blue,
          },
        }),
      );
    },
    [onChange, colorUtils],
  );

  // Debounce the onChange event for 100ms
  const debouncedColorChange = useMemo(
    () => debounce(emitSetColor, 100),
    [emitSetColor],
  );

  const handleColorPickerChange = useCallback(
    (newColor: HSBColor) => {
      if (!colorUtils) return;
      const rgb = colorUtils.hsbToRgb(newColor);
      const hex = colorUtils.rgbToHex(rgb);

      setHexInputValue(hex);
      setColor(newColor);
      debouncedColorChange(newColor);
    },
    [colorUtils, debouncedColorChange],
  );

  return (
    <Dialog
      header="Pick a color"
      id="dialog-color"
      onClose={toggleDialog}
      width={1}
      zOffset={1000}
    >
      <Box padding={4}>
        <Flex align="center" justify="center">
          <div>
            <ColorPicker
              color={color}
              fullWidth
              onChange={handleColorPickerChange}
            />
            <HexInput
              color={color}
              hexInputValue={hexInputValue}
              onChange={onChange}
              setColor={setColor}
              setHexInputValue={setHexInputValue}
              value={value}
            />
          </div>
        </Flex>
      </Box>
    </Dialog>
  );
}

function HexInput(props: {
  color: HSBColor;
  hexInputValue: string;
  onChange: ObjectInputProps['onChange'];
  setColor: (value: HSBColor) => void;
  setHexInputValue: (value: string) => void;
  value: ObjectInputProps['value'];
}) {
  const {value, color, onChange, hexInputValue, setHexInputValue, setColor} =
    props;
  const colorUtils = useColorUtils();
  const [validity, setValidity] = useState<string | undefined>(undefined);

  const validateHex = useCallback(
    (value: string) => {
      if (!colorUtils) return false;
      if (hexaRegex.test(value)) {
        setValidity(undefined);
        const rgb = colorUtils.hexToRgb(value);
        const hsb = colorUtils.rgbToHsb(rgb);

        onChange(
          set({
            hex: value,
            hsl: {
              h: hsb.hue,
              s: hsb.saturation,
              l: hsb.brightness,
            },
            rgb: {
              r: rgb.red,
              g: rgb.green,
              b: rgb.blue,
            },
          }),
        );

        setColor({
          hue: hsb.hue,
          saturation: hsb.saturation,
          brightness: hsb.brightness,
        });

        return true;
      }

      setValidity('Invalid hexadecimal value');
      return false;
    },
    [onChange, setColor, colorUtils],
  );

  const handleHexInputChange = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      setHexInputValue(e.currentTarget.value);
      validateHex(e.currentTarget.value);
    },
    [setHexInputValue, validateHex],
  );

  const backgroundColor = useMemo(() => {
    if (!colorUtils) return 'transparent';
    return colorUtils.rgbToHex(colorUtils.hsbToRgb(color));
  }, [colorUtils, color]);

  return (
    <Flex align="center" gap={3} paddingTop={2}>
      <div
        style={{
          backgroundColor,
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '5px',
          border: '1px solid',
          borderColor: 'var(--card-border-color)',
        }}
      />
      <TextInput
        customValidity={validity}
        onChange={(e) => handleHexInputChange(e)}
        style={{
          textTransform: 'uppercase',
        }}
        value={hexInputValue}
      />
    </Flex>
  );
}
