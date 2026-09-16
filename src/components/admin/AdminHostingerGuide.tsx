import React from 'react';
import { Server, Database, FileCode, CheckCircle, Terminal, HelpCircle, ExternalLink, Shield } from 'lucide-react';

export const AdminHostingerGuide: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl text-xs sm:text-sm">
      <div>
        <h2 className="text-2xl font-bold font-display text-white">
          Guide de Déploiement Hostinger (Node.js + MySQL)
        </h2>
        <p className="text-xs text-[#8c9bb0] mt-1">
          Instructions pas-à-pas pour héberger Kwan Studio sur les offres Hostinger Cloud ou Web Hosting avec support Node.js.
        </p>
      </div>

      {/* Overview Card */}
      <div className="p-6 rounded-2xl bg-[#0e131d] border border-[#1e273a] space-y-3">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <Server className="w-4 h-4 text-[#d4af37]" />
          <span>Architecture de Production Prévue</span>
        </div>
        <p className="text-xs text-[#95a6bc] leading-relaxed">
          Le projet utilise une architecture unifiée : React/Vite est compilé dans <code className="text-[#f3e5ab]">/dist</code> et servi par un serveur Express autonome compilé dans <code className="text-[#f3e5ab]">dist/server.cjs</code>. Ce bundle unique gère les routes API, les uploads de fichiers et le routage SPA sans aucun conflit de chemin.
        </p>
      </div>

      {/* Step 1: Build */}
      <div className="p-6 rounded-2xl bg-[#0e131d] border border-[#1e273a] space-y-4">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <div className="w-6 h-6 rounded-full bg-[#d4af37] text-black text-xs flex items-center justify-center font-black">1</div>
          <span>Compilation du Projet (Build)</span>
        </div>
        <p className="text-xs text-[#95a6bc]">
          Sur votre machine locale ou via le terminal de déploiement, exécutez la commande suivante :
        </p>
        <div className="p-3 rounded-xl bg-[#07090e] border border-[#1a2334] font-mono text-xs text-[#d4af37]">
          npm run build
        </div>
        <p className="text-xs text-[#8292a7]">
          Cette commande génère automatiquement le dossier <code className="text-white">dist/</code> contenant à la fois l'application web cliente et le serveur autonome <code className="text-white">dist/server.cjs</code>.
        </p>
      </div>

      {/* Step 2: MySQL on Hostinger */}
      <div className="p-6 rounded-2xl bg-[#0e131d] border border-[#1e273a] space-y-4">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <div className="w-6 h-6 rounded-full bg-[#d4af37] text-black text-xs flex items-center justify-center font-black">2</div>
          <span>Création de la Base de Données MySQL sur Hostinger</span>
        </div>
        <ol className="list-decimal list-inside space-y-2 text-xs text-[#95a6bc]">
          <li>Connectez-vous à votre panneau de contrôle <strong>Hostinger (hPanel)</strong>.</li>
          <li>Rendez-vous dans la rubrique <strong>Bases de données MySQL</strong>.</li>
          <li>Créez une nouvelle base (ex: <code className="text-white">u123456789_kwanstudio</code>) et un utilisateur avec mot de passe fort.</li>
          <li>Ouvrez <strong>phpMyAdmin</strong> pour cette base.</li>
          <li>Cliquez sur l'onglet <strong>Importer</strong> et sélectionnez le fichier <code className="text-[#f3e5ab]">database.sql</code> inclus à la racine du projet.</li>
          <li>Exécutez l'importation : toutes les tables (admins, packages, bookings, blog, settings, etc.) et données initiales sont créées instantanément.</li>
        </ol>
      </div>

      {/* Step 3: Environment Variables */}
      <div className="p-6 rounded-2xl bg-[#0e131d] border border-[#1e273a] space-y-4">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <div className="w-6 h-6 rounded-full bg-[#d4af37] text-black text-xs flex items-center justify-center font-black">3</div>
          <span>Variables d'Environnement (.env)</span>
        </div>
        <p className="text-xs text-[#95a6bc]">
          Créez un fichier <code className="text-white">.env</code> à la racine de votre hébergement Node.js avec les identifiants de votre base MySQL Hostinger :
        </p>
        <pre className="p-4 rounded-xl bg-[#07090e] border border-[#1a2334] font-mono text-xs text-[#c6d7ea] overflow-x-auto">
{`PORT=3000
NODE_ENV=production
JWT_SECRET=VotreCleSecreteTresLongueEtAleatoire2026

# Identifiants MySQL Hostinger
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=u123456789_kwanuser
MYSQL_PASSWORD=VotreMotDePasseMySQLHostinger
MYSQL_DATABASE=u123456789_kwanstudio`}
        </pre>
      </div>

      {/* Step 4: Hostinger Node.js Setup */}
      <div className="p-6 rounded-2xl bg-[#0e131d] border border-[#1e273a] space-y-4">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <div className="w-6 h-6 rounded-full bg-[#d4af37] text-black text-xs flex items-center justify-center font-black">4</div>
          <span>Configuration de l'Application Node.js sur Hostinger</span>
        </div>
        <div className="space-y-2 text-xs text-[#95a6bc]">
          <p>Dans hPanel, accédez à <strong>Node.js</strong> et configurez les paramètres comme suit :</p>
          <div className="p-4 rounded-xl bg-[#131926] border border-[#212b3e] space-y-2 font-mono text-xs">
            <div><strong className="text-[#d4af37]">Version de Node.js :</strong> 18.x ou 20.x</div>
            <div><strong className="text-[#d4af37]">Mode d'application :</strong> Production</div>
            <div><strong className="text-[#d4af37]">Racine de l'application :</strong> /home/u.../public_html (ou sous-dossier)</div>
            <div><strong className="text-[#d4af37]">Fichier de démarrage (Startup File) :</strong> dist/server.cjs</div>
          </div>
          <p className="pt-2">
            Cliquez sur <strong>"NPM Install"</strong> ou transférez le dossier <code className="text-white">node_modules</code>, puis démarrez l'application.
          </p>
        </div>
      </div>

      {/* Step 5: Verification & SSL */}
      <div className="p-6 rounded-2xl bg-[#0e131d] border border-[#1e273a] space-y-3">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <div className="w-6 h-6 rounded-full bg-[#d4af37] text-black text-xs flex items-center justify-center font-black">5</div>
          <span>Vérification & Certificat SSL Let's Encrypt</span>
        </div>
        <ul className="space-y-2 text-xs text-[#95a6bc]">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Activez le <strong>certificat SSL gratuit</strong> dans hPanel pour assurer le protocole HTTPS.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Vérifiez l'URL de santé : <code className="text-[#f3e5ab]">https://votredomaine.ma/api/health</code> qui doit renvoyer <code className="text-white">"status": "ok"</code>.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Vérifiez le sitemap XML à l'adresse : <code className="text-[#f3e5ab]">https://votredomaine.ma/sitemap.xml</code>.</span>
          </li>
        </ul>
      </div>

    </div>
  );
};
