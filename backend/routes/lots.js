/** Routes for lots. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Lot = require("../models/lot");

const lotNewSchema = require("../schemas/lotNew.json");
const lotUpdateSchema = require("../schemas/lotUpdate.json");
const lotSearchSchema = require("../schemas/lotSearch.json");

const router = new express.Router();


/**For later
 * https://stackoverflow.com/questions/40423376/json-schema-validator-custom-message
 */

/** POST / { lot } =>  { lot }
 *
 * lot should be { name, description, locId, (quantity), (price) }
 *
 *
 * Authorization required: logged in
 */
router.post("/",ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, lotNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const lot = await Lot.create(req.body);
    return res.status(201).json({ lot });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { lot: [ { id, name, description }, ...] }
 *
 * Can filter on provided search filters:
 * - searchTerm
 * 
 * Authorization required: logged in
 */

router.get("/",ensureLoggedIn, async function (req, res, next) {
  const search = req.query
  try {
    if(search){
      const validator = jsonschema.validate(search, lotSearchSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
      const lots = await Lot.findAll(search);
      return res.json({ lots });
    }
    const lots = await Lot.findAll();
    return res.json({ lots });
    
    
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { lot }
 *
 * 
 * Authorization required: logged in
 */

router.get("/:id",ensureLoggedIn, async function (req, res, next) {
  try {
    const lot = await Lot.get(Number(req.params.id));
    return res.json({ lot });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { fld1, fld2, ... } => { lot }
 *
 * Patches lot data.
 *
 * Authorization required: logged in
 */

router.patch("/:id",ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, lotUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const lot = await Lot.update(Number(req.params.id), req.body);
    return res.json({ lot });
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
    const {id} = await Lot.remove(Number(req.params.id));
    return res.json({ deleted:id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
