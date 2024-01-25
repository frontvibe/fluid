import {getCliClient} from 'sanity/cli';
import {SINGLETONS} from '../structure/singletons';
import fs from 'fs';

/**
 * This script will create one or many "singleton" documents for each language
 * It works by appending the language ID to the document ID
 * and creating the translations.metadata document
 *
 * 1. Take a backup of your dataset with:
 * `npx sanity@latest dataset export`
 *
 * 2. Copy this file to the root of your Sanity Studio project
 *
 * 3. Update the SINGLETONS and LANGUAGES constants to your needs
 *
 * 4. Run the script (replace <schema-type> with the name of your schema type):
 * npx sanity@latest exec ./createSingletons.ts --with-user-token
 *
 * 5. Update your desk structure to use the new documents
 */

const FLAG_FILE_PATH = './scripts/flag.txt';

// Check if the flag file exists
if (fs.existsSync(FLAG_FILE_PATH)) {
  console.log('✔ Singletons already created. Exiting...');
  process.exit(0);
}

// Create the flag file to indicate that the script has run
fs.writeFileSync(FLAG_FILE_PATH, 'Singletons created: true');

// This will use the client configured in ./sanity.cli.ts
const client = getCliClient();

async function createSingletons() {
  const singletonsArray = Object.values(SINGLETONS);

  const documents = singletonsArray
    .map((singleton) => {
      return [
        {
          _id: `${singleton.id}`,
          _type: singleton._type,
          ...singleton.initialValue,
        },
      ];
    })
    .flat();

  const transaction = client.transaction();

  documents.forEach((doc: any) => {
    transaction.createIfNotExists(doc);
  });

  await transaction
    .commit()
    .then((res) => {
      // eslint-disable-next-line no-console
      console.log('✔ Singletons created or updated successfully!');
    })
    .catch((err) => {
      console.error(err);
    });
}

createSingletons();
