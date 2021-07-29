"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for tags. */

class Tag {
  /** Create a tag (from data), update db, return new tag data.
   *
   * data should be { name, notes }
   *
   * Returns { id, name, notes }
   *
   * Throws BadRequestError if tag already in database.
   * */
  static async create({title}) {
    if (!title || title === "") throw new BadRequestError(`Please include a name for the tag`)
    const result = await db.query(
          `INSERT INTO tag
           (title)
           VALUES ($1)
           RETURNING id, title`,
        [
         title
        ],
        );
    
    return result.rows[0];
  }
  /** connect a lot to a tag, if tag doesnt exist, create,  return new tag data.
   *
   * data should be { name, notes }
   *
   * Returns { id, name, notes }
   *
   * Throws BadRequestError if tag already in database.
   * */
  static async tag(lotId,{title}) {
    if (typeof lotId != "number" || !lotId) throw new BadRequestError(`lotId should be an integer`)
    if (!title || title === "") throw new BadRequestError(`Please include a title for the tag`)

    const {rows:tag} = await db.query(
          `SELECT tag_something($1,$2)`,[lotId,title]);
    
    if(!tag) throw new BadRequestError("That lot already has that tag")

    return tag;
  }

  /** get all tags.
   *
   * Returns [{ id, title},tag,tag]
   *
   * Throws NotFoundError if not found.
   **/

   static async getAll() {
    
    let {rows:tags} = await db.query(
      `SELECT t.id,
              t.title,
              COUNT(lot_id) AS "lotsWithTag"
        FROM tag AS t
        FULL OUTER JOIN lot_tag ON tag_id=t.id
        LEFT JOIN lot AS l ON lot_id=l.id
        GROUP BY t.id
        ORDER BY t.id
        `);

    return tags;
  }

  /** Given a tag id, return data about tag.
   *
   * Returns { id, title, lots:[] }
   *
   * Throws NotFoundError if not found.
   **/

   static async get(id) {
    if (typeof id != "number") throw new BadRequestError(`${id} is not an integer`)
    
    let {rows:[tag]} = await db.query(
      `SELECT id, title
        FROM tag
        WHERE id=$1
        `,
    [id]);

    if (!tag) throw new NotFoundError(`No tag: ${id}`);
    
    let {rows} = await db.query(
      `SELECT l.id, 
          l.name, 
          l.description,
          loc.id AS "locId", 
          loc.name AS location
        FROM lot_tag
        JOIN lot AS l ON lot_id=l.id
        JOIN location AS loc ON l.loc_id=loc.id
        WHERE tag_id=$1
        `,
    [id]);
    tag.lots = rows

    return tag;
  }

  /** Given a Lot id, return all tags.
   *
   * Returns [tag,tag,tag]
   *
   * Throws NotFoundError if not found.
   **/

   static async getLotTags(lotId) {
    if (typeof lotId != "number") throw new BadRequestError(`${lotId} is not an integer`)

    let {rows:[{exists}]} = await db.query(
      "SELECT EXISTS (SELECT FROM lot WHERE id=$1)"
      ,[lotId])
    if (!exists) throw new NotFoundError(`${lotId} is not a lot id that exists`)

    let {rows:tags} = await db.query(
      `SELECT t.id, t.title
        FROM lot_tag
        JOIN tag AS t ON tag_id=t.id
        WHERE lot_id=$1
        `,
    [lotId]);

    return tags;
  }


  /** Update tag data with `data`.
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
    if (Object.keys(data).length === 0) throw new BadRequestError("No update data sumbitted")

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE tag 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title`;
    const result = await db.query(querySql, [...values, id]);
    const tag = result.rows[0];

    if (!tag) throw new NotFoundError(`No tag: ${id}`);

    return tag;
  }

  /** Delete given tag from database; returns id.
   *
   * Throws NotFoundError if tag not found.
   **/

  static async remove(id) {
    if (typeof id != 'number') throw new BadRequestError(`${id} is not an integer`)

    const result = await db.query(
          `DELETE
           FROM tag
           WHERE id = $1
           RETURNING id`,
        [id]);
    const tag = result.rows[0];

    if (!tag) throw new NotFoundError(`No tag: ${id}`);
    return tag
  }
}

module.exports = Tag;
