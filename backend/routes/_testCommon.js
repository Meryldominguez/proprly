'use strict'


const db = require('../db.js')

const Location = require('../models/Location')
const Lot = require('../models/lot')
const Production = require('../models/production.js')
const Prop = require('../models/prop.js')
const Tag = require("../models/tag")
const User = require('../models/user')

const { createToken } = require('../helpers/tokens')


async function commonBeforeAll (testName) {
  // noinspection SqlWithoutWhere
  await db.query('DELETE FROM location')
  await db.query('DELETE FROM lot')
  await db.query('DELETE FROM production')
  await db.query('DELETE FROM prop')
  await db.query('DELETE FROM tag')
  await db.query('DELETE FROM users')
  
  await addUsers();
  await addLocations();
  await addLots();
  await addProductions();
  await addProps();
  await addTags();

  console.log(`Ready for ${testName} tests`)

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

async function addLocations(){
  try {
    const warehouse = await Location.create(
      {
        name: 'Warehouse',
        notes: 'warehouse address, number of coordinator',
        parentId: null
      }
    )
    await Location.create(
      {
        name: "Rehearsal studio",
        notes: "studio address, number of coordinator",
        parentId: null
      }
    )
  
    await Location.create(
      {
        name: "Bay 1",
        notes: null,
        parentId: warehouse.id
      }
    )
    await Location.create(
      {
        name: "Bay 2",
        notes: null,
        parentId: warehouse.id
      }
    )
  } catch (error) {
    console.error(error)
  }
};

async function addLots(){
  try {
    const [warehouse,studio,bay1,bay2] = await Location.getChildren(false)

    await Lot.create(
      {
        name: "Lot1",
        description: "New Lot1",
        quantity: 3,
        locId: bay1.locationId,
        price : "$20.99"
      });
    await Lot.create(
      {
        name: "Lot2",
        description: "New Lot2",
        quantity: 50,
        locId: bay1.locationId,
        price : null
      });
    await Lot.create(
      {
        name: "Lot3",
        description: "New Lot3",
        quantity: 1,
        locId: bay1.locationId,
        price : "$50"
      });
    await Lot.create(
      {
        name: "Lot4",
        description: "New Lot4",
        quantity: 10,
        locId: bay2.locationId,
        price : "$10.99"
      });
    await Lot.create(
      {
        name: "Lot5",
        description: "New Lot5",
        quantity: 50,
        locId: bay2.locationId,
        price : null
      });
    await Lot.create(
      {
        name: "Lot6",
        description: "New Lot6",
        quantity: 300,
        locId: bay2.locationId,
        price : "$2"
      });
    await Lot.create(
      {
        name: "Lot7",
        description: "New Lot7",
        quantity: null,
        locId: bay2.locationId,
        price : "$30"
      });
    await Lot.create(
      {
        name: "Lot8",
        description: "New Lot8",
        quantity: null,
        locId: studio.locationId,
        price : null
      });
  } catch (error) {
    console.error(error)
  }
};

async function addProductions(){
  try {
    await Production.create({
      title:"Carmen",
      dateStart: new Date("May, 2020"),
      dateEnd: new Date("July, 2020"),
      active:true,
      notes:"a test production"
    });
    await Production.create({
      title:"La traviata",
      dateStart: new Date("September, 2006"),
      dateEnd: new Date("November, 2006"),
      active:false,
      notes:"a second test production"
    });
    await Production.create({
      title:"The magic flute",
      dateStart: new Date("January, 2001"),
      dateEnd: new Date("December, 2003"),
      active:true,
      notes:"a third test production"
    });
  } catch (error) {
    console.error(error)
  }
};

async function addProps(){
  try {
    const [lot1,lot2,lot3,lot4,lot5,lot6,lot7,lot8] = await Lot.findAll()
    const [prod1,prod2,prod3] = await Production.findAll()

    await Prop.create({
      prodId:prod1.id,
      lotId:lot1.id,
      quantity:2,
      notes:"prop 1 notes"
    })
    await Prop.create({
      prodId:prod1.id,
      lotId:lot5.id,
      quantity:20,
      notes:"prop 2 notes"
    })
    await Prop.create({
      prodId:prod1.id,
      lotId:lot3.id,
      quantity:2,
      notes:"prop 3 notes"
    })
    await Prop.create({
      prodId:prod2.id,
      lotId:lot8.id,
      quantity:null,
      notes:"prop 4 notes"
    })
    await Prop.create({
      prodId:prod2.id,
      lotId:lot6.id,
      quantity:100,
      notes:"prop 5 notes"
    })
    await Prop.create({
      prodId:prod2.id,
      lotId:lot1.id,
      quantity:2,
      notes:"prop 6 notes"
    })
    await Prop.create({
      prodId:prod3.id,
      lotId:lot3.id,
      quantity:2,
      notes:"prop 7 notes"
    })
    await Prop.create({
      prodId:prod3.id,
      lotId:lot7.id,
      quantity:300,
      notes:"prop 8 notes"
    })
    await Prop.create({
      prodId:prod3.id,
      lotId:lot5.id,
      quantity:10,
      notes:"prop 9 notes"
    })
  } catch (error) {
    console.error(error)
  }
};

async function addTags(){
  try {
    const [lot1,lot2,lot3,lot4] = await Lot.findAll()

    await Tag.tag(Number(lot1.id),{title:"Set Dressing"})
    await Tag.tag(Number(lot2.id),{title:"Hand Prop"})
    await Tag.tag(Number(lot3.id),{title:"Florals"})
    await Tag.tag(Number(lot4.id),{title:"Blue"})
    await Tag.tag(Number(lot1.id),{title:"Set Piece"})
    await Tag.tag(Number(lot2.id),{title:"Furniture"})

    
  } catch (error) {
    
  }
}

async function addUsers(){
  try {
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
  } catch (error) {
    console.error(error)
  }
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
