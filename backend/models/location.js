"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for locations. */

class Location {
  /** Create a location (from data), update db, return new loc data.
   *
   * data should be { name, notes }
   *
   * Returns { id, name, notes }
   *
   * Throws BadRequestError if location already in database.
   * */
  static async create({ name, notes=null,parentId=null}) {
    if (!name || name === "") throw new BadRequestError(`Please include a name for the location`)
    const {rows:[loc]} = await db.query(
          `INSERT INTO location
           (name, notes, parent_id)
           VALUES ($1, $2,$3)
           RETURNING id, name, notes, parent_id AS "parentId"`,
        [
          name,
          notes,
          parentId
        ],);
    return loc;
  }


  /** Returns array of locations and child locations
   * if no id param is passed, all locations are returned
   **/

  static async getChildren(id=null) {
    
    const result = await db.query(
      `WITH RECURSIVE findchildren AS ( 
        SELECT 
            child.parent_id AS "locationId", 
            parent.name AS "locationName",
            child.id AS "childId",
            child.name AS "childName"
            FROM location as child
        JOIN location AS parent ON child.parent_id=parent.id
        ${id ? `WHERE parent.id=${id}`: ""}

        UNION ALL

        SELECT child.parent_id, parent.name,child.id, child.name
            FROM findchildren AS r
        JOIN location AS parent ON parent.id=r."childId"
        JOIN location AS child ON parent.id=child.parent_id
      )

      SELECT * FROM findchildren
      GROUP BY "locationId","locationName", "childId", "childName"
      ORDER BY "locationId", "childId";`);

      
    return result.rows
  }

  /** Given a location id, return location and items listed under it or its child locations.
   *
   * Returns { id, name, notes, items=[loc, loc, loc...] }
   *
   * Throws NotFoundError if not found.
   **/
   static async get(id) {
    if (typeof id != "number") throw new BadRequestError(`${id} is not an integer`)
    
    let {rows:[loc]} = await db.query(
      `SELECT id, name, notes
        FROM location
        WHERE id=$1
        `,
    [id]);
    if (!loc) throw new NotFoundError(`No location: ${id}`);

    const childArrray = await Location.getChildren(loc.id)
    const idSet = new Set ()
    childArrray.map(item => [item.locationId,item.childId].forEach(i => idSet.add(i)))
    const idArray=Array.from(idSet)

    let lotQuery = await db.query(
      `SELECT lot.id, lot.name, quantity, description, price, loc_id, location.name as "location"
        FROM lot
        JOIN location on lot.loc_id = location.id
        WHERE ${idArray.map((item, idx) =>`location.id = $${idx+1}` ).join(" OR ")}
        `,
    [...idArray]);

    loc.items = lotQuery.rows
    return loc;
  }

  /** Update location data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   * 
   * A check is included to prevent locations being named the children of its current children
   *
   * Data can include: {name,notes, parent_id}
   *
   * Returns {id, name, description, numEmployees, logoUrl}
   *
   * Throws NotFoundError if not found.
   */
  static async update(id, data) {
    if (Object.keys(data).length === 0) throw new BadRequestError("No update data sumbitted")

    if (data.parentId) {
      const childArrray = await Location.getChildren(id)
      const idSet = new Set()
      childArrray.map(item => [item.locationId,item.childId].forEach(i => idSet.add(i)))
      
      if (idSet.has(data.parentId)) throw new BadRequestError(`New parent location cannot be a current child of the location`)
    }
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {parentId: "parent_id"});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE location 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                name, 
                                notes,
                                parent_id as "parentId"`;

    const result = await db.query(querySql, [...values, id]);
    const loc = result.rows[0];

    if (!loc) throw new NotFoundError(`No location: ${id}`);

    return loc;
  }

  /** Delete given location from database; returns id.
   *
   * Throws NotFoundError if loc not found.
   **/

  static async remove(id) {
    if (typeof id != 'number') throw new BadRequestError(`${id} is not an integer`)

    const result = await db.query(
          `DELETE
           FROM location
           WHERE id = $1
           RETURNING id`,
        [id]);
    const loc = result.rows[0];

    if (!loc) throw new NotFoundError(`No loc: ${id}`);
    return loc
  }
}

module.exports = Location;
