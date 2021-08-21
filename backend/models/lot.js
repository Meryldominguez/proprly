"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const Prop = require("./prop");
const Tag = require("./tag");

/** Related functions for lots. */

class Lot {
  /** Create a lot (from data), update db, return new lot data.
   *
   * data should be { id, name, description, numEmployees, logoUrl }
   *
   * Returns { id, name, description, numEmployees, logoUrl }
   *
   * Throws BadRequestError if lot already in database.
   * */

  static async create({ name, locId, quantity, price, description}) {
    const duplicateCheck = await db.query(
      `SELECT name, loc_id
       FROM lot
       WHERE name = $1 AND loc_id = $2`,
    [name, locId]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate item: ${name} already exists, in the same location. `);

    const {rows:[lot]} = await db.query(
          `INSERT INTO lot
           (name, loc_id, quantity, price, description)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, name, loc_id as "locId", quantity, price, description`,
        [
          name,
          locId,
          quantity,
          price,
          description
        ],
    );
    return lot;
  }

  /** Find all lots (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - location
   * - name (will find case-insensitive, partial matches)
   *
   * Returns [{ id, name, location, description, quantity, price }, ...]
   * */

   static async findAll(params={}) {
    let query = `
    SELECT 
        lot.id, 
        lot.name,
        location.id as "locId",
        location.name as location, 
        lot.quantity,
        CAST(lot.quantity-(SELECT SUM(prop.quantity) FROM prop WHERE lot_id=lot.id) 
          as int) AS available, 
        lot.price,
        array_remove(array_agg(tag.title), NULL) AS tags,
        lot.description
      FROM lot
      LEFT JOIN location ON location.id = lot.loc_id
      LEFT JOIN lot_tag AS lt ON lt.lot_id=lot.id
      LEFT JOIN tag on tag.id=tag_id
    `; 
    let whereExpressions = [];
    let queryValues = [];
    
    // For each possible search term, add to whereExpressions and queryValues
    // we can generate the right SQL
    if (params['searchTerm']) {
      
      queryValues.push(`%${params.searchTerm.toLowerCase()}%`);

      whereExpressions.push(`lot.name ILIKE $${queryValues.length}`)
      whereExpressions.push(`lot.description ILIKE $${queryValues.length}`)

      query += "WHERE " + whereExpressions.join(" OR ")
    }
      query += "GROUP BY lot.id, location.id\n";
      query += "ORDER BY lot.id,lot.name";
      // Finalize query and return results
      
   if (queryValues.length>0){
     const lotsRes = await db.query(query, queryValues)
     return lotsRes.rows
   }
    const lotsRes = await db.query(query)
    return lotsRes.rows;
  }

  /** Given a lot id, return data about lot.
   *
   * Returns { id, name, location, quantity, price, description, productions=[...the productions that have used this lot] }
   *
   * Throws NotFoundError if not found.
   **/

   static async get(id) {
    if (typeof id != "number") throw new BadRequestError(`${id} is not an integer`)
    const {rows:[lot]} = await db.query(
          `SELECT lot.id,
                  lot.name,
                  lot.loc_id as "locId", 
                  lot.quantity, 
                  CAST(lot.quantity-(SELECT SUM(prop.quantity) FROM prop WHERE lot_id=$1) as int)
                    AS available,
                  lot.price,
                  lot.description,
                  l.name as "location",
                  array_remove(array_agg(tag.title), NULL) AS tags 
           FROM lot
           JOIN location AS l ON l.id=lot.loc_id
           LEFT JOIN lot_tag ON lot_id=lot.id
           LEFT JOIN tag ON tag.id=tag_id
           WHERE lot.id=$1
           GROUP BY lot.id, l.name`,
        [id]);

    if (!lot) throw new NotFoundError(`No lot: ${id}`);
    const usedProps = await Prop.getLotProps(id)
    lot.active= usedProps

    return lot;
  }

  /** Update lot data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, description, numEmployees, logoUrl}
   *
   * Returns {id, name, description, numEmployees, logoUrl}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    if (Object.keys(data).length === 0 ) throw new BadRequestError("No update data sumbitted")
    if (typeof data !== "object" || data === null ) throw new BadRequestError("data is invalid")

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {locId:"loc_id"});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE lot 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                name, 
                                description, 
                                quantity,
                                price,
                                loc_id as "locId"`;
    const {rows:[lot]} = await db.query(querySql, [...values, id]);

    if (!lot) throw new NotFoundError(`No lot: ${id}`);

    return lot;
  }

  /** Delete given lot from database; returns undefined.
   *
   * Throws NotFoundError if lot not found.
   **/

  static async remove(id) {
    if (typeof id != 'number') throw new BadRequestError(`${id} is not an integer`)

    const {rows:[lot]} = await db.query(
          `DELETE
           FROM lot
           WHERE id = $1
           RETURNING id`,
        [id]);

    if (!lot) throw new NotFoundError(`No lot: ${id}`);
    return lot
  }
}

module.exports = Lot;
