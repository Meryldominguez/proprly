"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

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

  static async create({ name, loc_id, quantity = null, price = null, notes = null}) {

    const result = await db.query(
          `INSERT INTO lot
           (name, loc_id, quantity, price, notes)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, name, loc_id, quantity, price, notes`,
        [
          name,
          loc_id,
          quantity,
          price,
          notes
        ],
    );
    const lot = result.rows[0];

    return lot;
  }

  /** Given a lot id, return data about lot.
   *
   * Returns { id, name, location, quantity, price, description, productions=[...the productions that have used this lot] }
   *
   * Throws NotFoundError if not found.
   **/

   static async get(id) {
    const lotRes = await db.query(
          `SELECT id,
                  name,
                  location, 
                  quantity, 
                  price, 
                  description
           FROM lot
           WHERE id = $1`,
        [id]);

    const lot = lotRes.rows[0];

    if (!lot) throw new NotFoundError(`No lot: ${id}`);

    const prodRes = await db.query(
          `SELECT id, name,date_start,date_end, active, notes
           FROM production,
           JOIN prop ON production.id = prop.prod_id
           WHERE prop.lot_id = $1
           ORDER BY prop.date_start`,
        [id],
    );

    
    lot.productions = prodRes.rows || [];

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
        {
          dateStart: "date_start",
          dateEnd: "date_end",
          
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE lot 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                name, 
                                description, 
                                date_start AS dateStart,
                                date_end AS dateEnd`;
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
    const result = await db.query(
          `DELETE
           FROM lot
           WHERE id = $1
           RETURNING id`,
        [id]);
    const lot = result.rows[0];

    if (!lot) throw new NotFoundError(`No lot: ${id}`);
  }

  /** Find all lots (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - location
   * - name (will find case-insensitive, partial matches)
   *
   * Returns [{ id, name, description, numEmployees, logoUrl }, ...]
   * */

   static async findAll(searchTerm = "") {

    let query = `SELECT name,l.name,quantity,price,notes
                 FROM lot
                 JOIN location AS l ON location.id = lot.location`
                 ; 
    let whereExpressions = [];
    let queryValues = [];


    // For each possible search term, add to whereExpressions and queryValues so
    // we can generate the right SQL

    if (searchTerm) {
      queryValues.push(`%${searchTerm}%`);
      whereExpressions.push(`name ILIKE $${queryValues.length}`)
      whereExpressions.push(`description ILIKE $${queryValues.length}`)
    }


    // Finalize query and return results

    query += " ORDER BY name";
    const lotsRes = await db.query(query, queryValues);
    return lotsRes.rows;
  }
}

module.exports = Lot;
