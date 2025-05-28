import express from 'express';
import { DB } from '../database.js';

export const KanjiRouter = express.Router();

KanjiRouter.get('/kanjis', async (req, res) => {
  const query = {};

  let kanjis = [];

  let page = req.query.page ? parseInt(req.query.page) : 1;
  let limit = req.query.limit ? parseInt(req.query.limit) : 0;
  let rand = req.query.random ? eval(req.query.random) : false;

  if (limit > 0 && rand) {
    kanjis =  await DB.collection('kanjis').aggregate([{$sample: {size: limit}}]).toArray();
  } else {
    let request = DB.collection('kanjis').find(query);
    if (page >= 1) request.skip(page * limit);
    if (limit > 0) request.limit(limit);
    kanjis = await request.toArray();
  }
  console.log(kanjis);
  res.json({data: kanjis, count: kanjis.length});
});

KanjiRouter.get('/kanjis/level/:level', async (req, res) => {
  const query = {};
  query.level = req.params.level;

  let kanjis = [];

  let page = req.query.page ? parseInt(req.query.page) : 1;
  let limit = req.query.limit ? parseInt(req.query.limit) : 0;
  let rand = req.query.random ? eval(req.query.random) : false;
  console.log(limit)

  if (limit > 0 && rand) {
    kanjis =  await DB.collection('kanjis').aggregate([{$match: query}, {$sample: {size: limit}}]).toArray();
  } else {
    let request = DB.collection('kanjis').find(query);
    if (page >= 1) request.skip(page * limit);
    if (limit > 0) request.limit(limit);
    kanjis = await request.toArray();
  }
  res.json({data: kanjis, count: kanjis.length});
});
