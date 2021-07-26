"use strict";

const db = require("../db.js");
process.cwd()
const { BadRequestError, NotFoundError } = require("../expressError");
const Tag = require("./tag.js");
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
  
  const newCat = {
    title: "New Tag"
  };

  test("works", async function () {
    let tag = await Tag.create(newCat);
    
    expect(tag).toEqual({
      title: "New Tag",
      id: expect.any(Number),
    });

    const result = await db.query(
          `SELECT id, title
           FROM tag
           WHERE title ='New Tag'`);
    expect(result.rows[0]).toEqual(
      {
      title: "New Tag",
      id: expect.any(Number),
    }
    );
  });
  test("fails with bad data", async function () {
    try {
      await Tag.create("");
      fail();
    } catch (err){
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  test("fails with null", async function () {
    try {
      await Tag.create({});
      fail();
    } catch (err){
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  test("fails with title as empty string", async function () {
    try {
      await Tag.create({title:""});
      fail();
    } catch (err){
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

});

/************************************** getAll */

describe("getAll", function () {
  test("works", async function () {
    let tags = await Tag.getAll();
    expect(tags.length).toEqual(5)
    expect(tags).toEqual(expect.any(Array))
    expect(tags[0]).toEqual({
      lotsWithTag: "2", 
      id: expect.any(Number), 
      title: "Set Dressing"
    })
  });

});
/************************************** get */

describe("get", function () {
  test("works", async function () {
    const result = await db.query(
      `SELECT id, title
       FROM tag
       WHERE title = 'Hand Props'`);
      
    let tag = await Tag.get(result.rows[0].id);
    expect(tag).toEqual(
      {
        id: expect.any(Number),
        title: "Hand Props",
        lots: expect.any(Array)
      }
    )
    expect(tag.lots.length).toBe(2)
  });

  test("not found if no such tag", async function () {
    try {
      await Tag.get(-200);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("not found if string passed as id", async function () {
    try {
      await Tag.get("X");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  test("not found if passed null", async function () {
    try {
      await Tag.get();
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
/************************************** get */

describe("getLotTags", function () {
  test("works", async function () {
    const {rows:[{id}]} = await db.query(
      `SELECT id FROM lot
       WHERE name = 'item2'`);
      
    let tags = await Tag.getLotTags(id);
    expect(tags).toEqual([
      {
        id: expect.any(Number),
        title: "Hand Props",

      },
      {
        id: expect.any(Number),
        title: "Furniture",

      }
    ])
    expect(tags.length).toBe(2)
  });

  test("not found if no such lot", async function () {
    try {
      await Tag.getLotTags(-200);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("not found if string passed as id", async function () {
    try {
      await Tag.getLotTags("X");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  test("not found if passed null", async function () {
    try {
      await Tag.getLotTags();
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "New Description"
  };

  test("works", async function () {
    const {rows} = await db.query(
      `SELECT id, title, title
       FROM tag
       WHERE title = 'Hand Props'`);

    let updatedTag = await Tag.update(rows[0].id, updateData);
    expect(updatedTag).toEqual({
      id: expect.any(Number),
      ...updateData,
    });

    const result = await db.query(
          `SELECT id, title, title
           FROM tag
           WHERE title = 'New Description'`);
    expect(result.rows).toEqual([{
      ...updateData,
      id: expect.any(Number)
    }]);
  });

  test("not found if no such lot", async function () {
    try {
      await Tag.update(-3, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      const {rows} = await db.query(
        `SELECT id, title
         FROM tag
         WHERE title = 'Hand Props'`);
      await Tag.update(rows[0].id, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove Tag", function () {
  test("works", async function () {
    const test = await db.query(
      `SELECT *
      FROM tag
      WHERE title='Hand Props'`,

    );

    let result = await Tag.get(test.rows[0].id);
    await Tag.remove(result.id);

    const res = await db.query(
        "SELECT * FROM tag WHERE title='First Tag'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such lot", async function () {
    try {
      await Tag.remove(-200);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("not found if string passed as id", async function () {
    try {
      await Tag.remove("X");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
