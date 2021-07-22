/** Routes for lots. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Lot = require("../models/lot");

const lotNewSchema = require("../schemas/lotNew.json");
const lotUpdateSchema = require("../schemas/lotUpdate.json");
// const lotSearchSchema = require("../schemas/lotSearch.json");

const router = new express.Router();

/**For later
 * https://stackoverflow.com/questions/40423376/json-schema-validator-custom-message
 */

/** POST / { lot } =>  { lot }
 *
 * lot should be { name, description, numEmployees, logoUrl }
 *
 * Returns { id, name, description, numEmployees, logoUrl }
 *
 * Authorization required: logged in
 */
router.post("/", async function (req, res, next) {
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
 *   { lot: [ { id, name, description, numEmployees, logoUrl }, ...] }
 *
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: logged in
 */

router.get("/", async function (req, res, next) {
  const q = req.query
  try {
    // const validator = jsonschema.validate(q, lotSearchSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map(e => e.stack);
    //   throw new BadRequestError(errs);
    // }
    const lots = await Lot.findAll(q);
    return res.json({ lots });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { lot }
 *
 *  lot is { id, name, description, numEmployees, logoUrl, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: logged in
 */

router.get("/:id", async function (req, res, next) {
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
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { id, name, description, numEmployees, logo_url }
 *
 * Authorization required: logged in
 */

router.patch("/:id", async function (req, res, next) {
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
    
    return res.json({ deleted: id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
