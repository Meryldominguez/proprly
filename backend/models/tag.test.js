"use strict";

const db = require("../db.js");
process.cwd()
const { BadRequestError, NotFoundError } = require("../expressError");
const Tag = require("./tag.js");
const Lot = require("./lot.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon");
const { tag } = require("./tag.js");

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

/************************************** tagLot */

describe("tag", function () {
  test("works for new tag", async function () {
    const [lot1] = await Lot.findAll({searchTerm:"1"});
    let tag = await Tag.tag(Number(lot1.id),{title:"Test Tag"});
    expect(tag).toEqual({
      tagId: expect.any(Number),
      lotId: lot1.id,
      lotName: "item1",
      tagTitle: "Test Tag"
    });
  });
  test("works for existing tag", async function () {
    const [lot3] = await Lot.findAll({searchTerm:"3"});
    let tag = await Tag.tag(Number(lot3.id),{title:"Test Tag"});

    expect(tag).toEqual({
      tagId: expect.any(Number),
      lotId: lot3.id,
      lotName: "item3",
      tagTitle: "Test Tag"
    });
  });
  test("fails for existing tag/lot pair", async function () {
    try {
      const [lot3] = await Lot.findAll({searchTerm:"3"});

      await Tag.tag(Number(lot3.id),{title:"Test Tag"});
      await Tag.tag(Number(lot3.id),{title:"Test Tag"});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy()
    }   
  });
  test("fails for bad data", async function () {
    const [lot3] = await Lot.findAll({searchTerm:"3"});
    try {
      await Tag.tag(Number(lot3.id),{});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy()
    }
    try {
      await Tag.tag(lot3.id,{tag:"hello"});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy()
    }   
  });

});
/************************************** getAll */

describe("getAll", function () {
  test("works, no search", async function () {
    let tags = await Tag.getAll();
    expect(tags.length).toEqual(6)
    expect(tags).toEqual(expect.any(Array))
    expect(tags[0]).toEqual({
      lotsWithTag: "2", 
      id: expect.any(Number), 
      title: "Set Dressing"
    })
  });
  test("works, search", async function () {
    let tags = await Tag.getAll("set");
    expect(tags.length).toEqual(2)
    expect(tags).toEqual(expect.any(Array))
    expect(tags[1]).toEqual({
      lotsWithTag: "0", 
      id: expect.any(Number), 
      title: "Set Pieces"
    })
  });
  test("works, error for no tag", async function () {
    try {
      await Tag.getAll("Nothing");
      fail()
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();

    }
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
/************************************** getLotTags */

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
/************************************** getTagLots */

describe("getTagLots", function () {
  test("works", async function () {
    const {rows:[{id}]} = await db.query(
      `SELECT id FROM tag
       WHERE title = 'Hand Props'`);
      
    let lots = await Tag.getTagLots(id);
    expect(lots).toEqual([
      {
        id: expect.any(Number),
        name: "item1",
        locId: expect.any(Number),
        location:"First Location",
        description:"Desc1"

      },
      {
        id: expect.any(Number),
        name: "item2",
        locId: expect.any(Number),
        location:"First Location",
        description:"Desc2"

      }
    ])
    expect(lots.length).toBe(2)
  });

  test("not found if no such lot", async function () {
    try {
      await Tag.getTagLots(-200);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("not found if string passed as id", async function () {
    try {
      await Tag.getTagLots("X");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  test("not found if passed null", async function () {
    try {
      await Tag.getTagLots();
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
/************************************** removeLotTag */

describe("remove lotTag", function () {
  test("works", async function () {
    const {rows:[{lotId, tagId}]} = await db.query(
      `SELECT lot_id AS "lotId", tag_id AS "tagId"
      FROM lot_tag
      JOIN tag ON tag_id=tag.id
      WHERE tag.title='Hand Props'`,
    );

    await Tag.removeTag(Number(lotId),Number(tagId));

    const {rows} = await db.query(
        `SELECT * FROM lot_tag WHERE tag_id=${tagId} AND lot_id=${lotId}`);
    expect(rows.length).toEqual(0);
  });

  test("not found if no such lot", async function () {
    try {
      await Tag.removeTag(-200,203);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("not found if bad data passed", async function () {
    try {
      await Tag.removeTag("30","12");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
