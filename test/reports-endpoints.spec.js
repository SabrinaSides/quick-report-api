const knex = require('knex');
const app = require('../src/app');
const { makeReportsArray } = require('./reports.fixtures');

describe('Reports Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });

    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () =>
    db.raw('TRUNCATE quickreport_reports RESTART IDENTITY CASCADE')
  );

  afterEach('cleanup', () =>
    db.raw('TRUNCATE quickreport_reports RESTART IDENTITY CASCADE')
  );

  describe('GET /api/reports', () => {
    context('Given no reports', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app).get('/api/reports').expect(200, []);
      });
    });

    context('Given there are reports in the database', () => {
      const testReports = makeReportsArray();

      beforeEach('insert reports', () => {
        return db.into('quickreport_reports').insert(testReports);
      });

      it('responds with 200 and all of the reports', () => {
        return supertest(app).get('/api/reports').expect(200, testReports);
      });
    });
  });

  describe('GET /api/reports/:report_id', () => {
    context('Given no reports', () => {
      it('responds with 404', () => {
        const reportId = 123;
        return supertest(app)
          .get(`/api/reports/${reportId}`)
          .expect(404, { error: { message: `Report doesn't exist` } });
      });
    });

    context('Given there are reports in the database', () => {
      const testReports = makeReportsArray();

      beforeEach('insert reports', () => {
        return db.into('quickreport_reports').insert(testReports);
      });

      it('responds with 200 and the specified report', () => {
        const reportId = 2;
        const expectedReport = testReports[reportId - 1];
        return supertest(app)
          .get(`/api/reports/${reportId}`)
          .expect(200, expectedReport);
      });
    });
  });

  describe('POST /api/reports', () => {
    const testReports = makeReportsArray();

    it('creates a report, responding with 201 and the new report', () => {
      const newReport = {
        room_number: '123',
        pt_initials: 'JS',
        user_id: 1,
      };
      return supertest(app)
        .post('/api/reports')
        .send(newReport)
        .expect(201)
        .expect((res) => {
          expect(res.body.room_number).to.eql(newReport.room_number);
          expect(res.body.pt_initials).to.eql(newReport.pt_initials);
          expect(res.body.user_id).to.eql(newReport.user_id);
          expect(res.body).to.have.property('pt_id');
          expect(res.headers.location).to.eql(`/api/reports/${res.body.pt_id}`);
        })
        .then((res) =>
          supertest(app).get(`/api/reports/${res.body.pt_id}`).expect(res.body)
        );
    });

    const requiredFields = ['room_number', 'pt_initials', 'user_id'];

    requiredFields.forEach((field) => {
      const newReport = {
        room_number: '123',
        pt_initials: 'JS',
        user_id: 1,
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newReport[field];

        return supertest(app)
          .post('/api/reports')
          .send(newReport)
          .expect(400, {
            error: { message: `Missing required info in request body` },
          });
      });
    });
  });

  describe('DELETE /api/reports/:pt_id', () => {
    context('Given no reports', () => {
      it('responds with 404', () => {
        const reportId = 3456;
        return supertest(app)
          .delete(`/api/reports/${reportId}`)
          .expect(404, { error: { message: `Report doesn't exist` } });
      });
    });

    context('Given there are reports in the database', () => {
      const testReports = makeReportsArray();

      beforeEach('insert reports', () => {
        return db.into('quickreport_reports').insert(testReports);
      });

      it('responds with 204 and removes the report', () => {
        const idToRemove = 1;
        const expectedReports = testReports.filter(
          (report) => report.pt_id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/reports/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app).get('/api/reports').expect(expectedReports)
          );
      });
    });
  });

  describe('PATCH /api/reports/:pt_id', () => {
    context('Given no articles', () => {
      it('responds with 404', () => {
        const ptId = 123;
        return supertest(app)
          .patch(`/api/reports/${ptId}`)
          .expect(404, { error: { message: `Report doesn't exist` } });
      });
    });

    context('Given there are reports in the database', () => {
      const testReports = makeReportsArray();

      beforeEach('insert reports', () => {
        return db.into('quickreport_reports').insert(testReports);
      });

      it('responds with 204 and updates the report', () => {
        const reportToUpdate = 2;
        const updatedReport = {
          pt_id: 2,
          room_number: '822',
          pt_initials: 'VN',
          age: '67',
          gender: 'male',
          diagnosis: 'MI',
          allergies: 'statins',
          code_status: 'full',
          a_o: 'x2',
          pupils: 'PERRLA',
          other_neuro: 'n/a',
          heart_rhythm: 'SR 70s',
          bp: '130/80s',
          edema: 'generalized trace',
          other_cardiac: 'MD wants TED hose on legs',
          lung_sounds: 'bilat lower lobes coarse',
          oxygen: '2L NC with bipap at night',
          other_resp: 'tries to remove O2',
          last_bm: '6/1/2021',
          gu: 'foley',
          other_gi_gu: 'wears brief d/t urgency',
          skin: 'stage 2 coccyx',
          iv_access: 'left FA PIV',
          additional_report: 'daughter staying with pt',
          user_id: 1,
        };
        const expectedReport = {
          ...testReports[reportToUpdate - 1],
          ...updatedReport,
        };

        return supertest(app)
          .patch(`/api/reports/${reportToUpdate}`)
          .send(updatedReport)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/reports/${reportToUpdate}`)
              .expect(expectedReport)
          );
      });
    });
  });
});
