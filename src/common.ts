export enum SslModeEnum {
  Disable = 'disable',
  Allow = 'allow',
  Prefer = 'prefer',
  VerifyCa = 'verify-ca',
  VerifyFull = 'verify-full',
}

export type ConnectionOptions = {
  port: number
  host: string
  sslMode?: SslModeEnum
  database: string
  username: string
  password: string
}

export enum FormatEnum {
  Plain = 'plain',
  Custom = 'custom',
  Directory = 'directory',
  Tar = 'tar',
}

export const getConnectionArgs = (
  connectionOptions: ConnectionOptions,
): { connectionArgs: string[]; sslMode?: SslModeEnum } => {
  const { port, host, database, username, password, sslMode } = connectionOptions

  const connectionOptionsArray = [ port, host, database, username, password ]
  connectionOptionsArray.forEach((arg) => {
    if (arg === undefined) throw new Error('Connection options are missing')
  })

  // Add the ability to use unix socket for postgresql connection URI
  const encodedPass = encodeURIComponent(password)

  const connectionArgs = host.startsWith('/') ?
    [ `--dbname=postgresql:///${database}?user=${username}&password=${encodedPass}&host=${host}&port=${port}` ] :
    [ `--dbname=postgresql://${username}:${encodedPass}@${host}:${port}/${database}` ]

  return { sslMode, connectionArgs }
}
