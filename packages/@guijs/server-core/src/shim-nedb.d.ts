// Forked from https://github.com/bajankristof/nedb-promises/blob/master/index.d.ts

declare module 'nedb-promise' {
  // Type definitions for NeDB 1.8
  // Project: https://github.com/bajankristof/nedb-promises
  // Definitions by: Sam Denty <https://github.com/samdenty99>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
  export = Datastore
  export as namespace Datastore

  type Document = {
    _id: string
    createdAt?: Date
    updatedAt?: Date
  }

  declare class Datastore extends EventEmitter {
    /**
     * Datastore constructor...
     *
     * You should use `Datastore.create(...)` instead
     * of `new Datastore(...)`. With that you can access
     * the original datastore's properties such as `datastore.persistance`.
     *
     * It's basically the same as the original:
     * https://github.com/louischatriot/nedb#creatingloading-a-database
     */
    constructor(pathOrOptions?: string | Nedb.DatastoreOptions)

    /**
     * Load the datastore.
     */
    load(): Promise<undefined>

    /**
     * Find documents that match a query.
     *
     * It's basically the same as the original:
     * https://github.com/louischatriot/nedb#finding-documents
     *
     * There are differences minor in how the cursor works though.
     *
     * @example
     * datastore.find({ ... }).sort({ ... }).exec().then(...)
     *
     * @example
     * datastore.find({ ... }).sort({ ... }).then(...)
     *
     * @example
     * // in an async function
     * await datastore.find({ ... }).sort({ ... })
     */
    find<T>(query: any, projection?: T): Nedb.Cursor<(T & Document)[]>
    cfind<T>(query: any, projection?: T): Nedb.Cursor<(T & Document)[]>

    /**
     * Find a document that matches a query.
     *
     * It's basically the same as the original:
     * https://github.com/louischatriot/nedb#finding-documents
     */
    findOne<T>(query: any, projection?: T): Promise<T & Document>

    /**
     * Insert a document or documents.
     *
     * It's basically the same as the original:
     * https://github.com/louischatriot/nedb#inserting-documents
     *
     * @param  {Object|Object[]} docs
     * @return {Promise.<Object|Object[]>}
     */
    insert<T extends any | any[]>(docs: T): Promise<T & Document>

    /**
     * Update documents that match a query.
     *
     * It's basically the same as the original:
     * https://github.com/louischatriot/nedb#updating-documents
     *
     * If you set `options.returnUpdatedDocs`,
     * the returned promise will resolve with
     * an object (if `options.multi` is `false`) or
     * with an array of objects.
     */

    update<T>(
      query: any,
      updateQuery: any,
      options?: Nedb.UpdateOptions & { returnUpdatedDocs?: false }
    ): Promise<number>

    update<T>(
      query: any,
      updateQuery: any,
      options?: Nedb.UpdateOptions & { returnUpdatedDocs: true; multi?: false }
    ): Promise<T & Document>

    update<T>(
      query: any,
      updateQuery: any,
      options?: Nedb.UpdateOptions & { returnUpdatedDocs: true; multi: true }
    ): Promise<(T & Document)[]>

    /**
     * Remove documents that match a query.
     *
     * It's basically the same as the original:
     * https://github.com/louischatriot/nedb#removing-documents
     */
    remove(query: any, options: Nedb.RemoveOptions): Promise<number>

    /**
     * Count all documents matching the query
     * @param query MongoDB-style query
     */
    count(query: any): Promise<number>

    /**
     * Ensure an index is kept for this field. Same parameters as lib/indexes
     * For now this function is synchronous, we need to test how much time it takes
     * We use an async API for consistency with the rest of the code
     */
    ensureIndex(options: Nedb.EnsureIndexOptions): Promise<undefined>

    /**
     * Remove an index
     */
    removeIndex(fieldName: string): Promise<undefined>
  }
}
