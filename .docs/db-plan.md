# Database Schema for Arabic Words MVP

## 1. Tables and Columns

### 1.1 UserProfiles

- **user_id**: UUID, PRIMARY KEY, REFERENCES auth.users(id), NOT NULL.
- **has_offline_dictionary_access**: BOOLEAN, NOT NULL, DEFAULT FALSE.
- **subscription_valid_until**: TIMESTAMPTZ, NULLABLE.
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW().
- **updated_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW().

### 1.2 Words

- **id**: UUID, PRIMARY KEY.
- **english_term**: VARCHAR(30), NOT NULL.
- **primary_arabic_script**: VARCHAR(30), NOT NULL.
- **part_of_speech**: VARCHAR(30), NOT NULL -- (Allowed values: 'Noun', 'Verb', 'Adjective', 'Adverb', 'Pronoun', 'Preposition', 'Conjunction', 'Interjection').
- **english_definition**: TEXT.
- **general_frequency_tag**: ENUM('VERY_FREQUENT', 'FREQUENT', 'COMMON', 'UNCOMMON', 'RARE', 'NOT_DEFINED'), NOT NULL.
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW().
- **updated_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW().

**Constraints:**

- UNIQUE(english_term, part_of_speech)
- UNIQUE(primary_arabic_script)

### 1.3 WordForms

- **id**: UUID, PRIMARY KEY.
- **word_id**: UUID, NOT NULL, REFERENCES Words(id) ON DELETE RESTRICT.
- **arabic_script_variant**: VARCHAR(30), NULLABLE.
- **transliteration**: VARCHAR(30), NOT NULL.
- **conjugation_details**: TEXT NOT NULL.
- **audio_url**: TEXT, NULLABLE.
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW().
- **updated_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW().

### 1.4 Dialects

- **id**: UUID, PRIMARY KEY.
- **name**: VARCHAR(30), NOT NULL, UNIQUE.
- **country_code**: VARCHAR(10), NOT NULL.
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW().
- **updated_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW().

### 1.5 WordFormDialects (Junction Table)

- **word_form_id**: UUID, NOT NULL, REFERENCES WordForms(id) ON DELETE RESTRICT.
- **dialect_id**: UUID, NOT NULL, REFERENCES Dialects(id) ON DELETE RESTRICT.
- **Primary Key**: (word_form_id, dialect_id)

## 2. Relationships Between Tables

- **Words → WordForms**: One-to-Many. Each word can have multiple forms.
- **WordForms ↔ Dialects**: Many-to-Many via WordFormDialects.
- **UserProfiles → auth.users**: One-to-One, where user_id references the auth.users table.

## 3. Indexes

- B-tree index on `Words.english_term`.
- B-tree index on `Words.primary_arabic_script` (unique index due to UNIQUE constraint).
- B-tree index on `Words.general_frequency_tag`.
- B-tree index on `WordForms.transliteration`.
- Indexes on foreign key columns: `WordForms.word_id`; `WordFormDialects.word_form_id` and `WordFormDialects.dialect_id`.

## 4. PostgreSQL Row-Level Security (RLS) Policies

### 4.1 UserProfiles

- **Policy**: Allow each user to access only their own profile.
  - Example: `USING (user_id = auth.uid())`

### 4.2 Dictionary Tables (Words, WordForms, Dialects, WordFormDialects)

- **Policy**: Publicly readable by all authenticated users.
- **Policy**: Write operations (INSERT, UPDATE, DELETE) restricted to admin/editor roles.
  - Example: `WITH CHECK (current_setting('app.current_role') IN ('admin', 'editor'))`

## 5. Additional Comments and Design Decisions

- The `Words` table enforces uniqueness on the combination of `english_term` and `part_of_speech` to differentiate multiple meanings of the same term.
- The `primary_arabic_script` field in `Words` has a UNIQUE constraint to maintain a consistent primary representation.
- Certain text fields (e.g. `english_term`, `primary_arabic_script`, `transliteration`, and `Dialects.name`) are limited to 30 characters.
- ENUM types are used for `Words.general_frequency_tag` (and optionally for `part_of_speech` if defined as a PostgreSQL ENUM type).
- All foreign key relationships use `ON DELETE RESTRICT` to prevent accidental deletion of core dictionary data.
- Caching strategies will be handled at the application layer.
- RLS policies ensure secure access: only the profile owner can modify UserProfiles, while dictionary data modifications are limited to admin/editor roles.
- The schema is normalized to 3NF, ensuring efficient data storage and scalability for the MVP.
