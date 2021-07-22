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

// const warehouse = await db.query(
//   `SELECT * FROM location
//     WHERE name = "Warehouse"`)
// const studio = await db.query(
//   `SELECT * FROM location
//     WHERE name = "Rehearsal studio"`)
// const bay1 = await db.query(
//   `SELECT * FROM location
//     WHERE name = "Bay 1"`)
// const bay2 = await db.query(
//   `SELECT * FROM location
//     WHERE name = "Bay 2"`)

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

// /************************************** GET /lots */

// describe("GET /lots", function () {
//   test("works for admins", async function () {
//     const resp = await request(app)
//         .get("/lots")
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       users: [
//         {
//           username: "u1",
//           firstName: "U1F",
//           lastName: "U1L",
//           email: "user1@user.com",
//           isAdmin: false,
//         },
//         {
//           username: "u2",
//           firstName: "U2F",
//           lastName: "U2L",
//           email: "user2@user.com",
//           isAdmin: false,
//         },
//         {
//           username: "u3",
//           firstName: "U3F",
//           lastName: "U3L",
//           email: "user3@user.com",
//           isAdmin: false,
//         },
//       ],
//     });
//   });

//   test("unauth for non-admin users", async function () {
//     const resp = await request(app)
//         .get("/lots")
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .get("/lots");
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("fails: test next() handler", async function () {
//     // there's no normal failure event which will cause this route to fail ---
//     // thus making it hard to test that the error-handler works with it. This
//     // should cause an error, all right :)
//     await db.query("DROP TABLE users CASCADE");
//     const resp = await request(app)
//         .get("/lots")
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(500);
//   });
// });

// /************************************** GET /lots/:username */

// describe("GET /lots/:username", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//         .get(`/lots/u1`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u1",
//         firstName: "U1F",
//         lastName: "U1L",
//         email: "user1@user.com",
//         isAdmin: false,
//         applications: [testJobIds[0]],
//       },
//     });
//   });

//   test("works for same user", async function () {
//     const resp = await request(app)
//         .get(`/lots/u1`)
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u1",
//         firstName: "U1F",
//         lastName: "U1L",
//         email: "user1@user.com",
//         isAdmin: false,
//         applications: [testJobIds[0]],
//       },
//     });
//   });

//   test("unauth for other users", async function () {
//     const resp = await request(app)
//         .get(`/lots/u1`)
//         .set("authorization", `Bearer ${u2Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .get(`/lots/u1`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found if user not found", async function () {
//     const resp = await request(app)
//         .get(`/lots/nope`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });

// /************************************** PATCH /lots/:username */

// describe("PATCH /lots/:username", () => {
//   test("works for admins", async function () {
//     const resp = await request(app)
//         .patch(`/lots/u1`)
//         .send({
//           firstName: "New",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u1",
//         firstName: "New",
//         lastName: "U1L",
//         email: "user1@user.com",
//         isAdmin: false,
//       },
//     });
//   });

//   test("works for same user", async function () {
//     const resp = await request(app)
//         .patch(`/lots/u1`)
//         .send({
//           firstName: "New",
//         })
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u1",
//         firstName: "New",
//         lastName: "U1L",
//         email: "user1@user.com",
//         isAdmin: false,
//       },
//     });
//   });

//   test("unauth if not same user", async function () {
//     const resp = await request(app)
//         .patch(`/lots/u1`)
//         .send({
//           firstName: "New",
//         })
//         .set("authorization", `Bearer ${u2Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .patch(`/lots/u1`)
//         .send({
//           firstName: "New",
//         });
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found if no such user", async function () {
//     const resp = await request(app)
//         .patch(`/lots/nope`)
//         .send({
//           firstName: "Nope",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });

//   test("bad request if invalid data", async function () {
//     const resp = await request(app)
//         .patch(`/lots/u1`)
//         .send({
//           firstName: 42,
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });

//   test("works: can set new password", async function () {
//     const resp = await request(app)
//         .patch(`/lots/u1`)
//         .send({
//           password: "new-password",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u1",
//         firstName: "U1F",
//         lastName: "U1L",
//         email: "user1@user.com",
//         isAdmin: false,
//       },
//     });
//     const isSuccessful = await User.authenticate("u1", "new-password");
//     expect(isSuccessful).toBeTruthy();
//   });
// });

// /************************************** DELETE /lots/:username */

// describe("DELETE /lots/:username", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//         .delete(`/lots/u1`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({ deleted: "u1" });
//   });

//   test("works for same user", async function () {
//     const resp = await request(app)
//         .delete(`/lots/u1`)
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.body).toEqual({ deleted: "u1" });
//   });

//   test("unauth if not same user", async function () {
//     const resp = await request(app)
//         .delete(`/lots/u1`)
//         .set("authorization", `Bearer ${u2Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .delete(`/lots/u1`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found if user missing", async function () {
//     const resp = await request(app)
//         .delete(`/lots/nope`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });

// /************************************** POST /lots/:username/jobs/:id */

// describe("POST /lots/:username/jobs/:id", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//         .post(`/lots/u1/jobs/${testJobIds[1]}`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({ applied: testJobIds[1] });
//   });

//   test("works for same user", async function () {
//     const resp = await request(app)
//         .post(`/lots/u1/jobs/${testJobIds[1]}`)
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.body).toEqual({ applied: testJobIds[1] });
//   });

//   test("unauth for others", async function () {
//     const resp = await request(app)
//         .post(`/lots/u1/jobs/${testJobIds[1]}`)
//         .set("authorization", `Bearer ${u2Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .post(`/lots/u1/jobs/${testJobIds[1]}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found for no such username", async function () {
//     const resp = await request(app)
//         .post(`/lots/nope/jobs/${testJobIds[1]}`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });

//   test("not found for no such job", async function () {
//     const resp = await request(app)
//         .post(`/lots/u1/jobs/0`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });

//   test("bad request invalid job id", async function () {
//     const resp = await request(app)
//         .post(`/lots/u1/jobs/0`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });
