/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md. or https://github.com/ckeditor/ckeditor5-clipboard/blob/587c2aac8fe42c4a062db9c69de2b7222f6b693b/LICENSE.md
 *
 * @license MPL-2.0; see https://www.mozilla.org/en-US/MPL/2.0/
 */

/**
 * Converts plain text to its HTML-ized version.
 *
 * @param {String} text The plain text to convert.
 * @returns {String} HTML generated from the plain text.
 */
export default function plainTextToHtml(text: string): string {
  text = text
    // Encode <>.
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Creates paragraphs for double line breaks and change single line breaks to spaces.
    // In the future single line breaks may be converted into <br>s.
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, ' ')
    // Preserve trailing spaces (only the first and last one – the rest is handled below).
    .replace(/^\s/, '&nbsp;')
    .replace(/\s$/, '&nbsp;')
    // Preserve other subsequent spaces now.
    .replace(/\s\s/g, ' &nbsp;');

  if (text.indexOf('</p><p>') > -1) {
    // If we created paragraphs above, add the trailing ones.
    text = `<p>${text}</p>`;
  }

  return text;
}
