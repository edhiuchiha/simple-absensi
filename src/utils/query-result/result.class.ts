export class PagingData {
  page: number;
  rowsPerPage: number;
  totalRows: number;
  totalPages: number;
}

export class Result<T> {
  result: T;
  paging?: PagingData;
  status?: {
    code: number;
    description: string;
  };
}
