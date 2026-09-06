import csv from './works.csv?raw';

export type Work = {
  id: string;
  title: string;
  creationYear: number;
  techniques: string[];
  supports: string[];
  sizeCategory: string;
  status: string;
  salePriceEur?: number;
  soldPriceEur?: number;
};

const [headerLine, ...rows] = csv.trim().split(/\r?\n/);
const headers: string[] = headerLine.split(',');

function parseRow(row: string): Work {
  const values = row.split(',');
  const record = Object.fromEntries(
    headers.map((header: string, index: number) => [header, values[index] ?? '']),
  ) as Record<string, string>;
  const price = (value: string) => (value ? Number(value) : undefined);
  const list = (value: string) => (value ? value.split('|') : []);

  return {
    id: record.id,
    title: record.title,
    creationYear: Number(record.creationYear),
    techniques: list(record.techniques),
    supports: list(record.supports),
    sizeCategory: record.sizeCategory,
    status: record.status,
    salePriceEur: price(record.salePriceEur),
    soldPriceEur: price(record.soldPriceEur),
  };
}

export const works = rows.filter(Boolean).map(parseRow);
