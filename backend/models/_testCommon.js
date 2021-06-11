const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testJobIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM lots");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM location");
  await db.query("DELETE FROM category");

  await db.query(`
    INSERT INTO location( name, notes )
    VALUES ('Parent Location','The parent location'),
           ('First Location','The first location'),
           ('Second Location','The second location'),
           `);
    const {parentLocId=id} = await db.query(`
      SELECT id FROM location
        WHERE name = 'Parent Location`)
    const {locId1=id} = await db.query(`
      SELECT id FROM location
        WHERE name = 'First Location`)
    const {locId2=id} = await db.query(`
      SELECT id FROM location
        WHERE name = 'Second Location`)
  
  await db.query(`
    INSERT INTO parent_loc (parent_loc,loc_id)
    VALUES ($1,$2),
           ($1,$3)
           `,
           [parentId,locId1,locId2]);

  await db.query(`
    INSERT INTO lots( name, location, description, quantity, price)
    VALUES ('item1', $1, 'Desc1', 1, 10.99),
           ('item2', $1, 'Desc2', null, 5.50),
           ('item3', $2, 'Desc3', 3, 400.00`,
           [locId1,locId2]);

  // const resultsJobs = await db.query(`
  //   INSERT INTO jobs (title, salary, equity, company_handle)
  //   VALUES ('Job1', 100, '0.1', 'c1'),
  //          ('Job2', 200, '0.2', 'c1'),
  //          ('Job3', 300, '0', 'c1'),
  //          ('Job4', NULL, NULL, 'c1')
  //   RETURNING id`);
  // testJobIds.splice(0, 0, ...resultsJobs.rows.map(r => r.id));

  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          phone,
                          email,
                          is_admin)
        VALUES ('u1', $1, 'U1F', 'U1L', null, 'u1@email.com', false),
               ('u2', $2, 'U2F', 'U2L', '1800-123-4567', 'u2@email.com', false),
               ('a1', $3, 'A1F', 'A1L', '1800-123-4567, 'a1@email.com', true)

        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("adminpassword", BCRYPT_WORK_FACTOR),
      ]);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
};