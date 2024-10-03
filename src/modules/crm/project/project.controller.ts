import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, GetProjectsResponseDto } from './dto/project.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('crm/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: GetProjectsResponseDto,
  })
  async getProjects() {
    const data = await this.projectService.getProjects();
    return {
      message: 'Success get list crm projects',
      data,
    };
  }

  @Post()
  async createProject(@Body() body: CreateProjectDto) {
    const data = await this.projectService.createProject(body);

    return {
      message: 'Success create crm project',
      data,
    };
  }
}
