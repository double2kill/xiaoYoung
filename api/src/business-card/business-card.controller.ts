import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { BusinessCardService } from './business-card.service';

export interface BusinessCardDto {
  id?: number;
  userId: number;
  industry: string;
  profession: string;
  interests: string;
  position: string;
  company?: string;
  email?: string;
  phone?: string;
  wechat?: string;
  introduction?: string;
  avatarUrl?: string;
  nickName?: string;
  createTime?: string;
  updateTime?: string;
}

@Controller('api/business-card')
export class BusinessCardController {
  constructor(private readonly businessCardService: BusinessCardService) {}

  @Get('list/search')
  searchBusinessCards(
    @Query()
    query: {
      industry?: string;
      profession?: string;
      position?: string;
      keyword?: string;
    },
  ) {
    const cards = this.businessCardService.searchBusinessCards(query);
    return {
      code: 200,
      data: cards,
      message: '搜索成功',
    };
  }

  @Get('list/recommend')
  getRecommendBusinessCards(@Query('userId') userId: string) {
    const cards = this.businessCardService.getRecommendBusinessCards(
      parseInt(userId),
    );
    return {
      code: 200,
      data: cards,
      message: '获取推荐成功',
    };
  }

  @Get(':userId')
  getBusinessCard(@Param('userId') userId: string) {
    const userIdNum = parseInt(userId);
    const existingCard = this.businessCardService.getBusinessCard(userIdNum);
    const isMockData = !this.businessCardService.businessCards.find(
      (card) => card.userId === userIdNum,
    );

    return {
      code: 200,
      data: existingCard,
      message: isMockData ? '获取成功（Mock数据）' : '获取成功',
    };
  }

  @Post()
  createBusinessCard(@Body() businessCardDto: BusinessCardDto) {
    const result = this.businessCardService.createBusinessCard(businessCardDto);
    return {
      code: 200,
      data: result,
      message: '创建成功',
    };
  }

  @Put(':userId')
  updateBusinessCard(
    @Param('userId') userId: string,
    @Body() businessCardDto: Partial<BusinessCardDto>,
  ) {
    const result = this.businessCardService.updateBusinessCard(
      parseInt(userId),
      businessCardDto,
    );
    return {
      code: 200,
      data: result,
      message: result ? '更新成功' : '名片不存在',
    };
  }

  @Delete(':userId')
  deleteBusinessCard(@Param('userId') userId: string) {
    const result = this.businessCardService.deleteBusinessCard(
      parseInt(userId),
    );
    return {
      code: 200,
      data: { success: result },
      message: result ? '删除成功' : '名片不存在',
    };
  }
}
