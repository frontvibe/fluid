import {vercelStegaSplit} from '@vercel/stega';

export default function CleanString({value}: {value?: null | string}) {
  if (!value) return null;

  const {cleaned, encoded} = vercelStegaSplit(value);

  return encoded ? (
    <>
      {cleaned}
      <span aria-hidden className="hidden">
        {encoded}
      </span>
    </>
  ) : (
    cleaned
  );
}
