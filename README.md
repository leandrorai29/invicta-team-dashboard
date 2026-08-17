# Invicta Team Dashboard

Sales Script + Dashboard compartido para el equipo de closers de Invicta (Manuela, Leandro, Ariel).

Proyecto independiente — no comparte datos ni código con ningún dashboard personal.

## Setup

1. Creá un proyecto en [supabase.com](https://supabase.com)
2. Corré el SQL de `supabase-setup.sql` en el SQL Editor de Supabase
3. En `sales-script.html` y `dashboard-mejorado.html`, reemplazá:
   - `PEGAR_TU_SUPABASE_URL_ACA` → tu Project URL
   - `PEGAR_TU_SUPABASE_ANON_KEY_ACA` → tu anon public key
4. `npm install`
5. `git init && git add . && git commit -m "initial commit" && git push`
6. Importá el repo en [vercel.com](https://vercel.com/new)

## Uso

- `/sales-script` — cada closer elige su nombre (Manuela/Leandro/Ariel) al iniciar cada llamada
- `/dashboard` — métricas, Hot List, Cuotas y Performance, filtrables por closer y con buscador de lead
