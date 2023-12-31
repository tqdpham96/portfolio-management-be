import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainApiService } from './blockchain-api.service';

describe('BlockchainApiService', () => {
  let service: BlockchainApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockchainApiService],
    }).compile();

    service = module.get<BlockchainApiService>(BlockchainApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
