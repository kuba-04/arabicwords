import { WordDTO, PaginationDTO } from '../types';

// Mock data for testing
const mockWords: WordDTO[] = [
  {
    id: '1',
    english_term: 'book',
    primary_arabic_script: 'كتاب',
    part_of_speech: 'noun',
    english_definition: 'A written or printed work consisting of pages',
    general_frequency_tag: 'VERY_FREQUENT',
    word_forms: [
      {
        id: '1-1',
        transliteration: 'kitab',
        conjugation_details: 'singular',
        audio_url: null
      }
    ]
  }
];

export interface WordsResponse {
  data: WordDTO[];
  pagination: PaginationDTO;
}

export async function getWords(params: {
  english?: string;
  arabic?: string;
  part_of_speech?: string;
  frequency?: 'VERY_FREQUENT' | 'FREQUENT' | 'COMMON' | 'UNCOMMON' | 'RARE' | 'NOT_DEFINED';
  page?: number;
  limit?: number;
  sort_by?: string;
}): Promise<WordsResponse> {
  // Mock implementation for testing
  return {
    data: mockWords,
    pagination: {
      page: params.page || 1,
      limit: params.limit || 10,
      total: 1
    }
  };
}