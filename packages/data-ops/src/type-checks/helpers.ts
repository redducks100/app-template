/**
 * Compile-time type assertion helpers.
 * Zero runtime cost — these are only used in .check.ts files.
 */

/** Strip `undefined` from all property types (Zod `.optional()` and Kysely `Generated<>` both add `undefined`) */
export type StripOptional<T> = {
  [K in keyof T]-?: Exclude<T[K], undefined>;
};

/**
 * Bidirectional field-level type assertion.
 * Ensures schema output and DB column types are mutually assignable (after stripping `undefined`).
 */
export type AssertFieldsMatch<
  Schema extends Record<string, unknown>,
  DBTable extends Record<string, unknown>,
  Fields extends keyof Schema & keyof DBTable,
> = {
  [K in Fields]: Exclude<Schema[K], undefined> extends Exclude<DBTable[K], undefined>
    ? Exclude<DBTable[K], undefined> extends Exclude<Schema[K], undefined>
      ? true
      : ["Schema output too narrow for DB column", K, { db: DBTable[K]; schema: Schema[K] }]
    : ["DB column not satisfied by schema output", K, { db: DBTable[K]; schema: Schema[K] }];
};

/**
 * One-directional field-level type assertion (schema → DB).
 * Used for input/create/update schemas where a non-null schema value can be written to a nullable column.
 */
export type AssertInputFieldsMatch<
  Schema extends Record<string, unknown>,
  DBTable extends Record<string, unknown>,
  Fields extends keyof Schema & keyof DBTable,
> = {
  [K in Fields]: Exclude<Schema[K], undefined> extends Exclude<DBTable[K], undefined>
    ? true
    : ["Input field not assignable to DB column", K, { db: DBTable[K]; schema: Schema[K] }];
};

/** Semantic alias for update/PATCH paths */
export type AssertPartialFieldsMatch<
  Schema extends Record<string, unknown>,
  DBTable extends Record<string, unknown>,
  Fields extends keyof Schema & keyof DBTable,
> = AssertInputFieldsMatch<Schema, DBTable, Fields>;

/** Ensures a Zod enum's values match a Postgres enum's values */
export type AssertEnumMatch<
  ZodUnion extends string,
  DBUnion extends string,
> = ZodUnion extends DBUnion ? (DBUnion extends ZodUnion ? true : false) : false;

/** Enforcement wrapper — forces tsc to actually evaluate and error on `false` */
export type MustBeTrue<T extends true> = T;

/** Combine multiple assertions */
export type AllTrue<T extends Record<string, true>> = T;
