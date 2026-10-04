-- +goose Up

-- Baseline captured from the production schema-only dump on 2026-10-04.
-- Grants/default ACL are intentionally excluded; access policy is managed separately.
CREATE TABLE public.alumnis (
    id bigint NOT NULL,
    nisn character varying(50),
    name character varying(255) NOT NULL,
    angkatan character varying(20) DEFAULT '6'::character varying NOT NULL,
    tahun_lulus character varying(10) DEFAULT '2024'::character varying NOT NULL,
    tahun_ajaran character varying(20) DEFAULT '2023/2024'::character varying NOT NULL,
    status_kelulusan character varying(50) DEFAULT 'LULUS'::character varying NOT NULL,
    kategori character varying(50) NOT NULL,
    status_aktivitas character varying(100),
    keterangan character varying(255),
    institusi character varying(255),
    jurusan character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: alumnis_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.alumnis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: alumnis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.alumnis_id_seq OWNED BY public.alumnis.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id bigint NOT NULL,
    user_id bigint,
    user_name character varying(100),
    action character varying(50) NOT NULL,
    entity character varying(50) NOT NULL,
    entity_id character varying(100),
    details text,
    ip_address character varying(50),
    created_at timestamp with time zone
);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: bkk_alumnis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bkk_alumnis (
    id bigint NOT NULL,
    name character varying(150) NOT NULL,
    grad_year character varying(10) NOT NULL,
    company character varying(200) NOT NULL,
    role character varying(150) NOT NULL,
    quote text NOT NULL,
    photo character varying(500),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: bkk_alumnis_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bkk_alumnis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bkk_alumnis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bkk_alumnis_id_seq OWNED BY public.bkk_alumnis.id;


--
-- Name: bkk_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bkk_jobs (
    id bigint NOT NULL,
    title character varying(255) NOT NULL,
    company character varying(200) NOT NULL,
    location character varying(150) NOT NULL,
    job_type character varying(50) DEFAULT 'Full-time'::character varying NOT NULL,
    deadline character varying(50),
    salary character varying(100),
    requirements text,
    description text,
    company_logo character varying(500),
    apply_url character varying(500),
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    contact_person character varying(150),
    email_or_wa character varying(150),
    jurusan character varying(100),
    source character varying(50) DEFAULT 'admin'::character varying
);


--
-- Name: bkk_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bkk_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bkk_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bkk_jobs_id_seq OWNED BY public.bkk_jobs.id;


--
-- Name: bkk_partners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bkk_partners (
    id bigint NOT NULL,
    name character varying(200) NOT NULL,
    category character varying(100) NOT NULL,
    logo character varying(500) NOT NULL,
    description text,
    website character varying(500),
    order_index bigint DEFAULT 0,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: bkk_partners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bkk_partners_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bkk_partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bkk_partners_id_seq OWNED BY public.bkk_partners.id;


--
-- Name: digital_talents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.digital_talents (
    id bigint NOT NULL,
    slug character varying(120) NOT NULL,
    number character varying(10) DEFAULT '01'::character varying,
    title character varying(200) NOT NULL,
    category character varying(100) NOT NULL,
    image character varying(500),
    short_desc text,
    full_desc text,
    core_skills text,
    supporting_skills text,
    career_prospects text,
    tools text,
    badge_text character varying(100),
    order_index bigint DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: digital_talents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.digital_talents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: digital_talents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.digital_talents_id_seq OWNED BY public.digital_talents.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documents (
    id bigint NOT NULL,
    title character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    file_url character varying(500) NOT NULL,
    file_size character varying(50),
    file_type character varying(50) DEFAULT 'PDF'::character varying,
    description text,
    download_count bigint DEFAULT 0,
    is_public boolean DEFAULT true,
    order_index bigint DEFAULT 0,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: ekstrakurikulers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ekstrakurikulers (
    id bigint NOT NULL,
    name character varying(150) NOT NULL,
    slug character varying(150) NOT NULL,
    category character varying(100) NOT NULL,
    pembina character varying(150),
    schedule character varying(150),
    description text,
    image character varying(500),
    badge_color character varying(50),
    order_index bigint DEFAULT 0,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: ekstrakurikulers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ekstrakurikulers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ekstrakurikulers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ekstrakurikulers_id_seq OWNED BY public.ekstrakurikulers.id;


--
-- Name: fasilitas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fasilitas (
    id bigint NOT NULL,
    name character varying(200) NOT NULL,
    category character varying(100) NOT NULL,
    image character varying(500) NOT NULL,
    description text,
    capacity character varying(100),
    features text,
    order_index bigint DEFAULT 0,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: fasilitas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.fasilitas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: fasilitas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.fasilitas_id_seq OWNED BY public.fasilitas.id;


--
-- Name: jurusans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jurusans (
    id bigint NOT NULL,
    kode character varying(10) NOT NULL,
    nama character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    deskripsi text NOT NULL,
    skills text,
    prospek_karier text,
    gambar character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: jurusans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jurusans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jurusans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jurusans_id_seq OWNED BY public.jurusans.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news (
    id bigint NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    day character varying(10),
    month character varying(20),
    date_formatted character varying(50),
    "time" character varying(20),
    image character varying(500),
    summary text,
    content text,
    author character varying(100) DEFAULT 'Humas SKOMDA'::character varying,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    status character varying(20) DEFAULT 'published'::character varying NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: prestasis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.prestasis (
    id bigint NOT NULL,
    slug character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    category character varying(50) NOT NULL,
    award character varying(100) NOT NULL,
    badge_level character varying(50) NOT NULL,
    competition character varying(255) NOT NULL,
    organizer character varying(255) NOT NULL,
    year character varying(10) NOT NULL,
    student_name character varying(150) NOT NULL,
    student_class character varying(50) NOT NULL,
    image character varying(500),
    description text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: prestasis_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.prestasis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: prestasis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.prestasis_id_seq OWNED BY public.prestasis.id;


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_settings (
    id bigint NOT NULL,
    key character varying(100) NOT NULL,
    value text NOT NULL,
    category character varying(50) DEFAULT 'general'::character varying NOT NULL,
    description character varying(255),
    updated_at timestamp with time zone
);


--
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.site_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- Name: teachers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teachers (
    id bigint NOT NULL,
    name character varying(150) NOT NULL,
    role character varying(150) NOT NULL,
    category character varying(50) NOT NULL,
    image character varying(500),
    bio text,
    pendidikan_terakhir character varying(150),
    bidang_keahlian character varying(150),
    motto character varying(255),
    kontak character varying(100),
    order_index bigint DEFAULT 0,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.teachers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.teachers_id_seq OWNED BY public.teachers.id;


--
-- Name: trial_class_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trial_class_events (
    id bigint NOT NULL,
    title character varying(255) NOT NULL,
    badge character varying(100) DEFAULT 'EVENT TERDEKAT'::character varying,
    date_day character varying(50) NOT NULL,
    date_full character varying(100) NOT NULL,
    time_range character varying(100) NOT NULL,
    timezone character varying(50) DEFAULT 'WIB'::character varying,
    mode character varying(100) DEFAULT 'Online'::character varying,
    submode character varying(100) DEFAULT '(Virtual Class)'::character varying,
    status character varying(50) DEFAULT 'open'::character varying,
    quota bigint DEFAULT 100,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: trial_class_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.trial_class_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: trial_class_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.trial_class_events_id_seq OWNED BY public.trial_class_events.id;


--
-- Name: trial_class_registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trial_class_registrations (
    id bigint NOT NULL,
    ticket_code character varying(64) NOT NULL,
    full_name character varying(255) NOT NULL,
    school_origin character varying(255) NOT NULL,
    whatsapp character varying(50) NOT NULL,
    email character varying(255),
    major character varying(100) NOT NULL,
    status character varying(50) DEFAULT 'registered'::character varying NOT NULL,
    notes text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: trial_class_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.trial_class_registrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: trial_class_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.trial_class_registrations_id_seq OWNED BY public.trial_class_registrations.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'editor'::character varying NOT NULL,
    avatar character varying(500),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: alumnis id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumnis ALTER COLUMN id SET DEFAULT nextval('public.alumnis_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: bkk_alumnis id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bkk_alumnis ALTER COLUMN id SET DEFAULT nextval('public.bkk_alumnis_id_seq'::regclass);


--
-- Name: bkk_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bkk_jobs ALTER COLUMN id SET DEFAULT nextval('public.bkk_jobs_id_seq'::regclass);


--
-- Name: bkk_partners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bkk_partners ALTER COLUMN id SET DEFAULT nextval('public.bkk_partners_id_seq'::regclass);


--
-- Name: digital_talents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_talents ALTER COLUMN id SET DEFAULT nextval('public.digital_talents_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: ekstrakurikulers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ekstrakurikulers ALTER COLUMN id SET DEFAULT nextval('public.ekstrakurikulers_id_seq'::regclass);


--
-- Name: fasilitas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fasilitas ALTER COLUMN id SET DEFAULT nextval('public.fasilitas_id_seq'::regclass);


--
-- Name: jurusans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jurusans ALTER COLUMN id SET DEFAULT nextval('public.jurusans_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: prestasis id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prestasis ALTER COLUMN id SET DEFAULT nextval('public.prestasis_id_seq'::regclass);


--
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- Name: teachers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teachers ALTER COLUMN id SET DEFAULT nextval('public.teachers_id_seq'::regclass);


--
-- Name: trial_class_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trial_class_events ALTER COLUMN id SET DEFAULT nextval('public.trial_class_events_id_seq'::regclass);


--
-- Name: trial_class_registrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trial_class_registrations ALTER COLUMN id SET DEFAULT nextval('public.trial_class_registrations_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: alumnis alumnis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumnis
    ADD CONSTRAINT alumnis_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: bkk_alumnis bkk_alumnis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bkk_alumnis
    ADD CONSTRAINT bkk_alumnis_pkey PRIMARY KEY (id);


--
-- Name: bkk_jobs bkk_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bkk_jobs
    ADD CONSTRAINT bkk_jobs_pkey PRIMARY KEY (id);


--
-- Name: bkk_partners bkk_partners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bkk_partners
    ADD CONSTRAINT bkk_partners_pkey PRIMARY KEY (id);


--
-- Name: digital_talents digital_talents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_talents
    ADD CONSTRAINT digital_talents_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: ekstrakurikulers ekstrakurikulers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ekstrakurikulers
    ADD CONSTRAINT ekstrakurikulers_pkey PRIMARY KEY (id);


--
-- Name: fasilitas fasilitas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fasilitas
    ADD CONSTRAINT fasilitas_pkey PRIMARY KEY (id);


--
-- Name: jurusans jurusans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jurusans
    ADD CONSTRAINT jurusans_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: prestasis prestasis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prestasis
    ADD CONSTRAINT prestasis_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: trial_class_events trial_class_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trial_class_events
    ADD CONSTRAINT trial_class_events_pkey PRIMARY KEY (id);


--
-- Name: trial_class_registrations trial_class_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trial_class_registrations
    ADD CONSTRAINT trial_class_registrations_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_alumnis_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alumnis_deleted_at ON public.alumnis USING btree (deleted_at);


--
-- Name: idx_alumnis_kategori; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alumnis_kategori ON public.alumnis USING btree (kategori);


--
-- Name: idx_alumnis_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alumnis_name ON public.alumnis USING btree (name);


--
-- Name: idx_alumnis_nisn; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alumnis_nisn ON public.alumnis USING btree (nisn);


--
-- Name: idx_audit_logs_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_action ON public.audit_logs USING btree (action);


--
-- Name: idx_audit_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at);


--
-- Name: idx_audit_logs_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_entity ON public.audit_logs USING btree (entity);


--
-- Name: idx_audit_logs_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id);


--
-- Name: idx_bkk_alumnis_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bkk_alumnis_deleted_at ON public.bkk_alumnis USING btree (deleted_at);


--
-- Name: idx_bkk_jobs_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bkk_jobs_deleted_at ON public.bkk_jobs USING btree (deleted_at);


--
-- Name: idx_bkk_partners_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bkk_partners_deleted_at ON public.bkk_partners USING btree (deleted_at);


--
-- Name: idx_bkk_partners_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bkk_partners_order_index ON public.bkk_partners USING btree (order_index);


--
-- Name: idx_digital_talents_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_digital_talents_category ON public.digital_talents USING btree (category);


--
-- Name: idx_digital_talents_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_digital_talents_deleted_at ON public.digital_talents USING btree (deleted_at);


--
-- Name: idx_digital_talents_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_digital_talents_is_active ON public.digital_talents USING btree (is_active);


--
-- Name: idx_digital_talents_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_digital_talents_order_index ON public.digital_talents USING btree (order_index);


--
-- Name: idx_digital_talents_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_digital_talents_slug ON public.digital_talents USING btree (slug);


--
-- Name: idx_documents_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documents_category ON public.documents USING btree (category);


--
-- Name: idx_documents_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documents_deleted_at ON public.documents USING btree (deleted_at);


--
-- Name: idx_documents_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documents_order_index ON public.documents USING btree (order_index);


--
-- Name: idx_ekstrakurikulers_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ekstrakurikulers_category ON public.ekstrakurikulers USING btree (category);


--
-- Name: idx_ekstrakurikulers_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ekstrakurikulers_deleted_at ON public.ekstrakurikulers USING btree (deleted_at);


--
-- Name: idx_ekstrakurikulers_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ekstrakurikulers_order_index ON public.ekstrakurikulers USING btree (order_index);


--
-- Name: idx_ekstrakurikulers_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_ekstrakurikulers_slug ON public.ekstrakurikulers USING btree (slug);


--
-- Name: idx_fasilitas_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fasilitas_category ON public.fasilitas USING btree (category);


--
-- Name: idx_fasilitas_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fasilitas_deleted_at ON public.fasilitas USING btree (deleted_at);


--
-- Name: idx_fasilitas_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fasilitas_order_index ON public.fasilitas USING btree (order_index);


--
-- Name: idx_jurusans_kode; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_jurusans_kode ON public.jurusans USING btree (kode);


--
-- Name: idx_jurusans_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_jurusans_slug ON public.jurusans USING btree (slug);


--
-- Name: idx_news_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_news_deleted_at ON public.news USING btree (deleted_at);


--
-- Name: idx_news_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_news_slug ON public.news USING btree (slug);


--
-- Name: idx_prestasis_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prestasis_category ON public.prestasis USING btree (category);


--
-- Name: idx_prestasis_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prestasis_deleted_at ON public.prestasis USING btree (deleted_at);


--
-- Name: idx_prestasis_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_prestasis_slug ON public.prestasis USING btree (slug);


--
-- Name: idx_prestasis_year; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prestasis_year ON public.prestasis USING btree (year);


--
-- Name: idx_site_settings_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_site_settings_key ON public.site_settings USING btree (key);


--
-- Name: idx_teachers_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_teachers_category ON public.teachers USING btree (category);


--
-- Name: idx_teachers_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_teachers_deleted_at ON public.teachers USING btree (deleted_at);


--
-- Name: idx_teachers_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_teachers_order_index ON public.teachers USING btree (order_index);


--
-- Name: idx_trial_class_events_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_trial_class_events_deleted_at ON public.trial_class_events USING btree (deleted_at);


--
-- Name: idx_trial_class_events_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_trial_class_events_is_active ON public.trial_class_events USING btree (is_active);


--
-- Name: idx_trial_class_registrations_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_trial_class_registrations_deleted_at ON public.trial_class_registrations USING btree (deleted_at);


--
-- Name: idx_trial_class_registrations_full_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_trial_class_registrations_full_name ON public.trial_class_registrations USING btree (full_name);


--
-- Name: idx_trial_class_registrations_ticket_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_trial_class_registrations_ticket_code ON public.trial_class_registrations USING btree (ticket_code);


--
-- Name: idx_trial_class_registrations_whatsapp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_trial_class_registrations_whatsapp ON public.trial_class_registrations USING btree (whatsapp);


--
-- Name: idx_users_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_deleted_at ON public.users USING btree (deleted_at);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: news Allow public read on news; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read on news" ON public.news FOR SELECT USING (true);


--
-- Name: jurusans allow public read on jurusans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "allow public read on jurusans" ON public.jurusans FOR SELECT USING (true);


--
-- Name: alumnis; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.alumnis ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: digital_talents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.digital_talents ENABLE ROW LEVEL SECURITY;

--
-- Name: jurusans; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.jurusans ENABLE ROW LEVEL SECURITY;

--
-- Name: news; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

--
-- Name: trial_class_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.trial_class_events ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--
