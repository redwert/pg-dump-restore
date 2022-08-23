import execa, { ExecaChildProcess } from 'execa'
import { ConnectionOptions, FormatEnum, getConnectionArgs } from './common'

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
  } = restoreOptions
  if (!filePath) throw new Error('Needs filePath in the options')

  const args: string[] = getConnectionArgs(connectionOptions)

  args.push(filePath)
  if (format) args.push(`--format=${format}`)
  if (fileName) args.push(`--filename=${fileName}`)
  if (index) args.push(`--index=${index}`)
  if (jobs) args.push(`--jobs=${jobs}`)
  if (useListFile) args.push(`--use-list=${useListFile}`)
  if (schemaPattern) args.push(`--schema=${schemaPattern}`)
  if (excludeSchemaPattern) args.push(`--exclude-schema=${excludeSchemaPattern}`)
  if (functionName) args.push(`--function=${functionName}`)
  if (superUser) args.push(`--superuser=${superUser}`)
  if (table) args.push(`--table=${table}`)
  if (trigger) args.push(`--trigger=${trigger}`)
  if (sectionName) args.push(`--section=${sectionName}`)
  if (roleName) args.push(`--role=${roleName}`)

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
    'schema-only': schemaOnly,
    'single-transaction': singleTransaction,
    'strict-names': strictNames,
    'use-set-session-authorization': useSetSessionAuthorization,
  }

  Object.keys(paramsMap).forEach(key => {
    if (paramsMap[key]) args.push(`--${key}`)
  })

  return execa('pg_restore', args, {})
}
