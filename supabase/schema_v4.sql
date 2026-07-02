-- Add partially_paid status and overdue + amount_paid to invoices
ALTER TABLE public.invoices 
  DROP CONSTRAINT IF EXISTS invoices_status_check;
ALTER TABLE public.invoices 
  ADD CONSTRAINT invoices_status_check 
  CHECK (status IN ('draft','sent','paid','accepted','declined','overdue','partially_paid'));
ALTER TABLE public.invoices 
  ADD COLUMN IF NOT EXISTS amount_paid numeric(10,2) DEFAULT 0;
