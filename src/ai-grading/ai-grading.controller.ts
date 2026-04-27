import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AiGradingService } from './ai-grading.service';
import { SubmitGradingDto } from './dto/submit-grading.dto';
import { SupabaseAuthGuard } from '../auth/auth.guard';

@Controller('ai-grading')
export class AiGradingController {
    constructor(private readonly aiService: AiGradingService) { }

    @Post(':orderId')
    // @UseGuards(SupabaseAuthGuard)
    async submitGrading(
        @Param('orderId') orderId: string,
        @Body() dto: SubmitGradingDto,
    ) {
        return this.aiService.processGrading(orderId, dto);
    }
}
