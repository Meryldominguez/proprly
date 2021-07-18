"use strict";

const db = require("../db.js");
process.cwd()
const { BadRequestError, NotFoundError } = require("../expressError");
const Prop = require("./Prop.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  
  test("works", async function () {
    const {rows:[lot]} = await db.query(
      `SELECT id
       FROM lot
       WHERE name = 'item2'`);
    const {rows:[prod]} = await db.query(
    `SELECT id
      FROM production
      WHERE title ILIKE 'Carmen'`);

      let prop = await Prop.create({
        prodId: prod.id,
        lotId:lot.id,
        quantity: 50,
        notes: "Notes on test prop"
        });
    
    expect(prop).toEqual({
      prodId: prod.id,
      lotId: lot.id,
      quantity: 50,
      notes: "Notes on test prop"
    });

  });
  
  test("fails with null", async function () {
    try {
      const res = await Prop.create({});
      console.log(res)
      fail();
    } catch (err){
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });


});

/************************************** update */

describe("update", function () {

  const updateData = {
    quantity: 5,
    notes: "New Description"
  };

  test("works", async function () {
    const {rows:[lot]} = await db.query(
      `SELECT id
       FROM lot
       WHERE name = 'item1'`);
    const {rows:[prod]} = await db.query(
    `SELECT id
      FROM production
      WHERE title ILIKE 'Carmen'`);

    const {rows:[testProp]} = await db.query(
      `SELECT 
          prod_id as "prodId", 
          lot_id as "lotId",
          quantity, 
          notes
       FROM prop
       WHERE prod_id=$1 AND lot_id=$2`,[prod.id, lot.id]);

    let updatedProp = await Prop.update(testProp.prodId, testProp.lotId, updateData);
    
    expect(updatedProp).toEqual({
        prodId: prod.id,
        lotId:lot.id,
        quantity: 5,
        notes: "New Description"
        });

  });

  test("works: null fields", async function () {
    const {rows:[lot]} = await db.query(
      `SELECT id
       FROM lot
       WHERE name = 'item1'`);
    const {rows:[prod]} = await db.query(
    `SELECT id
      FROM production
      WHERE title ILIKE 'Carmen'`);

    const {rows:[testProp]} = await db.query(
      `SELECT 
          prod_id as "prodId", 
          lot_id as "lotId",
          quantity, 
          notes
       FROM prop
       WHERE prod_id=$1 AND lot_id=$2`,[prod.id, lot.id]);

    const updateDataSetNulls = {
      notes: "New Description",
    };

    let company = await Prop.update(testProp.prodId, testProp.lotId, updateDataSetNulls);
    expect(company).toEqual({
      prodId: prod.id,
        lotId:lot.id,
        quantity: testProp.quantity,
        ...updateDataSetNulls
    });

  });

  test("not found if no such lot", async function () {
    try {
      await Prop.update(-3,1, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("not found either id is 0", async function () {
    try {
      await Prop.update(2,0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
    try {
      await Prop.update(0,2, updateData);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      const {rows:[lot]} = await db.query(
        `SELECT id
         FROM lot
         WHERE name = 'item1'`);
      const {rows:[prod]} = await db.query(
      `SELECT id
        FROM production
        WHERE title ILIKE 'Carmen'`);

      const {rows:[testProp]} = await db.query(
        `SELECT 
            prod_id as "prodId", 
            lot_id as "lotId",
            quantity, 
            notes
         FROM prop
         WHERE prod_id=$1 AND lot_id=$2`,[prod.id, lot.id]);
  
      await Prop.update(testProp.prodId, testProp.lotId, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove Prop",  function () {
  test("works", async function () {
    const {rows:[lot]} = await db.query(
      `SELECT id
       FROM lot
       WHERE name = 'item1'`);
    const {rows:[prod]} = await db.query(
    `SELECT id
      FROM production
      WHERE title ILIKE 'Carmen'`);

    const {rows:[testProp]} = await db.query(
      `SELECT 
          prod_id as "prodId", 
          lot_id as "lotId",
          quantity, 
          notes
       FROM prop
       WHERE prod_id=$1 AND lot_id=$2`,[prod.id, lot.id]);

    await Prop.remove(testProp.prodId,testProp.lotId);

    const res = await db.query(
    `SELECT * FROM prop 
      WHERE prod_id=$1 AND lot_id=$2`,[prod.id, lot.id]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such lot", async function () {
    try {
      await Prop.remove(-200,2)
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("not found if string passed as id", async function () {
    try {
      await Prop.remove("X");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  test("not found if ids are 0", async function () {
    try {
      await Prop.remove(0,20);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
    try {
      await Prop.remove(20,0);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
