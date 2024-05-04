import { Controller } from '@nestjs/common';
import { LandService } from './land.service';

@Controller('land')
export class LandController {
  constructor(private readonly landService: LandService) {}
}
