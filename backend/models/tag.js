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
    const {rows:[tag]} = await db.query(
          `INSERT INTO tag
           (title)
           VALUES ($1)
           RETURNING id, title`,
        [
         title
        ],
        );
    
    return tag;
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
    if (!title || title === "") throw new BadRequestError(`Please include a title for the tag`)
    if (typeof lotId != "number" || !lotId) throw new BadRequestError(`lotId should be an integer`)

    const {rows:[tag]} = await db.query(
          `SELECT * FROM tag_something($1,$2)`,[lotId,title]);
    
    if(!tag) throw new BadRequestError("That lot already has that tag")

    return tag;
  }

  /** get all tags.
   *
   * Returns [{ id, title},tag,tag]
   *
   * Throws NotFoundError if not found.
   **/

   static async getAll(search=null) {
    if (typeof search !== "string" && search !== null) throw new BadRequestError(`search must be a string`)

    const whereExpression = search? `WHERE t.title ILIKE '%${search}%'` : ""

    const query =
      `SELECT t.id,
            t.title,
            COUNT(lot_id) AS "lotsWithTag"
      FROM tag AS t
      FULL OUTER JOIN lot_tag ON tag_id=t.id
      LEFT JOIN lot AS l ON lot_id=l.id
      ${whereExpression}
      GROUP BY t.id
      ORDER BY t.id`

    let {rows:tags} = await db.query(query);

    if (tags.length === 0 ) throw new NotFoundError(`No tags that match: ${search}`);
    
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
    
    let lots = await Tag.getTagLots(id)
    tag.lots = lots

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

  /** Given a tag id, return all tags.
   *
   * Returns [tag,tag,tag]
   *
   * Throws NotFoundError if not found.
   **/

   static async getTagLots(tagId) {
    if (typeof tagId != "number") throw new BadRequestError(`${tagId} is not an integer`)

    let {rows:[{exists}]} = await db.query(
      "SELECT EXISTS (SELECT FROM tag WHERE id=$1)"
      ,[tagId])
    if (!exists) throw new NotFoundError(`${tagId} is not a tag id that exists`)

    let {rows:lots} = await db.query(
      `SELECT 
          l.id, 
          l.name, 
          l.description,
          loc.id AS "locId", 
          loc.name AS location
        FROM lot_tag
        JOIN lot AS l ON lot_id=l.id
        JOIN location AS loc ON loc.id=l.loc_id
        WHERE tag_id=$1
        `,
    [tagId]);

    return lots;
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

  /** Delete given lot_tag from database; returns id.
   *
   * Throws NotFoundError if tag not found.
   **/

  static async removeTag(lotId,tagId) {
    if (typeof lotId != 'number'|| typeof tagId != 'number') throw new BadRequestError(`Both lotId and tagId must be an integer`)

    const {rows} = await db.query(
          `DELETE
           FROM lot_tag
           WHERE lot_id = $1 AND tag_id=$2
           RETURNING lot_id AS "lotId", tag_id AS "tagId"`,
        [lotId, tagId]);

    const tag = rows[0];

    if (!tag) throw new NotFoundError(`there is no lot_tag with lotId,tagId (${lotId},${tagId})`);
    return tag
  }
}

module.exports = Tag;
