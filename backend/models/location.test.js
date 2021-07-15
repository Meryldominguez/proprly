"use strict";

const db = require("../db.js");
process.cwd()
const { BadRequestError, NotFoundError } = require("../expressError");
const Location = require("./location.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create",function () {
  
  const newLoc = {
    name: "New",
    notes: "New Location",
  };

  test("works", async function () {
    let loc = await Location.create(newLoc);
    
    expect(loc).toEqual({
      name: "New",
      notes: "New Location",
      id: expect.any(Number),
    });

    const result = await db.query(
          `SELECT id, name, notes
           FROM location
           WHERE name = 'New'`);
    expect(result.rows[0]).toEqual(
      {
      name: "New",
      notes: "New Location",
      id: expect.any(Number),
    }
    );
  });
  test("fails with bad data", async function () {
    try {
      await Location.create("");
      fail();
    } catch (err){
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  test("fails with null", async function () {
    try {
      await Location.create({notes:"bad data"});
      fail();
    } catch (err){
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  test("fails with name as empty string", async function () {
    try {
      await Location.create({name:""});
      fail();
    } catch (err){
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    const result = await db.query(
      `SELECT id, name, notes
       FROM location
       WHERE name = 'Parent Location'`);
      
    let location = await Location.get(result.rows[0].id);
    expect(location).toEqual(
      {
        id: expect.any(Number),
        name: "Parent Location",
        notes: "The parent location",
        items: expect.any(Array)
      }
    )
    expect(location.items.length).toEqual(3)
  });

  test("not found if no such lot", async function () {
    try {
      await Location.get(-200);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("not found if string passed as id", async function () {
    try {
      await Location.get("X");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    name: "Edited",
    notes: "New Description"
  };

  test("works", async function () {
    const {rows} = await db.query(
      `SELECT id, name, notes
       FROM location
       WHERE name = 'First Location'`);

    let updatedLocation = await Location.update(rows[0].id, updateData);
    expect(updatedLocation).toEqual({
      id: expect.any(Number),
      ...updateData,
    });

    const result = await db.query(
          `SELECT id, name, notes
           FROM location
           WHERE name = 'Edited'`);
    expect(result.rows).toEqual([{
      ...updateData,
      id: expect.any(Number)
    }]);
  });

  test("works: null fields", async function () {
    const {rows} = await db.query(
      `SELECT id, name, notes
       FROM location
       WHERE name = 'Parent Location'`);

    const updateDataSetNulls = {
      notes: "New Parent Description",
    };

    let company = await Location.update(rows[0].id, updateDataSetNulls);
    expect(company).toEqual({
      id: expect.any(Number),
      name: "Parent Location",
      ...updateDataSetNulls,
    });

    const result = await db.query(
      `SELECT id, name, notes
       FROM location
       WHERE name = 'Parent Location'`);
    expect(result.rows).toEqual([{
      id: expect.any(Number),
      name: "Parent Location",
      notes: "New Parent Description"
    }]);
  });

  test("not found if no such lot", async function () {
    try {
      await Location.update(-3, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      const {rows} = await db.query(
        `SELECT id, name, notes
         FROM location
         WHERE name = 'Parent Location'`);
      await Location.update(rows[0].id, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove Location", function () {
  test("works", async function () {
    const test = await db.query(
      `SELECT *
      FROM location
      WHERE name='First Location'`,

    );

    let locations = await Location.get(test.rows[0].id);
    await Location.remove(locations.id);

    const res = await db.query(
        "SELECT * FROM location WHERE name='First Location'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such lot", async function () {
    try {
      await Location.remove(-200);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("not found if string passed as id", async function () {
    try {
      await Location.remove("X");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
