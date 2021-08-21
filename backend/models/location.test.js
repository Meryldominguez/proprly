"use strict";

const db = require("../db.js");
process.cwd()
const { BadRequestError, NotFoundError } = require("../expressError");
const Location = require("./location.js");
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

describe("create",function () {
  
  const newLoc = {
    name: "New",
    notes: "New Location",
  };
  const newLoc2 = {
    name: "New2",
    notes: "child Location",
  };


  test("works", async function () {
    let loc = await Location.create(newLoc);
    
    expect(loc).toEqual({
      name: "New",
      notes: "New Location",
      parentId: null,
      id: expect.any(Number),
    });

    const {rows:[parent]} = await db.query(
          `SELECT id, name, notes, parent_id AS "parentId"
           FROM location
           WHERE name = 'New'`);
    expect(parent).toEqual(
      {
      name: "New",
      notes: "New Location",
      id: expect.any(Number),
      parentId:null
    }
    );
    let childLoc = await Location.create({...newLoc2,parentId:loc.id})
    expect(childLoc).toEqual({
      name: "New2",
      notes: "child Location",
      parentId: expect.any(Number),
      id: expect.any(Number),
    });

    const {rows:[child]} = await db.query(
          `SELECT id, name, notes, parent_id AS "parentId"
           FROM location
           WHERE name = 'New2'`);
    expect(child).toEqual(
      {
      name: "New2",
      notes: "child Location",
      id: expect.any(Number),
      parentId: expect.any(Number)
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

/************************************** getChildren */

describe("getChildren", function () {
  test("works, parsed", async function () {
    const {rows:[loc]} = await db.query(
      `SELECT id, name, notes
       FROM location
       WHERE name = 'Parent Location'`);
      
    let locations = await Location.getChildren(true,loc.id);
    
    expect(locations).toEqual([
      {
        parentId: null,
        locationName: "Parent Location",
        locationId:expect.any(Number),
        children: expect.any(Array)
      }
    ])
    expect(locations.length).toEqual(1)
  });
  test("works, flat", async function () {
    const {rows:[loc]} = await db.query(
      `SELECT id, name, notes
       FROM location
       WHERE name = 'Parent Location'`);
      
    let locations = await Location.getChildren(false, loc.id);
    expect(locations[0]).toEqual(
      {
        parentId: null,
        locationName: "Parent Location",
        locationId:expect.any(Number),
      }
    )
    
    expect(locations.length).toEqual(3)
  });

  test("not found if no such lot", async function () {
    try {
      await Location.getChildren(false,-200);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("not found if string passed as id", async function () {
    try {
      await Location.getChildren(true,"X");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
/************************************** get */

describe("get", function () {
  test("works", async function () {
    const {rows:[loc]} = await db.query(
      `SELECT id, name, notes
       FROM location
       WHERE name = 'Parent Location'`);
      
    let location = await Location.get(loc.id);
    
    expect(location).toEqual(
      {
        id: expect.any(Number),
        name: "Parent Location",
        notes: "The parent location",
        items: expect.any(Array),
        parentId: null
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

  test("works: standard", async function () {

    const {rows:[childLoc]} = await db.query(
      `SELECT id, name, notes
       FROM location
       WHERE name = 'First Location'`);

    let updatedChildLoc = await Location.update(childLoc.id, updateData);
    expect(updatedChildLoc).toEqual({
      ...updateData,
      id: expect.any(Number),
      parentId: expect.any(Number)
    });

    const result = await db.query(
          `SELECT id, name, notes, parent_id AS "parentId"
           FROM location
           WHERE name = 'Edited'`);
    expect(result.rows).toEqual([{
      ...updateData,
      parentId: expect.any(Number),
      id: expect.any(Number)
    }]);
  });
  test("works: changing parentId", async function () {

    const {rows:[childLoc]} = await db.query(
      `SELECT id, name, notes, parent_id AS "parentId"
       FROM location
       WHERE name = 'First Location'`);

    let updatedChildLoc = await Location.update(childLoc.id, {parentId:null});
    expect(updatedChildLoc).toEqual({
      ...childLoc,
      id: expect.any(Number),
      parentId: null
    });

    const result = await db.query(
          `SELECT id, name, notes, parent_id AS "parentId"
           FROM location
           WHERE name = 'First Location'`);
    expect(result.rows).toEqual([{
      ...childLoc,
      parentId: null,
      id: expect.any(Number)
    }]);
  });

  test("works: null fields", async function () {
    const {rows:[{id}]} = await db.query(
      `SELECT id
       FROM location
       WHERE name = 'Parent Location'`);

    const updateDataSetNulls = {
      notes: "New Parent Description",
    };

    let location = await Location.update(id, updateDataSetNulls);
    expect(location).toEqual({
      id: expect.any(Number),
      name: "Parent Location",
      parentId: null,
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
  
  test("fails: cannot make parent/child loop", async function(){
    try {
      const {rows:[{id}]} = await db.query(
        `SELECT id
         FROM location
         WHERE name = 'Parent Location'`);
      const {rows:[child]} = await db.query(
        `SELECT id
         FROM location
         WHERE name = 'First Location'`);

      const res = await Location.update(id, {parentId:child.id});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
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
      const {rows:[{id}]} = await db.query(
        `SELECT id, name, notes
         FROM location
         WHERE name = 'Parent Location'`);
      await Location.update(id, {});
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
    await Location.remove(test.rows[0].id);

    const res = await db.query(
        "SELECT * FROM location WHERE name='First Location'");
    expect(res.rows.length).toEqual(0);
  });

  test("works and cascade  delete works", async function () {
    const test = await db.query(
      `SELECT *
      FROM location
      WHERE name='First Location'`,

    );
    await Location.remove(test.rows[0].id);
    const res = await db.query(
        "SELECT * FROM location WHERE name='First Location'");
    expect(res.rows.length).toEqual(0);


    const {rows:lotCount} = await db.query(
      "SELECT * FROM lot");
    expect(lotCount.length).toBe(1)

    const {rows:propCount} = await db.query(
      "SELECT * FROM prop");
    expect(propCount.length).toBe(2)

    const {rows:tagCount} = await db.query(
      "SELECT * FROM tag");
    expect(tagCount.length).toBe(6)

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
