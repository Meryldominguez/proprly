"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for companies. */

class Prop {
  /** Create a prop (from data), update db, return new prop data.
   *
   * data should be { title, salary, equity, companyHandle }
   *
   * Returns { id, title, salary, equity, companyHandle }
   **/

  static async create({prodId,lotId,quantity,notes}) {
    if (!prodId || !lotId) throw new BadRequestError("production id and lot id are both required")

    const result = await db.query(
          `INSERT INTO prop (
                prod_id,
                lot_id,
                quantity,
                notes)
           VALUES ($1, $2, $3, $4)
           RETURNING prod_id as "prodId", lot_id as "lotId", quantity, notes`,
        [ 
            prodId,
            lotId,
            quantity,
            notes
        ]);
    let prop = result.rows[0];

    return prop;
  }


  /** Update prop data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { notes, quantity }
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws NotFoundError if not found.
   */

  static async update(prodId, lotId, data) {
    if (prodId === 0 || lotId===0 ) throw new BadRequestError("production id or lot id cannot be 0")
    if (!prodId || !lotId) throw new BadRequestError("production id and lot id are both required")
    if (Object.keys(data).length===0) throw new BadRequestError(`No data submitted to update prop`)

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
        });

    const querySql = `UPDATE prop 
                      SET ${setCols} 
                      WHERE prod_id = $${values.length+1} AND lot_id = $${values.length+2}
                      RETURNING 
                        prod_id AS "prodId",
                        lot_id AS "lotId",
                        quantity,
                        notes`;
    const result = await db.query(querySql, [...values, prodId,lotId]);
    const prop = result.rows[0];

    if (!prop) throw new NotFoundError(`No prop: ${prodId}, ${lotId}`);

    return prop;
  }

  /** Delete given prop from database; returns undefined.
   *
   * Throws NotFoundError if prop not found.
   **/

  static async remove(prodId, lotId) {
    if (prodId === 0 || lotId===0 ) throw new BadRequestError("production id or lot id cannot be 0")
    if (!prodId || !lotId) throw new BadRequestError("production id and lot id are both required")
    const result = await db.query(
          `DELETE
           FROM prop
           WHERE prod_id = $1 and lot_id=$2
           RETURNING *`, [prodId,lotId]);
    const prop = result.rows[0];

    if (!prop) throw new NotFoundError(`No prop: ${prodId}, ${lotId}`);
    return `DELETED: ${prop}`
  }
}

module.exports = Prop;
