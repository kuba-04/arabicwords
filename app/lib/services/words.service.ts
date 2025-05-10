import { createClient } from '@supabase/supabase-js';
import type { WordDTO, WordsQueryParams, WordsListResponseDTO } from '../../types';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!
);

export class WordsService {
  async getWords(params: WordsQueryParams): Promise<WordsListResponseDTO> {
    const {
      english,
      arabic,
      part_of_speech,
      frequency,
      page = 1,
      limit = 10,
      sort_by = 'english_term'
    } = params;

    // Start building the query
    let query = supabase
      .from('words')
      .select('*, word_forms(*)', { count: 'exact' });

    // Apply filters
    if (english) {
      query = query.ilike('english_term', `%${english}%`);
    }
    if (arabic) {
      query = query.ilike('primary_arabic_script', `%${arabic}%`);
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
      throw new Error(`Failed to fetch words: ${error.message}`);
    }

    return {
      data: data as WordDTO[],
      pagination: {
        page,
        limit,
        total: count ?? 0
      }
    };
  }
} 

export default WordsService;