-- Проект «Норма»: персональные данные пользователей
-- Выполните этот файл в Supabase Dashboard → SQL Editor.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Пользователь',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1), 'Пользователь')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.topic_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null,
  status text not null default 'not-started'
    check (status in ('not-started', 'exploring', 'learning', 'needs-practice', 'review', 'mastered')),
  started_at timestamptz,
  last_opened_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (user_id, topic_id)
);

create table if not exists public.notes (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null default 'quick' check (mode in ('quick', 'study')),
  title text not null,
  topic_id text,
  source_id text,
  body text not null default '',
  main_idea text not null default '',
  key_facts text not null default '',
  unclear_questions text not null default '',
  contradictions text not null default '',
  practical_value text not null default '',
  review_question text not null default '',
  review_date date,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.clinical_case_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_id text not null,
  answer_text text not null default '',
  analysis_revealed boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'solved', 'review')),
  review_date date,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (user_id, case_id)
);

create table if not exists public.test_attempts (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id text not null,
  topic_id text not null,
  answers jsonb not null default '{}'::jsonb,
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  completed_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists topic_progress_user_id_idx on public.topic_progress(user_id);
create index if not exists notes_user_id_updated_at_idx on public.notes(user_id, updated_at desc);
create index if not exists clinical_case_answers_user_id_idx on public.clinical_case_answers(user_id);
create index if not exists test_attempts_user_id_completed_at_idx on public.test_attempts(user_id, completed_at desc);

alter table public.profiles enable row level security;
alter table public.topic_progress enable row level security;
alter table public.notes enable row level security;
alter table public.clinical_case_answers enable row level security;
alter table public.test_attempts enable row level security;

-- Повторный запуск файла безопасен: старые политики сначала удаляются.
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "profiles_delete_own" on public.profiles for delete to authenticated using ((select auth.uid()) = id);

drop policy if exists "topic_progress_select_own" on public.topic_progress;
drop policy if exists "topic_progress_insert_own" on public.topic_progress;
drop policy if exists "topic_progress_update_own" on public.topic_progress;
drop policy if exists "topic_progress_delete_own" on public.topic_progress;
create policy "topic_progress_select_own" on public.topic_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "topic_progress_insert_own" on public.topic_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "topic_progress_update_own" on public.topic_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "topic_progress_delete_own" on public.topic_progress for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "notes_select_own" on public.notes;
drop policy if exists "notes_insert_own" on public.notes;
drop policy if exists "notes_update_own" on public.notes;
drop policy if exists "notes_delete_own" on public.notes;
create policy "notes_select_own" on public.notes for select to authenticated using ((select auth.uid()) = user_id);
create policy "notes_insert_own" on public.notes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "notes_update_own" on public.notes for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "notes_delete_own" on public.notes for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "case_answers_select_own" on public.clinical_case_answers;
drop policy if exists "case_answers_insert_own" on public.clinical_case_answers;
drop policy if exists "case_answers_update_own" on public.clinical_case_answers;
drop policy if exists "case_answers_delete_own" on public.clinical_case_answers;
create policy "case_answers_select_own" on public.clinical_case_answers for select to authenticated using ((select auth.uid()) = user_id);
create policy "case_answers_insert_own" on public.clinical_case_answers for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "case_answers_update_own" on public.clinical_case_answers for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "case_answers_delete_own" on public.clinical_case_answers for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "test_attempts_select_own" on public.test_attempts;
drop policy if exists "test_attempts_insert_own" on public.test_attempts;
drop policy if exists "test_attempts_update_own" on public.test_attempts;
drop policy if exists "test_attempts_delete_own" on public.test_attempts;
create policy "test_attempts_select_own" on public.test_attempts for select to authenticated using ((select auth.uid()) = user_id);
create policy "test_attempts_insert_own" on public.test_attempts for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "test_attempts_update_own" on public.test_attempts for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "test_attempts_delete_own" on public.test_attempts for delete to authenticated using ((select auth.uid()) = user_id);

-- Автоматическое обновление updated_at.
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
drop trigger if exists topic_progress_set_updated_at on public.topic_progress;
create trigger topic_progress_set_updated_at before update on public.topic_progress for each row execute procedure public.set_updated_at();
drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at before update on public.notes for each row execute procedure public.set_updated_at();
drop trigger if exists clinical_case_answers_set_updated_at on public.clinical_case_answers;
create trigger clinical_case_answers_set_updated_at before update on public.clinical_case_answers for each row execute procedure public.set_updated_at();
