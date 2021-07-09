"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for locations. */

class Location {
  /** Create a location (from data), update db, return new lot data.
   *
   * data should be { name, notes }
   *
   * Returns { id, name, notes }
   *
   * Throws BadRequestError if location already in database.
   * */
  static async create({ name, notes=null}) {
    if (!name || name === "") throw new BadRequestError(`Please include a name for the location`)
    const result = await db.query(
          `INSERT INTO location
           (name, notes)
           VALUES ($1, $2)
           RETURNING id, name, notes`,
        [
          name,
          notes
        ],
        );
    
    const loc = result.rows;
    return loc[0];
  }


  /** Given a location id, return data about location.
   *
   * Returns { id, name, notes, parentLocations=[{id, name, notes}] }
   *
   * Throws NotFoundError if not found.
   **/

   static async get(id) {
    if (typeof id != "number") throw new BadRequestError(`${id} is not an integer`)
    
    // const locRes = await db.query(
    //       `SELECT id, name
    //        FROM location
    //       JOIN parent_loc 
    //         ON id=parent_loc OR id=loc_id
    //       WHERE loc_id=2 OR id=2
    //       GROUP by id;`,
    //     [id]);
    // const loc = lotRes.rows;
    //https://www.sql-workbench.eu/comparison/recursive_queries.html
    
    let locationQuery = await db.query(
      `SELECT id, name, notes
        FROM location
        WHERE id=$1
        `,
    [id]);

    if (!locationQuery.rows[0]) throw new NotFoundError(`No location: ${id}`);
    let loc = locationQuery.rows[0]

    let {rows} = await db.query(
      `SELECT loc_id, loc.name, loc.notes
        FROM parent_loc
        JOIN location AS loc ON loc.id = loc_id 
        WHERE parent_loc=$1
        `,

    [id]);
    
    loc.childLocations = rows
    
    return loc;
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

    const querySql = `UPDATE location 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                name, 
                                notes`;
    const result = await db.query(querySql, [...values, id]);
    const lot = result.rows[0];

    if (!lot) throw new NotFoundError(`No lot: ${id}`);

    return lot;
  }

  /** Add a parent_loc entry
   * 
   * @param {parentId} id for location
   * @param {id} id for another location to be child
   * @returns {}
   */
   static async addChild(parentId,id){


  }

  /** Delete given lot from database; returns id.
   *
   * Throws NotFoundError if lot not found.
   **/

  static async remove(id) {
    if (typeof id != 'number') throw new BadRequestError(`${id} is not an integer`)

    const result = await db.query(
          `DELETE
           FROM location
           WHERE id = $1
           RETURNING id`,
        [id]);
    const lot = result.rows[0];

    if (!lot) throw new NotFoundError(`No lot: ${id}`);
    return lot
  }
}

module.exports = Location;
