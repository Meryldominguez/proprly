/** Routes for props. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Prop = require("../models/prop");

const propNewSchema = require("../schemas/propNew.json");
const propUpdateSchema = require("../schemas/propUpdate.json");

const router = new express.Router();


/**For later
 * https://stackoverflow.com/questions/40423376/json-schema-validator-custom-message
 */

/** POST / { prop } =>  { prop }
 *
 * prop should be {  }
 *
 * Returns { id,  }
 *
 * Authorization required: logged in
 */
router.post("/",ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, propNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const prop = await Prop.create(req.body);

    return res.status(201).json({ prop });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[id] { fld1, fld2, ... } => { prop }
 *
 * Patches prop data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { id, name, description, numEmployees, logo_url }
 *
 * Authorization required: logged in
 */

router.patch("/:prodId/:lotId",ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, propUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const prop = await Prop.update(Number(req.params.prodId),Number(req.params.lotId), req.body);
    return res.json({ prop });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: Logged in
 */

router.delete("/:prodId/:lotId", ensureLoggedIn, async function (req, res, next) {
  try {
    const resp = await Prop.remove(Number(req.params.prodId),Number(req.params.lotId));
    return res.json({ deleted:resp });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
