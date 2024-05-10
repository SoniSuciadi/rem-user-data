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

  getStages() {
    return this.db.manyOrNone(
      `
        SELECT 
            phase AS "Tahap",
            start_date AS "Tanggal Mulai Project "
        FROM rem_master_stages
        WHERE project_id=1
        `,
    );
  }
  getClusters() {
    return this.db.manyOrNone(
      `
        SELECT 
            name AS "Nama cluster"
        FROM rem_master_clusters
        WHERE project_id=1
        `,
    );
  }
  getBloks() {
    return this.db.manyOrNone(
      `
        SELECT 
            name AS "Nama blok"
        FROM rem_master_blocks
        WHERE project_id=1
        `,
    );
  }
  getUnits() {
    return this.db.manyOrNone(
      `
     SELECT
      coalesce(cast(ot.detail ->> 'buildingArea' AS text) || '/' || cast(ot.detail ->> 'landArea' AS text) || ' ' || ot.name, '') AS "Tipe unit",
      ot.detail ->> 'landArea' AS "Luas Tanah",
      ot.detail ->> 'buildingArea' AS "Luas Bangunan",
      ot.name AS "Nama Desain",
      ot.detail ->> 'widthField' AS "Lebar Bidang ",
      ot.detail ->> 'lengthField' AS "Panjang Bidang"
    FROM
      rem_object_types ot
    WHERE
      development_object_id = 3
        `,
    );
  }
  getFacilities() {
    return this.db.manyOrNone(
      `
      SELECT
        name AS "Nama Tipe",
        detail ->> 'volume' AS "Luas",
        detail ->> 'uom' AS "Satuan"
      FROM
        rem_object_types ot
      WHERE
        development_object_id = 1
        `,
    );
  }
  getInfrastructure() {
    return this.db.manyOrNone(
      `
       SELECT
        name AS "Nama Tipe",
        detail ->> 'volume' AS "Luas",
        detail ->> 'uom' AS "Satuan"
      FROM
        rem_object_types ot
      WHERE
        development_object_id = 2
        `,
    );
  }
}
