import { dbPocketbase } from 'src/common/helpers/crm.helper';

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
}
