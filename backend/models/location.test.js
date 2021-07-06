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
        childLocations: expect.any(Array)
      }
    )
    expect(location.childLocations.length).toEqual(2)
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

// describe("update", function () {
//   const updateData = {
//     name: "New",
//     description: "New Description",
//     numEmployees: 10,
//     logoUrl: "http://new.img",
//   };

//   test("works", async function () {
//     let company = await Location.update("item1", updateData);
//     expect(company).toEqual({
//       handle: "item1",
//       ...updateData,
//     });

//     const result = await db.query(
//           `SELECT handle, name, description, num_employees, logo_url
//            FROM lot
//            WHERE handle = 'item1'`);
//     expect(result.rows).toEqual([{
//       handle: "item1",
//       name: "New",
//       description: "New Description",
//       num_employees: 10,
//       logo_url: "http://new.img",
//     }]);
//   });

//   test("works: null fields", async function () {
//     const updateDataSetNulls = {
//       name: "New",
//       description: "New Description",
//       numEmployees: null,
//       logoUrl: null,
//     };

//     let company = await Location.update("item1", updateDataSetNulls);
//     expect(company).toEqual({
//       handle: "item1",
//       ...updateDataSetNulls,
//     });

//     const result = await db.query(
//           `SELECT handle, name, description, num_employees, logo_url
//            FROM lot
//            WHERE handle = 'item1'`);
//     expect(result.rows).toEqual([{
//       handle: "item1",
//       name: "New",
//       description: "New Description",
//       num_employees: null,
//       logo_url: null,
//     }]);
//   });

//   test("not found if no such lot", async function () {
//     try {
//       await Location.update("nope", updateData);
//       fail();
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });

//   test("bad request with no data", async function () {
//     try {
//       await Location.update("item1", {});
//       fail();
//     } catch (err) {
//       expect(err instanceof BadRequestError).toBeTruthy();
//     }
//   });
// });

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
