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
  ORDER BY timestamp DESC
  `, [req.params.id])
    .then(({ rows: messages }) => {
      res.json(
        messages);
    });
});

router.get('/chat/:id/:otherId', (req, res) => {
  console.log('HELLLLLLLO')
  console.log('HERE IS REQ.PARAMS >>>>>>>>>>>', req.params)
  return db.query(`
  SELECT messages.*, fp.name as from_pet_name, tp.name as to_pet_name, fp.photo_url as from_pet_photo_url, tp.photo_url as to_pet_photo_url
  FROM messages
  JOIN pets fp ON fp.id = messages.from_petId
  JOIN pets tp ON tp.id = messages.to_petId
  WHERE messages.timestamp IN (
  SELECT MAX(timestamp)
  FROM messages
  WHERE (from_petId = $1 AND to_petId = $2) OR (from_petId = $2 AND to_petId = $1)
  GROUP BY CASE
    WHEN from_petId = $1 AND to_petId = $2 THEN CONCAT(from_petId, to_petId)
    WHEN from_petId = $2 AND to_petId = $1 THEN CONCAT(from_petId, to_petId)
  END
  )
  ORDER BY messages.timestamp ASC;
  `, [Number(req.params.otherId), Number(req.params.id)])
    .then(({ rows: messages }) => {
      res.json(
       messages
      );
    });
});

module.exports = router;
