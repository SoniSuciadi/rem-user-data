import { Injectable, Logger } from '@nestjs/common';
import pgPromise, { IDatabase, IMain } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import { format } from 'sql-formatter';

@Injectable()
export class DatabaseService {
  private static dbInstance: IDatabase<IClient>;
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {
    if (!DatabaseService.dbInstance) {
      this.logger.log('create new database instance');
      const initOptions: pgPromise.IInitOptions<IClient> = {
        query(e) {
          console.log('\n');
          console.log('====================================================');
          console.log('💸💸💸💸💸💸💸💸💸💸QuerySection💸💸💸💸💸💸💸💸💸');
          console.log('====================================================');
          console.log(format(e.query, { language: 'postgresql' }));
          console.log('=====================================================');
          console.log('💸💸💸💸💸💸💸💸💸EndQuerySection💸💸💸💸💸💸💸💸💸');
          console.log('=====================================================');
          console.log('\n');
        },
      };
      const pgp: IMain = pgPromise(initOptions);

      const dbConfig = {
        host: process.env.PG_HOST,
        port: +process.env.PG_PORT,
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
      };
      DatabaseService.dbInstance = pgp(dbConfig);
    } else {
      this.logger.log('database instance existing ');
    }
  }

  get db(): IDatabase<IClient> {
    return DatabaseService.dbInstance;
  }
}
