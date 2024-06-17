import {TypedObject} from 'sanity';
import {htmlToBlocks} from '@sanity/block-tools';
import {type PasteData, type OnPasteFn} from '@sanity/portable-text-editor';
import {cleanWordPaste} from './cleanWordPaste';
import plainTextToHtml from './plainTextToHtml';

export const handlePaste: OnPasteFn = (input) => {
  const {value, event, path, schemaTypes} = input as PasteData;

  const transfer = event.clipboardData;

  // detect what types are available
  const types = transfer.types;

  // handle Portable Text paste
  if (types.includes('application/x-portable-text')) {
    const pText = event.clipboardData.getData('application/x-portable-text');
    const parsed = JSON.parse(pText) as TypedObject[];
    return Promise.resolve({
      insert: parsed,
    });
  }

  // handle HTML or Word paste
  if (types.includes('text/html')) {
    const html = event.clipboardData.getData('text/html');

    const cleaned = cleanWordPaste(html);
    // remove head and script tags and whatever makes word paste text as an image
    const blockContentType = schemaTypes.portableText;
    let blocks = htmlToBlocks(cleaned, blockContentType) as TypedObject[];

    return Promise.resolve({
      insert: blocks,
      path,
    });
  }
  // handle plain text paste
  if (types.includes('text/plain')) {
    const plainText = event.clipboardData.getData('text/plain');
    const plainToHtml = plainTextToHtml(plainText);
    const blocks = htmlToBlocks(
      plainToHtml,
      schemaTypes.portableText,
    ) as TypedObject[];
    return Promise.resolve({
      insert: blocks,
      path,
    });
  }
  return undefined;
};
