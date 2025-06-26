import execa, { ExecaChildProcess } from 'execa'
import { ConnectionOptions, FormatEnum, getConnectionArgs, SslModeEnum } from './common'

export type RestoreOptionsType = {
  filePath: string
  dataOnly?: boolean
  clean?: boolean
  create?: boolean
  exitOnError?: boolean
  format?: FormatEnum
  fileName?: string
  index?: string
  jobs?: number
  list?: boolean
  useListFile?: string
  schemaPattern?: string
  excludeSchemaPattern?: string
  noOwner?: boolean
  noReconnect?: boolean
  schemaOnly?: boolean
  verbose?: boolean
  singleTransaction?: boolean
  version?: boolean
  noAcl?: boolean
  disableTriggers?: boolean
  enableRowSecurity?: boolean
  ifExists?: boolean
  noComments?: boolean
  noDataForFailedTables?: boolean
  noSecurityLabels?: boolean
  noPublications?: boolean
  noSubscriptions?: boolean
  noTableSpaces?: boolean
  strictNames?: boolean
  useSetSessionAuthorization?: boolean
  functionName?: string
  superUser?: string
  table?: string
  trigger?: string
  sectionName?: string
  noPassword?: boolean
  roleName?: string
  noPrivileges?: boolean
}

export const pgRestore = async (
  connectionOptions: ConnectionOptions,
  restoreOptions: RestoreOptionsType,
): Promise<ExecaChildProcess> => {
  const {
    filePath,
    dataOnly,
    clean,
    create,
    exitOnError,
    format,
    fileName,
    index,
    jobs,
    list,
    useListFile,
    schemaPattern,
    excludeSchemaPattern,
    noOwner,
    functionName,
    noReconnect,
    schemaOnly,
    superUser,
    table,
    trigger,
    verbose,
    version,
    noAcl,
    singleTransaction,
    disableTriggers,
    enableRowSecurity,
    ifExists,
    noComments,
    noDataForFailedTables,
    noPublications,
    noSecurityLabels,
    noSubscriptions,
    noTableSpaces,
    sectionName,
    strictNames,
    useSetSessionAuthorization,
    noPassword,
    roleName,
    noPrivileges,
  } = restoreOptions
  if (!filePath) throw new Error('Needs filePath in the options')

  const os = process.platform
  const { connectionArgs, sslMode } = getConnectionArgs(connectionOptions)

  if (format) connectionArgs.push(`--format=${format}`)
  if (fileName) connectionArgs.push(`--filename=${fileName}`)
  if (index) connectionArgs.push(`--index=${index}`)
  if (jobs) connectionArgs.push(`--jobs=${jobs}`)
  if (useListFile) connectionArgs.push(`--use-list=${useListFile}`)
  if (schemaPattern) connectionArgs.push(`--schema=${schemaPattern}`)
  if (excludeSchemaPattern) connectionArgs.push(`--exclude-schema=${excludeSchemaPattern}`)
  if (functionName) connectionArgs.push(`--function=${functionName}`)
  if (superUser) connectionArgs.push(`--superuser=${superUser}`)
  if (table) connectionArgs.push(`--table=${table}`)
  if (trigger) connectionArgs.push(`--trigger=${trigger}`)
  if (sectionName) connectionArgs.push(`--section=${sectionName}`)
  if (roleName) connectionArgs.push(`--role=${roleName}`)

  const paramsMap: { [key: string]: boolean | undefined } = {
    clean,
    create,
    list,
    verbose,
    version,
    'data-only': dataOnly,
    'disable-triggers': disableTriggers,
    'enable-row-security': enableRowSecurity,
    'exit-on-error': exitOnError,
    'if-exists': ifExists,
    'no-acl': noAcl,
    'no-comments': noComments,
    'no-data-for-failed-tables': noDataForFailedTables,
    'no-owner': noOwner,
    'no-password': noPassword,
    'no-publications': noPublications,
    'no-reconnect': noReconnect,
    'no-security-labels': noSecurityLabels,
    'no-subscriptions': noSubscriptions,
    'no-tablespaces': noTableSpaces,
    'no-privileges': noPrivileges,
    'schema-only': schemaOnly,
    'single-transaction': singleTransaction,
    'strict-names': strictNames,
    'use-set-session-authorization': useSetSessionAuthorization,
  }

  Object.keys(paramsMap).forEach((key) => {
    if (paramsMap[key]) connectionArgs.push(`--${key}`)
  })

  connectionArgs.push(filePath)

  const env: { PGSSLMODE?: SslModeEnum } = {}
  if (sslMode) env.PGSSLMODE = sslMode

  return execa(os == 'win32' ? 'pg_restore.exe' : 'pg_restore', connectionArgs, { env })
}
