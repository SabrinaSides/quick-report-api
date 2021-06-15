const ReportsService = {
  getAllReports(knex) {
    return knex
      .from('quickreport_reports')
      .select('pt_id', 'room_number', 'pt_initials');
  },

  getById(knex, id) {
    return knex.from('quickreport_reports')
        .select('*')
        .where('pt_id', id)
        .first()
  },
};

module.exports = ReportsService;
