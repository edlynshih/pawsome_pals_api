const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post("/", (req, res) => {
  console.log('Req.body>>>>>>', req.body)
  return db.query(`
  INSERT INTO messages (from_petId, to_petId, message, timestamp)
  VALUES ($1, $2, $3, $4)
  RETURNING *
  `, [
    req.body.from_petId,
    req.body.to_petId,
    req.body.message,
    req.body.timestamp
  ])
    .then(({ rows: message }) => {
      res.json(
        message.reduce(
        (previous, current) => ({ ...previous, [current.id]: current }),
          {}
        )
      );
    });
});

router.get('/:id', (req, res) => {
  return db.query(`
  SELECT messages.*, fp.name as from_pet_name, tp.name as to_pet_name, fp.photo_url as from_pet_photo_url, tp.photo_url as to_pet_photo_url
  FROM messages
  JOIN pets fp ON fp.id = messages.from_petId
  JOIN pets tp ON tp.id = messages.to_petId
  WHERE from_petId = $1 OR to_petId = $1
  ORDER BY timestamp DESC
  `, [req.params.id])
    .then(({ rows: messages }) => {
      res.json(
        messages);
    });
});

router.get('/chat/:id/:otherId', (req, res) => {
  console.log('HERE IS REQ.PARAMS >>>>>>>>>>>', req.params)
  return db.query(`
  SELECT messages.*, fp.name as from_pet_name, tp.name as to_pet_name, fp.photo_url as from_pet_photo_url, tp.photo_url as to_pet_photo_url
  FROM messages
  JOIN pets fp ON fp.id = messages.from_petId
  JOIN pets tp ON tp.id = messages.to_petId
  WHERE (from_petId = $1 AND to_petId = $2) OR (from_petId = $2 AND to_petId = $1)
  ORDER BY messages.timestamp ASC;
  `, [Number(req.params.otherId), Number(req.params.id)])
    .then(({ rows: messages }) => {
      res.json(
        messages
      );
    });
});

module.exports = router;
