export type ApiResponse<Data> = {
  status: string;
  data: Data;
};

export type ApiOptions = {
  auth?: boolean;
  headers?: { [key: string]: string };
};

export type PaginatedResponse<Data> = {
  current_page: number;
  data: Data;
  first_page_url: string;
  from: string | null;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: number | null;
  to: string | null;
  total: number;
};
