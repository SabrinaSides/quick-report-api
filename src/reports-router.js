const express = require('express')
//const ReportsService = require('./reports-service')
const xss = require('xss')
const path = require('path')

const reportsRouter = express.Router()
const jsonParser = express.json() //used to parse body content

//const serializeReport goes here

reportsRouter 
    .route('/')
    .get((req, res, next) => {
        res.send('You are starting your endpoints!')
    })

reportsRouter
    .route('/:report_id')
    //.all()
    .get((req, res, next) => {
        res.send('this will be a specific report')
    })

module.exports = reportsRouter