'use strict'

const request = require('supertest')

const db = require('../db.js')
const app = require('../app')
const Tag = require('../models/tag')

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

/** ************************************ POST /tags */

describe('POST /tags', function () {
  test('works for admin', async function () {
    const { rows: [prod] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'The magic flute'`)
    const { rows: [lot] } = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot6'`)

    const resp = await request(app)
      .post('/tags')
      .send({
          lotId: lot.id, 
          prodId: prod.id,
          quantity: 100,
          notes:"a tag"
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(201)
    expect(resp.body).toEqual({
      tag: {
        lotId: lot.id, 
        prodId: prod.id,
        quantity: 100,
        notes:"a tag"
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
      .post('/tags')
      .send({
          lotId: lot.id, 
          prodId: prod.id,
          quantity: 100,
          notes:"a tag"
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(201)
    expect(resp.body).toEqual({
      tag: {
        lotId: lot.id, 
          prodId: prod.id,
          quantity: 100,
          notes:"a tag"
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
      .post('/tags')
      .send({
        lotId: lot.id, 
        prodId: prod.id,
        quantity: 100,
        notes:"a tag"
    })
    expect(resp.statusCode).toEqual(401)
  })

  test('bad request if missing data', async function () {
    const { rows: [lot] } = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot4'`)
    const resp = await request(app)
      .post('/tags')
      .send({
          lotId: lot.id,
          quantity: 100,
          notes:"a tag"
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(400)
  })
})

/** ************************************ PATCH /tags/:prodId/:lotId */

describe('PATCH /tags/:id', () => {
  test('works for admins', async function () {

    const { rows: [prod] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'La traviata'`)
    const { rows: [lot] } = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot8'`)

    const resp = await request(app)
      .patch(`/tags/${prod.id}/${lot.id}`)
      .send({
        notes:"New Notes"
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      tag: {
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
      .patch(`/tags/${prod.id}/${lot.id}`)
      .send({
        quantity: 25
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.body).toEqual({
      tag: {
        prodId:prod.id,
        lotId:lot.id,
        quantity:25,
        notes:"tag notes"
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
      .patch(`/tags/${prod.id}/${lot.id}`)
      .send({
        notes: 'New'
      })
    expect(resp.statusCode).toEqual(401)
  })

  test('not found if no such production', async function () {
    const resp = await request(app)
      .patch('/tags/1000000')
      .send({
        title: 'Nope'
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(404)

    const resp2 = await request(app)
      .patch('/tags/1000000')
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
      .patch(`/tags/${prod.id}/${lot.id}`)
      .send({
        title: 42
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(400)
  })
})

/** ************************************ DELETE /tags/:prodId/:lotId */

describe('DELETE /tags/:prodId/:lotId', function () {

  test('unauth for users', async function () {
    const { rows: [prod] } = await db.query(
      `SELECT * FROM production
        WHERE title = 'The magic flute'`)
      const { rows: [lot] } = await db.query(
        `SELECT * FROM lot
          WHERE name = 'Lot7'`)    

    const resp = await request(app)
      .delete(`/tags/${prod.id}/${lot.id}`)
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
      .delete(`/tags/${prod.id}/${lot.id}`)
    expect(resp.statusCode).toEqual(401)
  })
})
