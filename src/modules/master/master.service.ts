import { Injectable } from '@nestjs/common';
import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class MasterService {
  db: pgPromise.IDatabase<pg.IClient, pg.IClient>;
  constructor(private readonly databaseService: DatabaseService) {
    this.db = databaseService.db;
  }

  getStage(projectId: string) {
    return this.db.manyOrNone(
      `
        SELECT 
            phase AS "Tahap",
            start_date AS "Tanggal Mulai Project "
        FROM rem_master_stages
        WHERE project_id=$<projectId>
        `,
      { projectId },
    );
  }
}
