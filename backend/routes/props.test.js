'use strict'

const request = require('supertest')

const db = require('../db.js')
const app = require('../app')
const Prop = require('../models/prop')

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken

} = require('./_testCommon')

beforeAll(async ()=> await commonBeforeAll("/props Routes"))
beforeEach(commonBeforeEach)
afterEach(commonAfterEach)
afterAll(commonAfterAll)

/** ************************************ POST /props */

describe('POST /props', function () {
  test('works for admin', async function () {
    const { rows: [prod] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'The magic flute'`)
    const { rows: [lot] } = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot6'`)

    const resp = await request(app)
      .post('/props')
      .send({
          lotId: lot.id, 
          prodId: prod.id,
          quantity: 100,
          notes:"a prop"
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(201)
    expect(resp.body).toEqual({
      prop: {
        lotId: lot.id, 
        prodId: prod.id,
        quantity: 100,
        notes:"a prop"
      }
    })
  })
  test('works for user', async function () {
    const { rows: [prod] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'The magic flute'`)
    const { rows: [lot] } = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot4'`)

    const resp = await request(app)
      .post('/props')
      .send({
          lotId: lot.id, 
          prodId: prod.id,
          quantity: 100,
          notes:"a prop"
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(201)
    expect(resp.body).toEqual({
      prop: {
        lotId: lot.id, 
          prodId: prod.id,
          quantity: 100,
          notes:"a prop"
      }
    })
  })

  test('unauth for anon', async function () {
    const { rows: [prod] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'La traviata'`)
    const { rows: [lot] } = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot4'`)

    const resp = await request(app)
      .post('/props')
      .send({
        lotId: lot.id, 
        prodId: prod.id,
        quantity: 100,
        notes:"a prop"
    })
    expect(resp.statusCode).toEqual(401)
  })

  test('bad request if missing data', async function () {
    const { rows: [lot] } = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot4'`)
    const resp = await request(app)
      .post('/props')
      .send({
          lotId: lot.id,
          quantity: 100,
          notes:"a prop"
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(400)
  })
})

/** ************************************ PATCH /props/:prodId/:lotId */

describe('PATCH /props/:id', () => {
  test('works for admins', async function () {

    const { rows: [prod] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'La traviata'`)
    const { rows: [lot] } = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot8'`)

    const resp = await request(app)
      .patch(`/props/${prod.id}/${lot.id}`)
      .send({
        notes:"New Notes"
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      prop: {
        prodId:prod.id,
        lotId:lot.id,
        quantity:null,
        notes:"New Notes"
      }
    })
  })

  test('works for user', async function () {
    const { rows: [prod] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'Carmen'`)
    const { rows: [lot] } = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot5'`)

    const resp = await request(app)
      .patch(`/props/${prod.id}/${lot.id}`)
      .send({
        quantity: 25
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.body).toEqual({
      prop: {
        prodId:prod.id,
        lotId:lot.id,
        quantity:25,
        notes:"prop notes"
      }
    })
  })

  test('unauth for anon', async function () {
    const { rows: [prod] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'Carmen'`)
    const { rows: [lot] } = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot5'`)

    const resp = await request(app)
      .patch(`/props/${prod.id}/${lot.id}`)
      .send({
        notes: 'New'
      })
    expect(resp.statusCode).toEqual(401)
  })

  test('not found if no such production', async function () {
    const resp = await request(app)
      .patch('/props/1000000')
      .send({
        title: 'Nope'
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(404)

    const resp2 = await request(app)
      .patch('/props/1000000')
      .send({
        title: 'Nope'
      })
      .set('authorization', `Bearer ${u2Token}`)
    expect(resp2.statusCode).toEqual(404)
  })

  test('bad request if invalid data', async function () {
    const { rows: [prod] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'Carmen'`)
    const { rows: [lot] } = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot5'`)
    const resp = await request(app)
      .patch(`/props/${prod.id}/${lot.id}`)
      .send({
        title: 42
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(400)
  })
})

/** ************************************ DELETE /props/:prodId/:lotId */

describe('DELETE /props/:prodId/:lotId', function () {

  test('unauth for users', async function () {
    const { rows: [prod] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'The magic flute'`)
      const { rows: [lot] } = await db.query(
        `SELECT * FROM lot
          WHERE name = 'Lot7'`)    

    const resp = await request(app)
      .delete(`/props/${prod.id}/${lot.id}`)
      .set('authorization', `Bearer ${u2Token}`)

    expect(resp.statusCode).toEqual(401)
  })

  test('unauth for anon', async function () {
    const { rows:[prod] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'La traviata'`)
    const { rows: [lot] } = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot6'`)  
    const resp = await request(app)
      .delete(`/props/${prod.id}/${lot.id}`)
    expect(resp.statusCode).toEqual(401)
  })
})
