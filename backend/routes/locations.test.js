
'use strict'

const request = require('supertest')

const db = require('../db.js')
const app = require('../app')
const Location = require('../models/location')

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken

} = require('./_testCommon')

beforeAll(async ()=> await commonBeforeAll("/locations Routes"))
beforeEach(commonBeforeEach)
afterEach(commonAfterEach)
afterAll(commonAfterAll)

/** ************************************ POST /locations */

describe('POST /locations', function () {
  test('works for admin', async function () {

    const resp = await request(app)
      .post('/locations')
      .send({
        name: 'Backroom',
        notes: 'New',
        parentId: null
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(201)
    expect(resp.body).toEqual({
      location: {
        id: expect.any(Number),
        name: 'Backroom',
        notes: 'New',
        parentId: null
      }
    })
  })
  test('works for user', async function () {

    const resp = await request(app)
      .post('/locations')
      .send({
        name: 'New Location',
        notes: 'New',
        parentId: null
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(201)
    expect(resp.body).toEqual({
      location: {
        id: expect.any(Number),
        name: 'New Location',
        notes: 'New',
        parentId: null
      }
    })
  })

  test('unauth for anon', async function () {
    const { rows: [bay1] } = await db.query(
      `SELECT * FROM location
        WHERE name = 'Bay 1'`)
    const resp = await request(app)
      .post('/locations')
      .send({
        name: 'failed Location',
        notes: 'New',
        parentId: null
      })
    expect(resp.statusCode).toEqual(401)
  })

  test('bad request if missing data', async function () {
    const resp = await request(app)
      .post('/locations')
      .send({
        notes: 'New',
        parentId: null
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(400)
  })
})

/** ************************************ GET /locations */

describe('GET /locations', function () {
  test('works for admins', async function () {
    const resp = await request(app)
      .get('/locations')
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      locations: expect.any(Array)
    })
    expect(resp.body.locations.length).toBe(2)
    expect(resp.status).toEqual(200)
  })

  test('works for user', async function () {
    const resp = await request(app)
      .get('/locations')
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.body.locations.length).toBe(2)
    expect(resp.statusCode).toEqual(200)
  })

  test('works with search', async function () {
    const { rows: [bay1] } = await db.query(
      `SELECT * FROM location
        WHERE name = 'Bay 1'`)
    const resp = await request(app)
      .get(`/locations?id=${bay1.id}`)
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.body.locations.length).toBe(1)
    expect(resp.statusCode).toEqual(200)
  })
  test('fails with bad search', async function () {
    const resp = await request(app)
      .get(`/locations?id=abcde`)
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(400)
  })

  test('unauth for anon', async function () {
    const resp = await request(app)
      .get('/locations')
    expect(resp.statusCode).toEqual(401)
  })

  test('fails: test next() handler', async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query('DROP TABLE location CASCADE;')
    const resp = await request(app)
      .get('/locations')
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(500)
  })
})
/** ************************************ GET /locations/list */

describe('GET /locations/list', function () {
  test('works for admins', async function () {
    const resp = await request(app)
      .get('/locations/list')
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      locations: expect.any(Array)
    })
    expect(resp.body.locations.length).toBe(4)
    expect(resp.status).toEqual(200)
  })

  test('works for user', async function () {
    const resp = await request(app)
      .get('/locations/list')
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.body.locations.length).toBe(4)
    expect(resp.statusCode).toEqual(200)
  })

  test('unauth for anon', async function () {
    const resp = await request(app)
      .get('/locations/list')
    expect(resp.statusCode).toEqual(401)
  })

  test('fails: test next() handler', async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query('DROP TABLE location CASCADE;')
    const resp = await request(app)
      .get('/locations/list')
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(500)
  })
})

/** ************************************ GET /locations/:id */

