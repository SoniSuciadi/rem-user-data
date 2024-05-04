import { Controller } from '@nestjs/common';
import { PermittingService } from './permitting.service';

@Controller('permitting')
export class PermittingController {
  constructor(private readonly permittingService: PermittingService) {}
}
