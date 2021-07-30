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

beforeAll(async ()=> await commonBeforeAll("/tags Routes"))
beforeEach(commonBeforeEach)
afterEach(commonAfterEach)
afterAll(commonAfterAll)

/** ************************************ POST /tags */

describe('POST /tags', function () {
  test('works for admin', async function () {
    const resp = await request(app)
      .post('/tags')
      .send({
          title: "Created"
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(201)
    expect(resp.body).toEqual({
      tag: {
        id: expect.any(Number),
        title: "Created"
      }
    })
  })

  test('works for user', async function () {
    const resp = await request(app)
      .post('/tags')
      .send({
          title:"a tag"
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(201)
    expect(resp.body).toEqual({
      tag: {
        id: expect.any(Number),
        title:"a tag"
      }
    })
  })

  test('unauth for anon', async function () {
    const resp = await request(app)
      .post('/tags')
      .send({
        title:"a tag"
    })
    expect(resp.statusCode).toEqual(401)
  })

  test('bad request if missing data', async function () {
    const resp = await request(app)
      .post('/tags')
      .send({
          notes:"a tag"
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(400)
  })
})
/** ************************************ POST /tags/lots/:lotId */

describe('POST /tags/lots/:lotId', function () {
  test('works for admin, new tag', async function () {
    const { rows: [lot] } = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot6'`)

    const resp = await request(app)
      .post(`/tags/lots/${lot.id}`)
      .send({
          title: "Created"
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(201)
    expect(resp.body).toEqual({
      tag: {
        tagId: expect.any(Number),
        tagTitle: "Created",
        lotId: lot.id,
        lotName: lot.name
      }
    })
  })

  test('works for admin, existing tag', async function () {
    const { rows: [lot] } = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot5'`)
    const {body:{tag}} = await request(app)
      .post('/tags')
      .send({
          title: "Created"
      })
      .set('authorization', `Bearer ${adminToken}`)

    const resp = await request(app)
      .post(`/tags/lots/${lot.id}`)
      .send({
          title: "Created"
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(201)
    expect(resp.body).toEqual({
      tag: {
        tagId: tag.id,
        tagTitle: "Created",
        lotId: lot.id,
        lotName: lot.name
      }
    })
  })

  test('works for user', async function () {
    const { rows: [lot] } = await db.query(
      `SELECT * FROM lot
        WHERE name = 'Lot4'`)

    const resp = await request(app)
      .post(`/tags/lots/${lot.id}`)
      .send({
          title:"Test"
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(201)
    expect(resp.body).toEqual({
      tag: {
        tagId: expect.any(Number),
        tagTitle: "Test",
        lotId: lot.id,
        lotName: lot.name
      }
    })
  })

  test('unauth for anon', async function () {
    const resp = await request(app)
      .post('/tags/lots/1')
      .send({
        title:"a tag"
    })
    expect(resp.statusCode).toEqual(401)
  })

  test('bad request if missing data', async function () {
    const resp = await request(app)
      .post('/tags/lots/1')
      .send({
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(400)
  })
})

/** ************************************ GET /tags/ */

describe('GET /tags', ()=>{
  test('Works for admins', async function(){
    const resp = await request(app)
      .get(`/tags`)
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toBe(200)
    expect(resp.body.tags.length).toBe(6)
  })
  test('Works for users', async function(){
    const resp = await request(app)
      .get(`/tags`)
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toBe(200)
    expect(resp.body.tags.length).toBe(6)
  })
  test('Works for admins with search', async function(){
    const resp = await request(app)
      .get(`/tags?search=set`)
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toBe(200)
    expect(resp.body.tags.length).toBe(2)
  })
  test('Works for users with search', async function(){
    const resp = await request(app)
      .get(`/tags?search=set`)
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toBe(200)
    expect(resp.body.tags.length).toBe(2)
  })
  test('unauth for anon', async function(){
    const resp = await request(app)
      .get(`/tags`)
    expect(resp.statusCode).toEqual(401)
  })
})
/** ************************************ GET /tags/:id */

describe('GET /tags', ()=>{
  test('Works for admins', async function(){
    const { rows: [tag] } = await db.query(
      `SELECT * FROM tag
        WHERE title = 'Florals'`)
    const resp = await request(app)
      .get(`/tags/${tag.id}`)
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toBe(200)
    expect(resp.body.tag).toEqual({
      id: expect.any(Number),
      title: "Florals",
      lots: expect.any(Array)
    })
  });
  test('Works for users', async function(){
    const { rows: [tag] } = await db.query(
      `SELECT * FROM tag
        WHERE title = 'Florals'`)
    const resp = await request(app)
      .get(`/tags/${tag.id}`)
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toBe(200)
    expect(resp.body.tag).toEqual({
        id: expect.any(Number),
        title: "Florals",
        lots: expect.any(Array)
      })
    });
  test('unauth for anon', async function(){
    const resp = await request(app)
      .get(`/tags/1`)
    expect(resp.statusCode).toEqual(401)
  });
});

/** ************************************ PATCH /tags/:id */

describe('PATCH /tags/:id', () => {
  test('works for admins', async function () {
    const { rows: [tag] } = await db.query(
      `SELECT * FROM tag
        WHERE title = 'Hand Prop'`)
    const resp = await request(app)
      .patch(`/tags/${tag.id}`)
      .send({
        title:"New title"
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      tag: {
        id: tag.id,
        title:"New title"
      }
    })
  })

  test('works for user', async function () {
    const { rows: [tag] } = await db.query(
      `SELECT * FROM tag
        WHERE title = 'Florals'`)
    const resp = await request(app)
      .patch(`/tags/${tag.id}`)
      .send({
        title:"New title"
      })
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.body).toEqual({
      tag: {
        id: tag.id,
        title:"New title"
      }
    })
  })

  test('unauth for anon', async function () {
    const { rows: [tag] } = await db.query(
      `SELECT * FROM tag
        WHERE title = 'Blue'`)
    const resp = await request(app)
      .patch(`/tags/${tag.id}`)
      .send({
        title: 'New'
      })
    expect(resp.statusCode).toEqual(401)
  })

  test('not found if no such tag', async function () {
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
    const { rows: [tag] } = await db.query(
      `SELECT * FROM tag
        WHERE title = 'Blue'`)
    const resp = await request(app)
      .patch(`/tags/${tag.id}`)
      .send({
        qty: 42
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(400)
  })
})

/** ************************************ DELETE /tags/:id */

describe('DELETE /tags/:id', function () {
  test('works for admin', async function () {
    const { rows: [tag] } = await db.query(`SELECT * FROM tag`)
    const resp = await request(app)
      .delete(`/tags/${tag.id}`)
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      deleted:tag.id
    })
    expect(resp.statusCode).toEqual(200)
  });
  
  test('unauth for users', async function () {
    const { rows: [tag] } = await db.query(`SELECT * FROM tag`)
      const resp = await request(app)
      .delete(`/tags/${tag.id}`)
      .set('authorization', `Bearer ${u2Token}`)
    expect(resp.statusCode).toEqual(401)
  });

  test('unauth for anon', async function () {
    const { rows: [tag] } = await db.query(`SELECT * FROM tag`)
      const resp = await request(app)
      .delete(`/tags/${tag.id}`)
    expect(resp.statusCode).toEqual(401)
  });
});

/** ************************************ DELETE /tags/lots/:tagId/:lotId */

describe('DELETE /tags/lots/:tagId/:lotId', function () {
  test('works for admin', async function () {
    const { rows: [{tag_id:tagId, lot_id:lotId}] } = await db.query(
      `SELECT * FROM lot_tag`)
    const resp = await request(app)
      .delete(`/tags/lots/${tagId}/${lotId}`)
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      deleted:{
        lotId,
        tagId
      }
    })
    expect(resp.statusCode).toEqual(200)
  })

  test('unauth for users', async function () {
    const { rows: [{tag_id:tagId, lot_id:lotId}] } = await db.query(
      `SELECT * FROM lot_tag`) 
      const resp = await request(app)
      .delete(`/tags/lots/${tagId}/${lotId}`)
      .set('authorization', `Bearer ${u2Token}`)
    expect(resp.statusCode).toEqual(401)
  })

  test('unauth for anon', async function () {
    const { rows: [{tag_id:tagId, lot_id:lotId}] } = await db.query(
      `SELECT * FROM lot_tag`) 
      const resp = await request(app)
      .delete(`/tags/lots/${tagId}/${lotId}`)
      
    expect(resp.statusCode).toEqual(401)
  })
})
