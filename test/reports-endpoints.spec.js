const knex = require('knex')
const app = require('../src/app')
const { makeReportsArray } = require('./reports.fixtures')

describe('Reports Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })

        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE quickreport_reports RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE quickreport_reports RESTART IDENTITY CASCADE'))

    describe('GET /api/reports', () => {
        context('Given no reports', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/reports')
                    .expect(200, [])
            })
        })

        context('Given there are reports in the database', () => {
            const testReports = makeReportsArray()

            beforeEach('insert reports', () => {
                return db
                    .into('quickreport_reports')
                    .insert(testReports)
            })

            it('responds with 200 and all of the reports', () => {
                return supertest(app)
                    .get('/api/reports')
                    .expect(200, testReports)
            })
        })
    })

    describe('GET /api/reports/:report_id', () => {
        context('Given no reports', () => {
            it('responds with 404', () => {
                const reportId = 123
                return supertest(app)
                    .get(`/api/reports/${reportId}`)
                    .expect(404, {error: { message: `Report doesn't exist`}})
            })
        })

        context('Given there are reports in the database', () => {
            const testReports = makeReportsArray()

            beforeEach('insert reports', () => {
                return db.into('quickreport_reports')
                    .insert(testReports)
            })

            it('responds with 200 and the specified report', () => {
                const reportId = 2
                const expectedReport = testReports[reportId - 1]
                return supertest(app)
                    .get(`/api/reports/${reportId}`)
                    .expect(200, expectedReport)
            })
        })
    })
})