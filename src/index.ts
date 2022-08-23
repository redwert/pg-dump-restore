import execa, { ExecaChildProcess } from 'execa'

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

export type DumpOptionsType = {
  filePath: string
  format?: FormatEnum
  dataOnly?: boolean
  blobs?: boolean
  noBlobs?: boolean
  clean?: boolean
  create?: boolean
  extensionPattern?: string
  encoding?: string
  jobs?: number
  schemaPattern?: string
  excludeSchemaPattern?: string
  tablePattern?: string
  excludeTablePattern?: string
  excludeTableDataPattern?: string
  noOwner?: boolean
  noReconnect?: boolean
  schemaOnly?: boolean
  verbose?: boolean
  noAcl?: boolean
  compress?: number
  binaryUpgrade?: boolean
  columnInserts?: boolean
  disableDollarQuoting?: boolean
  disableTriggers?: boolean
  enableRowSecurity?: boolean
  extraFloatDigits?: number
  ifExists?: boolean
  includeForeignData?: string
  inserts?: boolean
  loadViaPartitionRoot?: boolean
  lockWaitTimeout?: number
  noComments?: boolean
  noPublications?: boolean
  noSecurityLabels?: boolean
  noSubscriptions?: boolean
  noSync?: boolean
  noSynchronizedSnapshots?: boolean
  noTableSpaces?: boolean
  noToastCompression?: boolean
  noUnloggedTableData?: boolean
  onConflictDoNothing?: boolean
  quoteAllIdentifiers?: boolean
  rowsPerInsert?: number
  sectionName?: string
  serializableDeferrable?: boolean
  snapshotName?: string
  strictNames?: boolean
  useSetSessionAuthorization?: boolean
  roleName?: string
}

export type RestoreOptionsType = {
  filePath: string
  clean?: boolean
  create?: boolean
}

const getConnectionArgs = (connectionOptions: ConnectionOptions): string[] => {
  const { port, host, database, username, password } = connectionOptions

  const connectionOptionsArray = [ port, host, database, username, password ]
  connectionOptionsArray.forEach((arg) => {
    if (arg === undefined) throw new Error('Connection options are missing')
  })

  return [ `--dbname=postgresql://${username}:${password}@${host}:${port}/${database}` ]
}

export const pgDump = async (
  connectionOptions: ConnectionOptions,
  dumpOptions: DumpOptionsType,
): Promise<ExecaChildProcess> => {
  const args: string[] = getConnectionArgs(connectionOptions)

  const {
    filePath,
    format = FormatEnum.Custom,
    dataOnly = false,
    blobs = false,
    noBlobs = false,
    clean = false,
    create = false,
    extensionPattern,
    encoding,
    jobs,
    schemaPattern,
    excludeSchemaPattern,
    noOwner = false,
    noReconnect = false,
    schemaOnly = false,
    tablePattern,
    excludeTablePattern,
    verbose = false,
    noAcl = false,
    compress,
    binaryUpgrade = false,
    columnInserts = false,
    disableDollarQuoting = false,
    disableTriggers = false,
    enableRowSecurity = false,
    excludeTableDataPattern,
    extraFloatDigits,
    ifExists = false,
    includeForeignData,
    inserts = false,
    loadViaPartitionRoot = false,
    lockWaitTimeout,
    noComments = false,
    noPublications = false,
    noSecurityLabels = false,
    noSubscriptions = false,
    noSync = false,
    noSynchronizedSnapshots = false,
    noTableSpaces = false,
    noToastCompression = false,
    noUnloggedTableData = false,
    onConflictDoNothing = false,
    quoteAllIdentifiers = false,
    rowsPerInsert,
    sectionName,
    serializableDeferrable = false,
    snapshotName,
    strictNames = false,
    useSetSessionAuthorization = false,
    roleName
  } = dumpOptions

  args.push(`--file=${format}`)
  if (filePath) args.push(`--file=${filePath}`)
  if (extensionPattern) args.push(`--extension=${extensionPattern}`)
  if (encoding) args.push(`--encoding=${encoding}`)
  if (jobs) args.push(`--jobs=${jobs}`)
  if (schemaPattern) args.push(`--schema=${schemaPattern}`)
  if (excludeSchemaPattern) args.push(`--exclude-schema=${excludeSchemaPattern}`)
  if (tablePattern) args.push(`--table=${tablePattern}`)
  if (excludeTablePattern) args.push(`--exclude-table=${excludeTablePattern}`)
  if (compress !== undefined) args.push(`--compress=${compress}`)
  if (excludeTableDataPattern) args.push(`--exclude-table-data=${excludeTableDataPattern}`)
  if (extraFloatDigits !== undefined) args.push(`--extra-float-digits=${extraFloatDigits}`)
  if (includeForeignData) args.push(`--include-foreign-data=${includeForeignData}`)
  if (lockWaitTimeout) args.push(`--lock-wait-timeout=${lockWaitTimeout}`)
  if (rowsPerInsert !== undefined) args.push(`--rows-per-insert=${rowsPerInsert}`)
  if (sectionName) args.push(`--section=${sectionName}`)
  if (snapshotName) args.push(`--snapshot=${snapshotName}`)
  if (roleName) args.push(`--role=${roleName}`)

  const paramsMap: { [key: string]: boolean } = {
    'data-only': dataOnly,
    blobs,
    'no-blobs': noBlobs,
    clean,
    create,
    'no-owner': noOwner,
    'no-reconnect': noReconnect,
    'schema-only': schemaOnly,
    verbose,
    'no-acl': noAcl,
    'binary-upgrade': binaryUpgrade,
    'column-inserts': columnInserts,
    'disable-dollar-quoting': disableDollarQuoting,
    'disable-triggers': disableTriggers,
    'enable-row-security': enableRowSecurity,
    'if-exists': ifExists,
    inserts,
    'load-via-partition-root': loadViaPartitionRoot,
    'no-comments': noComments,
    'no-publications': noPublications,
    'no-security-labels': noSecurityLabels,
    'no-subscriptions': noSubscriptions,
    'no-sync': noSync,
    'no-synchronized-snapshots': noSynchronizedSnapshots,
    'no-tablespaces': noTableSpaces,
    'no-toast-compression': noToastCompression,
    'no-unlogged-table-data': noUnloggedTableData,
    'on-conflict-do-nothing': onConflictDoNothing,
    'quote-all-identifiers': quoteAllIdentifiers,
    'serializable-deferrable': serializableDeferrable,
    'strict-names': strictNames,
    'use-set-session-authorization': useSetSessionAuthorization,
  }

  Object.keys(paramsMap).forEach(key => {
    if (paramsMap[key]) args.push(`--${key}=${paramsMap[key]}`)
  })

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
