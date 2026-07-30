import 'dotenv/config';
import { Client } from 'pg';
import * as bcrypt from 'bcrypt';
import { randomBytes, randomUUID } from 'node:crypto';
import * as readline from 'node:readline';

const SALT_ROUNDS = 10;
const MIN_SECRET_LENGTH = 12;
const GENERATED_SECRET_BYTES = 24;

type ParsedArgs = {
  label: string | null;
  secret: string | null;
  revoke: boolean;
  list: boolean;
  generate: boolean;
};

/** URL-safe random secret. 24 bytes ≈ 192 bits of entropy. */
function generateSecret(): string {
  return randomBytes(GENERATED_SECRET_BYTES).toString('base64url');
}

/**
 * Reads a secret from the terminal without echoing it, so it never lands in
 * shell history or the process list (both of which `--secret` exposes).
 */
function promptForSecret(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = process.stdin;
    if (!input.isTTY) {
      reject(new Error('No TTY available — pass --secret or --generate instead.'));
      return;
    }

    const rl = readline.createInterface({ input, output: process.stdout, terminal: true });
    process.stdout.write('Enter secret (input hidden): ');

    // Suppress echo while the user types.
    const onData = () => readline.clearLine(process.stdout, 0);
    input.on('data', onData);

    rl.question('', (answer) => {
      input.off('data', onData);
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });
}

function parseArgs(argv: string[]): ParsedArgs {
  let label: string | null = null;
  let secret: string | null = null;
  let revoke = false;
  let list = false;
  let generate = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === '--label' && next) {
      label = next.trim();
      index += 1;
      continue;
    }

    if (arg === '--secret' && next) {
      secret = next;
      index += 1;
      continue;
    }

    if (arg === '--revoke') {
      revoke = true;
      continue;
    }

    if (arg === '--list') {
      list = true;
      continue;
    }

    if (arg === '--generate') {
      generate = true;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      printUsageAndExit(0);
    }
  }

  return { label, secret, revoke, list, generate };
}

function printUsageAndExit(exitCode: number): never {
  const output = exitCode === 0 ? console.log : console.error;

  output(
    [
      'Manage the AI tier-change secret.',
      '',
      'Usage:',
      '  npm run tier:secret -- --label office-admin --generate      (recommended)',
      '  npm run tier:secret -- --label office-admin                 (prompts, input hidden)',
      "  npm run tier:secret -- --label office-admin --secret 'my-secret'",
      '  npm run tier:secret -- --label office-admin --revoke',
      '  npm run tier:secret -- --list',
      '',
      'Notes:',
      '  - The secret is stored bcrypt-hashed and cannot be read back.',
      `  - Minimum length is ${MIN_SECRET_LENGTH} characters.`,
      '  - Re-running with an existing label rotates that secret.',
      '  - Prefer --generate or the hidden prompt: --secret puts the value in',
      '    your shell history and in the process list.',
    ].join('\n'),
  );

  process.exit(exitCode);
}

async function main(): Promise<void> {
  const { label, secret, revoke, list, generate } = parseArgs(process.argv.slice(2));

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    if (list) {
      const { rows } = await client.query(
        `SELECT label, revoked_at, created_at, updated_at
           FROM tier_change_secrets
          ORDER BY created_at`,
      );
      if (rows.length === 0) {
        console.log('No tier-change secrets configured.');
      } else {
        console.table(
          rows.map((row) => ({
            label: row.label,
            status: row.revoked_at ? 'revoked' : 'active',
            created: row.created_at,
            updated: row.updated_at,
          })),
        );
      }
      return;
    }

    if (!label) {
      console.error('--label is required.');
      printUsageAndExit(1);
    }

    if (revoke) {
      const { rowCount } = await client.query(
        `UPDATE tier_change_secrets
            SET revoked_at = NOW(), updated_at = NOW()
          WHERE label = $1 AND revoked_at IS NULL`,
        [label],
      );
      console.log(
        rowCount
          ? `Revoked secret "${label}".`
          : `No active secret found with label "${label}".`,
      );
      return;
    }

    // Resolve the secret: explicit flag, generated, or hidden prompt.
    let resolvedSecret: string;
    if (generate) {
      resolvedSecret = generateSecret();
    } else if (secret) {
      resolvedSecret = secret;
    } else {
      resolvedSecret = (await promptForSecret()).trim();
    }

    if (resolvedSecret.length < MIN_SECRET_LENGTH) {
      console.error(
        `Secret must be at least ${MIN_SECRET_LENGTH} characters (got ${resolvedSecret.length}).`,
      );
      process.exit(1);
    }

    const secretHash = await bcrypt.hash(resolvedSecret, SALT_ROUNDS);

    // Upsert: re-running with the same label rotates the secret and clears
    // any prior revocation.
    await client.query(
      `INSERT INTO tier_change_secrets (id, label, secret_hash, created_at, updated_at)
            VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (label)
       DO UPDATE SET secret_hash = EXCLUDED.secret_hash,
                     revoked_at = NULL,
                     updated_at = NOW()`,
      [randomUUID(), label, secretHash],
    );

    console.log(`Secret "${label}" is set and active.`);

    if (generate) {
      console.log('');
      console.log('  Generated secret (shown once — copy it now):');
      console.log(`  ${resolvedSecret}`);
      console.log('');
    }

    console.log('Store it in your password manager — it cannot be recovered from the database.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
