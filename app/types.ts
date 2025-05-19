import type { Database } from "./db/database.types";

// Aliases for underlying database entities

type WordEntity = Database["public"]["Tables"]["words"]["Row"];
type WordFormEntity = Database["public"]["Tables"]["word_forms"]["Row"];

// Define FrequencyTag as per allowed enum values from the database.
export type FrequencyTag = "VERY_FREQUENT" | "FREQUENT" | "COMMON" | "UNCOMMON" | "RARE" | "NOT_DEFINED";

/*
 * WordFormDTO:
 * DTO for word forms as returned in the GET /api/words endpoint.
 * Derived from the underlying word_forms table by selecting required fields.
 */
export type WordFormDTO = Pick<WordFormEntity, "id" | "transliteration" | "conjugation_details" | "audio_url">;

/*
 * DialectDTO:
 * Represents a dialect with its country code and name
 */
export type DialectDTO = {
  id: string;
  country_code: string;
  name: string;
};

/*
 * WordDTO:
 * DTO for words returned by GET /api/words.
 * It includes necessary fields from the words table and a nested array of WordFormDTO.
 */
export type WordDTO = Pick<
  WordEntity,
  "id" | "english_term" | "primary_arabic_script" | "part_of_speech" | "english_definition" | "general_frequency_tag"
> & {
  word_forms: WordFormDTO[];
  dialects: DialectDTO[];
};

/*
 * PaginationDTO:
 * Represents pagination metadata for paginated API responses.
 */
export type PaginationDTO = {
  page: number;
  limit: number;
  total: number;
};

/*
 * WordsListResponseDTO:
 * The response DTO for GET /api/words, containing the list of words and pagination info.
 */
export type WordsListResponseDTO = {
  data: WordDTO[];
  pagination: PaginationDTO;
};

/*
 * TranslationResponseDTO:
 * DTO for the translation endpoint GET /api/words/translate.
 */
export type TranslationResponseDTO = {
  word: string;
  translation: string;
};

/*
 * AuthCommand:
 * Base type for all authentication-related commands
 */
export type AuthCommand = {
  email: string;
  password: string;
};

/*
 * RegisterUserCommand:
 * Command Model for registering a new user (POST /api/auth/register).
 */
export type RegisterUserCommand = AuthCommand;

/*
 * LoginCommand:
 * Command Model for user login (POST /api/auth/login).
 */
export type LoginCommand = AuthCommand;

/*
 * UserDTO:
 * DTO for user information returned in auth responses
 */
export type UserDTO = {
  id: string;
  email: string;
};

/*
 * AuthResponseDTO:
 * Base DTO for all authentication responses
 */
export type AuthResponseDTO = {
  token: string;
  user: UserDTO;
};

/*
 * RegisterResponseDTO:
 * DTO for the registration response (POST /api/auth/register)
 */
export type RegisterResponseDTO = AuthResponseDTO;

/*
 * LoginResponseDTO:
 * DTO for the login response (POST /api/auth/login)
 */
export type LoginResponseDTO = AuthResponseDTO;

/*
 * WordsQueryParams:
 * Query parameters for GET /api/words endpoint
 */
export type WordsQueryParams = {
  english?: string;
  arabic?: string;
  part_of_speech?: string;
  frequency?: Database["public"]["Enums"]["frequency_tag"];
  page?: number;
  limit?: number;
  sort_by?: string;
};

/*
 * WordDefinition:
 * Represents a single definition of a word
 */
export type WordDefinition = {
  id: number;
  definition: string;
  example?: string;
  usage_notes?: string;
};

/*
 * WordDialect:
 * Represents the dialect information for a word using country codes
 */
export type WordDialect = "lb" | "sa" | "eg";

/*
 * WordForm:
 * Represents a form of the word with its conjugation and dialect
 */
export type WordForm = {
  id: number;
  arabic_script: string;
  transliteration: string;
  conjugation: string;
  dialect: WordDialect;
  audio_url?: string;
};

/*
 * DetailedWordDTO:
 * Extended DTO for detailed word information
 */
export type DetailedWordDTO = WordDTO & {
  definitions: WordDefinition[];
  forms: WordForm[];
  frequency_tags: string[];
  usage_regions: WordDialect[];
  educational_notes?: string[];
  dialects: DialectDTO[];
};

/*
 * WordsResponse:
 * Represents the response for GET /api/words endpoint
 */
export type WordsResponse = {
  data: WordDTO[];
  pagination: PaginationDTO;
};

export type AuthError = {
  code: string;
  message: string;
};

// Add a default export to prevent router from treating this as a route
const Types = {};
export default Types;