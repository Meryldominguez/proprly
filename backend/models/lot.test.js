"use strict";

const db = require("../db.js");
process.cwd()
const { BadRequestError, NotFoundError } = require("../expressError");
const Lot = require("./lot.js");
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

describe("create", function () {
  
  const newLot = {
    name: "New",
    description: "New Lot",
    loc_id: 1,
    quantity: 1,
    price: 20.99,
  };

  test("works", async function () {
    let lot = await Lot.create(Lotnew);
    expect(lot).toEqual(newLot);

    const result = await db.query(
          `SELECT name, description, location, quantity, price
           FROM lot
           WHERE name = 'New'`);
    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        name: "New",
        description: "New Lot",
        loc_id: 1,
        quantity: 1,
        price: 20.99,
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Lot.create(newLot);
      await Lot.create(newLot);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: all", async function () {
    let lots = await Lot.findAll();
    expect(lots).toEqual([
      {
        id: expect.any(Number),
        name: "item1",
        location: "First Location",
        description: "Desc1",
        quantity: 1,
        price:10.99
      },
      {
        id: expect.any(Number),
        name: "item2",
        location: "First Location",
        description: "Desc2",
        quantity:null,
        price:5.50
      },
      {
        id: expect.any(Number),
        name: "item3",
        location: "Second Location",
        description: "Desc3",
        quantity: 3,
        price:400.00
      },

    ]);
  });


  test("works: search by name", async function () {
    let lots = await Lot.findAll({ searchTerm: "1" });
    expect(lots.rows.length).toEqual(1)
    expect(lots[0]).toEqual([
      {
        id: expect.any(Number),
        name: "item1",
        location: "First Location",
        description: "Desc1",
        quantity: 1,
        price:10.99
      },
    ]);
  });
  test("works: search by description", async function () {
    let lots = await Lot.findAll({ searchTerm: "desc" });
    expect(lots.rows.length).toEqual(3)
  });

  test("works: search by location", async function () {
    let lots = await Lot.findAll({ searchTerm: "first" });
    expect(lots.rows.length).toEqual(2)
  });

  test("works: empty list on nothing found", async function () {
    let lots = await Lot.findAll({ name: "nope" });
    expect(lots).toEqual([]);
  });

});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let {rows} = await Lot.findAll({ searchTerm: "1" });
    let lot = await Lot.get(rows[0].id);
    expect(lot).toEqual(
      {
        id: expect.any(Number),
        name: "item1",
        location: "First Location",
        description: "Desc1",
        quantity: 1,
        price:10.99
      },
    )
  });

  test("not found if no such lot", async function () {
    try {
      await Lot.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
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
//     let company = await Lot.update("item1", updateData);
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

//     let company = await Lot.update("item1", updateDataSetNulls);
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
//       await Lot.update("nope", updateData);
//       fail();
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });

//   test("bad request with no data", async function () {
//     try {
//       await Lot.update("item1", {});
//       fail();
//     } catch (err) {
//       expect(err instanceof BadRequestError).toBeTruthy();
//     }
//   });
// });

/************************************** remove */

describe("remove Lot", function () {
  test("works", async function () {
    let {rows} = await Lot.findAll({ searchTerm: "1" });
    await Lot.remove(rows[0].id);
    
    const res = await db.query(
        "SELECT handle FROM lot WHERE handle='item1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such lot", async function () {
    try {
      await Lot.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
