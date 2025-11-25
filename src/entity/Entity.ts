/**
 * Entity - Standard entity without partition
 *
 * Use this for global/shared data that doesn't require partition-based isolation.
 * For multi-tenant data, use PartitionedEntity instead.
 *
 * @example
 * ```typescript
 * // Create a global entity
 * const TenantEntity = Entity<"tenants">(client, "tenants", {
 *   softDelete: true
 * })
 *
 * // Query without partition key
 * const tenants = await TenantEntity.getItems({ where: { status: "active" } }).many()
 * const tenant = await TenantEntity.getItem({ id: "123" }).one()
 * ```
 */

import type { SupabaseClientType, TableNames } from "@/types"

import { getSoftDeleteMode, makeAddItems, makeGetItem, makeGetItems, makeUpdateItem, makeUpdateItems } from "./core"
import type { EntityConfig, IEntity } from "./types"

// Re-export types for backwards compatibility
export type {
  AddItemsParams,
  EntityConfig,
  EntityType,
  GetItemParams,
  GetItemsParams,
  IdParam,
  IEntity,
  IsParams,
  MutationMultiExecution,
  MutationSingleExecution,
  OrderParams,
  TypedRecord,
  UpdateItemParams,
  UpdateItemsParams,
  WhereinParams,
  WhereParams,
} from "./types"
export { MultiMutationQuery, SingleMutationQuery } from "./types"

/**
 * Creates an entity interface with methods for interacting with the given table.
 *
 * @param client The Supabase client instance to use for queries.
 * @param name The name of the table to interact with.
 * @param config Configuration for entity behavior.
 * @returns An object with methods for interacting with the table.
 *
 * @typeParam T - The table name type
 */
export const Entity = <T extends TableNames>(client: SupabaseClientType, name: T, config: EntityConfig): IEntity<T> => {
  const softDeleteMode = getSoftDeleteMode(config.softDelete)

  return {
    /**
     * Retrieve a single item from the table by ID.
     * @param params Query parameters including id, where conditions, and is conditions
     * @returns A chainable query that can be executed with .one(), .many(), or .first()
     */
    getItem: makeGetItem(client, name, softDeleteMode),

    /**
     * Get a list of items from the table filtered by conditions.
     * @param params Optional query parameters including where, is, wherein, and order
     * @returns A chainable query that can be executed with .one(), .many(), or .first()
     */
    getItems: makeGetItems(client, name, softDeleteMode),

    /**
     * Adds multiple items to the table.
     * @param params Parameters including items array
     * @returns A mutation query with OrThrow methods
     */
    addItems: makeAddItems(client, name),

    /**
     * Update a single item in the table.
     * @param params Update parameters including id, item data, and optional filters
     * @returns A mutation query with OrThrow methods
     */
    updateItem: makeUpdateItem(client, name),

    /**
     * Update multiple items in the table.
     * @param params Update parameters including items array, identity, and optional filters
     * @returns A mutation query with OrThrow methods
     */
    updateItems: makeUpdateItems(client, name),
  }
}
