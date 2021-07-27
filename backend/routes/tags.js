/** Routes for tags. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Tag = require("../models/tag");

const tagSchema = require("../schemas/tagNewAndUpdate.json");

const router = new express.Router();


/**For later
 * https://stackoverflow.com/questions/40423376/json-schema-validator-custom-message
 */

/** POST / { tag } =>  { tag }
 *
 * tag should be {  }
 *
 * Returns { id,  }
 *
 * Authorization required: logged in
 */
router.post("/",ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, tagSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const tag = await Tag.create(req.body);

    return res.status(201).json({ tag });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[id] { fld1, fld2, ... } => { tag }
 *
 * Patches tag data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { id, name, description, numEmployees, logo_url }
 *
 * Authorization required: logged in
 */

router.patch("/:id",ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, tagSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const tag = await Tag.update(Number(req.params.id), req.body);
    return res.json({ tag });
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
    const {id} = await Tag.remove(Number(req.params.id));
    return res.json({ deleted:id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
