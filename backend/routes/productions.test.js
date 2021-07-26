'use strict'

const request = require('supertest')

const db = require('../db.js')
const app = require('../app')
const Production = require('../models/production')

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken

} = require('./_testCommon')

beforeAll(commonBeforeAll)
beforeEach(commonBeforeEach)
afterEach(commonAfterEach)
afterAll(commonAfterAll)

/** ************************************ POST /productions */

describe('POST /productions', function () {
  test('works if logged in', async function () {

    const resp = await request(app)
      .post('/productions')
      .send({
          title:"Flight",
          dateStart: new Date('1995-12-17T03:24:00'),
          dateEnd: new Date('1995-12-17T03:24:00'),
          active:true,
          notes:"a fourth test production"
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(201)
    expect(resp.body).toEqual({
      production: {
        id: expect.any(Number),
        title:"Flight",
        dateStart: expect.any(String),
        dateEnd: expect.any(String),
        active:true,
        notes:"a fourth test production"
      }
    })
  })

  test('unauth for anon', async function () {
    const resp = await request(app)
      .post('/productions')
      .send({
        title:"Jenufa",
        dateStart: new Date('1995-12-17T03:24:00'),
        dateEnd: new Date('1995-12-17T03:24:00'),
        active:false,
        notes:"a failed test production"
      })
    expect(resp.statusCode).toEqual(401)
  })

  test('bad request if missing data', async function () {
    const resp = await request(app)
      .post('/productions')
      .send({
        title:"Jenufa",
        dateStart: new Date('1995-12-17T03:24:00'),
        dateEnd: new Date('1995-12-17T03:24:00')
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(400)
  })
})

/** ************************************ GET productions */

describe('GET /productions', function () {
  test('works for admins', async function () {
    const resp = await request(app)
      .get('/productions')
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      productions: expect.any(Array)
    })
    expect(resp.body.productions.length).toBe(3)
    expect(resp.status).toEqual(200)
  })

  test('works for user', async function () {
    const resp = await request(app)
      .get('/productions')
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.body.productions.length).toBe(3)
    expect(resp.statusCode).toEqual(200)
  })

  test('unauth for anon', async function () {
    const resp = await request(app)
      .get('/productions')
    expect(resp.statusCode).toEqual(401)
  })

  test('fails: test next() handler', async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query('DROP TABLE production CASCADE;')
    const resp = await request(app)
      .get('/productions')
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(500)
  })
})
/** ************************************ GET productions?QUERY */

describe('GET /productions?QUERY', function () {
  test('works with isActive', async function () {
    const resp = await request(app)
      .get('/productions?isActive=true')
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.body).toEqual({
      productions: expect.any(Array)
    })
    expect(resp.body.productions.length).toBe(2)
    expect(resp.status).toEqual(200)
  })
  test('works with search', async function () {
    const resp = await request(app)
      .get('/productions?search=third')
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.body.productions.length).toBe(1)
    expect(resp.statusCode).toEqual(200)
  })
  test('works with year', async function () {
    const resp = await request(app)
      .get('/productions?year=2006,2002')
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.body.productions.length).toBe(2)
    expect(resp.statusCode).toEqual(200)
  })
  test('fails with incorrect format year', async function () {
    const resp = await request(app)
      .get('/productions?year=20')
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(400)
  })
  test('fails with bad query', async function () {
    const resp = await request(app)
      .get('/productions?work=something')
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(400)
  })
})

/** ************************************ GET /productions/:id */

describe('GET /productions/:id', function () {
  test('works for admin', async function () {
    const { rows: [prod1] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'Carmen'`)
    const resp = await request(app)
      .get(`/productions/${prod1.id}`)
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      production: {
        id: expect.any(Number),
        title:"Carmen",
        dateStart: expect.any(String),
        dateEnd: expect.any(String),
        active:true,
        notes:"a test production",
        props: expect.any(Array)
      }
    })
  })

  test('works for user', async function () {
    const { rows: [prod1] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'Carmen'`)
    const resp = await request(app)
      .get(`/productions/${prod1.id}`)
      .set('authorization', `Bearer ${u2Token}`)
    expect(resp.statusCode).toEqual(200)
  })

  test('unauth for anon', async function () {
    const { rows: [prod1] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'Carmen'`)
    const resp = await request(app)
      .get(`/productions/${prod1.id}`)
    expect(resp.statusCode).toEqual(401)
  })

  test('not found if production not found', async function () {
    const resp = await request(app)
      .get('/productions/100000')
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(404)
  })
})

/** ************************************ PATCH /productions/:id */

describe('PATCH /productions/:id', () => {
  test('works for admins', async function () {

    const { rows: [prod1] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'La traviata'`)

    const resp = await request(app)
      .patch(`/productions/${prod1.id}`)
      .send({
        notes:"New"
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      production: {
        id: expect.any(Number),
        title: 'La traviata',
        dateStart: expect.any(String),
        dateEnd: expect.any(String),
        active:false,
        notes:"New"
      }
    })
  })

  test('works for user', async function () {
    const { rows: [prod1] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'Carmen'`)

    const resp = await request(app)
      .patch(`/productions/${prod1.id}`)
      .send({
        notes: 'New'
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.body).toEqual({
      production: {
        id: expect.any(Number),
        title: 'Carmen',
        dateEnd:expect.any(String),
        dateStart:expect.any(String),
        notes: "New",
        active:true
      }
    })
  })

  test('unauth for anon', async function () {
    const { rows: [prod1] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'Carmen'`)

    const resp = await request(app)
      .patch(`/productions/${prod1.id}`)
      .send({
        notes: 'New'
      })
    expect(resp.statusCode).toEqual(401)
  })

  test('not found if no such production', async function () {
    const resp = await request(app)
      .patch('/productions/1000000')
      .send({
        title: 'Nope'
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(404)

    const resp2 = await request(app)
      .patch('/productions/1000000')
      .send({
        title: 'Nope'
      })
      .set('authorization', `Bearer ${u2Token}`)
    expect(resp2.statusCode).toEqual(404)
  })

  test('bad request if invalid data', async function () {
    const { rows: [prod1] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'Carmen'`)
    const resp = await request(app)
      .patch(`/productions/${prod1.id}`)
      .send({
        title: 42
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(400)
  })
})

/** ************************************ DELETE /productions/:id */

describe('DELETE /productions/:id', function () {
  test('works for admin', async function () {
    const { rows: [prod1] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'Carmen'`)
    const resp = await request(app)
      .delete(`/productions/${prod1.id}`)
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({ deleted: prod1.id })
  })

  test('unauth for users', async function () {
    const { rows: [prod2] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'The magic flute'`)

    const resp = await request(app)
      .delete(`/productions/${prod2.id}`)
      .set('authorization', `Bearer ${u2Token}`)

    expect(resp.statusCode).toEqual(401)
  })

  test('unauth for anon', async function () {
    const { rows:[prod3] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'La traviata'`)

    const resp = await request(app)
      .delete(`/productions/${prod3.id}`)
    expect(resp.statusCode).toEqual(401)
  })
})
