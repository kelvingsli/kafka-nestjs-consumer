import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WikiPost } from './models/entity/wikipost.entity'
import { IWikiPost } from './models/dto/wikipost.interface'
import { WikiPostDto } from './models/dto/wikipost.dto'

@Injectable()
export class EventWriterService {

  constructor(
    @InjectRepository(WikiPost)
    private readonly wikiPostRepository: Repository<WikiPost>,
  ) { }

  async upsertWikiPost(key_id: string, title: string, title_url: string, timestamp: Date, source: string): Promise<IWikiPost> {
    const new_post = this.wikiPostRepository.create({ key_id: key_id, timestamp: timestamp, title: title, title_url: title_url, source: source });
    const res = await this.wikiPostRepository.save(new_post);
    return new WikiPostDto(res.id, res.key_id, res.title, res.title_url, res.timestamp, res.source);
  }

}
