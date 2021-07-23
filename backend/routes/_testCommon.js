'use strict'


const db = require('../db.js')
const User = require('../models/user')
const Lot = require('../models/lot')
const Location = require('../models/Location')
const { createToken } = require('../helpers/tokens')

async function commonBeforeAll () {
  console.log('beforeall')
  // noinspection SqlWithoutWhere
  await db.query('DELETE FROM lot')
  await db.query('DELETE FROM users')
  await db.query('DELETE FROM location')
  await db.query('DELETE FROM tag')
  await db.query('DELETE FROM production')
  await db.query('DELETE FROM prop')

  const warehouse = await Location.create(
    {
      name: 'Warehouse',
      notes: 'warehouse address, number of coordinator',
      parendId: null
    }
  )
  const studio = await Location.create(
    {
      name: "Rehearsal studio",
      notes: "studio address, number of coordinator",
      parendId: null
    }
  )

  const bay1 = await Location.create(
    {
      name: "Bay 1",
      notes: null,
      parendId: warehouse.id
    }
  )
  const bay2 =await Location.create(
    {
      name: "Bay 2",
      notes: null,
      parendId: warehouse.id
    }
  )
  
  await Lot.create(
      {
        name: "Lot1",
        description: "New Lot1",
        quantity: 3,
        locId: bay1.id,
        price : "$20.99"
      });

  await Lot.create(
      {
        name: "Lot2",
        description: "New Lot2",
        quantity: 50,
        locId: bay1.id,
        price : null
      });
  await Lot.create(
      {
        name: "Lot3",
        description: "New Lot3",
        quantity: 1,
        locId: bay1.id,
        price : "$50"
      });
  await Lot.create(
      {
        name: "Lot4",
        description: "New Lot4",
        quantity: 10,
        locId: bay2.id,
        price : "$10.99"
      });
  await Lot.create(
      {
        name: "Lot5",
        description: "New Lot5",
        quantity: 50,
        locId: bay2.id,
        price : null
      });
  await Lot.create(
      {
        name: "Lot6",
        description: "New Lot6",
        quantity: 300,
        locId: bay2.id,
        price : "$2"
      });
  await Lot.create(
      {
        name: "Lot7",
        description: "New Lot7",
        quantity: null,
        locId: bay2.id,
        price : "$30"
      });
  await Lot.create(
      {
        name: "Lot8",
        description: "New Lot8",
        quantity: null,
        locId: studio.id,
        price : null
      });

  await User.register({
    username: 'u1',
    firstName: 'U1F',
    lastName: 'U1L',
    email: 'user1@user.com',
    password: 'password1',
    isAdmin: false
  })
  await User.register({
    username: 'u2',
    firstName: 'U2F',
    lastName: 'U2L',
    email: 'user2@user.com',
    password: 'password2',
    isAdmin: false
  })
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });
  await User.register({
    username: "a1",
    firstName: "A1F",
    lastName: "A1L",
    email: "admin@user.com",
    password: "adminpassword1",
    isAdmin: true
  });
};

async function commonBeforeEach() {
  await db.query("BEGIN");
};

async function commonAfterEach() {
  await db.query("ROLLBACK");
};

async function commonAfterAll() {
  await db.end();
};

const u1Token = createToken({ username: 'u1', isAdmin: false })
const u2Token = createToken({ username: 'u2', isAdmin: false })
const adminToken = createToken({ username: 'admin', isAdmin: true })

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken
};
