# Les Cro Cro Cros

Jeu de plateforme et d’énigmes en solo, en français, jouable hors ligne. Trois crocodiles complémentaires, 37 étapes, six chapitres et 111 étoiles facultatives.

**Version 0.7.1 — arrivée validée même si un croco dépasse l’arche.**

![Les personnages dessinés par le moteur du jeu](docs/personnages-v07.png)

## Jouer

Télécharger [Les_Cro_Cro_Cros.html](Les_Cro_Cro_Cros.html) puis l’ouvrir dans un navigateur sur ordinateur. Le fichier est autonome ; le bouton « Raw / Download raw file » de GitHub permet de récupérer son contenu.

Pour la PWA, servir le dossier `dist/` sur HTTPS ou localement :

```sh
python3 -m http.server 8080 --directory dist --bind 127.0.0.1
```

Ouvrir `http://localhost:8080`. L’installation PWA nécessite HTTPS ou localhost et un premier chargement complet. Aucun serveur de jeu, compte ni connexion n’est requis ensuite. Ce dépôt ne configure aucun déploiement automatique.

## Commandes

- **W / X / C** : sélectionner Croquinet / Croquefort / Croqueboum.
- **← / →** : marcher ; **↑** : sauter avec Croquinet ou monter à l’échelle ; **↓** : descendre.
- **Espace** : capacité, interaction ou capture d’un zèbre coincé.
- **R** : rembobiner ; **M** : vue d’ensemble ; **Échap** : pause.

Commandes tactiles disponibles. Progression locale, export/import dans les réglages. La mise à jour 0.6 → 0.7 conserve la tentative en cours.

## Sources et reconstruction

- `src/` : moteur, bestiaire, dessin Canvas, musique et interface.
- `content/` : définition et génération des 37 niveaux.
- `dist/` : PWA compilée, manifeste, service worker et icônes.
- `tests/` : solutions par les commandes normales, sauvegardes, interactions et simulations d’API.
- `docs/` : planche de personnages produite par le moteur.

```sh
node content/author-campaign.cjs
python3 build.py
node tests/engine.test.js
node tests/exit.test.cjs
node tests/blocks.test.cjs
node tests/wildlife.test.cjs
node tests/pranks.test.cjs
node tests/music.test.cjs
node tests/package.test.cjs
```

Les tests d’interface et les rendus demandent `@napi-rs/canvas` dans l’environnement Node, sans dépendance pour jouer. L’aperçu vidéo facultatif demande aussi FFmpeg. Lire [LISEZ_MOI.md](LISEZ_MOI.md) pour les instructions complètes et les limites de validation ; [VALIDATION.json](VALIDATION.json) consigne les vérifications de cette version. L’installation sur appareil, le rendu CSS en navigateur réel et la difficulté ressentie nécessitent encore une validation humaine.

Les illustrations sont originales et produites par le code Canvas. L’adaptation musicale de la comptine traditionnelle est documentée dans [MUSIQUE.md](MUSIQUE.md). Les références de conception des énigmes figurent dans [CARNET_ADAPTATION.md](CARNET_ADAPTATION.md).
