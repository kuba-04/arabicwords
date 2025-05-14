import type { WordDTO, WordsQueryParams, WordsListResponseDTO, DetailedWordDTO, WordForm, WordDialect, WordDefinition } from '../../types';
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

export async function fetchWordDetails(id: string): Promise<DetailedWordDTO> {
  try {
    // Fetch word with all related data in a single query
    const { data, error } = await supabase
      .from('words')
      .select(`
        *,
        word_forms!inner (
          id,
          arabic_script_variant,
          transliteration,
          conjugation_details,
          audio_url,
          word_form_dialects!inner (
            dialects!inner (
              name,
              country_code
            )
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new ApiError(500, `Failed to fetch word details: ${error.message}`);
    }

    if (!data) {
      throw new ApiError(404, 'Word not found');
    }

    // Transform word forms and their dialects
    const forms: WordForm[] = data.word_forms.map((form: any) => {
      // Extract dialects from the nested structure
      const dialects = form.word_form_dialects?.map((wfd: any) => ({
        name: wfd.dialects.name,
        code: wfd.dialects.country_code
      })) || [];

      // Map to the first dialect or default to Lebanese
      const primaryDialect = dialects.length > 0 ? 
        dialects[0].name as WordDialect : 
        'Leb.';

      return {
        id: form.id,
        arabic_script: form.arabic_script_variant || '',
        transliteration: form.transliteration,
        conjugation: form.conjugation_details,
        dialect: primaryDialect,
        audio_url: form.audio_url
      };
    });

    // Get unique dialects from all forms
    const uniqueDialects = Array.from(new Set(
      data.word_forms.flatMap((form: any) => 
        form.word_form_dialects?.map((wfd: any) => wfd.dialects.name as WordDialect) || []
      )
    ));

    // Use default dialects if none found
    const usage_regions = uniqueDialects.length > 0 ? 
      uniqueDialects : 
      ['Leb.', 'For.', 'Egy.'];

    // Create a single definition from the english_definition field
    const definitions: WordDefinition[] = [{
      id: 1,
      definition: data.english_definition || '',
    }];

    // Transform the data to match DetailedWordDTO
    const detailedWord: DetailedWordDTO = {
      id: data.id,
      primary_arabic_script: data.primary_arabic_script,
      english_term: data.english_term,
      part_of_speech: data.part_of_speech,
      english_definition: data.english_definition,
      general_frequency_tag: data.general_frequency_tag,
      word_forms: [],  // Required by WordDTO
      forms,
      frequency_tags: [data.general_frequency_tag],
      usage_regions,
      definitions,
      educational_notes: []
    };

    return detailedWord;
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
  fetchWords,
  fetchWordDetails
};