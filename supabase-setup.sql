-- Invicta Team Dashboard — tablas iniciales
create table calls (
  id bigint primary key,
  closer text,
  nombre text,
  empresa text,
  estado text,
  fecha date,
  objecion text,
  programa text,
  cash_collected numeric default 0,
  contracted_revenue numeric default 0,
  notas text,
  primera_cuota_pagada boolean default true,
  fee_perdido boolean default false,
  created_at timestamptz default now()
);

create table hot_leads (
  id bigint primary key,
  closer text,
  nombre text,
  empresa text,
  estado text,
  ultimo_contacto date,
  proximo_followup date,
  transcript text,
  notas text,
  objecion text,
  analisis_call text,
  puntuacion int,
  mensajes jsonb default '[]',
  created_at timestamptz default now()
);

create table cuotas (
  id bigint primary key,
  closer text,
  call_id bigint,
  nombre_cliente text,
  empresa text,
  numero_cuota int,
  total_cuotas int,
  monto numeric default 0,
  fecha_estimada date,
  pagada boolean default false,
  fecha_pagada date,
  linked_call_id bigint
);

-- Habilitar acceso público de lectura/escritura vía anon key (mismo esquema que el proyecto personal)
alter table calls enable row level security;
alter table hot_leads enable row level security;
alter table cuotas enable row level security;

create policy "allow all calls" on calls for all using (true) with check (true);
create policy "allow all hot_leads" on hot_leads for all using (true) with check (true);
create policy "allow all cuotas" on cuotas for all using (true) with check (true);
