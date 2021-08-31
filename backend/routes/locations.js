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
 * location should be { name, notes, parent_id }
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

/** GET /  => [{location, children: [{location}]}, {location}]
 *
 * Authorization required: logged in
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const id = req.query.id? req.query.id : null

    if (!Number(id) && id != null) throw new BadRequestError("id must be a number")
    const locations = id ? 
      await Location.getChildren(true,Number(id))
      :
      await Location.getChildren();
    return res.json({ locations });
  } catch (err) {
    return next(err);
  }
});

/** GET /list => [{location}, {location}]
 * 
 * authorization: Logged in
 */
router.get("/list", ensureLoggedIn, async function (req, res, next){
  try {
    const locationsList = await Location.getChildren(false)
    return res.json({locations:locationsList})
  } catch (err){
    return next(err);
  }
})

/** GET /[id]  =>  { location }
 * 
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
