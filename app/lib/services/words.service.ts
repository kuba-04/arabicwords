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

export class WordsService {
  public static async getWords(params: WordsQueryParams): Promise<WordsListResponseDTO> {
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
        .select(`
          *,
          word_forms!inner (
            *,
            word_form_dialects!inner (
              dialects!inner (
                id,
                name,
                country_code
              )
            )
          )
        `, { count: 'exact' });

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

      // Transform the data to include dialects
      const transformedData = data?.map(word => {
        // Get unique dialects from all word forms
        const dialects = Array.from(new Set(
          word.word_forms.flatMap((form: any) => 
            form.word_form_dialects?.map((wfd: any) => ({
              id: wfd.dialects.id,
              name: wfd.dialects.name,
              country_code: wfd.dialects.country_code
            })) || []
          )
        ));

        return {
          ...word,
          dialects
        };
      }) || [];

      return {
        data: transformedData as WordDTO[],
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

  public static async getWordDetails(id: string): Promise<DetailedWordDTO> {
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
          dialects[0].code as WordDialect : 
          'lb';

        return {
          id: form.id,
          arabic_script: form.arabic_script_variant || '',
          transliteration: form.transliteration,
          conjugation: form.conjugation_details,
          dialect: primaryDialect,
          audio_url: form.audio_url
        };
      });

      // Get unique dialects from all forms (for usage_regions)
      const uniqueDialects = Array.from(new Set(
        data.word_forms.flatMap((form: any) => 
          form.word_form_dialects?.map((wfd: any) => wfd.dialects.country_code as WordDialect) || []
        )
      ));

      // Collect dialects as objects (for flag rendering)
      const dialects = Array.from(new Set(
        data.word_forms.flatMap((form: any) => 
          form.word_form_dialects?.map((wfd: any) =>
            JSON.stringify({
              id: wfd.dialects.id,
              name: wfd.dialects.name,
              country_code: wfd.dialects.country_code
            })
          ) || []
        )
      ))
      .map(str => JSON.parse(str) as { id: string; name: string; country_code: string });

      // Use default dialects if none found
      const usage_regions = uniqueDialects.length > 0 ? 
        uniqueDialects as WordDialect[] : 
        ['lb', 'sa', 'eg'];

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
        educational_notes: [],
        dialects
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
}

export default new WordsService();