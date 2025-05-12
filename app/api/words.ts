import { WordDTO, PaginationDTO, WordsQueryParams } from '../types';
import { fetchWords } from '../lib/api/words';

export interface WordsResponse {
  data: WordDTO[];
  pagination: PaginationDTO;
}

export async function getWords(params: WordsQueryParams): Promise<WordsResponse> {
  return fetchWords(params);
}