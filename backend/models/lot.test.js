"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Lot = require("./lot.js");
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
    newLot.locId=loc.id

    let lot = await Lot.create(newLot);
    expect(lot).toEqual({
      name: "New",
      description: "New Lot",
      quantity: 1,
      locId:loc.id,
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
        available:0,
        id: expect.any(Number),
        name: "item1",
        locId: expect.any(Number),
        location: "First Location",
        description: "Desc1",
        quantity: 1,
        price:"$10.99",
        tags:expect.any(Array)
      },
      {
        available:null,
        id: expect.any(Number),
        name: "item2",
        locId: expect.any(Number),
        location: "First Location",
        description: "Desc2",
        quantity:null,
        price:"$5.50",
        tags:expect.any(Array)
      },
      {
        available:-1,
        id: expect.any(Number),
        name: "item3",
        locId: expect.any(Number),
        location: "Second Location",
        description: "Desc3",
        quantity: 3,
        price:"$400.00",
        tags:expect.any(Array)
      },

    ]);
  });


  test("works: search by name", async function () {
    let lots = await Lot.findAll({searchTerm:"1"});
    expect(lots.length).toEqual(1)
    expect(lots).toEqual([
      {      
        available:0,  
        locId: expect.any(Number),
        id: expect.any(Number),
        name: "item1",
        location: "First Location",
        description: "Desc1",
        quantity: 1,
        price:"$10.99",
        tags:expect.any(Array)
      },
    ]);
    lots = await Lot.findAll({searchTerm:"Item"});
    expect(lots.length).toEqual(3)
  });

  test("works: search by description", async function () {
    let lots = await Lot.findAll({searchTerm:"desc"});
    expect(lots.length).toEqual(3)
  });

  test("works: empty list on nothing found", async function () {
    let lots = await Lot.findAll({searchTerm:"nope"});
    expect(lots).toEqual([]);
  });
  test("work: bad search params gives whole list", async function () {
    const lots = await Lot.findAll({q:"nope"});
    expect(lots.length).toEqual(3)
  });

});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let [lot1] = await Lot.findAll({searchTerm:"1"});
    lot1 = await Lot.get(lot1.id);
    expect(lot1).toEqual(
      {
        id: expect.any(Number),
        name: "item1",
        locId: expect.any(Number),
        location: "First Location",
        active: expect.any(Array),
        description: "Desc1",
        available: 0,
        quantity: 1,
        price:"$10.99",
        tags:expect.any(Array)
      })
    expect(lot1.tags.length).toBe(4)
    
    let [lot2] = await Lot.findAll({searchTerm:"2"});
    lot2 = await Lot.get(lot2.id);
    expect(lot2).toEqual(
      {
        id: expect.any(Number),
        name: "item2",
        available:null,
        locId: expect.any(Number),
        active: expect.any(Array),
        location:"First Location",
        description: "Desc2",
        quantity: null,
        price:"$5.50",
        tags:expect.any(Array)
      },
    )
    let [lot3]= await Lot.findAll({searchTerm:"3"});
    lot3 = await Lot.get(lot3.id);
    expect(lot3).toEqual(
      {
        id: expect.any(Number),
        name: "item3",
        locId: expect.any(Number),
        active: expect.any(Array),
        location:"Second Location",
        available:-1,
        description: "Desc3",
        quantity: 3,
        price:"$400.00",
        tags:expect.any(Array)
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

describe("update", function () {
  const updateData = {
    name: "Updated",
    description: "New Description",
    quantity: 10,
    price:"2.50",
  };

  test("works", async function () {
    let [{id}] = await Lot.findAll({searchTerm:"1"});

    let resp = await Lot.update(id, updateData);
    expect(resp).toEqual({
      id: expect.any(Number),
      locId:expect.any(Number),
      ...updateData,
      price:"$2.50"
    });

    const {rows:[updated]} = await db.query(
          `SELECT id, name, description, quantity, price, loc_id as "locId"
           FROM lot
           WHERE name = 'Updated'`);
    expect(updated).toEqual({
      id: expect.any(Number),
      name: "Updated",
      locId: expect.any(Number),
      description: "New Description",
      quantity: 10,
      price:"$2.50",
    });
  });

  test("works: null fields", async function () {
    let [{id}] = await Lot.findAll({searchTerm:"1"});

    const updateDataSetNulls = {
      name: "New",
    };

    let company = await Lot.update(id, updateDataSetNulls);
    expect(company).toEqual({
      id: expect.any(Number),
      locId:expect.any(Number),
      price:"$10.99",
      quantity:1,
      description: "Desc1",
      ...updateDataSetNulls
    });

    const result = await db.query(
          `SELECT id, name, description, quantity, price, loc_id as "locId"
          FROM lot
          WHERE name = 'New'`);
    expect(result.rows).toEqual([{
      id: expect.any(Number),
      locId:expect.any(Number),
      name: "New",
      price:"$10.99",
      quantity:1,
      description: "Desc1"
    }]);
  });

  test("not found if no such lot", async function () {
    try {
      await Lot.update(100000, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      let [{id}] = await Lot.findAll({searchTerm:"1"});

      await Lot.update(id, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  test("bad request with bad data", async function () {
    try {
      let [{id}] = await Lot.findAll({searchTerm:"1"});
      await Lot.update(id, "hello");
      fail();
    } catch (err) {      
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove Lot", function () {
  test("works", async function () {
    let lots = await Lot.findAll({searchTerm:"item1"} );
    await Lot.remove(lots[0].id);

    const res = await db.query(
        "SELECT id FROM lot WHERE name='item1'");
    expect(res.rows.length).toEqual(0);
  });

  test("works with cascade", async function () {
    let lots = await Lot.findAll({searchTerm:"item2"} );
    await Lot.remove(lots[0].id);

    const {rows:lotCount} = await db.query(
      "SELECT * FROM lot");
    expect(lotCount.length).toBe(2)

    const {rows:locCount} = await db.query(
      "SELECT * FROM location");
    expect(locCount.length).toBe(3)

    const {rows:propCount} = await db.query(
      "SELECT * FROM prop");
    expect(propCount.length).toBe(3)

    const {rows:tagCount} = await db.query(
      "SELECT * FROM tag");
    expect(tagCount.length).toBe(6)
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
