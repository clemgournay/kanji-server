import express from 'express';
import { DB } from '../database.js';

export const KanaRouter = express.Router();

KanaRouter.get('/kanas', async (req, res) => {
  const query = {};

  let kanas = [];

  let page = req.query.page ? parseInt(req.query.page) : 1;
  let limit = req.query.limit ? parseInt(req.query.limit) : 0;
  let rand = req.query.random ? eval(req.query.random) : false;

  if (req.query.type) query.type = req.query.type;

  console.log(page * limit, limit, rand, query);

  if (limit > 0 && rand) {
    kanas =  await DB.collection('kanas').aggregate([{$sample: {size: limit}}]).toArray();
  } else {
    let request = DB.collection('kanas').find(query);
    if (page >= 1) request.skip(page * limit);
    if (limit > 0) request.limit(limit);
    kanas = await request.toArray();
  }
  console.log(kanas);
  res.json({data: kanas, count: kanas.length});
});

KanaRouter.get('/kanas/category/:category', async (req, res) => {
  const query = {};
  query.category = req.params.category;

  if (req.query.type) query.type = req.query.type;

  let kanas = [];

  let page = req.query.page ? parseInt(req.query.page) : 1;
  let limit = req.query.limit ? parseInt(req.query.limit) : 0;
  let rand = req.query.random ? eval(req.query.random) : false;
  console.log(limit)

  if (limit > 0 && rand) {
    kanas =  await DB.collection('kanas').aggregate([{$match: query}, {$sample: {size: limit}}]).toArray();
  } else {
    let request = DB.collection('kanas').find(query);
    if (page >= 1) request.skip(page * limit);
    if (limit > 0) request.limit(limit);
    kanas = await request.toArray();
  }
  res.json({data: kanas, count: kanas.length});
});
