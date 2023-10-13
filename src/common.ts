export type ConnectionOptions = {
  port: number
  host: string
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

export const getConnectionArgs = (connectionOptions: ConnectionOptions): string[] => {
  const { port, host, database, username, password } = connectionOptions

  const connectionOptionsArray = [port, host, database, username, password]
  connectionOptionsArray.forEach((arg) => {
    if (arg === undefined) throw new Error('Connection options are missing')
  })

  if (host.startsWith('/')) {
    return [`--dbname=postgresql:///${database}?user=${username}&password=${password}&host=${host}&port=${port}`]
  }

  return [`--dbname=postgresql://${username}:${password}@${host}:${port}/${database}`]
}
