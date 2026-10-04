-- +goose Up
-- Browser traffic uses the backend, never a PostgreSQL login or Supabase Data API.
-- The credential is generated and set by the operator outside migration source.
-- +goose StatementBegin
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'skomda_runtime') THEN
    CREATE ROLE skomda_runtime NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
  END IF;
END $$;
-- +goose StatementEnd
GRANT USAGE ON SCHEMA public TO skomda_runtime;
REVOKE CREATE ON SCHEMA public FROM skomda_runtime;
GRANT SELECT ON public.jurusans TO skomda_runtime;
GRANT SELECT, INSERT, UPDATE ON public.users, public.site_settings, public.trial_class_events TO skomda_runtime;
GRANT SELECT, INSERT ON public.audit_logs TO skomda_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news, public.teachers, public.prestasis,
  public.bkk_jobs, public.bkk_partners, public.ekstrakurikulers, public.fasilitas,
  public.documents, public.alumnis, public.digital_talents, public.trial_class_registrations TO skomda_runtime;
GRANT USAGE ON SEQUENCE public.users_id_seq, public.site_settings_id_seq, public.trial_class_events_id_seq,
  public.audit_logs_id_seq, public.news_id_seq, public.teachers_id_seq, public.prestasis_id_seq,
  public.bkk_jobs_id_seq, public.bkk_partners_id_seq, public.ekstrakurikulers_id_seq, public.fasilitas_id_seq,
  public.documents_id_seq, public.alumnis_id_seq, public.digital_talents_id_seq, public.trial_class_registrations_id_seq TO skomda_runtime;

-- Keep every application table protected if the Data API is enabled later.
-- Backend roles are shared application identities; JWT authorization remains in the API.
-- +goose StatementBegin
DO $$ DECLARE tbl text; op text; ops text[];
BEGIN
  FOREACH tbl IN ARRAY ARRAY['alumnis','audit_logs','bkk_alumnis','bkk_jobs','bkk_partners','digital_talents','documents','ekstrakurikulers','fasilitas','jurusans','news','prestasis','site_settings','teachers','trial_class_events','trial_class_registrations','users'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', tbl);
    EXECUTE format('REVOKE ALL ON SEQUENCE public.%I FROM anon, authenticated', tbl || '_id_seq');
    IF tbl = 'bkk_alumnis' THEN CONTINUE; END IF;
    ops := CASE
      WHEN tbl = 'jurusans' THEN ARRAY['SELECT']
      WHEN tbl = 'audit_logs' THEN ARRAY['SELECT','INSERT']
      WHEN tbl IN ('users','site_settings','trial_class_events') THEN ARRAY['SELECT','INSERT','UPDATE']
      ELSE ARRAY['SELECT','INSERT','UPDATE','DELETE'] END;
    FOREACH op IN ARRAY ops LOOP
      IF op = 'INSERT' THEN
        EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO skomda_runtime WITH CHECK (true)', 'skomda_runtime_' || lower(op), tbl);
      ELSIF op = 'UPDATE' THEN
        EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO skomda_runtime USING (true) WITH CHECK (true)', 'skomda_runtime_' || lower(op), tbl);
      ELSE
        EXECUTE format('CREATE POLICY %I ON public.%I FOR %s TO skomda_runtime USING (true)', 'skomda_runtime_' || lower(op), tbl, op);
      END IF;
    END LOOP;
  END LOOP;
END $$;
-- +goose StatementEnd
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
