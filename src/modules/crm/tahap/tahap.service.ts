import { CreateTahapDto, GetTahapDto } from './dto/tahap.dto';

export class TahapService {
  async findAll() {}

  async findByProjectId(params: GetTahapDto) {
    const { projectId } = params;
  }

  async create(arg: CreateTahapDto) {
    const { projectId, stage } = arg;
    
  }
}
