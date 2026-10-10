-- +goose Up
-- Virtual Class dinamis: modul video dan kuis bertimestamp yang diatur admin.
CREATE TABLE public.virtual_class_modules (
    id bigserial PRIMARY KEY,
    slug character varying(120) NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    icon character varying(500),
    duration character varying(50),
    drive_video_id character varying(200) NOT NULL,
    lesson_title character varying(255),
    lesson_desc text,
    mentor character varying(255),
    topics text,
    translations_en text,
    order_index bigint DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

CREATE UNIQUE INDEX idx_virtual_class_modules_slug ON public.virtual_class_modules USING btree (slug);
CREATE INDEX idx_virtual_class_modules_order_index ON public.virtual_class_modules USING btree (order_index);
CREATE INDEX idx_virtual_class_modules_is_active ON public.virtual_class_modules USING btree (is_active);

CREATE TABLE public.virtual_class_quizzes (
    id bigserial PRIMARY KEY,
    module_id bigint NOT NULL REFERENCES public.virtual_class_modules(id) ON DELETE CASCADE,
    trigger_seconds bigint NOT NULL DEFAULT 0,
    question text NOT NULL,
    options text,
    correct_index bigint NOT NULL DEFAULT 0,
    explanation text,
    translations_en text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

CREATE INDEX idx_virtual_class_quizzes_module_id ON public.virtual_class_quizzes USING btree (module_id);

-- Akses mengikuti pola 00002: hanya backend (skomda_runtime), tidak ada akses Data API.
ALTER TABLE public.virtual_class_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_class_quizzes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.virtual_class_modules, public.virtual_class_quizzes FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.virtual_class_modules_id_seq, public.virtual_class_quizzes_id_seq FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.virtual_class_modules, public.virtual_class_quizzes TO skomda_runtime;
GRANT USAGE ON SEQUENCE public.virtual_class_modules_id_seq, public.virtual_class_quizzes_id_seq TO skomda_runtime;

-- +goose StatementBegin
DO $$ DECLARE tbl text; op text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['virtual_class_modules','virtual_class_quizzes'] LOOP
    FOREACH op IN ARRAY ARRAY['SELECT','INSERT','UPDATE','DELETE'] LOOP
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

-- +goose Down
DROP TABLE IF EXISTS public.virtual_class_quizzes;
DROP TABLE IF EXISTS public.virtual_class_modules;
