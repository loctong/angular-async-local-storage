import { JSONSchema } from './json-schema';

/**
 * Infer the data type from a tuple JSON schema.
 * Unfortunately, TypeScript doesn't provide yet a dynamic way to handle this,
 * so currently we have a limit of 10 for the tuple length.
 */
export type InferFromJSONSchemaTuple<Schemas extends readonly JSONSchema[]> =
  Schemas extends readonly [JSONSchema] ? [InferFromJSONSchema<Schemas[0]>] :
  Schemas extends readonly [JSONSchema, JSONSchema] ? [InferFromJSONSchema<Schemas[0]>, InferFromJSONSchema<Schemas[1]>] :
  Schemas extends readonly [JSONSchema, JSONSchema, JSONSchema] ? [InferFromJSONSchema<Schemas[0]>, InferFromJSONSchema<Schemas[1]>, InferFromJSONSchema<Schemas[2]>] :
  // tslint:disable-next-line: max-line-length
  Schemas extends readonly [JSONSchema, JSONSchema, JSONSchema, JSONSchema] ? [InferFromJSONSchema<Schemas[0]>, InferFromJSONSchema<Schemas[1]>, InferFromJSONSchema<Schemas[2]>, InferFromJSONSchema<Schemas[3]>] :
  // tslint:disable-next-line: max-line-length
  Schemas extends readonly [JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema] ? [InferFromJSONSchema<Schemas[0]>, InferFromJSONSchema<Schemas[1]>, InferFromJSONSchema<Schemas[2]>, InferFromJSONSchema<Schemas[3]>, InferFromJSONSchema<Schemas[4]>] :
  // tslint:disable-next-line: max-line-length
  Schemas extends readonly [JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema] ? [InferFromJSONSchema<Schemas[0]>, InferFromJSONSchema<Schemas[1]>, InferFromJSONSchema<Schemas[2]>, InferFromJSONSchema<Schemas[3]>, InferFromJSONSchema<Schemas[4]>, InferFromJSONSchema<Schemas[5]>] :
  // tslint:disable-next-line: max-line-length
  Schemas extends readonly [JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema] ? [InferFromJSONSchema<Schemas[0]>, InferFromJSONSchema<Schemas[1]>, InferFromJSONSchema<Schemas[2]>, InferFromJSONSchema<Schemas[3]>, InferFromJSONSchema<Schemas[4]>, InferFromJSONSchema<Schemas[5]>, InferFromJSONSchema<Schemas[6]>] :
  // tslint:disable-next-line: max-line-length
  Schemas extends readonly [JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema] ? [InferFromJSONSchema<Schemas[0]>, InferFromJSONSchema<Schemas[1]>, InferFromJSONSchema<Schemas[2]>, InferFromJSONSchema<Schemas[3]>, InferFromJSONSchema<Schemas[4]>, InferFromJSONSchema<Schemas[5]>, InferFromJSONSchema<Schemas[6]>, InferFromJSONSchema<Schemas[7]>] :
  // tslint:disable-next-line: max-line-length
  Schemas extends readonly [JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema] ? [InferFromJSONSchema<Schemas[0]>, InferFromJSONSchema<Schemas[1]>, InferFromJSONSchema<Schemas[2]>, InferFromJSONSchema<Schemas[3]>, InferFromJSONSchema<Schemas[4]>, InferFromJSONSchema<Schemas[5]>, InferFromJSONSchema<Schemas[6]>, InferFromJSONSchema<Schemas[7]>, InferFromJSONSchema<Schemas[8]>] :
  // tslint:disable-next-line: max-line-length
  Schemas extends readonly [JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema, JSONSchema] ? [InferFromJSONSchema<Schemas[0]>, InferFromJSONSchema<Schemas[1]>, InferFromJSONSchema<Schemas[2]>, InferFromJSONSchema<Schemas[3]>, InferFromJSONSchema<Schemas[4]>, InferFromJSONSchema<Schemas[5]>, InferFromJSONSchema<Schemas[6]>, InferFromJSONSchema<Schemas[7]>, InferFromJSONSchema<Schemas[8]>, InferFromJSONSchema<Schemas[9]>] :
  unknown[]
;

/**
 * Pick properties set as required,
 * and add the other properties as optional.
 */
export type ObjectFromJSONSchema<ObjectType, RequiredKeys extends keyof ObjectType> = Pick<ObjectType, RequiredKeys> & Partial<Omit<ObjectType, RequiredKeys>>;

/**
 * Infer the data type from a JSON schema.
 */
export type InferFromJSONSchema<Schema extends JSONSchema> =
  /* Infer `const` and `enum` first, as they are more specific */
  Schema extends { const: infer ConstType } ? ConstType :
  Schema extends { enum: readonly (infer EnumType)[] } ? EnumType :
  /* Infer primitive types */
  Schema extends { type: 'string' } ? string :
  Schema extends { type: 'integer' } ? number :
  Schema extends { type: 'number' } ? number :
  Schema extends { type: 'boolean' } ? boolean :
  /* Infer arrays */
  Schema extends { type: 'array', items: infer ItemsType } ?
    /* Classic array */
    ItemsType extends JSONSchema ? InferFromJSONSchema<ItemsType>[] :
    /* Tuples (ie. array with different value types) */
    ItemsType extends readonly JSONSchema[] ? InferFromJSONSchemaTuple<ItemsType> :
    /* Not supposed to happen given the `JSONSchema` interface */
    unknown[] :
  /* Infer objects */
  Schema extends { type: 'object', properties: infer Properties, required?: readonly (infer RequiredProperties)[] } ?
    ObjectFromJSONSchema<{ -readonly [Key in keyof Properties]: Properties[Key] extends JSONSchema ? InferFromJSONSchema<Properties[Key]> : unknown },
                         RequiredProperties extends keyof Properties ? RequiredProperties : never> :
  /* Default type if inference failed */
  unknown;