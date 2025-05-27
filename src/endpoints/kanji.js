import express from 'express';
import { DB } from '../database.js';

export const KanjiRouter = express.Router();

KanjiRouter.get('/kanjis', async (req, res) => {
  const kanjis = await DB.collection('kanjis').find().toArray();
  console.log(kanjis);
  res.json({data: kanjis, count: kanjis.length});
});

KanjiRouter.get('/kanjis/level/:level', async (req, res) => {
  const level = req.params.level;
  const kanjis = await DB.collection('kanjis').find({level}).toArray();
  res.json({data: kanjis, count: kanjis.length});
});
