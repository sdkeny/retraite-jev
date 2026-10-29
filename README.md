# Retraite JEV — questionnaire

Site du questionnaire de la retraite **Jeunesse Et Vie**, les **28 et 29 novembre 2026 à Marseille**.
Même architecture que le site du camp OJEMS.

| Fichier | Rôle |
|---|---|
| `config.js` | **Le seul fichier à modifier** : lieu, montant, contact, programme, thème. Les lignes marquées « À CONFIRMER » attendent une info. |
| `index.html` | La page publique et le questionnaire. |
| `admin.html` | Tableau des réponses, protégé par mot de passe : statistiques, volontaires par commission, export Excel. |
| `supabase-installation.sql` | Crée la table et l'accès admin. **Contient le mot de passe, jamais publié** (exclu par `.gitignore`). |
| `supabase.sql` | La même table, sans le mot de passe (référence). |

## Le questionnaire

1. **Qui es-tu ?** nom, frère/sœur, âge, téléphone, e-mail, église, ville, **membre de JEV ou invité(e)** (+ « qui t'a invité(e) ? »), première retraite ?
2. **Ta présence** : oui / peut-être / non. Si oui ou peut-être : jours, nuit du samedi, transport/covoiturage, régime alimentaire, participation financière.
3. **En cas d'urgence** : contact, et parent/tuteur pour les moins de 18 ans.
4. **Tes attentes** : ce qu'on attend de la retraite, sujets souhaités, une phrase libre, sujet de prière confidentiel.
5. **Les commissions** (membres seulement) : les 19 commissions avec leur description.

## Mise en service

1. Supabase → projet du camp OJEMS (`ncqmacsmzzrmpycenoci`) → **SQL Editor** → New query →
   coller tout `supabase-installation.sql` → **Run**. La table `inscriptions_jev` est séparée de celle du camp.
2. Compléter `config.js` (lieu, montant, contact).
3. Publier sur GitHub Pages depuis **ce dossier** (`git init` ici, jamais depuis `C:\Users\sevar`).

Mot de passe de `admin.html` : voir `supabase-installation.sql`.
