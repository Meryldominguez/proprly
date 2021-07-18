"use strict";
const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Production = require("./production.js");
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
  let newProd = {
    title: "Flight(Dove)",
    date_start: "2019-08-15",
    date_end:"2019-09-29",
    active: false,
    notes: "company premiere",
  };

  test("works", async function () {
    let prod = await Production.create(newProd);
    delete newProd.date_end
    delete newProd.date_start

    expect(prod).toEqual({
      ...newProd,
      dateStart: expect.any(Date),
      dateEnd: expect.any(Date),
      id: expect.any(Number),
    });
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Production.findAll();

    expect(jobs).toEqual(expect.arrayContaining([
      {
        id: expect.any(Number),
        title: "Carmen",
        dateStart: expect.any(Object),
        dateEnd: expect.any(Object),
        active: false,
        notes: "co-production carmen notes"
      },
      {
        id: expect.any(Number),
        title: "Magic Flute",
        dateStart: expect.any(Object),
        dateEnd: null,
        active: true,
        notes: "flute notes"
      },
      {
        id: expect.any(Number),
        title: "La traviata",
        dateStart: null,
        dateEnd: expect.any(Object),
        active: false,
        notes: "co-production traviata notes"
      },
      {
        id: expect.any(Number),
        title: "Steve Jobs",
        dateStart: null,
        dateEnd:null,
        active: true,
        notes: "upcoming planning for steve jobs"
      }
    ])
    );
  });

  test("works: by active", async function () {
    let jobs = await Production.findAll({ active: true });
    expect(jobs).toEqual(expect.arrayContaining([
      {
        id: expect.any(Number),
        title: "Steve Jobs",
        dateStart: null,
        dateEnd:null,
        active: true,
        notes: "upcoming planning for steve jobs"
      },
      {
        id: expect.any(Number),
        title: "Magic Flute",
        dateStart: expect.any(Object),
        dateEnd: null,
        active: true,
        notes: "flute notes"
      }
    ])
    );
  });

  // test("works: by year", async function () {
  //   let jobs = await Production.findAll({ year:[2006, 2019] });
  //   expect(jobs).toEqual([
  //     {
  //       id: testJobIds[0],
  //       title: "Job1",
  //       salary: 100,
  //       equity: "0.1",
  //       companyHandle: "c1",
  //       companyName: "C1",
  //     },
  //     {
  //       id: testJobIds[1],
  //       title: "Job2",
  //       salary: 200,
  //       equity: "0.2",
  //       companyHandle: "c1",
  //       companyName: "C1",
  //     },
  //   ]);
  // });


  test("works: by search", async function () {
    let jobs = await Production.findAll({ search: "co-prod notes" });
    expect(jobs).toEqual(expect.arrayContaining([
      {
        id: expect.any(Number),
        title: "Carmen",
        dateStart: expect.any(Object),
        dateEnd: expect.any(Object),
        active: false,
        notes: "co-production carmen notes"
      },
      {
        id: expect.any(Number),
        title: "La traviata",
        dateStart: null,
        dateEnd: expect.any(Object),
        active: false,
        notes: "co-production traviata notes"
      }
    ])
    );
  });
});

/************************************** get */

describe("get", function () {
  
  test("works", async function () {
    let [prod] = await Production.findAll();
    let result = await Production.get(prod.id);
    expect(result).toEqual(prod);
  });

  test("not found if no such job", async function () {
    try {
      await Production.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  let updateData = {
    title: "Carmen (Bizet)",
    dateStart: "2021-06-01",
    dateEnd: null,
    active: true,
    notes: "updated"
  }

  test("works", async function () {
    let [carmen] = await Production.findAll({ search: "carmen" });
    let job = await Production.update(carmen.id, updateData);
    expect(job).toEqual({
      id: expect.any(Number),
      title: "Carmen (Bizet)",
      dateStart: expect.any(Object),
      dateEnd: null,
      active: true,
      notes: "updated"
    });
  });

  test("not found if no such job", async function () {
    try {
      await Production.update(0, {
        title: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Production.update(testJobIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    let [prod] = await Production.findAll();
    await Production.remove(prod.id);
    const res = await db.query(
        "SELECT id FROM production WHERE id=$1", [testJobIds[0]]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Production.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
