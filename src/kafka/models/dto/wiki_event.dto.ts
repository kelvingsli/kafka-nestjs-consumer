export class WikiEventDto {
  id: number;

  title: string;

  title_url: string;

  timestamp: Date;

  source: string;

  constructor(
    id: number,
    title: string,
    title_url: string,
    timestamp: Date,
    source: string,
  ) {
    this.id = id;
    this.title = title;
    this.title_url = title_url;
    this.timestamp = timestamp;
    this.source = source;
  }
}
