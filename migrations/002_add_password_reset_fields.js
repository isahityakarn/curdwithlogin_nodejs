const addPasswordResetFields = {
  name: 'add_password_reset_fields',
  up: `
    ALTER TABLE users 
    ADD COLUMN reset_token VARCHAR(255) NULL,
    ADD COLUMN reset_token_expires TIMESTAMP NULL
  `,
  down: `
    ALTER TABLE users 
    DROP COLUMN reset_token,
    DROP COLUMN reset_token_expires
  `
};

module.exports = addPasswordResetFields;
