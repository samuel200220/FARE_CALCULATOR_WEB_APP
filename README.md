# 🚖 Farcal

Une application **Next.js** moderne qui permet de calculer le coût estimatif d’un trajet urbain, avec visualisation sur carte et support multilingue (🇬🇧 Anglais par défaut, 🇫🇷 Français, 🇩🇪 Allemand).

---

## ✨ Fonctionnalités

- 🗺️ **Calcul de coût** basé sur la distance entre deux adresses.
- 🌍 **Internationalisation (i18n)** : Anglais (par défaut), Français, Allemand.
- 🌓 **Mode sombre/clair** avec sauvegarde des préférences.
- 📊 **Affichage des résultats** : distance, coût estimé, tarif officiel.
- 🚘 **Intégration externe** : redirection vers agences de voyages, taxis, location.
- 📈 **Roadmap** :
  - 🚀 Optimisation du calcul avec **Redis** (mise en cache).
  - 📂 Collecte de données via **DuckDB** (Google Sheets, saisies utilisateurs).
  - 🤖 Amélioration de l’API de calcul avec **Machine Learning (Random Forest)**.
  - 🔑 Administration et gestion des droits utilisateurs (Simple, Pro, Admin).

---

## 🛠️ Stack Technique

- **Frontend** : [Next.js 15](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend** : [Spring Boot WebFlux](https://spring.io/projects/spring-boot), [ScyllaDB](https://www.scylladb.com/), [Redis](https://redis.io/)
- **Map API** : [Navigoo](https://www.navigoo.com/) + Google Maps
- **Internationalisation** : [`next-intl`](https://next-intl-docs.vercel.app/)
- **Machine Learning (à venir)** : Random Forest (Python / Scikit-learn)

---

<!-- ## 📂 Structure du projet

fare-calculator/
├── app/ # Pages Next.js (App Router)
│ ├── [locale]/ # Routes multilingues
│ └── layout.tsx # Layout principal avec NextIntlProvider
├── components/ # Composants réutilisables
├── messages/ # Fichiers i18n (en.json, fr.json, de.json)
├── provider/ # Providers (thème, i18n, etc.)
├── public/ # Assets statiques
├── styles/ # Fichiers CSS globaux
├── backend/ # API Spring Boot (WebFlux + ScyllaDB + Redis)
└── README.md # Documentation -->


---

## 🚀 Installation & Lancement

### 1. Cloner le dépôt
```bash
git clone https://github.com/samuel200220/FARE_CALCULATOR_WEB_APP.git
cd FARE_CALCULATOR_WEB_APP

### 2. Installer les dépendances
```bash
npm install

### 3. Lancer le projet en mode dev
```bash
npm run dev```bash


### 4. Construire la version production
```bash
npm run build
npm run start

---

## Internationalisation
L’app gère trois langues :

🇬🇧 en.json (par défaut)

🇫🇷 fr.json

🇩🇪 de.json

Les fichiers se trouvent dans le dossier /messages.
