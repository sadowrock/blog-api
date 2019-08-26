const router = require("express").Router();


router.get('/', (req, res, nex) => {
  res.send('title')
})
module.exports = router;