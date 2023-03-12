const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/:id', (req, res) => {
  return db.query(`
  SELECT messages.*, fp.name as from_pet_name, tp.name as to_pet_name, fp.photo_url as from_pet_photo_url, tp.photo_url as to_pet_photo_url
  FROM messages
  JOIN pets fp ON fp.id = messages.from_petId
  JOIN pets tp ON tp.id = messages.to_petId
  WHERE from_petId = $1 OR to_petId = $1
  ORDER BY timestamp ASC
  `, [req.params.id])
    .then(({ rows: messages }) => {
      res.json(
        messages);
    });
});

router.get('/', (req, res) => {
  return db.query(`
  SELECT *
  FROM messages
  `)
    .then(({ rows: messages }) => {
      res.json(
        messages.reduce(
          (previous, current) => ({ ...previous, [current.id]: current }),
          {}
        )
      );
    });
});

module.exports = router;
