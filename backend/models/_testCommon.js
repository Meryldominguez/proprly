const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");


async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM lot");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM location");
  await db.query("DELETE FROM tag");
  await db.query("DELETE FROM production");
  await db.query("DELETE FROM prop");

  const {rows:[testParentLoc]} = await db.query(`
    INSERT INTO location(name, notes, parent_id)
    VALUES ('Parent Location','The parent location', null)
    RETURNING id, name, notes, parent_id
           `);
  const {rows:[testFirstLoc]} = await db.query(`
    INSERT INTO location(name, notes, parent_id)
    VALUES ('First Location','The first location', $1)
    RETURNING id, name, notes, parent_id
           `,[testParentLoc.id]);
  const {rows:[testSecondLoc]} = await db.query(`
    INSERT INTO location(name, notes, parent_id)
    VALUES ('Second Location','The second location', $1)
    RETURNING id, name, notes, parent_id
           `,[testParentLoc.id]);

  const{rows:[tag1,tag2,tag3,tag4]}= await db.query(`
    INSERT INTO tag(title)
    VALUES ('Set Dressing'),
           ('Hand Props'),
           ('Fabric'),
           ('Furniture'),
           ('Florals'),
           ('Set Pieces')
    RETURNING id,title
            `);
  
  const {rows:[testLot1, testLot2, testLot3]}=await db.query(`
    INSERT INTO lot( name, loc_id, description, quantity, price)
    VALUES ('item1', $1, 'Desc1', 1, 10.99),
           ('item2', $1, 'Desc2', null, 5.50),
           ('item3', $2, 'Desc3', 3, 400.00)
    RETURNING id, name`,
           [testFirstLoc.id,testSecondLoc.id]);

  await db.query(`
    INSERT INTO lot_tag(tag_id,lot_id)
    VALUES ($1,$5),
            ($1,$7),
            ($2,$5),
            ($2,$6),
            ($4,$5),
            ($4,$6),
            ($4,$7),
            ($3,$7),
            ($3,$5)
          `,[
            tag1.id,
            tag2.id,
            tag3.id,
            tag4.id,
            testLot1.id,
            testLot2.id,
            testLot3.id
          ]);
      
  const {rows:[testFirstProd,testSecondProd,testThirdProd,testFourthProd]}= await db.query(`
    INSERT INTO production (title, date_start, date_end, active, notes)
    VALUES ('Carmen', '2019-09-01', '2019-10-15', FALSE,'co-production carmen notes'),
           ('Magic Flute', '2021-05-03', null, TRUE, 'flute notes'),
           ('La traviata', null ,'2006-12-01', FALSE, 'co-production traviata notes'),
           ('Steve Jobs', NULL, NULL, TRUE, 'upcoming planning for steve jobs')
    RETURNING id, title, active, notes
           `);

  await db.query(`
    INSERT INTO prop ( prod_id, lot_id, quantity, notes)
    VALUES ($1,$5, 1, null),
           ($1,$7, 2, 'need this'),
           ($2,$6, null, 'using half the box'),
           ($3,$6, null, '20 singular items' ),
           ($4,$7, 1, null),
           ($4,$6, null, 'maybe')`,
           [
             testFirstProd.id,
             testSecondProd.id,
             testThirdProd.id,
             testFourthProd.id,
             testLot1.id,
             testLot2.id,
             testLot3.id
            ]);

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
};