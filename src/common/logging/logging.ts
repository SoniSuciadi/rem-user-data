import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { tap, finalize } from 'rxjs/operators';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  constructor(private databaseService: DatabaseService) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const startTime = Date.now();

    const logging = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      'user-agent': req.headers['user-agent'],
      statusCode: 0,
      processingTime: 0,
      status: 'success',
      responseBody: null,
    };

    return next.handle().pipe(
      tap(
        (response) => {
          logging.statusCode = res.statusCode;
          logging.responseBody = response;
        },
        (e) => {
          logging.status = 'error';
          logging.statusCode = e.status || 500;
          logging.responseBody = e;
        },
      ),
      finalize(() => {
        logging.processingTime = Date.now() - startTime;
        const logMessage = JSON.stringify(logging, null, 2);

        if (logging.status === 'error') {
          this.logger.error(logMessage);
        } else {
          this.logger.log(logMessage);
        }
      }),
    );
  }
}
