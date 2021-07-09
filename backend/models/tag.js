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
 /** Returns full nested list of tags and nested child tags
   *
   **/

  static async list() {
}

  /** Given a tag id, return data about tag.
   *
   * Returns { id, title }
   *
   * Throws NotFoundError if not found.
   **/

   static async get(id) {
    if (typeof id != "number") throw new BadRequestError(`${id} is not an integer`)
    
    //https://www.sql-workbench.eu/comparison/recursive_queries.html
    
    let tagQuery = await db.query(
      `SELECT id, title
        FROM tag
        WHERE id=$1
        `,
    [id]);

    if (!tagQuery.rows[0]) throw new NotFoundError(`No tag: ${id}`);
    
    return tagQuery.rows[0];
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
