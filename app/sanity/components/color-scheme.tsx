import {Flex, Text} from '@sanity/ui';

function ColorSchemeMedia({
  foreground,
  background,
}: {
  background?: {hex: string};
  foreground?: {hex: string};
}) {
  return background?.hex && foreground?.hex ? (
    <Flex
      align={'center'}
      justify={'center'}
      style={{
        width: '3rem',
        height: '3rem',
        backgroundColor: background?.hex,
      }}
    >
      <Flex direction="column" gap={2}>
        <Text
          align={'center'}
          style={{
            color: foreground?.hex,
          }}
          weight="bold"
        >
          Aa
        </Text>
        <Flex align="center" gap={1}>
          <Pill full={true} hex={foreground?.hex} />
          <Pill full={false} hex={foreground?.hex} />
        </Flex>
      </Flex>
    </Flex>
  ) : null;
}

function Pill({full, hex}: {full?: boolean; hex: string}) {
  return (
    <div
      style={{
        width: '.68rem',
        height: '.35rem',
        borderRadius: '5px',
        backgroundColor: full ? hex : 'none',
        border: '1.5px solid',
        borderColor: hex,
      }}
    ></div>
  );
}

export default ColorSchemeMedia;
