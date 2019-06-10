'use strict';

const assert = require('assert');
const express = require('express');
const superagent = require('superagent');
const validateReq = require('../');

describe('validate-express-req', function() {
  let server;

  before(async function() {
    const app = express();

    app.use(validateReq({
      query: {
        answer: {
          $type: 'number',
          $required: true
        }
      }
    }));

    app.get('*', function(req, res) {
      return res.json({ answer: req.query.answer });
    });

    app.use(function(error, req, res, next) {
      res.json({ message: error.message });
    });

    server = await app.listen(3000);
  });

  after(function() {
    server.close();
  });

  it('works', async function() {
    const { answer } = await superagent.get('http://localhost:3000/?answer=42').
      then(res => res.body);
    assert.strictEqual(answer, 42);
  });

  it('error', async function() {
    const err = await superagent.get('http://localhost:3000/?answer=bad').
      then(() => null, err => err);
    assert.strictEqual(err.status, 400);
    assert.ok(err.response.body.message.indexOf('answer') !== -1,
      err.response.body.message);
  });
});