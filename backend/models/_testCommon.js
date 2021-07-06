const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testJobIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM lot");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM location");
  await db.query("DELETE FROM category");
  await db.query("DELETE FROM production");

  await db.query(`
    INSERT INTO location(name, notes)
    VALUES ('Parent Location','The parent location'),
           ('First Location','The first location'),
           ('Second Location','The second location')
           `);
    const {rows:[{id:parentLocId}]} = await db.query(`
      SELECT id FROM location
        WHERE name = 'Parent Location'`)
    const {rows:[{id:locId1}]} = await db.query(`
      SELECT id FROM location
        WHERE name = 'First Location'`)
    const {rows:[{id:locId2}]} = await db.query(`
      SELECT id FROM location
        WHERE name = 'Second Location'`)
  
  await db.query(`
    INSERT INTO parent_loc (parent_loc,loc_id)
    VALUES ($1,$2),
           ($1,$3)`,
           [parentLocId,locId1,locId2]);

  await db.query(`
    INSERT INTO lot( name, loc_id, description, quantity, price)
    VALUES ('item1', $1, 'Desc1', 1, 10.99),
           ('item2', $1, 'Desc2', null, 5.50),
           ('item3', $2, 'Desc3', 3, 400.00)`,
           [locId1,locId2]);

  await db.query(`
    INSERT INTO production (title, date_start, date_end, active, notes)
    VALUES ('Carmen', '2019-09-01', '2019-10-15', FALSE,'co-production carmen notes'),
           ('Magic Flute', '2021-05-03', null, TRUE, 'flute notes'),
           ('La traviata', null ,'2006-12-01', FALSE, 'co-production traviata notes'),
           ('Steve Jobs', NULL, NULL, TRUE, 'upcoming planning for steve jobs')`);

  let {rows:[{id:lot1Id},{id:lot2Id},{id:lot3Id}]} = await db.query(`
    SELECT id FROM lot`);
  let {rows:[{id:prod1Id},{id:prod2Id},{id:prod3Id},{id:prod4Id}]} = await db.query(`
    SELECT id FROM production`);

  // await db.query(`
  //   INSERT INTO props ( prod_id, lot_id, quantity, notes)
  //   VALUES ($1,$5, 1, null),
  //          ($1,$6, null, null),
  //          ($1,$7, 2, "need this"),
  //          ($2,$6, null, "using half the box"),
  //          ($3,$6, null, "20 singular items" ),
  //          ($4,$7, 1, null),
  //          ($4,$6, null, "maybe")`,
  //          [prod1Id,prod2Id,prod3Id,prod4Id,lot1Id,lot2Id,lot3Id]);

  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          phone,
                          email,
                          is_admin)
        VALUES ('u1', $1, 'U1F', 'U1L', null, 'u1@email.com', FALSE),
               ('u2', $2, 'U2F', 'U2L', '1800-123-4567', 'u2@email.com', FALSE),
               ('a1', $3, 'A1F', 'A1L', '1800-123-4567', 'a1@email.com', TRUE)
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