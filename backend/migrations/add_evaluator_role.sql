ALTER TABLE users
  MODIFY COLUMN role ENUM('user', 'staff', 'admin', 'evaluator')
  NOT NULL DEFAULT 'user';
