import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitGradingDto } from './dto/submit-grading.dto';

@Injectable()
export class AiGradingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Processes a product image for quality grading and verifies location authenticity.
   * @param orderId The ID of the order being fulfilled
   * @param dto Contains image URL and capture coordinates
   */
  async processGrading(orderId: string, dto: SubmitGradingDto) {
    const order = await this.prisma.order.findUnique({
      where: { order_id: orderId },
    });

    if (!order) throw new BadRequestException('Order not found.');
    if (!order.farmer_id) throw new BadRequestException('Order has not been accepted by a farmer.');

    // Metadata Forensics: Verify if the photo was taken at the registered farm location
    const distanceCheck: any[] = await this.prisma.$queryRaw`
      SELECT ST_Distance(
        fp.farm_location::geography, 
        ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)::geography
      ) AS distance_meters
      FROM "FarmerProfile" fp
      WHERE fp.profile_id = ${order.farmer_id}
    `;

    const distance = distanceCheck[0]?.distance_meters || 999999;
    console.log(`📏 Forensics Check: Capture distance is ${distance.toFixed(2)} meters from farm.`);

    // Allow a 10km radius for testing purposes (Should be tighter in production)
    if (distance > 10000) { 
      throw new BadRequestException('Forensics verification failed: Image capture location mismatch.');
    }

    // AI Grading (Current Mock Implementation)
    // Future: Integrate with FastAPI CNN model
    const aiGrade = 'A';
    const qualityScore = 98.5;
    const finalPrice = 125.00; // Calculated based on market base price + quality premium

    // Persist the AI Verification Report
    return this.prisma.aiVerificationReport.create({
      data: {
        order_id: orderId,
        price_id: dto.price_id,
        image_url: dto.image_url,
        ai_grade: aiGrade,
        quality_score: qualityScore,
        metadata_verified: true,
        final_price: finalPrice,
      },
    });
  }
}
