import { Sequelize, STRING, JSON } from 'sequelize'
import { Options } from 'sequelize/types/sequelize'
import { ConnectionOptions } from '../src/index'

require('pg')

export class DatabaseMock {
  public sequelize: Sequelize
  patient: any

  constructor(connectionOptions: ConnectionOptions) {
    const databaseConfig: Options = {
      logging: () => {},
      dialect: 'postgres',
      ...connectionOptions,
    }

    this.sequelize = new Sequelize(databaseConfig)
    this.patient = this.sequelize.define(
      'patient',
      {
        id: {
          type: STRING,
          primaryKey: true,
          allowNull: false,
        },
        data: { type: JSON },
        misc: { type: JSON },
      },
      {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
      },
    )
  }

  async populate() {
    await this.patient.create({
      id: '1',
      data: {
        name: 'John Doe',
        age: 42,
      },
    })
  }
}
