const express = require('express');
const router  = express.Router();
const db = require('../db/connection');


router.get('/', (req, res) => {
  if (req.query.email) {
    return db.query(`
    SELECT *
    FROM users
    WHERE email = $1
    `, [req.query.email])
      .then(({ rows: user }) => {
        res.json(
          user.reduce(
            (previous, current) => ({ ...previous, [current.id]: current }),
            {}
          )
        );
      });

  } else {
    return db.query(`
    SELECT *
    FROM users
    ORDER BY id DESC
    `)
      .then(({ rows: users }) => {
        res.json(
          users.reduce(
            (previous, current) => ({ ...previous, [current.id]: current }),
            {}
          )
        );
      });
  }

});

router.get('/:id', (req, res) => {
  return db.query(`
  SELECT *
  FROM users
  WHERE id = $1
  `, [req.params.id])
    .then(({ rows: user }) => {
      res.json(
        user.reduce(
          (previous, current) => ({ ...previous, [current.id]: current }),
          {}
        )
      );
    });
});

// router.get('/pets/:id', (req, res) => {
//   console.log("hello")
//   return db.query(`
//   SELECT *
//   FROM pets
//   WHERE user_id IN (SELECT users.id FROM users WHERE email = $1)
//   `, [req.params.id])
//     .then(({ rows: pets }) => {
//       console.log('RESPONSE', pets)
//       res.json(
//         pets
//       );
//     });
// });

router.post('/', (req, res) => {
  console.log(req.body);
  return db.query(`
  INSERT INTO users (email)
  VALUES ($1)
  RETURNING *
  `, [req.body.email])
    .then(({ rows: user }) => {
      res.json(
        user.reduce(
          (previous, current) => ({ ...previous, [current.id]: current }),
          {}
        )
      );
    });

});


module.exports = router;
