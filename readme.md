# pg-dump-restore

Utility that gives ability to call pg_dump and pg_restore from nodejs with all parameters.
Please see the [pg_dump](https://www.postgresql.org/docs/14/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/14/app-pgrestore.html) documentation for details on the arguments.
[execa](https://github.com/sindresorhus/execa) for details on the output streams.
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
}
```
```typescript
import { pgDump, pgRestore } from "pg-dump-restore";

async function main() {
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
### Command excludeTableDataPattern

The `excludeTableDataPattern` command allows excluding data from one or more tables during an operation. It can receive an array of names or patterns to specify the tables to be excluded. This option is useful when you only need the definition of a particular table but do not require the data it contains.

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
      excludeTableDataPattern: ["table1", "table2"]
    },
  ); // outputs an execa object
}
```
