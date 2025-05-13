import type { WordDTO, WordsQueryParams, WordsListResponseDTO } from '../../types';
import { wordsQuerySchema } from '../validations/words';
import { supabase } from '../supabase';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchWords(params: WordsQueryParams): Promise<WordsListResponseDTO> {
  try {
    // Validate params
    const validatedParams = wordsQuerySchema.safeParse(params);
    if (!validatedParams.success) {
      throw new ApiError(400, 'Invalid parameters', validatedParams.error.issues);
    }

    const {
      english,
      arabic,
      part_of_speech,
      frequency,
      page = 1,
      limit = 10,
      sort_by = 'english_term'
    } = validatedParams.data;

    // Return empty result if no search criteria provided
    const hasSearchCriteria = english || arabic || part_of_speech || frequency;
    if (!hasSearchCriteria) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0
        }
      };
    }

    // Build query
    let query = supabase
      .from('words')
      .select('*, word_forms(*)', { count: 'exact' });

    // Apply filters
    if (english) {
      query = query.ilike('english_term', `${english}%`);
    }
    if (arabic) {
      query = query.ilike('primary_arabic_script', `${arabic}%`);
    }
    if (part_of_speech) {
      query = query.eq('part_of_speech', part_of_speech);
    }
    if (frequency) {
      query = query.eq('general_frequency_tag', frequency);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    query = query
      .order(sort_by, { ascending: true })
      .range(from, from + limit - 1);

    // Execute query
    const { data, count, error } = await query;

    if (error) {
      throw new ApiError(500, `Failed to fetch words: ${error.message}`);
    }

    return {
      data: data as WordDTO[],
      pagination: {
        page,
        limit,
        total: count ?? 0
      }
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      500,
      'An unexpected error occurred',
      error instanceof Error ? error.message : undefined
    );
  }
}

// Export the words API functions as a default export
export default {
  fetchWords
};