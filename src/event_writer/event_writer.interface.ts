import { IWikiPost } from './models/dto/wikipost.interface'

export interface IEventWriterService {
    upsertWikiPost(key_id: string, title: string, title_url: string, timestamp: Date, source: string): Promise<IWikiPost>
}
