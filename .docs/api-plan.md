/_ API Plan Document _/

# REST API Plan

## 1. Resources

- **UserProfiles**: Corresponds to the `UserProfiles` table. Stores user subscription data and access rights.
- **Words**: Corresponds to the `Words` table. Contains the dictionary entries along with language specifics and frequency tags.
- **WordForms**: Corresponds to the `WordForms` table. Stores variations, transliterations, conjugation details, and associated audio URLs.
- **Dialects**: Corresponds to the `Dialects` table. Stores information about different dialects (e.g., Lebanese Arabic).
- **WordFormDialects**: Corresponds to the `WordFormDialects` junction table. Connects word forms with their applicable dialects.
- **Auth Users**: Managed externally (via Supabase auth) and referenced in the UserProfiles table.

## 2. Endpoints

### A. Word Translation and Dictionary Search

1. **GET /api/words**

   - **Description:** Retrieve words from the dictionary with support for filtering by English term, Arabic script, part of speech, and frequency tag. Supports pagination, filtering, and sorting.
   - **Request Parameters:**
     - Query parameters such as:
       - `english` (optional): Filter by English term
       - `arabic` (optional): Filter by primary Arabic script
       - `part_of_speech` (optional)
       - `frequency` (optional): Corresponds to `general_frequency_tag`
       - `page` (optional): Page number for pagination
       - `limit` (optional): Number of records per page
       - `sort_by` (optional): Field to sort results
   - **JSON Response Payload Structure:**
     ```json
     {
       "data": [
         {
           "id": "UUID",
           "english_term": "string",
           "primary_arabic_script": "string",
           "part_of_speech": "string",
           "english_definition": "string",
           "general_frequency_tag": "VERY_FREQUENT|FREQUENT|COMMON|UNCOMMON|RARE|NOT_DEFINED",
           "word_forms": [
             {
               "id": "UUID",
               "transliteration": "string",
               "conjugation_details": "string",
               "audio_url": "string | null"
             }
           ]
         }
       ],
       "pagination": {
         "page": 1,
         "limit": 10,
         "total": 100
       }
     }
     ```
   - **Success Codes:** 200 OK
   - **Error Codes:** 400 Bad Request (invalid query parameters), 404 Not Found

2. **GET /api/words/translate**
   - **Description:** Translate a given word from English to Lebanese Arabic or vice versa.
   - **Request Parameters:**
     - Query parameters:
       - `word` (required): The term to translate
       - `direction` (required): Either `en-to-ar` or `ar-to-en`
   - **JSON Response Payload Structure:**
     ```json
     {
       "word": "string",
       "translation": "string"
     }
     ```
   - **Success Codes:** 200 OK
   - **Error Codes:** 400 Bad Request (missing or empty input), 404 Not Found (if the translation does not exist)

### B. CRUD Operations for Dictionary Management (Admin/Editor Only)

For the following endpoints, access is restricted and validated via role-based authorization (roles: admin, editor).

3. **POST /api/words**

   - **Description:** Create a new word entry in the dictionary.
   - **JSON Request Payload Structure:**
     ```json
     {
       "english_term": "string",
       "primary_arabic_script": "string",
       "part_of_speech": "string",
       "english_definition": "string",
       "general_frequency_tag": "VERY_FREQUENT|FREQUENT|COMMON|UNCOMMON|RARE|NOT_DEFINED"
     }
     ```
   - **JSON Response Payload Structure:** Returns the created word object with its auto-generated `id` and timestamps.
   - **Success Codes:** 201 Created
   - **Error Codes:** 400 Bad Request, 409 Conflict (if uniqueness constraints are violated)

4. **PUT /api/words/{id}**

   - **Description:** Update an existing word entry.
   - **URL Parameter:** `id` (UUID of the word)
   - **JSON Request Payload Structure:** Same as POST /api/words
   - **Success Codes:** 200 OK
   - **Error Codes:** 400 Bad Request, 404 Not Found, 409 Conflict

5. **DELETE /api/words/{id}**
   - **Description:** Delete a word entry from the dictionary. Cascading restrictions apply for associated word forms.
   - **URL Parameter:** `id` (UUID of the word)
   - **Success Codes:** 200 OK with a confirmation message
   - **Error Codes:** 404 Not Found, 403 Forbidden (if unauthorized)

_Similar CRUD endpoints would be defined for **WordForms**, **Dialects** and managing junctions in **WordFormDialects** with corresponding validations for foreign key constraints._

### C. Offline Dictionary Download & Payment

TODO: this will be added later

### D. Authentication Endpoints

7. **POST /api/auth/register**

   - **Description:** Register a new user account.
   - **JSON Request Payload Structure:**
     ```json
     {
       "email": "string",
       "password": "string"
     }
     ```
   - **JSON Response Payload Structure:** Includes user profile details and authentication token.
   - **Success Codes:** 201 Created
   - **Error Codes:** 400 Bad Request

8. **POST /api/auth/login**
   - **Description:** Log in an existing user.
   - **JSON Request Payload Structure:**
     ```json
     {
       "email": "string",
       "password": "string"
     }
     ```
   - **JSON Response Payload Structure:**
     ```json
     {
       "token": "JWT",
       "user": { "id": "UUID", "email": "string" }
     }
     ```
   - **Success Codes:** 200 OK
   - **Error Codes:** 401 Unauthorized

## 3. Authentication and Authorisation

- **Mechanism:** Token-based authentication using JWT (JSON Web Tokens) provided by Supabase's auth system.
- **Implementation Details:**
  - Every restricted endpoint requires the `Authorization: Bearer <token>` header.
  - Role-based access control is enforced, with admin and editor roles allowed to perform data modifications (CRUD operations on dictionary entries).
  - Supabase Row-Level Security (RLS) policies ensure that users can only access their own profiles and that dictionary modifications are limited to privileged roles.

## 4. Validation and Business Logic

- **Validation Conditions:**

  - Fields such as `english_term`, `primary_arabic_script`, and `transliteration` are limited to 30 characters.
  - Unique constraints:
    - Combination of `english_term` and `part_of_speech` must be unique.
    - `primary_arabic_script` is unique.
  - Foreign key relationships must be maintained (e.g., `word_id` in WordForms, and dialect references in WordFormDialects).

- **Business Logic Implementation:**
  - **Translation Endpoints:**
    - Validate that the input word is not empty. Return a 400 error if it is.
    - If no translation is found, return a 404 error with an appropriate message.
    - Use caching strategies to serve frequent queries in under 1 second (as specified in the PRD).
  - **Offline Dictionary & Payment:**
    TODO: will be added later
  - **Error Handling:** For each endpoint, errors such as 400 for bad requests, 404 for not found, and 409 for conflict on unique constraints are implemented.
  - **Pagination, Filtering & Sorting:** These are supported on list endpoints to enhance performance and scalability, especially for the dictionary search endpoints.

_Assumptions:_

- The API will integrate with the frontend built with Expo & React Native, using TypeScript for type safety.
- Supabase will handle the backend database connectivity and authentication, while caching may be implemented at the application layer or via a dedicated caching service.