describe('GET /locations/:id', function () {
  test('works for admin', async function () {
    const { rows: [loc] } = await db.query(
      `SELECT * FROM location
        WHERE name = 'Bay 1'`)
    const resp = await request(app)
      .get(`/locations/${loc.id}`)
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      location: {
        id: expect.any(Number),
        items: expect.any(Array),
        name: "Bay 1",
        notes:null,
        parentId:expect.any(Number)
      }
    })
    expect(resp.body.location.items.length).toBe(3)
  })
  test('works for user', async function () {
    const { rows: [loc] } = await db.query(
      `SELECT * FROM location
        WHERE name = 'Bay 1'`)
    const resp = await request(app)
      .get(`/locations/${loc.id}`)
      .set('authorization', `Bearer ${u2Token}`)
    expect(resp.statusCode).toEqual(200)
    expect(resp.body).toEqual({
      location: {
        id: expect.any(Number),
        items: expect.any(Array),
        name: "Bay 1",
        notes:null,
        parentId:expect.any(Number)
      }
    })
    expect(resp.body.location.items.length).toBe(3)
  })

  test('unauth for anon', async function () {
    const { rows: [loc] } = await db.query(
      `SELECT * FROM location
        WHERE name = 'Bay 1'`)
    const resp = await request(app)
      .get(`/locations/${loc.id}`)
    expect(resp.statusCode).toEqual(401)
  })

  test('not found if location not found', async function () {
    const resp = await request(app)
      .get('/locations/100000')
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(404)
  })
})

/** ************************************ PATCH /locations/:id */

describe('PATCH /locations/:id', () => {
  test('works for admins', async function () {
    const { rows: [loc] } = await db.query(
      `SELECT * FROM location
        WHERE name = 'Bay 1'`)

    const resp = await request(app)
      .patch(`/locations/${loc.id}`)
      .send({
        name: 'New Bay 1',
        notes: 'New Bay 1'
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      location: {
        id: expect.any(Number),
        name: 'New Bay 1',
        notes: 'New Bay 1',
        parentId: expect.any(Number),

      }
    })
  })

  test('works for user', async function () {
    const { rows: [loc] } = await db.query(
      `SELECT * FROM location
        WHERE name = 'Bay 2'`)

    const resp = await request(app)
      .patch(`/locations/${loc.id}`)
      .send({
        name: 'New Bay 2',
        notes: 'New Bay 2'
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.body).toEqual({
      location: {
        id: expect.any(Number),
        name: 'New Bay 2',
        notes: 'New Bay 2',
        parentId: expect.any(Number),
      }
    })
  })

  test('unauth for anon', async function () {
    const { rows: [loc] } = await db.query(
      `SELECT * FROM location
        WHERE name = 'Bay 1'`)

    const resp = await request(app)

      .patch(`/locations/${loc.id}`)
      .send({
        name: 'Wont work'
      })
    expect(resp.statusCode).toEqual(401)
  })

  test('not found if no such location', async function () {
    const resp = await request(app)
      .patch('/locations/1000000')
      .send({
        name: 'Nope'
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(404)

    const resp2 = await request(app)
      .patch('/locations/1000000')
      .send({
        name: 'Nope'
      })
      .set('authorization', `Bearer ${u2Token}`)
    expect(resp2.statusCode).toEqual(404)
  })

  test('bad request if invalid data', async function () {
    const { rows: [loc] } = await db.query(
      `SELECT * FROM location
        WHERE name = 'Warehouse'`)
    const resp = await request(app)
      .patch(`/locations/${loc.id}`)
      .send({
        name: 42
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(400)
  })
})

/** ************************************ DELETE /locations/:id */

describe('DELETE /locations/:id', function () {
  test('works for admin', async function () {
    const { rows: [loc] } = await db.query(
      `SELECT * FROM location
        WHERE name = 'Bay 1'`)
    const resp = await request(app)
      .delete(`/locations/${loc.id}`)
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({ deleted: loc.id })
  })

  test('unauth for users', async function () {
    const { rows: [loc] } = await db.query(
      `SELECT * FROM location
        WHERE name = 'Bay 2'`)
    const resp = await request(app)
      .delete(`/locations/${loc.id}`)
      .set('authorization', `Bearer ${u2Token}`)

    expect(resp.statusCode).toEqual(401)
  })

  test('unauth for anon', async function () {
    const { rows: [lot] } = await db.query(
      `SELECT * FROM location
        WHERE name = 'Warehouse'`)
    const resp = await request(app)
      .delete(`/locations/${lot.id}`)
    expect(resp.statusCode).toEqual(401)
  })
})
