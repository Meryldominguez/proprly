"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const Prop = require("./prop");

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

  static async create({ name, loc_id, quantity, price, description}) {
    const duplicateCheck = await db.query(
      `SELECT name, loc_id
       FROM lot
       WHERE name = $1 AND loc_id = $2`,
    [name, loc_id]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate item: ${name} already exists, in the same location. `);

    const result = await db.query(
          `INSERT INTO lot
           (name, loc_id, quantity, price, description)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, name, loc_id, quantity, price, description`,
        [
          name,
          loc_id,
          quantity,
          price,
          description
        ],
    );
    const lot = result.rows[0];
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
    let selectCols=[
        "lot.id", 
        "lot.name",
        "location.name as location", 
        "lot.quantity", 
        "lot.price", 
        "lot.description"]

    let query = `SELECT ${selectCols.join(", ")}
                 FROM lot
                 JOIN location ON location.id = lot.loc_id
                 `
                 ; 
    let whereExpressions = [];
    let queryValues = [];

    //for searching by tags
    // if (params['tags']){
    // }
    
    // For each possible search term, add to whereExpressions and queryValues so
    // we can generate the right SQL

    if (params['searchTerm']) {
      queryValues.push(`%${params.searchTerm}%`);
      whereExpressions.push(`lot.name ILIKE $${queryValues.length}`)
      whereExpressions.push(`lot.description ILIKE $${queryValues.length}`)
      whereExpressions.push(`location.name ILIKE $${queryValues.length} \n`)
      query += "WHERE " + whereExpressions.join(" OR ")
      query += " ORDER BY lot.name";
    }


    // Finalize query and return results
    const lotsRes = await db.query(query, queryValues);
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
          `SELECT id,
                  name,
                  loc_id, 
                  quantity, 
                  price, 
                  description
           FROM lot
           WHERE id = $1`,
        [id]);

    if (!lot) throw new NotFoundError(`No lot: ${id}`);

    if (lot['quantity'] !== null) {
      const usedProps = await Prop.getLotProps(id)
      lot.available = lot.quantity-(usedProps.length)
    }
    const {rows} = await db.query(
        `SELECT t.title
          FROM lot_tag
          JOIN tag AS t ON t.id=tag_id
          WHERE lot_id=$1
        `,[id])
    lot.tags=rows
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
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE lot 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                name, 
                                description, 
                                quantity,
                                price`;
    const result = await db.query(querySql, [...values, id]);
    const lot = result.rows[0];

    if (!lot) throw new NotFoundError(`No lot: ${id}`);

    return lot;
  }

  /** Delete given lot from database; returns undefined.
   *
   * Throws NotFoundError if lot not found.
   **/

  static async remove(id) {
    if (typeof id != 'number') throw new BadRequestError(`${id} is not an integer`)

    const result = await db.query(
          `DELETE
           FROM lot
           WHERE id = $1
           RETURNING id`,
        [id]);
    const lot = result.rows[0];

    if (!lot) throw new NotFoundError(`No lot: ${id}`);
    return lot
  }
}

module.exports = Lot;
