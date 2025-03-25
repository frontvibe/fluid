import {getCliClient} from 'sanity/cli';
import fs from 'node:fs';

const client = getCliClient();
const {projectId} = client.config();
const pathname = `projects/${projectId}/tokens`;
const tokenName = 'Preview';

type TokenResponse = {
  key: string;
  label: string;
  roleName: string;
  projectUserId: string;
  createdAt: string;
  roles: {
    name: string;
    title: string;
  }[];
};

async function create() {
  const currentTokens = await client.request<TokenResponse[]>({
    uri: pathname,
    method: 'get',
  });

  if (
    currentTokens.length > 0 &&
    currentTokens.find((t) => t.label === tokenName)
  ) {
    // eslint-disable-next-line no-console
    console.log(
      'Token already exists. You will need to manually update the .env file to use it.',
    );
    return;
  }

  const {key: token} = await client.request<{key: string}>({
    uri: pathname,
    method: 'post',
    body: {
      label: tokenName,
      roleName: 'viewer',
    },
  });

  if (!token) {
    throw new Error('No token in response');
  }

  const envPath = `.env`;
  const env = fs.readFileSync(envPath, 'utf8');
  fs.writeFileSync(envPath, `${env}\nSANITY_STUDIO_TOKEN=${token}\n`);
}

create();
