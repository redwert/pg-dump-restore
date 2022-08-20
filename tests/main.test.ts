import { DatabaseMock } from './database.mock'
import { ConnectionOptions, pgDump, DumpOptionsType, FormatEnum, pgRestore, RestoreOptionsType } from '../src/index'
import { pathExists, remove } from 'fs-extra'
import { join } from 'path'

const filePath = join(__dirname, 'test-dump.sql')

const connectionOptions: ConnectionOptions = {
  host: 'localhost',
  database: 'test',
  username: 'test',
  password: 'test',
  port: 5400,
}

describe('Check pg_dump pg_restore', () => {
  const databaseMock = new DatabaseMock(connectionOptions)

  beforeAll(async () => {
    await databaseMock.sequelize.sync({ force: true })
    await databaseMock.populate()
  })

  afterAll(async () => {
    await remove(filePath)
  })

  describe('Can dump', () => {
    test('can dump database', async () => {
      expect.assertions(1)

      const dumpOptions: DumpOptionsType = { filePath, format: FormatEnum.Custom }
      await pgDump(connectionOptions, dumpOptions)

      expect(await pathExists(dumpOptions.filePath)).toBeTruthy()
    })
  })

  describe('Can restore', () => {
    test('can restore database', async () => {
      expect.assertions(1)

      const restoreOptions: RestoreOptionsType = { filePath }
      await databaseMock.sequelize.drop()
      await pgRestore(connectionOptions, restoreOptions)

      const allPatients = await databaseMock.patient.findAll()

      expect(allPatients.length).toBe(1)
    })
  })
})
