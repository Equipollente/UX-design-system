import mediaCsv from './work-media.csv?raw';

export type WorkMedia = {
  workId: string;
  url: string;
  alt: string;
  displayOrder: number;
};

const [headerLine, ...rows] = mediaCsv.trim().split(/\r?\n/);
const headers: string[] = headerLine.split(',');

const media = rows.filter(Boolean).map((row): WorkMedia => {
  const values = row.split(',');
  const record = Object.fromEntries(
    headers.map((header: string, index: number) => [header, values[index] ?? '']),
  ) as Record<string, string>;

  return {
    workId: record.workId,
    url: record.url,
    alt: record.alt,
    displayOrder: Number(record.displayOrder),
  };
});

export const firstMediaByWorkId = media
  .sort((left, right) => left.displayOrder - right.displayOrder)
  .reduce((result, item) => {
    if (!result.has(item.workId)) {
      result.set(item.workId, item);
    }
    return result;
  }, new Map<string, WorkMedia>());
