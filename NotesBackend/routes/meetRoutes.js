const meetCntrl = require("../controllers/meetcntrl");

const router = require("express").Router();

router.post("/:meet-id", meetCntrl);

module.exports = router;
