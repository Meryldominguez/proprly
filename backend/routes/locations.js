/** Routes for locations. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Location = require("../models/location");

const locNewSchema = require("../schemas/locNew.json");
const locUpdateSchema = require("../schemas/locUpdate.json");

const router = new express.Router();


/**For later
 * https://stackoverflow.com/questions/40423376/json-schema-validator-custom-message
 */

/** POST / { location } =>  { location }
 *
 * location should be { n }
 *
 * Returns { id, name, description, numEmployees, logoUrl }
 *
 * Authorization required: logged in
 */
router.post("/",ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, locNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const location = await Location.create(req.body);
    return res.status(201).json({ location });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { location: [ { id, name, description, numEmployees, logoUrl }, ...] }
 *
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: logged in
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
  const searchTerm = req.query.q
  try {
    const locations = await Location.getChildren();
    return res.json({ locations });
  } catch (err) {
    // console.log(err)
    return next(err);
  }
});

/** GET /[id]  =>  { location }
 *
 *  location is { id, name, description, numEmployees, logoUrl, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: logged in
 */

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const location = await Location.get(Number(req.params.id));
    return res.json({ location });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { fld1, fld2, ... } => { location }
 *
 * Patches location data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { id, name, description, numEmployees, logo_url }
 *
 * Authorization required: logged in
 */

router.patch("/:id",ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, locUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const location = await Location.update(Number(req.params.id), req.body);
    return res.json({ location });
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
    const {id} = await Location.remove(Number(req.params.id));
    return res.json({ deleted:id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
