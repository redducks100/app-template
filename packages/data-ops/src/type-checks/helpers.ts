/**
 * Compile-time type assertion helpers.
 * Zero runtime cost — these are only used in .check.ts files.
 */

/** Strip `undefined` from all property types (Zod `.optional()` and Kysely `Generated<>` both add `undefined`) */
export type StripOptional<T> = {
  [K in keyof T]-?: Exclude<T[K], undefined>;
};

/**
 * Assert that a schema field type is assignable to a DB column type.
 * One-directional: schema → DB (a non-null schema value can be written to a nullable column).
 */
type FieldMatch<SchemaVal, DBVal> =
  StripOptional<{ v: SchemaVal }> extends StripOptional<{ v: DBVal }> ? true : false;

/** Assert that all named fields in a schema are assignable to the corresponding DB table columns */
export type AssertFieldsMatch<
  Schema extends Record<string, unknown>,
  DBTable extends Record<string, unknown>,
  Fields extends (keyof Schema & keyof DBTable)[],
> = {
  [K in Fields[number]]: FieldMatch<Schema[K], DBTable[K]> extends true
    ? true
    : { error: `Field '${K & string}' type mismatch between schema and DB` };
};

/** Semantic alias for update/PATCH paths */
export type AssertPartialFieldsMatch<
  Schema extends Record<string, unknown>,
  DBTable extends Record<string, unknown>,
  Fields extends (keyof Schema & keyof DBTable)[],
> = AssertFieldsMatch<Schema, DBTable, Fields>;

/** Ensures a Zod enum's values match a Postgres enum's values */
export type AssertEnumMatch<ZodUnion extends string, DBUnion extends string> =
  ZodUnion extends DBUnion ? (DBUnion extends ZodUnion ? true : false) : false;

/** Enforcement wrapper — forces tsc to actually evaluate and error on `false` */
export type MustBeTrue<T extends true> = T;

/** Combine multiple assertions */
export type AllTrue<T extends Record<string, true>> = T;
