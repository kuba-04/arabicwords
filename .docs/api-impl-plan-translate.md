# API Endpoint Implementation Plan: GET /api/words/translate

## 1. Overview of the endpoint

The GET /api/words/translate endpoint is designed to translate a given word either from English to Lebanese Arabic or vice versa. It returns a JSON payload with the input word and its translation.

## 2. Request details

- **HTTP Method:** GET
- **URL:** /api/words/translate
- **Query Parameters:**
  - **word** (required): The term to translate.
  - **direction** (required): The translation direction, either `en-to-ar` for English-to-Arabic translation or `ar-to-en` for Arabic-to-English translation.
- **Request Body:** Not applicable.

## 3. Types used

- **TranslationResponseDTO:**
  ```typescript
  export type TranslationResponseDTO = {
    word: string;
    translation: string;
  };
  ```

## 4. Response details

- **Success (200 OK):** Returns a JSON object containing the original word and its translation.
  ```json
  {
    "word": "example",
    "translation": "مثال"
  }
  ```
- **Error Responses:**
  - **400 Bad Request:** If required query parameters are missing, empty, or invalid.
  - **404 Not Found:** If no translation can be found for the provided word.
  - **500 Internal Server Error:** For unexpected server errors.

## 5. Data flow

1. The client sends a GET request to `/api/words/translate` with the required query parameters.
2. The API endpoint extracts and validates the `word` and `direction` parameters.
3. Based on the `direction` parameter:
   - For `en-to-ar`: Query the database's `Words` table filtering by `english_term`.
   - For `ar-to-en`: Query the database's `Words` table filtering by `primary_arabic_script`.
4. The database returns a matching word record if one exists.
5. The translation (either `primary_arabic_script` or `english_term`) is then extracted and returned in the JSON response.
6. If no match is found, return a 404 error.

## 6. Security considerations

- **Authentication & Authorization:** Ensure only authenticated users access this endpoint according to the application's RLS policies if applicable.
- **Input Validation:** Rigorously validate both `word` and `direction` parameters to prevent SQL injection and similar attacks.
- **Error Logging:** Log any errors encountered during database queries or translation processing, ensuring sensitive details are not exposed to the client.
- **Database Security:** Use the Supabase client retrieved from `context.locals` to ensure proper security context is maintained.

## 7. Error handling

- **400 Bad Request:**
  - Input validation failures (missing or empty `word`, invalid `direction` values).
- **404 Not Found:**
  - When no matching translation is found in the database.
- **500 Internal Server Error:**
  - Any unexpected exceptions during processing will be caught, logged, and a generic error message will be returned.

## 8. Performance considerations

- **Database Indexing:** Leverage existing indexes on `english_term` and `primary_arabic_script` to optimize query performance.
- **Caching Strategy:** Consider caching frequent translations if performance becomes an issue.
- **Efficient Querying:** Only select required fields from the database to reduce load.
- **Error Logging Performance:** Utilize asynchronous logging to avoid blocking the main execution flow.

## 9. Implementation steps

1. **Setup Endpoint:**
   - Create or modify the API route file under `./src/pages/api/words/translate.ts` (or the appropriate file structure).
2. **Parameter Extraction & Validation:**
   - Ensure query parameters `word` and `direction` are provided.
   - Validate that `direction` is either `en-to-ar` or `ar-to-en`.
   - Return a 400 response if validations fail.
3. **Translation Service:**
   - Implement or update a service function in `./src/lib` to handle the translation logic.
   - The service should accept `word` and `direction`, perform the database query, and return the translation.
4. **Database Query:**
   - Use the Supabase client from `context.locals` to query the `Words` table.
   - For `en-to-ar`, query by `english_term` and for `ar-to-en`, query by `primary_arabic_script`.
5. **Response Construction:**
   - If a matching record is found, extract the corresponding translation field and form a `TranslationResponseDTO`.
   - Return the response with a 200 status code.
6. **Error Handling & Logging:**
   - Catch any errors during processing and log them appropriately (using the logging infrastructure).
   - Return the appropriate error responses (400, 404, or 500).
7. **Testing:**
   - Write unit and integration tests using Vitest and React Testing Library to cover all edge cases, including missing parameters, not found translations, and successful responses.
8. **Documentation & Code Review:**
   - Document the endpoint implementation, update API documentation.
   - Conduct a code review for adherence to the implementation rules and coding practices.
