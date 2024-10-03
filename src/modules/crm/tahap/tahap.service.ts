import { crmCreate, dbPocketbase } from 'src/common/helpers/crm.helper';
import { CreateTahapDto, GetTahapDto } from './dto/tahap.dto';
import { BadRequestException } from '@nestjs/common';

export class TahapService {
  async findAll() {
    const items = await dbPocketbase({
      q: `
      SELECT 
        s.id,
        s."stageName" AS "name",
        p."name" AS "proyek"
      FROM cms_stages s
      JOIN cms_projects p ON s."projectId" = p.id
      ORDER BY p."name", s."stageName"
      `,
    });
    return items;
  }

  async findByProjectId(params: GetTahapDto) {
    const { projectId } = params;
    const items = await dbPocketbase({
      q: `
      SELECT 
        s.id,
        s."stageName" AS "name",
        p."name" AS "proyek"
      FROM cms_stages s
      JOIN cms_projects p ON s."projectId" = p.id
      WHERE s."projectId" = '${projectId}'
      ORDER BY s."stageName"
      `,
    });
    if (!items) throw new BadRequestException(`Invalid projectId`);
    return items;
  }

  async create(arg: CreateTahapDto) {
    const { projectId, stage } = arg;
    const findSameName = await dbPocketbase({
      q: `
      SELECT 
        s."stageName"
      FROM cms_stages s
      JOIN cms_projects p ON s."projectId" = p.id
      WHERE s."stageName" = '${stage}' AND s."projectId" = '${projectId}'
      `,
    });
    if (findSameName) throw new BadRequestException(`Tahap ${stage} sudah ada`);

    const createData = await crmCreate({
      collection: 'cms_stages',
      data: {
        stageName: stage,
        projectId,
      },
    });

    return {
      id: createData?.data?.id,
      stage,
      projectId,
    };
  }
}
