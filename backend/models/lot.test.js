"use strict";

const db = require("../db.js");
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

describe("create",function () {
  
  const newLot = {
    name: "New",
    description: "New Lot",
    quantity: 1,
    price: 20.99,
  };

  test("works", async function () {
    let {rows:[loc]} = await db.query(
      `SELECT * FROM location
        WHERE name = 'First Location'`)
    newLot.loc_id=loc.id

    let lot = await Lot.create(newLot);
    expect(lot).toEqual({
      name: "New",
      description: "New Lot",
      quantity: 1,
      loc_id:loc.id,
      price : "$20.99",
      id: expect.any(Number),
    });

    const result = await db.query(
          `SELECT id, name, description, loc_id, quantity, price
           FROM lot
           WHERE name = 'New'`);
    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        name: "New",
        description: "New Lot",
        loc_id: loc.id,
        quantity: 1,
        price: "$20.99",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      let {rows:[loc]} = await db.query(
        `SELECT * FROM location
          WHERE name = 'First Location'`)
      newLot.loc_id=loc.id

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
        price:"$10.99"
      },
      {
        id: expect.any(Number),
        name: "item2",
        location: "First Location",
        description: "Desc2",
        quantity:null,
        price:"$5.50"
      },
      {
        id: expect.any(Number),
        name: "item3",
        location: "Second Location",
        description: "Desc3",
        quantity: 3,
        price:"$400.00"
      },

    ]);
  });


  test("works: search by name", async function () {
    let lots = await Lot.findAll({searchTerm:"1"});
    expect(lots.length).toEqual(1)
    expect(lots).toEqual([
      {
        id: expect.any(Number),
        name: "item1",
        location: "First Location",
        description: "Desc1",
        quantity: 1,
        price:"$10.99"
      },
    ]);
  });
  test("works: search by description", async function () {
    let lots = await Lot.findAll({searchTerm:"desc"});
    expect(lots.length).toEqual(3)
  });

  test("works: search by location", async function () {
    let lots = await Lot.findAll({searchTerm:"first"});
    expect(lots.length).toEqual(2)
  });

  test("works: empty list on nothing found", async function () {
    let lots = await Lot.findAll({searchTerm:"nope"});
    expect(lots).toEqual([]);
  });

});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let lots = await Lot.findAll({searchTerm:"1"});
    let lot = await Lot.get(lots[0].id);
    expect(lot).toEqual(
      {
        id: expect.any(Number),
        name: "item1",
        loc_id: expect.any(Number),
        description: "Desc1",
        quantity: 1,
        price:"$10.99"
      },
    )
  });

  test("not found if no such lot", async function () {
    try {
      await Lot.get(-200);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("not found if string passed as id", async function () {
    try {
      await Lot.get("X");
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
    let lots = await Lot.findAll({searchTerm:"item1"} );
    await Lot.remove(lots[0].id);

    const res = await db.query(
        "SELECT id FROM lot WHERE name='item1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such lot", async function () {
    try {
      await Lot.remove(-200);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("not found if string passed as id", async function () {
    try {
      await Lot.remove("X");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
