"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Lot = require("../models/lot");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** POST /lots */

describe("POST /lots", function () {
  test("works if logged in", async function () {
    const {rows:[bay1]} = await db.query(
      `SELECT * FROM location
        WHERE name = 'Bay 1'`)

    const resp = await request(app)
        .post("/lots")
        .send({
          name: "New Lot",
          description: "New",
          quantity: 2,
          locId: bay1.id,
          price : 20.99
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      lot: {
          id:expect.any(Number),
          name: "New Lot",
          description: "New",
          quantity: 2,
          locId: bay1.id,
          price : "$20.99"
      }
    });
  });
  
  test("unauth for anon", async function () {
    const {rows:[bay1]} = await db.query(
      `SELECT * FROM location
        WHERE name = 'Bay 1'`)
    const resp = await request(app)
        .post("/lots")
        .send({
          name: "New Lot",
          description: "New",
          quantity: 3,
          locId: bay1.id,
          price : "$20.99"
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
        .post("/lots")
        .send({
          name: "New Lot",
          description: "New"
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /lots */

describe("GET /lots", function () {
  test("works for admins", async function () {
    const resp = await request(app)
        .get("/lots")
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      lots: expect.any(Array)
    });
    expect(resp.body.lots.length).toBe(8)
    expect(resp.status).toEqual(200)
  });

  test("works for user", async function () {
    const resp = await request(app)
        .get("/lots")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body.lots.length).toBe(8)
    expect(resp.statusCode).toEqual(200);
  });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .get("/lots");
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("fails: test next() handler", async function () {
//     // there's no normal failure event which will cause this route to fail ---
//     // thus making it hard to test that the error-handler works with it. This
//     // should cause an error, all right :)
//     await db.query("DROP TABLE lot CASCADE;");
//     const resp = await request(app)
//         .get("/lots")
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(500);
//   });
});

/************************************** GET /lots/:id */

describe("GET /lots/:id", function () {
  test("works for admin", async function () {
    const {rows:[lot1]} = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot1'`)
    const resp = await request(app)
        .get(`/lots/${lot1.id}`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      lot: {
        id: expect.any(Number),
        name: "Lot1",
        description: "New Lot1",
        quantity: 3,
        available:3,
        locId: expect.any(Number),
        price : "$20.99",
        tags: [],
      },
    });
  });

  test("works for user", async function () {
    const {rows:[lot1]} = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot1'`)
    const resp = await request(app)
        .get(`/lots/${lot1.id}`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(200);
  });

  test("unauth for anon", async function () {
    const {rows:[lot1]} = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot1'`)
    const resp = await request(app)
        .get(`/lots/${lot1.id}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if lot not found", async function () {
    const resp = await request(app)
        .get(`/lots/100000`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /lots/:id */

describe("PATCH /lots/:id", () => {
  test("works for admins", async function () {
    const {rows:[lot1]} = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot1'`)

    const resp = await request(app)
        .patch(`/lots/${lot1.id}`)
        .send({
          name: "New",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      lot: {
        id: expect.any(Number),
        name: "New",
        description: "New Lot1",
        quantity: 3,
        locId: expect.any(Number),
        price : "$20.99"
      }
    });
  });

  test("works for user", async function () {
    const {rows:[lot1]} = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot1'`)

    const resp = await request(app)
        .patch(`/lots/${lot1.id}`)
        .send({
          name: "New",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      lot: {
        id: expect.any(Number),
        name: "New",
        description: "New Lot1",
        quantity: 3,
        locId: expect.any(Number),
        price : "$20.99"
      }
    });
  });

  test("unauth for anon", async function () {
    const {rows:[lot1]} = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot1'`)

    const resp = await request(app)
        .patch(`/lots/${lot1.id}`)
        .send({
          name: "New"
        })
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such lot", async function () {
    const resp = await request(app)
        .patch(`/lots/1000000`)
        .send({
          name: "Nope",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);

    const resp2 = await request(app)
        .patch(`/lots/1000000`)
        .send({
          name: "Nope",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if invalid data", async function () {
    const {rows:[lot1]} = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot1'`)
    const resp = await request(app)
        .patch(`/lots/${lot1.id}`)
        .send({
          name: 42,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

});

/************************************** DELETE /lots/:id */

describe("DELETE /lots/:id", function () {
  test("works for admin", async function () {
    const {rows:[lot1]} = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot1'`)
    const resp = await request(app)
        .delete(`/lots/${lot1.id}`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: lot1.id });
  });

  test("unauth for users", async function () {
    const {rows:[lot1]} = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot1'`)

    const resp = await request(app)
        .delete(`/lots/${lot1.id}`)
        .set("authorization", `Bearer ${u2Token}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const {rows:[lot1]} = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot1'`)

    const resp = await request(app)
        .delete(`/lots/${lot1.id}`);
    expect(resp.statusCode).toEqual(401);
  });
});
