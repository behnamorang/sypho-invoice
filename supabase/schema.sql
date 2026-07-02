-- ============================================================
-- Sypho CRM — Supabase Database Schema
-- Run this in your Supabase SQL editor to set up the database
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- CUSTOMERS
-- ============================================================
create table if not exists public.customers (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  phone       text,
  address     text,
  notes       text,
  created_at  timestamptz default now()
);

alter table public.customers enable row level security;

create policy "Users see own customers"
  on public.customers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- INVOICES
-- ============================================================
create table if not exists public.invoices (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  customer_id     uuid not null references public.customers(id) on delete cascade,
  invoice_number  text not null,
  status          text not null default 'draft' check (status in ('draft', 'sent', 'paid')),
  issue_date      date not null default current_date,
  due_date        date,
  notes           text,
  total           numeric(10, 2) default 0,
  created_at      timestamptz default now()
);

alter table public.invoices enable row level security;

create policy "Users see own invoices"
  on public.invoices for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- INVOICE ITEMS
-- ============================================================
create table if not exists public.invoice_items (
  id          uuid primary key default uuid_generate_v4(),
  invoice_id  uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity    numeric(10, 2) not null default 1,
  unit_price  numeric(10, 2) not null default 0,
  total       numeric(10, 2) generated always as (quantity * unit_price) stored,
  created_at  timestamptz default now()
);

alter table public.invoice_items enable row level security;

create policy "Users see own invoice items"
  on public.invoice_items for all
  using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_items.invoice_id
      and invoices.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_items.invoice_id
      and invoices.user_id = auth.uid()
    )
  );

-- ============================================================
-- INDEXES for performance
-- ============================================================
create index if not exists idx_customers_user_id on public.customers(user_id);
create index if not exists idx_invoices_user_id on public.invoices(user_id);
create index if not exists idx_invoices_customer_id on public.invoices(customer_id);
create index if not exists idx_invoice_items_invoice_id on public.invoice_items(invoice_id);
