// Migration to add phone_no column to users table
exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.string('phone_no', 20);
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('phone_no');
  });
};
