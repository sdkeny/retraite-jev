-- =====================================================================
--  Retraite JEV — Jeunesse Et Vie — 28 et 29 novembre 2026, Marseille
--  Table des réponses au questionnaire (sans le mot de passe admin).
--  La version complète, avec l'accès au tableau de bord, est dans
--  supabase-installation.sql (non publié).
-- =====================================================================

create table if not exists public.inscriptions_jev (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  -- identité
  nom            text not null,
  sexe           text,
  age            text,
  telephone      text,
  email          text,
  eglise         text,
  ville          text,
  statut         text,
  invite_par     text,
  premiere_fois  text,

  -- présence
  participation  text,
  jours          text,
  hebergement    text,
  transport      text,
  repas          text,
  cotisation     text,

  -- en cas d'urgence
  urgence_nom    text,
  urgence_tel    text,
  tuteur         text,

  -- attentes
  attentes       text,
  sujets         text,
  attente_texte  text,
  priere         text,

  -- commissions (membres)
  commissions    text,
  message        text
);

alter table public.inscriptions_jev enable row level security;

-- Les jeunes (clé "anon", celle du site) peuvent UNIQUEMENT ajouter
-- une réponse. Ils ne peuvent ni lire, ni modifier, ni supprimer.
drop policy if exists "les jeunes peuvent repondre" on public.inscriptions_jev;
create policy "les jeunes peuvent repondre"
  on public.inscriptions_jev
  for insert
  to anon
  with check (
    char_length(coalesce(nom, ''))           between 1 and 120
    and char_length(coalesce(eglise, ''))        <= 160
    and char_length(coalesce(repas, ''))         <= 300
    and char_length(coalesce(attente_texte, '')) <= 1500
    and char_length(coalesce(priere, ''))        <= 1500
    and char_length(coalesce(message, ''))       <= 1000
  );

create index if not exists inscriptions_jev_created_at_idx
  on public.inscriptions_jev (created_at desc);
