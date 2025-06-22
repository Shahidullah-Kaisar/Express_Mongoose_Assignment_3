export interface IBooks {
  title: string;
  author: string;
  genre: "FICTION" | "NON_FICTION" | "SCIENCE" | "HISTORY" | "BIOGRAPHY" | "FANTASY";
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  deductCopies(quantity: number): Promise<void>;
}

export interface BookQuery {
  filter?: string;
  sortBy?: string;
  sort?: 'asc' | 'desc';
  limit?: string; // query string theke ashbe tai string
}
