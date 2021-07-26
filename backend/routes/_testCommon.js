'use strict'


const db = require('../db.js')
const User = require('../models/user')
const Lot = require('../models/lot')
const Location = require('../models/Location')
const { createToken } = require('../helpers/tokens')
const Production = require('../models/production.js')
const Prop = require('../models/prop.js')

async function commonBeforeAll () {
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
      parentId: null
    }
  )
  const studio = await Location.create(
    {
      name: "Rehearsal studio",
      notes: "studio address, number of coordinator",
      parentId: null
    }
  )

  const bay1 = await Location.create(
    {
      name: "Bay 1",
      notes: null,
      parentId: warehouse.id
    }
  )
  const bay2 =await Location.create(
    {
      name: "Bay 2",
      notes: null,
      parentId: warehouse.id
    }
  )
  
  const lot1 = await Lot.create(
      {
        name: "Lot1",
        description: "New Lot1",
        quantity: 3,
        locId: bay1.id,
        price : "$20.99"
      });

  const lot2 = await Lot.create(
      {
        name: "Lot2",
        description: "New Lot2",
        quantity: 50,
        locId: bay1.id,
        price : null
      });
  const lot3 = await Lot.create(
      {
        name: "Lot3",
        description: "New Lot3",
        quantity: 1,
        locId: bay1.id,
        price : "$50"
      });
  const lot4 = await Lot.create(
      {
        name: "Lot4",
        description: "New Lot4",
        quantity: 10,
        locId: bay2.id,
        price : "$10.99"
      });
  const lot5 = await Lot.create(
      {
        name: "Lot5",
        description: "New Lot5",
        quantity: 50,
        locId: bay2.id,
        price : null
      });
  const lot6 = await Lot.create(
      {
        name: "Lot6",
        description: "New Lot6",
        quantity: 300,
        locId: bay2.id,
        price : "$2"
      });
  const lot7 = await Lot.create(
      {
        name: "Lot7",
        description: "New Lot7",
        quantity: null,
        locId: bay2.id,
        price : "$30"
      });
  const lot8 = await Lot.create(
      {
        name: "Lot8",
        description: "New Lot8",
        quantity: null,
        locId: studio.id,
        price : null
      });

  const prod1 = await Production.create({
    title:"Carmen",
    dateStart: new Date("May, 2020"),
    dateEnd: new Date("July, 2020"),
    active:true,
    notes:"a test production"
  });
  const prod2 = await Production.create({
    title:"La traviata",
    dateStart: new Date("September, 2006"),
    dateEnd: new Date("November, 2006"),
    active:false,
    notes:"a second test production"
  });
  const prod3 = await Production.create({
    title:"The magic flute",
    dateStart: new Date("January, 2001"),
    dateEnd: new Date("December, 2003"),
    active:true,
    notes:"a third test production"
  });

  await Prop.create({
    prodId:prod1.id,
    lotId:lot1.id,
    quantity:2,
    notes:"prop notes"
  })
  await Prop.create({
    prodId:prod1.id,
    lotId:lot5.id,
    quantity:20,
    notes:"prop notes"
  })
  await Prop.create({
    prodId:prod1.id,
    lotId:lot3.id,
    quantity:2,
    notes:"prop notes"
  })
  await Prop.create({
    prodId:prod2.id,
    lotId:lot8.id,
    quantity:null,
    notes:"prop notes"
  })
  await Prop.create({
    prodId:prod2.id,
    lotId:lot6.id,
    quantity:100,
    notes:"prop notes"
  })
  await Prop.create({
    prodId:prod2.id,
    lotId:lot1.id,
    quantity:2,
    notes:"prop notes"
  })
  await Prop.create({
    prodId:prod3.id,
    lotId:lot3.id,
    quantity:2,
    notes:"prop notes"
  })
  await Prop.create({
    prodId:prod3.id,
    lotId:lot7.id,
    quantity:300,
    notes:"prop notes"
  })
  await Prop.create({
    prodId:prod3.id,
    lotId:lot5.id,
    quantity:10,
    notes:"prop notes"
  })


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
