const express = require('express');
const router = express.Router();
const db = require('../db/connection');



router.get('/:id', (req, res) => {
  return db.query(`
  SELECT pets.*
  FROM pets
  JOIN users
  ON users.id = pets.user_id
  WHERE users.id = $1
  `, [req.params.id])
    .then(({ rows: pets }) => {
      res.json(
        pets);
    });
});

router.get('/', (req, res) => {
  return db.query(`
  SELECT *
  FROM pets
  `)
    .then(({ rows: pets }) => {
      res.json(
        pets.reduce(
          (previous, current) => ({ ...previous, [current.id]: current }),
          {}
        )
      );
    });
});


router.post('/users', (req, res) => {
  console.log("hello", req.body);
  return db.query(`
  SELECT *
  FROM pets
  JOIN users
  ON users.id = pets.user_id
  WHERE users.email = $1
  `, [req.body.id])
    .then(({ rows: pets }) => {
      console.log('POST', pets);
      res.json(
        pets
      );
    });
});


router.get('/explore/:id/:userId', (req, res) => {
  console.log(req.params);
  return db.query(`
  select id, user_id, name, breed, age, sex, spayed_or_neutered, size, city, description, photo_url
  from pets where id
  not in (
    select other_pet as id from relationships where current_pet = $1 and other_pet is not null
    union
    (SELECT pets.id as id
    FROM pets
    WHERE user_id = $2 and pets.id is not null)
    )
  `, [Number(req.params.id), Number(req.params.userId)])
    .then(({ rows: pets }) => {
      res.json(
        pets
      );
    });
});

router.post("/", (req, res) => {
  // console.log(req.body);

  return db
    .query(
      `
  INSERT INTO pets (user_id, name, breed, age, sex, spayed_or_neutered, size, city, description, photo_url)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *
  `,
      [
        req.body.user_id,
        req.body.name,
        req.body.breed,
        req.body.age,
        req.body.sex,
        req.body.spayed_or_neutered,
        req.body.size,
        req.body.city,
        req.body.description,
        req.body.photo_url,
      ]
    )
    .then(({ rows: pet }) => {
      res.json(
        pet.reduce(
          (previous, current) => ({ ...previous, [current.id]: current }),
          {}
        )
      );
    });
});

router.delete("/:id", (req, res) => {
  console.log(req.params);
  return db
    .query(
      `
  DELETE FROM pets WHERE pets.id = $1;`,
      [req.params.id]
    )
    .then(({ rows: pet }) => {
      res.json(
        pet.reduce(
          (previous, current) => ({ ...previous, [current.id]: current }),
          {}
        )
      );
    });
});

module.exports = router;
