# Supabase Integration Plan

## 1. Resources (Database Tables)

[Previous resources section remains unchanged as it correctly describes our data model]

## 2. Data Access Patterns

### A. Word Translation and Dictionary Search

1. **Dictionary Search and Filtering**

   - **Description:** Query Words table with support for filtering, pagination, and sorting
   - **Implementation:** Supabase query builder with:
     - Filtering options: English term, Arabic script, part of speech, frequency
     - Join with WordForms for complete word information
     - Pagination support
     - Sorting capabilities
   - **Response Structure:** Same as current JSON structure
   - **Error Handling:** Standard Supabase error types

2. **Translation Lookup**
   - **Description:** Bidirectional translation lookup (English to Arabic or vice versa)
   - **Implementation:** Supabase query with text matching
   - **Input:** Word and translation direction
   - **Output:** Translation result or not found error

### B. Dictionary Management (Admin/Editor Only)

Access controlled via Row Level Security (RLS) policies

1. **Create Word Entry**

   - **Description:** Insert new dictionary entry
   - **Access:** Admin/Editor roles only
   - **Validation:** Field constraints and uniqueness checks
   - **Error Handling:** Duplicate entries, validation errors

2. **Update Word Entry**

   - **Description:** Modify existing dictionary entry
   - **Access:** Admin/Editor roles only
   - **Validation:** Same as create operation
   - **Error Handling:** Not found, validation errors

3. **Delete Word Entry**
   - **Description:** Remove dictionary entry
   - **Access:** Admin/Editor roles only
   - **Behavior:** Cascade delete related word forms
   - **Error Handling:** Not found, foreign key violations

### C. Authentication Operations

1. **User Registration**

   - **Description:** Create new user account
   - **Implementation:** Supabase Auth signUp
   - **Post-registration:** Create UserProfile record
   - **Error Handling:** Email validation, duplicate accounts

2. **User Login**

   - **Description:** Authenticate existing user
   - **Implementation:** Supabase Auth signInWithPassword
   - **Response:** Session token and user data
   - **Error Handling:** Invalid credentials

3. **Account Deletion**
   - **Description:** Delete user account and associated data
   - **Implementation:** Two-step process:
     1. Delete user profile and related data
     2. Delete auth user record
   - **Access:** Authenticated user (own account only)
   - **Error Handling:** Not found, unauthorized

## 3. Authentication and Authorization

- Supabase Auth handles user authentication
- Row Level Security (RLS) policies control data access
- JWT tokens managed by Supabase client
- Role-based access control for admin functions

## 4. Row Level Security Policies

- Read access policies for authenticated users
- Write access policies for admin/editor roles
- User-specific data access policies
- Profile data privacy policies

## 5. Type Definitions

- Shared TypeScript interfaces for all entities
- Error type definitions
- DTO interfaces for data transfer
- Enum types for fixed values (e.g., FrequencyTag)

## 6. Error Handling

- Standard error types from Supabase
- Custom error wrapper for frontend messages
- Consistent error structure across all operations
- Proper error logging and monitoring

## 7. Performance Considerations

- Query optimization using appropriate indexes
- Efficient joins and filtering
- Caching strategies where applicable
- Pagination for large result sets
