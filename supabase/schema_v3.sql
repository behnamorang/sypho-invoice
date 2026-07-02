-- Run in Supabase SQL Editor

-- Add new fields to business_settings
ALTER TABLE public.business_settings
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'GBP',
  ADD COLUMN IF NOT EXISTS invoice_color text DEFAULT '#2563eb',
  ADD COLUMN IF NOT EXISTS signature_url text;

-- Add currency to invoices
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'GBP';
