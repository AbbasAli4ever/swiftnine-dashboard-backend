import 'dotenv/config';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { extname, join, basename } from 'node:path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

// Uploads every file in assets/ to the public assets S3 bucket (same bucket
// PublicAssetsS3Service uses) and writes a { bankKey: publicUrl } map —
// one-off script for the fixed set of bank logos, run manually, not part of
// the app's request-time upload flow (bank-accounts/logo-presign).

const ASSETS_DIR = join(__dirname, '..', 'assets');
const OUTPUT_FILE = join(ASSETS_DIR, 'bank-logo-urls.json');
const KEY_PREFIX = `${(process.env.PUBLIC_ASSETS_AWS_S3_PREFIX ?? 'accounts_dashboard_assets').replace(/^\/+|\/+$/g, '')}/bank-logos`;

const CONTENT_TYPES: Record<string, string> = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

async function main() {
  const bucket = requireEnv('PUBLIC_ASSETS_AWS_S3_BUCKET');
  const region = requireEnv('PUBLIC_ASSETS_AWS_REGION');

  const client = new S3Client({
    region,
    credentials: {
      accessKeyId: requireEnv('PUBLIC_ASSETS_AWS_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('PUBLIC_ASSETS_AWS_SECRET_ACCESS_KEY'),
    },
  });

  const files = readdirSync(ASSETS_DIR).filter((name) =>
    Object.keys(CONTENT_TYPES).includes(extname(name).toLowerCase()),
  );

  if (files.length === 0) {
    console.log(`No logo files found in ${ASSETS_DIR}`);
    return;
  }

  const urlsByBank: Record<string, string> = {};

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    const bankKey = basename(file, ext).toLowerCase();
    const key = `${KEY_PREFIX}/${bankKey}${ext}`;

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: readFileSync(join(ASSETS_DIR, file)),
        ContentType: CONTENT_TYPES[ext],
      }),
    );

    const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    urlsByBank[bankKey] = publicUrl;
    console.log(`Uploaded ${file} -> ${publicUrl}`);
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(urlsByBank, null, 2) + '\n');
  console.log(
    `\nWrote ${Object.keys(urlsByBank).length} entries to ${OUTPUT_FILE}`,
  );
}

void main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error('ERROR:', error.message);
  } else {
    console.error('Unknown error while uploading bank logos.');
  }
  process.exit(1);
});
