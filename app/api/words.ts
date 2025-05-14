import { WordDTO, DetailedWordDTO, WordsQueryParams, WordsResponse } from '../types';
import { fetchWords, fetchWordDetails } from '../lib/api/words';

export async function getWords(params: WordsQueryParams): Promise<WordsResponse> {
  return fetchWords(params);
}

export async function getWordDetails(id: string): Promise<DetailedWordDTO> {
  return fetchWordDetails(id);
}