const express = require('express')
const xss = require('xss')
const path = require('path')
const ReportsService = require('./reports-service')

const reportsRouter = express.Router()
const jsonParser = express.json() //used to parse body content

//const serializeReport goes here

reportsRouter 
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        ReportsService.getAllReports(knexInstance)
            .then(reports => {
                res.json(reports)
            })
            .catch(next)
    })

reportsRouter
    .route('/:report_id')
    .all((req, res, next) => {
        knexInstance = req.app.get('db')
        const {report_id} = req.params

        ReportsService.getById(knexInstance, report_id)
            .then(report => {
                if(!report){
                    return res.status(404).json({
                        error: {message: `Report doesn't exist`}
                    })                }
                res.report = report
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.report)
    })

module.exports = reportsRouter