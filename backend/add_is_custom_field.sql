-- Migration SQL: Add is_custom field to facilities table
-- Run this in phpMyAdmin SQL tab

-- Add is_custom column (BOOLEAN with default FALSE)
ALTER TABLE facilities
ADD COLUMN is_custom TINYINT(1) DEFAULT 0 NOT NULL AFTER status;

-- Verify the column was added
DESCRIBE facilities;

-- Show message
SELECT 'Migration completed! Column is_custom added to facilities table' AS Status;