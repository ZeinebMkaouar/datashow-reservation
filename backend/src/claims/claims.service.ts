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

  /**
   * Find all claims (admin view) with searching and filtering.
   */
  async findAll(query?: { search?: string; status?: string }): Promise<any[]> {
    const pipeline: any[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'professeur',
          foreignField: '_id',
          as: 'professeur',
        },
      },
      { $unwind: '$professeur' },
    ];

    const match: any = {};
    if (query?.status && query.status !== 'all') {
      match.status = query.status;
    }

    if (query?.search) {
      const searchRegex = { $regex: query.search, $options: 'i' };
      match.$or = [
        { 'professeur.fullName': searchRegex },
        { title: searchRegex },
        { description: searchRegex },
      ];
    }

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    pipeline.push({
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        status: 1,
        adminResponse: 1,
        createdAt: 1,
        resolvedAt: 1,
        'professeur._id': 1,
        'professeur.fullName': 1,
        'professeur.email': 1,
      },
    });

    return this.claimModel.aggregate(pipeline).exec();
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
