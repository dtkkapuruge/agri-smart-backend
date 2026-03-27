import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async signup(signUpData: any) {
    // 1. පෝස්ට්මන් එකෙන් එන දත්ත ටික වෙන් කරගන්නවා
    const { email, password, role, name, location, phoneNumber } = signUpData;

    try {
      return await this.prisma.$transaction(async (tx) => {
        // 2. User කෙනෙක්ව හදනවා (Schema එකේ තියෙන නියම නම් පාවිච්චි කරලා)
        const user = await tx.user.create({
          data: {
            email: email,
            password: password, // Schema එකේ තියෙන්නේ 'password' නිසා
            role: role,
            name: name,
            location: location,
            phoneNumber: phoneNumber,
          },
        });

        // මල්ලි, දැනට ඔයාගේ Schema එකේ FarmerProfile/BuyerProfile models නැති නිසා,
        // සර්වර් එක Crash නොවී තියාගන්න ඒ Logic එක දැනට මම මෙතනින් අයින් කළා.
        // ඔයා Schema එකට ඒ models එකතු කළාම අපිට මේ යටින් ඒ ටික ආයෙත් දාන්න පුළුවන්.

        return { 
          message: 'Signup Success!', 
          userId: user.id // Schema එකේ තියෙන්නේ 'id' නිසා
        };
      });
    } catch (error) {
      // මොනවා හරි වැරැද්දක් වුණොත් (උදා: එකම Email එකෙන් දෙපාරක් Signup වීම)
      console.error('Signup Error:', error);
      throw new InternalServerErrorException('Signup process failed. Please check your data.');
    }
  }
}