import { Controller, Get } from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('crm/project')
export class ProjectController {
  constructor(private readonly ProjectService: ProjectService) {}

  @Get()
  async getProjects() {
    const data = await this.ProjectService.getProjects();
    return {
      message: 'Success get list crm projects',
      data,
    };
  }
}
