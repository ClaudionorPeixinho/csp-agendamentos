-- ============================================================
-- CORTE CERTO — Supabase Schema (execute no SQL Editor do Supabase)
-- ============================================================

-- 1. ADMIN CONFIG
CREATE TABLE admin_config (
  id bigint primary key default 1,
  username text not null default 'admin',
  password text not null default 'admin123',
  logo text not null default '',
  created_at timestamptz default now()
);
INSERT INTO admin_config (id, username, password, logo) VALUES (1, 'admin', 'admin123', '');
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ler admin_config" ON admin_config FOR SELECT USING (true);
CREATE POLICY "Admin pode atualizar admin_config" ON admin_config FOR UPDATE USING (true);

-- 2. HAIRDRESSERS
CREATE TABLE hairdressers (
  id bigint primary key,
  name text not null,
  specialty text not null,
  rating numeric(2,1) default 5.0,
  bio text not null default '',
  username text not null unique,
  password text not null default '123',
  phone text not null default '',
  photo text not null default '',
  gps_link text not null default '',
  work_start text not null default '08:00',
  work_end text not null default '19:00',
  lunch_start text not null default '12:00',
  lunch_end text not null default '13:00',
  is_closed boolean not null default false,
  extra_slots jsonb default '[]',
  plan text not null default 'basic',
  portfolio_enabled boolean not null default false,
  created_at timestamptz default now()
);
ALTER TABLE hairdressers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ler hairdressers" ON hairdressers FOR SELECT USING (true);
CREATE POLICY "Admin pode inserir hairdressers" ON hairdressers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin pode atualizar hairdressers" ON hairdressers FOR UPDATE USING (true);
CREATE POLICY "Cabeleireiro pode atualizar próprio perfil" ON hairdressers FOR UPDATE USING (auth.uid()::text = username);

-- 3. SERVICES
CREATE TABLE services (
  id bigint primary key,
  name text not null,
  icon text not null default 'fa-cut',
  price numeric(10,2) not null,
  duration text not null default '40min',
  hairdresser_id bigint references hairdressers(id) on delete cascade,
  created_at timestamptz default now()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ler services" ON services FOR SELECT USING (true);
CREATE POLICY "Cabeleireiro pode inserir seus services" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "Cabeleireiro pode atualizar seus services" ON services FOR UPDATE USING (true);
CREATE POLICY "Cabeleireiro pode deletar seus services" ON services FOR DELETE USING (true);

-- 4. APPOINTMENTS
CREATE TABLE appointments (
  id bigint primary key,
  hairdresser_id bigint references hairdressers(id) on delete cascade,
  service_id bigint references services(id) on delete set null,
  date text not null,
  time text not null,
  client_name text not null,
  client_phone text not null,
  client_email text not null default '',
  notes text not null default '',
  status text not null default 'confirmed',
  payment_method text not null default '',
  manual boolean not null default false,
  created_at timestamptz default now()
);
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ler appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Clientes podem inserir appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Cabeleireiros podem atualizar seus appointments" ON appointments FOR UPDATE USING (true);
CREATE POLICY "Cabeleireiros podem deletar seus appointments" ON appointments FOR DELETE USING (true);

-- 5. TRANSACTIONS
CREATE TABLE transactions (
  id bigint primary key,
  hairdresser_id bigint references hairdressers(id) on delete cascade,
  type text not null,
  category text not null,
  description text not null,
  amount numeric(10,2) not null,
  date text not null,
  payment_method text not null default '',
  created_at timestamptz default now()
);
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cabeleireiro pode ler suas transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Cabeleireiro pode inserir suas transactions" ON transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Cabeleireiro pode deletar suas transactions" ON transactions FOR DELETE USING (true);

-- 6. PORTFOLIO
CREATE TABLE portfolio (
  id bigint primary key,
  hairdresser_id bigint references hairdressers(id) on delete cascade,
  caption text not null default '',
  images jsonb default '[]',
  date text not null,
  created_at timestamptz default now()
);
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ler portfolio" ON portfolio FOR SELECT USING (true);
CREATE POLICY "Cabeleireiro pode inserir portfolio" ON portfolio FOR INSERT WITH CHECK (true);
CREATE POLICY "Cabeleireiro pode deletar seu portfolio" ON portfolio FOR DELETE USING (true);

-- 7. FREE USERS
CREATE TABLE free_users (
  id bigint primary key,
  name text not null,
  email text not null unique,
  password text not null,
  plan text not null default 'free',
  trial_expiry text,
  created_at timestamptz default now()
);
ALTER TABLE free_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário pode ler próprios dados" ON free_users FOR SELECT USING (true);
CREATE POLICY "Usuário pode se cadastrar" ON free_users FOR INSERT WITH CHECK (true);

-- INDEX para consultas rápidas de agendamentos
CREATE INDEX idx_appointments_hairdresser_date ON appointments(hairdresser_id, date);
CREATE INDEX idx_services_hairdresser ON services(hairdresser_id);
CREATE INDEX idx_transactions_hairdresser ON transactions(hairdresser_id);
CREATE INDEX idx_portfolio_hairdresser ON portfolio(hairdresser_id);
