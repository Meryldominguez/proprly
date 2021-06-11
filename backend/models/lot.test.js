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
    location: 1,
    quantity: 1,
    price: 20.99,
  };

  test("works", async function () {
    let company = await Lot.create(Lotnew);
    expect(company).toEqual(newLot);

    const result = await db.query(
          `SELECT name, description, location, quantity, price
           FROM lots
           WHERE name = 'New'`);
    expect(result.rows).toEqual([
      {
        name: "New",
        description: "New Lot",
        location: 1,
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
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
      {
        handle: "c3",
        name: "C3",
        description: "Desc3",
        numEmployees: 3,
        logoUrl: "http://c3.img",
      },
    ]);
  });

  test("works: by min employees", async function () {
    let lots = await Lot.findAll({ minEmployees: 2 });
    expect(lots).toEqual([
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
      {
        handle: "c3",
        name: "C3",
        description: "Desc3",
        numEmployees: 3,
        logoUrl: "http://c3.img",
      },
    ]);
  });

  test("works: by max employees", async function () {
    let lots = await Lot.findAll({ maxEmployees: 2 });
    expect(lots).toEqual([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
    ]);
  });

  test("works: by min-max employees", async function () {
    let lots = await Lot.findAll(
        { minEmployees: 1, maxEmployees: 1 });
    expect(lots).toEqual([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
    ]);
  });

  test("works: by name", async function () {
    let lots = await Lot.findAll({ name: "1" });
    expect(lots).toEqual([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
    ]);
  });

  test("works: empty list on nothing found", async function () {
    let lots = await Lot.findAll({ name: "nope" });
    expect(lots).toEqual([]);
  });

  test("bad request if invalid min > max", async function () {
    try {
      await Lot.findAll({ minEmployees: 10, maxEmployees: 1 });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let company = await Lot.get("c1");
    expect(company).toEqual({
      handle: "c1",
      name: "C1",
      description: "Desc1",
      numEmployees: 1,
      logoUrl: "http://c1.img",
      jobs: [
        { id: testJobIds[0], title: "Job1", salary: 100, equity: "0.1" },
        { id: testJobIds[1], title: "Job2", salary: 200, equity: "0.2" },
        { id: testJobIds[2], title: "Job3", salary: 300, equity: "0" },
        { id: testJobIds[3], title: "Job4", salary: null, equity: null },
      ],
    });
  });

  test("not found if no such company", async function () {
    try {
      await Lot.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    name: "New",
    description: "New Description",
    numEmployees: 10,
    logoUrl: "http://new.img",
  };

  test("works", async function () {
    let company = await Lot.update("c1", updateData);
    expect(company).toEqual({
      handle: "c1",
      ...updateData,
    });

    const result = await db.query(
          `SELECT handle, name, description, num_employees, logo_url
           FROM lots
           WHERE handle = 'c1'`);
    expect(result.rows).toEqual([{
      handle: "c1",
      name: "New",
      description: "New Description",
      num_employees: 10,
      logo_url: "http://new.img",
    }]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      name: "New",
      description: "New Description",
      numEmployees: null,
      logoUrl: null,
    };

    let company = await Lot.update("c1", updateDataSetNulls);
    expect(company).toEqual({
      handle: "c1",
      ...updateDataSetNulls,
    });

    const result = await db.query(
          `SELECT handle, name, description, num_employees, logo_url
           FROM lots
           WHERE handle = 'c1'`);
    expect(result.rows).toEqual([{
      handle: "c1",
      name: "New",
      description: "New Description",
      num_employees: null,
      logo_url: null,
    }]);
  });

  test("not found if no such company", async function () {
    try {
      await Lot.update("nope", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Lot.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Lot.remove("c1");
    const res = await db.query(
        "SELECT handle FROM lots WHERE handle='c1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such company", async function () {
    try {
      await Lot.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
