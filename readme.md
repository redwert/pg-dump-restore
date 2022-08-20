# pg-dump-restore

Utility that gives ability to call pg_dump and pg_restore from nodejs.

## Usage

```typescript
import { pgDump, pgRestore } from "pg-dump-restore";

async function main() {
  const { stdout, stderr } = await pgDump(
    {
      port, // defaults to 5432
      host,
      database,
      username,
      password,
    },
    {
      file: "./dump.sql",
      format, // defaults to 'custom'
    },
  ); // outputs an execa object

  const { stdout, stderr } = await pgRestore(
    {
      port, // defaults to 5432
      host,
      database,
      username,
      password,
    },
    {
      filename: "./dump.sql", // note the filename instead of file, following the pg_restore naming.
      clean, // defaults to false
      create, // defaults to false
    }
  ); // outputs an execa object
}
```

Please see the [pg_dump](https://www.postgresql.org/docs/14/app-pgdump.html)
and [pg_restore](https://www.postgresql.org/docs/14/app-pgrestore.html) documentation for details on the arguments
and [execa](https://github.com/sindresorhus/execa) for details on the output streams.

## To publish to GHCR

Add this to `package.json`

```json
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

and add a `.npmrc` to the root of the repo with

```.npmrc
//npm.pkg.github.com/:_authToken=AUTH_TOKEN
```

Where `AUTH_TOKEN` is replaced with a GitHub token.
