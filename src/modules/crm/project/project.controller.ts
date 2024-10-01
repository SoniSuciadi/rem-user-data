import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/project.dto';

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

  @Post()
  async createProject(@Body() body: CreateProjectDto) {
    const data = await this.ProjectService.createProject(body);
  }
}
