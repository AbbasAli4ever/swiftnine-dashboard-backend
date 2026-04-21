import 'dotenv/config';
import { Client } from 'pg';

type ParsedArgs = {
  email: string | null;
  id: string | null;
};

function parseArgs(argv: string[]): ParsedArgs {
  let email: string | null = null;
  let id: string | null = null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === '--email' && next) {
      email = next.trim().toLowerCase();
      index += 1;
      continue;
    }

    if (arg === '--id' && next) {
      id = next.trim();
      index += 1;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      printUsageAndExit(0);
    }
  }

  return { email, id };
}

function printUsageAndExit(exitCode: number): never {
  const output =
    exitCode === 0 ? console.log : console.error;

  output(
    [
      'Usage:',
      '  npm run user:soft-delete -- --email tester@example.com',
      '  npm run user:soft-delete -- --id 11111111-2222-3333-4444-555555555555',
      '',
      'Notes:',
      '  - This performs a soft delete by setting users.deleted_at.',
      '  - Refresh tokens are revoked so the user is signed out.',
      '  - Use either --email or --id.',
    ].join('\n'),
  );

  process.exit(exitCode);
}

async function main() {
  const { email, id } = parseArgs(process.argv.slice(2));

  if ((!email && !id) || (email && id)) {
    printUsageAndExit(1);
  }

  if (!process.env['DATABASE_URL']) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env['DATABASE_URL'],
  });

  try {
    await client.connect();

    const identifierColumn = email ? 'email' : 'id';
    const identifierValue = email ?? (id as string);

    const userResult = await client.query<{
      id: string;
      email: string;
      full_name: string;
      deleted_at: Date | null;
    }>(
      `
        SELECT id, email, full_name, deleted_at
        FROM users
        WHERE ${identifierColumn} = $1
        LIMIT 1
      `,
      [identifierValue],
    );

    const user = userResult.rows[0];

    if (!user) {
      console.error('User not found.');
      process.exit(1);
    }

    if (user.deleted_at) {
      console.log(
        `User is already soft deleted: ${user.email} (${user.id}) at ${user.deleted_at.toISOString()}`,
      );
      return;
    }

    const now = new Date();

    await client.query('BEGIN');
    await client.query('DELETE FROM refresh_tokens WHERE user_id = $1', [user.id]);
    await client.query(
      `
        UPDATE users
        SET deleted_at = $2,
            is_online = false,
            last_seen_at = $2,
            updated_at = $2
        WHERE id = $1
      `,
      [user.id, now],
    );
    await client.query('COMMIT');

    console.log(`Soft deleted user: ${user.full_name} <${user.email}> (${user.id})`);
  } catch (error: unknown) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // Ignore rollback failures after a failed transaction.
    }

    throw error;
  } finally {
    await client.end();
  }
}

void main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('Unknown error while soft deleting user.');
  }

  process.exit(1);
});
