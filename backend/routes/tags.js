/** Routes for tags. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Tag = require("../models/tag");

const tagSchema = require("../schemas/tagNewAndUpdate.json");
const tagSearchSchema = require("../schemas/tagSearch.json");

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

/** POST / { tag } =>  { tag }
 *
 * tag should be { title }
 * 
 * if tag doesnt exist, it is created, then item is tagged
 *
 * Returns { id,  }
 *
 * Authorization required: logged in
 */
router.post("/lots/:lotId/",ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, tagSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const tag = await Tag.tag(Number(req.params.lotId),req.body);

    return res.status(201).json({ tag });
  } catch (err) {
    return next(err);
  }
});
/** GET/[id]  =>  {  }
 *
 * Authorization: logged in
 * 
 */

 router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const tag = await Tag.get(Number(req.params.id));
    return res.json({ tag });
  } catch (err) {
    return next(err);
  }
});

/** GET/  =>  {  }
 *
 * Authorization: logged in
 * 
 */

router.get("/",ensureLoggedIn, async function (req, res, next) {
  try {
    if (Object.keys(req.query).length>0){
        const validator = jsonschema.validate(req.query, tagSearchSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
      const tags = await Tag.getAll(req.query.search);
      return res.json({ tags });
    }
    const tags = await Tag.getAll();
    return res.json({ tags });

  } catch (err) {
    return next(err);
  }
});


/** PATCH /[id] { fld1, fld2, ... } => { tag }
 *
 * Patches tag data.
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

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin
 */

router.delete("/:tagId/:lotId", ensureAdmin, async function (req, res, next) {
  try {
    const lotTag = await Tag.removeTag(Number(req.params.lotId),Number(req.params.tagId));
    return res.json({ deleted:lotTag });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
