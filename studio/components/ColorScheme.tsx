import {Flex, Text} from '@sanity/ui'

export function ColorSchemeMedia({
  text,
  background,
}: {
  text?: {hex: string}
  background?: {hex: string}
}) {
  return background?.hex && text?.hex ? (
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
            color: text?.hex,
          }}
          weight="bold"
        >
          Aa
        </Text>
        <Flex gap={1} align="center">
          <Pill hex={text?.hex} full={true} />
          <Pill hex={text?.hex} full={false} />
        </Flex>
      </Flex>
    </Flex>
  ) : null
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
  )
}
