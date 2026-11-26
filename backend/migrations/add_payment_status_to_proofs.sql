-- Run once on an existing database before deploying the updated backend.
ALTER TABLE abstract_payment_proofs
  ADD COLUMN payment_status ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  ADD COLUMN review_reason TEXT NULL,
  ADD COLUMN reviewer_id INT NULL,
  ADD COLUMN review_email_sent_at DATETIME NULL;

-- Copy earlier decisions when the legacy review table exists.
SET @payment_backfill = IF(
  EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = DATABASE() AND table_name = 'abstract_payment_reviews'
  ),
  'UPDATE abstract_payment_proofs p
   JOIN abstract_payment_reviews r ON r.submission_id = p.submission_id
   SET p.payment_status = r.status,
       p.review_reason = r.reason,
       p.reviewer_id = r.reviewer_id,
       p.review_email_sent_at = r.sent_at',
  'SELECT ''No legacy payment reviews to copy'' AS message'
);
PREPARE payment_backfill FROM @payment_backfill;
EXECUTE payment_backfill;
DEALLOCATE PREPARE payment_backfill;
