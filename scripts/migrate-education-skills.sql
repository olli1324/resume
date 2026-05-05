-- Run this once in Supabase SQL Editor before seeding (I forgot it in the original schema).
alter table education add column if not exists skills text[] not null default '{}';
