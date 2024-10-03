import { crmCreate, dbPocketbase } from 'src/common/helpers/crm.helper';
import { CreateTahapDto, GetTahapDto } from './dto/tahap.dto';
import { BadRequestException } from '@nestjs/common';

export class TahapService {
  async findAll() {}

  async findByProjectId(params: GetTahapDto) {
    const { projectId } = params;
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
