import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Claim, ClaimDocument, ClaimStatus } from './claim.schema';
import { CreateClaimDto } from './dto/create-claim.dto';
import { ResolveClaimDto } from './dto/resolve-claim.dto';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectModel(Claim.name) private claimModel: Model<ClaimDocument>,
  ) {}

  async create(userId: string, dto: CreateClaimDto): Promise<ClaimDocument> {
    return new this.claimModel({
      professeur: new Types.ObjectId(userId),
      ...dto,
    }).save();
  }

  async findByProfessor(userId: string): Promise<ClaimDocument[]> {
    return this.claimModel
      .find({ professeur: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAll(): Promise<ClaimDocument[]> {
    return this.claimModel
      .find()
      .populate('professeur', 'fullName email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async resolve(claimId: string, dto: ResolveClaimDto): Promise<ClaimDocument> {
    const claim = await this.claimModel.findById(claimId);
    if (!claim) throw new NotFoundException('Claim not found');

    claim.status = ClaimStatus.RESOLVED;
    claim.adminResponse = dto.adminResponse;
    claim.resolvedAt = new Date();
    return claim.save();
  }
}
