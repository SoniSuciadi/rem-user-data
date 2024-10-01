import { dbPocketbase } from 'src/common/helpers/crm.helper';
import { CreateClusterDto } from './dto/cluster.dto';
import { BadRequestException } from '@nestjs/common';

export class ClusterService {
  async getClusters() {
    const q = `
    SELECT
      c."name",
      c.id,
      p."name" AS "project",
      COALESCE(s."stageName", '') AS "tahap"
    FROM cms_clusters c
    JOIN cms_projects p ON c."projectId" = p.id
    LEFT JOIN cms_stages s ON c."stageId" = s.id
    ORDER BY p."name"
    `;
    const data = await dbPocketbase({ q });
    return data || [];
  }

  async createCluster(arg: CreateClusterDto) {
    const { name, projectId, stageId } = arg;
    const findSameName = await dbPocketbase({
      q: `
      SELECT 
        c.id,
        p."name" AS "project",
      FROM cms_clusters c
      JOIN cms_projects p ON c."projectId" = p.id
      WHERE name = '${name}' AND "projectId" = '${projectId}'
      `,
    }).catch((err) => null);
    console.log(findSameName);
    if (findSameName)
      throw new BadRequestException(`Cluster ${name} sudah ada`);
  }
}
