const express = require('express');
const router = express.Router();

//When API gets /info path send username
router.get('', (request, response) => {
  response.json({ username: request.headers.username });
});

module.exports = router;
