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


  /** Returns full nested list of locations and nested child locations
   * 
   * if no id param is passed, all locations are returned in a tree
   **/

   static async list(id=null) {
    const startId = id ? `WHERE parent.id=${id}`: ""
    const locationTree = await db.query(
      `WITH RECURSIVE findchildren AS ( 
        SELECT 
            child.parent_id AS "locationId", 
            parent.name AS "locationName",
            child.id AS "childId",
            child.name AS "childName"
            FROM location as child
        JOIN location AS parent ON child.parent_id=parent.id
        $1

        UNION ALL

        SELECT child.parent_id, parent.name,child.id, child.name
            FROM findchildren AS r
        JOIN location AS parent ON parent.id=r."childId"
        JOIN location AS child ON parent.id=child.parent_id
      )

      SELECT * FROM findchildren
      GROUP BY "locationId","locationName", "childId", "childName"
      ORDER BY "locationId", "childId";`,
      [startId])
  }

  /** Given a location id, return location and items listed under it or its child locations.
   *
   * Returns { id, name, notes, items=[lot, lot, lot...] }
   *
   * Throws NotFoundError if not found.
   **/
   static async get(id) {
    if (typeof id != "number") throw new BadRequestError(`${id} is not an integer`)

    let locationQuery = await db.query(
      `SELECT id, name, notes
        FROM location
        WHERE id=$1
        `,
    [id]);

    if (!locationQuery.rows[0]) throw new NotFoundError(`No location: ${id}`);
    let loc = locationQuery.rows[0]
    
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
   * 
   * if parentId is in Location.list(id)-> BadRequestError
   * if id is in
   */
   static async addChild(parentId,id){
    const idCheck = await db.query(
      `SELECT id
        FROM parent_loc
        WHERE loc_id = $1`,
        [id]
    )
    if(idCheck.rows[0])throw new BadRequestError(`${id} already has a parent`)

    const parentCheck = await Location.list(parentId)



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
