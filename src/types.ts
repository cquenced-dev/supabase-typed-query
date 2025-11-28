/**
 * Core type definitions for supabase-typed-query
 */

// =============================================================================
// Database Schema Types
// =============================================================================

/**
 * Base schema interface that all databases must conform to.
 * Consumer-provided Database types must extend this interface.
 */
export interface DatabaseSchema {
  public: {
    Tables: Record<
      string,
      {
        Row: object
        Insert: object
        Update: object
      }
    >
    Views?: Record<string, { Row: object }>
    Functions?: Record<string, { Args: object; Returns: unknown }>
    Enums?: Record<string, unknown>
    CompositeTypes?: Record<string, unknown>
  }
}

/**
 * Default Database type - used as fallback when no specific database type is provided.
 * For proper type inference, consumers should pass their generated Database type as a generic.
 */
export interface Database extends DatabaseSchema {
  public: {
    Tables: Record<
      string,
      {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
    >
    Views: Record<string, { Row: Record<string, unknown> }>
    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown }>
    Enums: Record<string, unknown>
    CompositeTypes: Record<string, unknown>
  }
}

// =============================================================================
// Generic Table Types
// =============================================================================

/**
 * Table names for a given database schema.
 * @typeParam DB - The database schema type (defaults to placeholder Database)
 */
export type TableNames<DB extends DatabaseSchema = Database> = keyof DB["public"]["Tables"] & string

/**
 * Row type for a given table in a database schema.
 * @typeParam T - The table name
 * @typeParam DB - The database schema type (defaults to placeholder Database)
 */
export type TableRow<T extends TableNames<DB>, DB extends DatabaseSchema = Database> = DB["public"]["Tables"][T]["Row"]

/**
 * Insert type for a given table in a database schema.
 * @typeParam T - The table name
 * @typeParam DB - The database schema type (defaults to placeholder Database)
 */
export type TableInsert<
  T extends TableNames<DB>,
  DB extends DatabaseSchema = Database,
> = DB["public"]["Tables"][T]["Insert"]

/**
 * Update type for a given table in a database schema.
 * @typeParam T - The table name
 * @typeParam DB - The database schema type (defaults to placeholder Database)
 */
export type TableUpdate<
  T extends TableNames<DB>,
  DB extends DatabaseSchema = Database,
> = DB["public"]["Tables"][T]["Update"]

// =============================================================================
// Utility Types
// =============================================================================

// Empty object type for optional parameters
export type EmptyObject = Record<string, never>

// =============================================================================
// Query Builder Types
// =============================================================================

// Query builder interface that Supabase returns from .from()
export interface QueryBuilder extends Promise<{ data: unknown; error: unknown }> {
  select: (columns?: string) => QueryBuilder
  insert: (data: unknown) => QueryBuilder
  update: (data: unknown) => QueryBuilder
  upsert: (data: unknown, options?: { onConflict?: string }) => QueryBuilder
  delete: () => QueryBuilder
  match: (query: Record<string, unknown>) => QueryBuilder
  eq: (column: string, value: unknown) => QueryBuilder
  neq: (column: string, value: unknown) => QueryBuilder
  gt: (column: string, value: unknown) => QueryBuilder
  gte: (column: string, value: unknown) => QueryBuilder
  lt: (column: string, value: unknown) => QueryBuilder
  lte: (column: string, value: unknown) => QueryBuilder
  like: (column: string, pattern: string) => QueryBuilder
  ilike: (column: string, pattern: string) => QueryBuilder
  is: (column: string, value: boolean | null) => QueryBuilder
  in: (column: string, values: unknown[]) => QueryBuilder
  or: (filters: string) => QueryBuilder
  single: () => QueryBuilder
  limit: (count: number) => QueryBuilder
  order: (column: string, options?: { ascending?: boolean }) => QueryBuilder
}

// =============================================================================
// Client Types
// =============================================================================

/**
 * Supabase client type - accepts any client with a compatible from() method.
 * Uses `unknown` return type to allow SupabaseClient<Database> from @supabase/supabase-js
 * to be used directly without type casting.
 *
 * @typeParam DB - The database schema type (defaults to placeholder Database)
 */
export interface SupabaseClientType<DB extends DatabaseSchema = Database> {
  from: (table: TableNames<DB>) => unknown
}
