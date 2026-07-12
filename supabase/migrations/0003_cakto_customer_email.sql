-- Migration: adicionar coluna cakto_customer_email para quando o webhook não traz customer.id

alter table user_profiles add column if not exists cakto_customer_email text;
create index if not exists idx_user_profiles_cakto_customer_email on user_profiles(cakto_customer_email);
