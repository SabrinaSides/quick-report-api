const ReportsService = {
  getAllReports(knex) {
    return knex
      .from('quickreport_reports')
      .select('*');
  },

  getById(knex, pt_id) {
    return knex.from('quickreport_reports')
        .select('*')
        .where({pt_id})
        .first()
  },

  insertReport(knex, newReport) {
      return knex.into('quickreport_reports')
        .insert(newReport)
        .returning('*')
        .then(rows => {
            return rows[0]
        })
  },

  deleteReport(knex, pt_id) {
      return knex.from('quickreport_reports')
      .where({pt_id})
      .delete()
  },

  updateReport(knex, pt_id, newReportFields){
      return knex.from('quickreport_reports')
        .where({pt_id})
        .update(newReportFields)
  }
};

module.exports = ReportsService;
