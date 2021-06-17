const express = require('express');
const xss = require('xss');
const path = require('path');
const ReportsService = require('./reports-service');

const reportsRouter = express.Router();
const jsonParser = express.json(); //used to parse body content

const serializeReport = report => ({
    pt_id: report.pt_id,
    room_number: xss(report.room_number),
      pt_initials: xss(report.pt_initials),
      diagnosis: xss(report.diagnosis),
      allergies: xss(report.allergies),
      age: xss(report.age),
      gender: report.gender,
      code_status: report.code_status,
      a_o: report.a_o,
      pupils: report.pupils,
      other_neuro: xss(report.other_neuro),
      heart_rhythm: xss(report.heart_rhythm),
      bp: xss(report.bp),
      edema: xss(report.edema),
      other_cardiac: xss(report.other_cardiac),
      lung_sounds: xss(report.lung_sounds),
      oxygen: xss(report.oxygen),
      other_resp: xss(report.other_resp),
      last_bm: xss(report.last_bm),
      gu: xss(report.gu),
      other_gi_gu: xss(report.other_gi_gu),
      skin: xss(report.skin),
      iv_access: xss(report.iv_access),
      additional_report: xss(report.additional_report),
      user_id: report.user_id
})

reportsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    ReportsService.getAllReports(knexInstance)
      .then((reports) => {
        res.json(reports.map(serializeReport));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {
      room_number,
      pt_initials,
      diagnosis,
      allergies,
      age,
      gender,
      code_status,
      a_o,
      pupils,
      other_neuro,
      heart_rhythm,
      bp,
      edema,
      other_cardiac,
      lung_sounds,
      oxygen,
      other_resp,
      last_bm,
      gu,
      other_gi_gu,
      skin,
      iv_access,
      additional_report,
      user_id,
    } = req.body;
    const newReport = {
      room_number,
      pt_initials,
      diagnosis,
      allergies,
      age,
      gender,
      code_status,
      a_o,
      pupils,
      other_neuro,
      heart_rhythm,
      bp,
      edema,
      other_cardiac,
      lung_sounds,
      oxygen,
      other_resp,
      last_bm,
      gu,
      other_gi_gu,
      skin,
      iv_access,
      additional_report,
      user_id,
    };

    if (room_number == null || pt_initials == null || user_id == null)
      return res.status(400).json({
        error: { message: `Missing required info in request body` },
      });

    ReportsService.insertReport(knexInstance, newReport)
      .then((report) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${report.pt_id}`))
          .json(serializeReport(report));
      })
      .catch(next);
  });

reportsRouter
  .route('/:pt_id')
  .all((req, res, next) => {
    knexInstance = req.app.get('db');
    const { pt_id } = req.params;

    ReportsService.getById(knexInstance, pt_id)
      .then((pt) => {
        if (!pt) {
          return res.status(404).json({
            error: { message: `Report doesn't exist` },
          });
        }
        res.pt = pt;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeReport(res.pt));
  })
  .delete((req, res, next) => {
    const { pt_id } = req.params;

    ReportsService.deleteReport(knexInstance, pt_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { pt_id } = req.params;
    const {
      room_number,
      pt_initials,
      diagnosis,
      allergies,
      age,
      gender,
      code_status,
      a_o,
      pupils,
      other_neuro,
      heart_rhythm,
      bp,
      edema,
      other_cardiac,
      lung_sounds,
      oxygen,
      other_resp,
      last_bm,
      gu,
      other_gi_gu,
      skin,
      iv_access,
      additional_report,
      user_id,
    } = req.body;
    const reportToUpdate = {
      room_number,
      pt_initials,
      diagnosis,
      allergies,
      age,
      gender,
      code_status,
      a_o,
      pupils,
      other_neuro,
      heart_rhythm,
      bp,
      edema,
      other_cardiac,
      lung_sounds,
      oxygen,
      other_resp,
      last_bm,
      gu,
      other_gi_gu,
      skin,
      iv_access,
      additional_report,
      user_id,
    };

    //counting how many values aren't null or undefined(are truthy) in report update
    const numberOfValues = Object.values(reportToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain at least one field input`,
        },
      });
    }

    ReportsService.updateReport(knexInstance, pt_id, reportToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = reportsRouter;
