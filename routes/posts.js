const router = require('express').Router();
const isAuth = require('../middlewares/verifytoken');

router.get('/', isAuth, (req, res) => {
  res.json({
    posts: {
      title: 'post',
      description: 'random data you should not access',
    },
  });
});

module.exports = router;
