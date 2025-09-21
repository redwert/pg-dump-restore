import { ConnectionOptions, getConnectionArgs, FormatEnum, SslModeEnum } from './common'
import execa, { ExecaChildProcess } from 'execa'

export type DumpOptionsType = {
  filePath: string
  format?: FormatEnum
  dataOnly?: boolean
  blobs?: boolean
  version?: boolean
  noBlobs?: boolean
  clean?: boolean
  create?: boolean
  extensionPattern?: string[]
  encoding?: string
  jobs?: number
  schemaPattern?: string[]
  excludeSchemaPattern?: string[]
  tablePattern?: string[]
  excludeTablePattern?: string[]
  excludeTableDataPattern?: string[]
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
  sectionName?: string[]
  serializableDeferrable?: boolean
  snapshotName?: string
  strictNames?: boolean
  useSetSessionAuthorization?: boolean
  roleName?: string
  noPrivileges?: boolean
}

export const pgDump = async (
  connectionOptions: ConnectionOptions,
  dumpOptions: DumpOptionsType,
): Promise<ExecaChildProcess> => {
  const os = process.platform
  const { connectionArgs, sslMode } = getConnectionArgs(connectionOptions)

  const {
    filePath,
    format = FormatEnum.Custom,
    dataOnly,
    blobs,
    noBlobs,
    clean,
    create,
    extensionPattern = [],
    encoding,
    jobs,
    schemaPattern = [],
    excludeSchemaPattern = [],
    noOwner,
    noReconnect,
    schemaOnly,
    tablePattern = [],
    excludeTablePattern = [],
    verbose,
    noAcl,
    compress,
    binaryUpgrade,
    columnInserts,
    disableDollarQuoting,
    disableTriggers,
    enableRowSecurity,
    excludeTableDataPattern = [],
    extraFloatDigits,
    ifExists,
    includeForeignData,
    inserts,
    loadViaPartitionRoot,
    lockWaitTimeout,
    noComments,
    noPublications,
    noSecurityLabels,
    noSubscriptions,
    noSync,
    noSynchronizedSnapshots,
    noTableSpaces,
    noToastCompression,
    noUnloggedTableData,
    onConflictDoNothing,
    quoteAllIdentifiers,
    rowsPerInsert,
    sectionName = [],
    serializableDeferrable,
    snapshotName,
    strictNames,
    useSetSessionAuthorization,
    roleName,
    version,
    noPrivileges,
  } = dumpOptions

  connectionArgs.push(`--format=${format}`)
  if (filePath) connectionArgs.push(`--file=${filePath}`)
  connectionArgs.push(...extensionPattern.map((item) => `--extension=${item}`))
  if (encoding) connectionArgs.push(`--encoding=${encoding}`)
  if (jobs) connectionArgs.push(`--jobs=${jobs}`)
  connectionArgs.push(...schemaPattern.map((item) => `--schema=${item}`))
  connectionArgs.push(...excludeSchemaPattern.map((item) => `--exclude-schema=${item}`))
  connectionArgs.push(...tablePattern.map((item) => `--table=${item}`))
  connectionArgs.push(...excludeTablePattern.map((item) => `--exclude-table=${item}`))
  if (compress !== undefined) connectionArgs.push(`--compress=${compress}`)
  connectionArgs.push(...excludeTableDataPattern.map((item) => `--exclude-table-data=${item}`))
  if (extraFloatDigits !== undefined) connectionArgs.push(`--extra-float-digits=${extraFloatDigits}`)
  if (includeForeignData) connectionArgs.push(`--include-foreign-data=${includeForeignData}`)
  if (lockWaitTimeout) connectionArgs.push(`--lock-wait-timeout=${lockWaitTimeout}`)
  if (rowsPerInsert !== undefined) connectionArgs.push(`--rows-per-insert=${rowsPerInsert}`)
  connectionArgs.push(...sectionName.map((item) => `--section=${item}`))
  if (snapshotName) connectionArgs.push(`--snapshot=${snapshotName}`)
  if (roleName) connectionArgs.push(`--role=${roleName}`)

  const paramsMap: { [key: string]: boolean | undefined } = {
    blobs,
    clean,
    create,
    inserts,
    verbose,
    version,
    'binary-upgrade': binaryUpgrade,
    'column-inserts': columnInserts,
    'data-only': dataOnly,
    'disable-dollar-quoting': disableDollarQuoting,
    'disable-triggers': disableTriggers,
    'enable-row-security': enableRowSecurity,
    'if-exists': ifExists,
    'load-via-partition-root': loadViaPartitionRoot,
    'no-acl': noAcl,
    'no-blobs': noBlobs,
    'no-comments': noComments,
    'no-owner': noOwner,
    'no-publications': noPublications,
    'no-reconnect': noReconnect,
    'no-security-labels': noSecurityLabels,
    'no-subscriptions': noSubscriptions,
    'no-sync': noSync,
    'no-synchronized-snapshots': noSynchronizedSnapshots,
    'no-tablespaces': noTableSpaces,
    'no-toast-compression': noToastCompression,
    'no-unlogged-table-data': noUnloggedTableData,
    'no-privileges': noPrivileges,
    'on-conflict-do-nothing': onConflictDoNothing,
    'quote-all-identifiers': quoteAllIdentifiers,
    'schema-only': schemaOnly,
    'serializable-deferrable': serializableDeferrable,
    'strict-names': strictNames,
    'use-set-session-authorization': useSetSessionAuthorization,
  }

  Object.keys(paramsMap).forEach((key) => {
    if (paramsMap[key]) connectionArgs.push(`--${key}`)
  })

  const env: { PGSSLMODE?: SslModeEnum } = {}
  if (sslMode) env.PGSSLMODE = sslMode

  return await execa(os == 'win32' ? 'pg_dump.exe' : 'pg_dump', connectionArgs, { env })
}
