export type Book = "A" | "B" | "C";

export type TrademarkEntry = {
  mark: string;
  registration: string;
  class: string;
  className: string;
};

export type Company = {
  name: string;
  book: Book;
  bookName: string;
  bookDescription?: string;
  records: number;
  marksCount: number;
  marks: string[];
  registrations: string[];
  representativeMarks: string[];
  entries: TrademarkEntry[];
  representativeEntries: TrademarkEntry[];
  classes: string[];
  classNames: string[];
  positioning: string;
};

export type SectorClass = {
  class: string;
  name: string;
  count: number;
};

export type LogoItem = {
  name: string;
  domain: string;
};

export type CatalogStats = {
  records: number;
  companies: number;
  classes: number;
  books: Record<Book, number>;
  topClasses: SectorClass[];
};

export type CatalogData = {
  stats: CatalogStats;
  featured: Company[];
  companies: Company[];
  classNames: Record<string, string>;
  bookNames: Record<Book, string>;
  logos: LogoItem[];
};

export type CatalogDocument = {
  id: string;
  data: CatalogData;
  updated_at: string;
};
