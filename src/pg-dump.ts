import { ConnectionOptions, getConnectionArgs, FormatEnum } from './common'
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

export const pgDump = async (
  connectionOptions: ConnectionOptions,
  dumpOptions: DumpOptionsType,
): Promise<ExecaChildProcess> => {
  const args: string[] = getConnectionArgs(connectionOptions)

  const {
    filePath,
    format = FormatEnum.Custom,
    dataOnly,
    blobs,
    noBlobs,
    clean,
    create,
    extensionPattern,
    encoding,
    jobs,
    schemaPattern,
    excludeSchemaPattern,
    noOwner,
    noReconnect,
    schemaOnly,
    tablePattern,
    excludeTablePattern,
    verbose,
    noAcl,
    compress,
    binaryUpgrade,
    columnInserts,
    disableDollarQuoting,
    disableTriggers,
    enableRowSecurity,
    excludeTableDataPattern,
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
    sectionName,
    serializableDeferrable,
    snapshotName,
    strictNames,
    useSetSessionAuthorization,
    roleName,
    version,
  } = dumpOptions

  args.push(`--format=${format}`)
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

  const paramsMap: { [key: string]: boolean | undefined} = {
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
    'on-conflict-do-nothing': onConflictDoNothing,
    'quote-all-identifiers': quoteAllIdentifiers,
    'schema-only': schemaOnly,
    'serializable-deferrable': serializableDeferrable,
    'strict-names': strictNames,
    'use-set-session-authorization': useSetSessionAuthorization,
  }

  Object.keys(paramsMap).forEach(key => {
    if (paramsMap[key]) args.push(`--${key}=${paramsMap[key]}`)
  })

  return await execa('pg_dump', args, {})
}
