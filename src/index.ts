import execa, { ExecaChildProcess } from 'execa'

export type ConnectionOptions = {
  port?: number;
  host: string;
  database: string;
  username: string;
  password: string;
};

export enum FormatEnum {
  Plain = 'plain',
  Custom = 'custom',
  Directory = 'directory',
  Tar = 'tar',
}

export type DumpOptionsType = {
  filePath: string;
  format?: FormatEnum;
};

export type RestoreOptionsType = {
  filePath: string;
  clean?: boolean;
  create?: boolean;
};

const getConnectionArgs = (connectionOptions: ConnectionOptions): string[] => {
  const { port = 5432, host, database, username, password } = connectionOptions

  if (password) {
    if (!(username && password && host && port && database)) {
      throw new Error(
        'When password is provided, username, password, host, port and dbname must be provided',
      )
    }

    return [ `--dbname=postgresql://${username}:${password}@${host}:${port}/${database}` ]
  }

  const argumentsMap: { [key: string]: string | number } = {
    host,
    port,
    dbname: database,
    username: username,
    password,
  }

  return Object.keys(argumentsMap).reduce(
    (result: string[], key: string): string[] => {
      if (argumentsMap[key]) result.push(`--${key}=${argumentsMap[key]}`)

      return result
    },
    [],
  )
}

export const pgDump = async (
  connectionOptions: ConnectionOptions,
  dumpOptions: DumpOptionsType,
): Promise<ExecaChildProcess> => {
  const { filePath, format = FormatEnum.Custom } = dumpOptions

  const args: string[] = getConnectionArgs(connectionOptions)

  if (filePath) args.push(`--file=${filePath}`)
  if (format) args.push(`--format=${format}`)

  return await execa('pg_dump', args, {})
}

export const pgRestore = async (
  connectionOptions: ConnectionOptions,
  restoreOptions: RestoreOptionsType,
): Promise<ExecaChildProcess> => {
  const { filePath, clean = false, create = false } = restoreOptions
  if (!filePath) throw new Error('Needs filePath in the options')

  const args: string[] = getConnectionArgs(connectionOptions)
  if (clean) args.push('--clean')
  if (create) args.push('--create')
  args.push(filePath)

  return execa('pg_restore', args, {})
}
