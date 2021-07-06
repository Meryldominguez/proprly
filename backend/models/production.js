"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for companies. */

class Production {
  /** Create a production (from data), update db, return new production data.
   *
   * data should be { title, salary, equity, companyHandle }
   *
   * Returns { id, title, salary, equity, companyHandle }
   **/

  static async create({title, date_start=null, date_end=null, active=true, notes }) {
    const result = await db.query(
          `INSERT INTO production (
                             title,
                             date_start,
                             date_end,
                             active,
                             notes)
           VALUES ($1, $2, $3, $4,$5)
           RETURNING id, title, date_start as "dateStart", date_end as "dateEnd", active, notes`,
        [
          title,
          date_start,
          date_end,
          active,
          notes
        ]);
    let prod = result.rows[0];

    return prod;
  }

  /** Find all productions (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - minSalary
   * - hasEquity (true returns only productions with equity > 0, other values ignored)
   * - title (will find case-insensitive, partial matches)
   *
   * Returns [{ id, title, salary, equity, companyHandle, companyName }, ...]
   * */

  static async findAll({ isActive, search, year=[]} = {}) {
    let query = `SELECT id,
                        title,
                        date_start as "dateStart",
                        date_end as "dateEnd",
                        active,
                        notes
                 FROM production`
    let whereExpressions = [];
    let queryValues = [];

    // For each possible search term, add to whereExpressions and
    // queryValues so we can generate the right SQL
    
    if (isActive != undefined){
      isActive === true ?  
      whereExpressions.push(`active = TRUE`)
      :
      whereExpressions.push(`active = FALSE`)
    }

    if (search !== undefined) {
      let searchValues = search.split(" ")

      searchValues.forEach(val=>{
        queryValues.push(`%${val}%`);
        whereExpressions.push(`title ILIKE $${queryValues.length} OR notes ILIKE $${queryValues.length}`);

      })
      
    }
    if(year.length>0){
      let yearExpressions = ""
      year.forEach((y)=> {
        queryValues.push(y)
        yearExpressions += `EXTRACT(year from "dateStart") = ${y} OR EXTRACT(year from "dateEnd") = ${y}`
      })
      whereExpressions.push(yearExpressions.join(" OR "))
    }


    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    // Finalize query and return results

    query += " ORDER BY title";
    const jobsRes = await db.query(query, queryValues);
    return jobsRes.rows;
  }

  /** Given a production id, return data about production.
   *
   * Returns { id, name, dateStart, dateEnd, companyHandle, props: [...]}
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const prodRes = await db.query(
          `SELECT id,
                title,
                date_start as "dateStart",
                date_end as "dateEnd",
                active,
                notes
           FROM production
           WHERE id = $1`, [id]);

    const prod = prodRes.rows[0];

    if (!prod) throw new NotFoundError(`No prod: ${id}`);

    // const propsRes = await db.query(
    //       `SELECT handle,
    //               description,
    //               num_employees AS "numEmployees",
    //               logo_url AS "logoUrl"
    //        FROM companies
    //        WHERE handle = $1`, [prod.companyHandle]);

    // delete prod.companyHandle;
    // prod.props = companiesRes.rows[0];

    return prod;
  }

  /** Update prod data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { title, salary, equity }
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          dateStart: "date_start",
          dateEnd: "date_end"
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE production 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title,
                                date_start as "dateStart",
                                date_end as "dateEnd",
                                active,
                                notes`;
    const result = await db.query(querySql, [...values, id]);
    const prod = result.rows[0];

    if (!prod) throw new NotFoundError(`No prod: ${id}`);

    return prod;
  }

  /** Delete given prod from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM production
           WHERE id = $1
           RETURNING id`, [id]);
    const prod = result.rows[0];

    if (!prod) throw new NotFoundError(`No prod: ${id}`);
  }
}

module.exports = Production;
