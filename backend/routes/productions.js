/** Routes for productions. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Production = require("../models/production");

const prodNewSchema = require("../schemas/prodNew.json");
const prodUpdateSchema = require("../schemas/prodUpdate.json");
const prodSearchSchema = require("../schemas/prodSearch.json");

const router = new express.Router();


/**For later
 * https://stackoverflow.com/questions/40423376/json-schema-validator-custom-message
 */

/** POST / { prod } =>  { prod }
 *
 * prod should be {  }
 *
 * Returns { id,  }
 *
 * Authorization required: logged in
 */
router.post("/",ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, prodNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    req.body.dateStart = new Date(req.body.dateStart)
    req.body.dateEnd = new Date(req.body.dateEnd)
    const production = await Production.create(req.body);

    return res.status(201).json({ production });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { prod: [ { }, ...] }
 *
 * Can filter on provided search filters:
 * - 
 *
 * Authorization required: logged in
 */

router.get("/",ensureLoggedIn, async function (req, res, next) {
  try {
    const searchParams = req.query
    if (searchParams['year']) searchParams.year=searchParams.year.split(",")
    if (searchParams['isActive']) searchParams.isActive=Boolean(searchParams.isActive)

    if(Object.keys(searchParams).length>0){
      const validator = jsonschema.validate(searchParams, prodSearchSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
      console.log(searchParams)
      const productions = await Production.findAll(searchParams);
      return res.json({ productions });
    }
    const productions = await Production.findAll();
    return res.json({ productions });
    
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { prod }
 *
 *  prod is {  }
 *   where props is [{}, ...]
 *
 * Authorization required: logged in
 */

router.get("/:id",ensureLoggedIn, async function (req, res, next) {
  try {
    const production = await Production.get(Number(req.params.id));
    return res.json({ production });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { fld1, fld2, ... } => { prod }
 *
 * Patches prod data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { id, name, description, numEmployees, logo_url }
 *
 * Authorization required: logged in
 */

router.patch("/:id",ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, prodUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const production = await Production.update(Number(req.params.id), req.body);
    return res.json({ production });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const {id} = await Production.remove(Number(req.params.id));
    return res.json({ deleted:id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
