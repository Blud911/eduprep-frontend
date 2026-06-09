-- ============================================================
-- EDUPREP CI — Schéma PostgreSQL complet
-- Version 1.0 — Juin 2026
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TYPES ÉNUMÉRÉS
-- ============================================================

CREATE TYPE user_role AS ENUM ('teacher', 'director', 'admin');
CREATE TYPE cycle_type AS ENUM ('primaire', 'college', 'lycee');
CREATE TYPE plan_type AS ENUM ('starter', 'pro', 'etablissement', 'formation', 'trial');
CREATE TYPE sub_status AS ENUM ('active', 'expired', 'cancelled', 'pending', 'trial');
CREATE TYPE payment_method AS ENUM ('wave', 'orange_money', 'mtn_money', 'manual');
CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'rejected', 'refunded');
CREATE TYPE content_type AS ENUM ('fiche', 'devoir', 'interrogation', 'composition', 'tp_note');
CREATE TYPE diff_level AS ENUM ('faible', 'moyen', 'fort', 'standard');
CREATE TYPE seance_type AS ENUM ('decouverte', 'approfondissement', 'revision', 'evaluation', 'tp_pratique');

-- ============================================================
-- TABLE: etablissements
-- ============================================================

CREATE TABLE etablissements (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom           VARCHAR(200) NOT NULL,
  type          VARCHAR(50),                    -- primaire, college, lycee, mixte
  ville         VARCHAR(100),
  dren          VARCHAR(100),                   -- Direction Régionale
  code_mena     VARCHAR(20) UNIQUE,             -- Code officiel MENA
  contact_nom   VARCHAR(150),
  contact_tel   VARCHAR(20),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: users
-- ============================================================

CREATE TABLE users (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email               VARCHAR(255) UNIQUE NOT NULL,
  password_hash       TEXT NOT NULL,
  nom                 VARCHAR(100) NOT NULL,
  prenoms             VARCHAR(150),
  telephone           VARCHAR(20),
  role                user_role DEFAULT 'teacher',
  etablissement_id    UUID REFERENCES etablissements(id) ON DELETE SET NULL,
  matieres            TEXT[],                   -- ex: ['mathematiques','svt']
  niveaux             TEXT[],                   -- ex: ['6ème','5ème','4ème']
  is_active           BOOLEAN DEFAULT TRUE,
  email_verified      BOOLEAN DEFAULT FALSE,
  last_login          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_etablissement ON users(etablissement_id);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- TABLE: subscriptions
-- ============================================================

CREATE TABLE subscriptions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  etablissement_id  UUID REFERENCES etablissements(id) ON DELETE SET NULL,
  plan              plan_type NOT NULL,
  status            sub_status DEFAULT 'pending',
  date_debut        DATE,
  date_fin          DATE,
  -- Quotas mensuels
  fiches_limite     INTEGER DEFAULT 20,        -- -1 = illimité
  devoirs_limite    INTEGER DEFAULT 10,        -- -1 = illimité
  fiches_utilisees  INTEGER DEFAULT 0,
  devoirs_utilises  INTEGER DEFAULT 0,
  reset_date        DATE,                      -- date du prochain reset des compteurs
  -- Métadonnées
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sub_user ON subscriptions(user_id);
CREATE INDEX idx_sub_status ON subscriptions(status);
CREATE INDEX idx_sub_dates ON subscriptions(date_debut, date_fin);

-- ============================================================
-- TABLE: payments
-- ============================================================

CREATE TABLE payments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id   UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES users(id),
  montant           INTEGER NOT NULL,           -- en FCFA
  plan              plan_type NOT NULL,
  methode           payment_method NOT NULL,
  status            payment_status DEFAULT 'pending',
  -- Référence Mobile Money
  reference_mm      VARCHAR(100),              -- numéro de transaction Wave/OM/MTN
  telephone_mm      VARCHAR(20),               -- numéro ayant effectué le paiement
  -- Confirmation admin
  confirme_par      UUID REFERENCES users(id),
  confirme_le       TIMESTAMPTZ,
  note_admin        TEXT,
  -- Période couverte
  periode_debut     DATE,
  periode_fin       DATE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_ref ON payments(reference_mm);

-- ============================================================
-- TABLE: programmes_mena
-- Référentiel officiel Côte d'Ivoire
-- ============================================================

CREATE TABLE programmes_mena (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cycle       cycle_type NOT NULL,
  classe      VARCHAR(20) NOT NULL,            -- ex: '6ème', 'Terminale'
  matiere     VARCHAR(100) NOT NULL,
  chapitre    INTEGER,
  titre       VARCHAR(300) NOT NULL,
  objectifs   TEXT[],
  notions_cles TEXT[],
  duree_heures INTEGER,                        -- durée prévue au programme
  sequence    INTEGER,                         -- ordre dans l'année
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prog_classe ON programmes_mena(classe, matiere);
CREATE INDEX idx_prog_cycle ON programmes_mena(cycle);

-- ============================================================
-- TABLE: fiches (préparations de cours)
-- ============================================================

CREATE TABLE fiches (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  programme_id        UUID REFERENCES programmes_mena(id) ON DELETE SET NULL,
  titre               VARCHAR(300) NOT NULL,
  matiere             VARCHAR(100) NOT NULL,
  cycle               cycle_type,
  classe              VARCHAR(20),
  type_seance         seance_type DEFAULT 'decouverte',
  duree_minutes       INTEGER DEFAULT 55,
  -- Contenu généré par IA (JSON structuré)
  objectif_general    TEXT,
  objectifs_specifiques TEXT[],
  prerequis           TEXT[],
  materiel            TEXT[],
  phases              JSONB,                   -- [{nom, duree, desc, methode}]
  competences         TEXT[],
  evaluation          TEXT,
  prolongements       TEXT[],
  -- Corrigé / ressources complémentaires
  corrige             JSONB,
  ressources          TEXT[],
  -- Métadonnées
  is_favoris          BOOLEAN DEFAULT FALSE,
  is_public           BOOLEAN DEFAULT FALSE,   -- partage entre enseignants
  tags                TEXT[],
  nb_utilisations     INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fiches_user ON fiches(user_id);
CREATE INDEX idx_fiches_matiere ON fiches(matiere, classe);
CREATE INDEX idx_fiches_favoris ON fiches(user_id, is_favoris);

-- ============================================================
-- TABLE: devoirs (évaluations composées)
-- ============================================================

CREATE TABLE devoirs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  programme_id    UUID REFERENCES programmes_mena(id) ON DELETE SET NULL,
  fiche_id        UUID REFERENCES fiches(id) ON DELETE SET NULL,
  titre           VARCHAR(300) NOT NULL,
  matiere         VARCHAR(100) NOT NULL,
  classe          VARCHAR(20),
  type_eval       content_type DEFAULT 'devoir',
  duree_minutes   INTEGER DEFAULT 55,
  total_points    INTEGER DEFAULT 20,
  consigne        TEXT,
  -- Questions (JSON array)
  questions       JSONB NOT NULL,              -- [{numero, type, enonce, points, niveau, bareme, reponse}]
  -- Variantes de différenciation
  variante_faible   JSONB,                     -- version adaptée niveau faible
  variante_fort     JSONB,                     -- version enrichie niveau fort
  -- Corrigé complet
  corrige_complet JSONB,
  -- Métadonnées
  is_favoris      BOOLEAN DEFAULT FALSE,
  is_public       BOOLEAN DEFAULT FALSE,
  tags            TEXT[],
  nb_utilisations INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_devoirs_user ON devoirs(user_id);
CREATE INDEX idx_devoirs_matiere ON devoirs(matiere, classe);

-- ============================================================
-- TABLE: banque_questions
-- Questions réutilisables individuellement
-- ============================================================

CREATE TABLE banque_questions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,  -- NULL = question système
  devoir_id   UUID REFERENCES devoirs(id) ON DELETE SET NULL,
  matiere     VARCHAR(100) NOT NULL,
  classe      VARCHAR(20),
  cycle       cycle_type,
  type_q      VARCHAR(50),                     -- QCM, Vrai/Faux, Question ouverte, Exercice
  niveau_taxo VARCHAR(50),                     -- connaissance, compréhension, application, analyse
  enonce      TEXT NOT NULL,
  points      NUMERIC(4,1),
  bareme      TEXT,
  reponse     TEXT,                            -- corrigé / réponse attendue
  options_qcm TEXT[],                          -- pour les QCM
  tags        TEXT[],
  is_public   BOOLEAN DEFAULT FALSE,
  nb_usages   INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bq_matiere ON banque_questions(matiere, classe);
CREATE INDEX idx_bq_user ON banque_questions(user_id);
CREATE INDEX idx_bq_public ON banque_questions(is_public, matiere);

-- ============================================================
-- TABLE: exports
-- Historique des exports PDF
-- ============================================================

CREATE TABLE exports (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id  UUID,                            -- fiche_id ou devoir_id
  content_type VARCHAR(20),                    -- 'fiche' ou 'devoir'
  filename    VARCHAR(255),
  format      VARCHAR(20) DEFAULT 'pdf',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: generation_logs
-- Suivi des appels à l'IA (coût + quota)
-- ============================================================

CREATE TABLE generation_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  type_gen        VARCHAR(50),                 -- 'fiche', 'devoir', 'corrige', 'variante'
  matiere         VARCHAR(100),
  classe          VARCHAR(20),
  titre           VARCHAR(300),
  tokens_input    INTEGER,
  tokens_output   INTEGER,
  latence_ms      INTEGER,
  success         BOOLEAN DEFAULT TRUE,
  error_msg       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_genlog_user ON generation_logs(user_id, created_at DESC);
CREATE INDEX idx_genlog_date ON generation_logs(created_at DESC);

-- ============================================================
-- TABLE: notifications
-- ============================================================

CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titre       VARCHAR(200) NOT NULL,
  message     TEXT NOT NULL,
  type        VARCHAR(50) DEFAULT 'info',      -- info, warning, success, payment
  lu          BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notif_user ON notifications(user_id, lu);

-- ============================================================
-- TABLE: refresh_tokens
-- ============================================================

CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  device_info TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rt_user ON refresh_tokens(user_id);

-- ============================================================
-- TRIGGERS: updated_at automatique
-- ============================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_subscriptions
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_payments
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_fiches
  BEFORE UPDATE ON fiches
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_devoirs
  BEFORE UPDATE ON devoirs
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- DONNÉES INITIALES: Plans
-- ============================================================

-- Admin système par défaut (changer le mot de passe impérativement)
INSERT INTO users (email, password_hash, nom, prenoms, role, email_verified)
VALUES (
  'admin@eduprep.ci',
  crypt('EduPrep@2026!', gen_salt('bf', 12)),
  'Admin',
  'EduPrep CI',
  'admin',
  TRUE
);

-- ============================================================
-- DONNÉES INITIALES: Programmes MENA (échantillon — à compléter)
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- MATHÉMATIQUES 6ème
('college', '6ème', 'mathematiques', 1, 'Les nombres entiers naturels', ARRAY['Lire, écrire, comparer les entiers naturels','Effectuer des opérations sur les entiers'], ARRAY['entiers naturels','ordre','addition','soustraction','multiplication','division euclidienne'], 12, 1),
('college', '6ème', 'mathematiques', 2, 'La numération décimale', ARRAY['Comprendre le système décimal','Convertir des fractions décimales'], ARRAY['décimaux','virgule','dixième','centième'], 10, 2),
('college', '6ème', 'mathematiques', 3, 'Les fractions', ARRAY['Comprendre la notion de fraction','Comparer et opérer sur les fractions simples'], ARRAY['numérateur','dénominateur','fraction irréductible','PGCD'], 14, 3),
('college', '6ème', 'mathematiques', 4, 'Figures géométriques usuelles', ARRAY['Reconnaître et construire des figures planes','Calculer périmètres et aires'], ARRAY['triangle','quadrilatère','cercle','périmètre','aire'], 16, 4),

-- FRANÇAIS 6ème
('college', '6ème', 'francais', 1, 'Le nom et le groupe nominal', ARRAY['Identifier les noms communs et propres','Analyser la structure du GN'], ARRAY['nom commun','nom propre','déterminant','adjectif','GN'], 8, 1),
('college', '6ème', 'francais', 2, 'Le verbe et la conjugaison', ARRAY['Identifier les verbes','Conjuguer au présent, passé composé, imparfait'], ARRAY['infinitif','radical','terminaison','auxiliaire','participe passé'], 12, 2),
('college', '6ème', 'francais', 3, 'Lecture et compréhension de texte', ARRAY['Lire un texte narratif','Identifier personnages, lieu, temps'], ARRAY['texte narratif','narrateur','personnage','cadre spatio-temporel'], 10, 3),

-- SVT 6ème
('college', '6ème', 'svt', 1, 'La cellule, unité du vivant', ARRAY['Décrire l''organisation cellulaire','Distinguer cellule animale et végétale'], ARRAY['cellule','membrane','noyau','cytoplasme','chloroplaste','vacuole'], 8, 1),
('college', '6ème', 'svt', 2, 'La nutrition des plantes vertes', ARRAY['Expliquer la photosynthèse','Identifier les besoins des plantes'], ARRAY['photosynthèse','chlorophylle','CO2','eau','lumière','minéraux'], 10, 2),
('college', '6ème', 'svt', 3, 'La digestion', ARRAY['Décrire le trajet des aliments','Expliquer la digestion mécanique et chimique'], ARRAY['tube digestif','enzymes','absorption','nutriments'], 10, 3),

-- MATHÉMATIQUES 3ème
('college', '3ème', 'mathematiques', 1, 'Les puissances et la notation scientifique', ARRAY['Calculer avec les puissances','Utiliser la notation scientifique'], ARRAY['puissance','exposant','notation scientifique','ordre de grandeur'], 10, 1),
('college', '3ème', 'mathematiques', 2, 'Équations du premier degré', ARRAY['Résoudre une équation du 1er degré','Traduire un problème en équation'], ARRAY['équation','inconnue','membre','solution'], 12, 2),
('college', '3ème', 'mathematiques', 3, 'Théorème de Pythagore et sa réciproque', ARRAY['Appliquer le théorème de Pythagore','Vérifier la nature d''un triangle'], ARRAY['triangle rectangle','hypoténuse','Pythagore','réciproque'], 14, 3),

-- PHYSIQUE-CHIMIE 3ème
('college', '3ème', 'physique', 1, 'Les états de la matière et changements d''état', ARRAY['Identifier les états de la matière','Décrire les changements d''état'], ARRAY['solide','liquide','gazeux','fusion','vaporisation','solidification'], 10, 1),
('college', '3ème', 'physique', 2, 'L''électricité : circuits et lois', ARRAY['Analyser un circuit électrique','Appliquer les lois d''Ohm et de Kirchhoff'], ARRAY['circuit','résistance','tension','intensité','loi d''Ohm'], 14, 2),

-- HISTOIRE-GÉOGRAPHIE 6ème
('college', '6ème', 'histoire-geo', 1, 'La Préhistoire', ARRAY['Situer la préhistoire dans le temps','Décrire les modes de vie des premiers hommes'], ARRAY['Homo sapiens','Paléolithique','Néolithique','sédentarisation'], 8, 1),
('college', '6ème', 'histoire-geo', 2, 'L''Égypte ancienne', ARRAY['Identifier les caractéristiques de la civilisation égyptienne','Comprendre l''organisation de la société'], ARRAY['pharaon','pyramide','hieroglyphes','Nil','empire'], 8, 2),
('college', '6ème', 'histoire-geo', 3, 'La Côte d''Ivoire : relief et hydrographie', ARRAY['Décrire le relief ivoirien','Localiser les principaux fleuves et cours d''eau'], ARRAY['relief','plateau','montagne','Comoé','Bandama','Sassandra'], 6, 3),

-- MATHÉMATIQUES Terminale
('lycee', 'Terminale', 'mathematiques', 1, 'Limites et continuité des fonctions', ARRAY['Calculer des limites','Étudier la continuité d''une fonction'], ARRAY['limite','continuité','théorème des valeurs intermédiaires','asymptote'], 20, 1),
('lycee', 'Terminale', 'mathematiques', 2, 'Dérivation et applications', ARRAY['Calculer des dérivées','Étudier les variations d''une fonction'], ARRAY['dérivée','tableau de variations','extremum','tangente'], 18, 2),
('lycee', 'Terminale', 'mathematiques', 3, 'Suites numériques', ARRAY['Définir et étudier des suites','Calculer sommes et limites'], ARRAY['suite arithmétique','suite géométrique','récurrence','convergence'], 16, 3),

-- PHILOSOPHIE Terminale
('lycee', 'Terminale', 'philosophie', 1, 'La conscience et l''inconscient', ARRAY['Définir la conscience','Analyser la notion d''inconscient freudien'], ARRAY['conscience','inconscient','Freud','psychanalyse','moi','surmoi','ça'], 12, 1),
('lycee', 'Terminale', 'philosophie', 2, 'La liberté et la responsabilité', ARRAY['Définir la liberté','Articuler liberté et responsabilité morale'], ARRAY['liberté','déterminisme','responsabilité','libre arbitre','Sartre'], 12, 2);
