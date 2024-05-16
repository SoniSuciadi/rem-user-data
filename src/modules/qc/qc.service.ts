import { Injectable } from '@nestjs/common';
import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { DatabaseContractorService } from 'src/common/database-contractor/database-contractor.service';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class QcService {
  db: pgPromise.IDatabase<pg.IClient, pg.IClient>;
  dbContractor: pgPromise.IDatabase<pg.IClient, pg.IClient>;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly databaseContractorService: DatabaseContractorService,
  ) {
    this.db = databaseService.db;
    this.dbContractor = databaseContractorService.db;
  }

  async getQcRecap() {
    const contractors = await this.dbContractor.manyOrNone(
      `SELECT id, company_type || ' ' || name AS name FROM users`,
    );

    const data = await this.db.manyOrNone(
      `
        SELECT 
            p.name AS "Project",
            ms.phase AS "Tahap",
            mc.name AS "Cluster",
            rdo.name AS "Tipe Konstruksi",
            (cast(ot.detail ->> 'buildingArea' AS text) || '/' || cast(ot.detail ->> 'landArea' AS text) || ' ' || ot.name) AS "Sub-Tipe Konstruksi",
            (
                SELECT
                    name || '/' || oo.name
                FROM
                    rem_master_blocks
                WHERE
                    id = master_block_id
            ) AS "Output",
            e.updated_by AS "Nama Pengawas",
            oo.contractor_id AS "Nama Kontraktor", 
            e.passed,
            e.failed,
            e.unstarted,
            ROUND((e.passed::numeric / (e.failed::numeric + e.passed::numeric + e.unstarted::numeric) * 100), 2) AS "Persentase Passed"
        FROM rem_output_objects oo
        LEFT JOIN rem_evaluations e ON e.output_object_id = oo.id
        LEFT JOIN rem_master_stages ms ON ms.id = oo.master_stage_id
        LEFT JOIN rem_projects p ON p.id = ms.project_id
        LEFT JOIN rem_master_clusters mc ON mc.id = oo.master_cluster_id
        LEFT JOIN rem_object_types ot ON ot.id = oo.object_type_id
        LEFT JOIN rem_development_objects rdo ON rdo.id = ot.development_object_id;
      `,
    );

    const contractorMap = new Map();
    contractors.forEach((contractor) => {
      contractorMap.set(contractor.id, contractor.name);
    });

    const result = data.map((item) => {
      return {
        ...item,
        'Nama Kontraktor':
          contractorMap.get(item['Nama Kontraktor']) || 'Unknown',
      };
    });

    return result;
  }
}
