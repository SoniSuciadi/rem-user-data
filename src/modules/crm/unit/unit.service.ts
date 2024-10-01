import { dbPocketbase } from 'src/common/helpers/crm.helper';
import { CreateUnit, GetUnits } from './dto/unit.dto';

export class UnitService {
  async getUnits(arg: GetUnits) {
    const { project, cluster } = arg;
    const q = `
    SELECT
      u."blocks" AS "blok",
      u."homeNumber" AS "homeNumber",
      u."unitStatus" AS "status",
      CASE
        WHEN hd."homeDesignName" IS NOT NULL THEN hd."homeDesignName" || ' (' || hd."typeUnit" || ')'
        ELSE ''
      END AS "Tipe Rumah"
    FROM cms_units u
    JOIN cms_clusters c ON u."clusterId" = c.id
    JOIN cms_projects p ON c."projectId" = p.id
    LEFT JOIN cms_home_design hd ON u."homeDesignId" = hd.id
    WHERE u."unitStatus" IS NOT NULL AND p."name" = '${project}' AND c."name" = '${cluster}'
    ORDER BY LOWER(u."blocks"), CAST(u."homeNumber" as INTEGER )
    `;
    const data = await dbPocketbase({ q });
    return data || [];
  }

  async createUnit(arg: CreateUnit) {
    const { projectId, clusterId, homeDesignId, block, homeNumber, status } =
      arg;
  }
}
