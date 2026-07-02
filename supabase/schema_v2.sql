-- ============================================================
-- Sypho CRM v2 — Schema Update
-- Run this in Supabase SQL Editor
-- ============================================================

-- Business Settings (one row per user)
create table if not exists public.business_settings (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  type        text not null default 'company' check (type in ('company', 'freelancer')),
  name        text not null default '',
  email       text,
  phone       text,
  address     text,
  city        text,
  postcode    text,
  country     text default 'United Kingdom',
  company_reg text,
  vat_number  text,
  logo_url    text,
  payment_terms text default 'Payment due within 30 days',
  bank_details text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.business_settings enable row level security;
create policy "Users manage own settings"
  on public.business_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Drop and recreate customers with new fields
alter table public.customers
  add column if not exists type text not null default 'individual' check (type in ('individual', 'company')),
  add column if not exists company_name text,
  add column if not exists company_reg text,
  add column if not exists vat_number text,
  add column if not exists contact_name text,
  add column if not exists email text,
  add column if not exists city text,
  add column if not exists postcode text,
  add column if not exists country text default 'United Kingdom';

-- Update invoices table
alter table public.invoices
  add column if not exists type text not null default 'invoice' check (type in ('invoice', 'quotation')),
  add column if not exists subtotal numeric(10,2) default 0,
  add column if not exists vat_rate numeric(5,2) default 0,
  add column if not exists vat_amount numeric(10,2) default 0,
  add column if not exists payment_terms text,
  add column if not exists converted_to_invoice uuid references public.invoices(id);

-- Update invoice_items
alter table public.invoice_items
  add column if not exists vat_rate numeric(5,2) default 0;

create index if not exists idx_business_settings_user_id on public.business_settings(user_id);
