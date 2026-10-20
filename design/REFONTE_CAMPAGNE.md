# Les Cro Cro Cros — refonte de toute la campagne

> **Mise à jour — objectif 100 niveaux :** voir [CAMPAGNE_100_NIVEAUX.md](CAMPAGNE_100_NIVEAUX.md), qui remplace la cible et la progression à 37 niveaux ci-dessous. Le retour utilisateur sur les trois étalons 0.9.0 est négatif concernant leur profondeur : encore trop simples et sommaires. Leur faisabilité technique est acquise, leur qualité de référence n’est pas validée. Le nouveau dossier contient 100 intentions et cinq fiches développées, pas une campagne déjà reconstruite.

Statut au 20 octobre 2026 : premier jalon technique et trois niveaux étalons livrés dans l’atelier 0.9.0 (`?essai=refonte`). La reconstruction des 37 cartes décrite ci-dessous reste à réaliser après évaluation de ces étalons. La refonte concerne toute la campagne, y compris les premiers niveaux.

## Diagnostic vérifié sur la version publiée

Source examinée : commit `9e20ba93a34fb2b9286cddf0e38d04e12cade2e3`, notamment `content/author-campaign.cjs`, `content/handcrafted.cjs`, `content/elephant-chapter.cjs`, `src/engine.js`, `src/art.js` et `tests/solutions.json`.

- 12 cartes particulières, puis 25 assemblages de passages récurrents. La combinaison de modules déjà résolus explique la répétition ressentie en fin de jeu.
- Le moteur dessine un monde haut de 620 unités, avec un suivi horizontal. La chute hors du niveau est fixée à y > 740 ; plusieurs dessins supposent un sol à y = 520. Agrandir seulement les cartes ne donnera pas une vraie exploration verticale.
- Les cinq dernières solutions scriptées prennent respectivement environ 27, 38, 45, 47 et 51 secondes. Ce sont des parcours connaissant la solution, pas des temps de découverte humaine ; ils ne mesurent pas la difficulté ressentie.
- Les animaux sont présents dans 25 niveaux si l’on compte patrouilles, éléphants et zèbres. Leur présence ne suffit pas : les énigmes dépendent trop rarement de leurs comportements.
- Les tests actuels vérifient la faisabilité, les commandes, les sauvegardes et les régressions. Ils ne prouvent ni l’amusement, ni la qualité de la découverte, ni une difficulté progressive.

## Direction de conception

Une aventure de coopération et de plateforme pour un joueur : observer, formuler un plan, essayer, comprendre, coordonner, puis réunir les trois personnages. Des animaux expressifs et prévisibles participent aux problèmes et à leurs solutions.

La progression porte sur le nombre de décisions à anticiper, la variété des interactions et les changements de rôle. Les temps ci-dessous sont des cibles de première découverte, à mesurer avec des joueurs : début 2–4 minutes, milieu 5–10 minutes, fin 10–15 minutes, avec des étapes courtes de respiration entre les grandes énigmes. Le jeu n’impose pas de chronomètre.

Chaque niveau doit avoir une idée principale identifiable, une situation spatiale propre et au moins un moment de découverte ou un gag jouable. Les règles apprises reviennent dans des contextes qui en changent l’usage. Une succession de leviers/cibles avec seulement de nouvelles coordonnées n’est pas une nouvelle énigme.

## Chantiers nécessaires dans le moteur

1. **Monde vertical** : hauteur par niveau, caméra sur deux axes, zones de caméra lisibles et aperçu global ; limites de chute propres au niveau. Conserver l’affichage paysage et la visibilité des commandes tactiles.
2. **Objets qui interagissent** : charges transportables/poussables, contrepoids, plateformes mobiles, cordes, bascules, conduits et interrupteurs à usages explicites. Définir les interactions autorisées avant de multiplier les objets.
3. **Animaux acteurs** : perception par distance, ligne de vue et bruit ; états annoncés visuellement ; intérêt pour des appâts ou des objets. Un comportement peut gêner le joueur et fournir une solution.
4. **Coopération** : bouclier servant à protéger, porter, planer ou dévier ; saut et charge qui modifient les lieux ; tirs utiles sur l’environnement et pour distraire. Le rôle d’un personnage évolue au cours d’un même niveau.
5. **Lisibilité** : liens entre commandes et mécanismes, sons et animations de confirmation, prévisualisation d’un danger, mécanismes jamais cachés au départ. Les indices arrivent sur demande et progressent du principe à la solution.
6. **Récupération** : rembobinage, points de reprise sûrs, remise à zéro d’un sous-problème, sauvegarde des objets et animaux. Identifier les situations sans issue et fournir une récupération locale.
7. **Mesure locale des essais** : temps actif, essais, indices demandés, reprises, zones de blocage et bref avis facultatif. Stockage sur l’appareil et export volontaire ; aucun compte ni service réseau de télémétrie.

## Parcours de conception des 37 niveaux

Ces intentions seront ajustées après les premiers essais. La table décrit des situations à construire, pas des niveaux déjà jouables.

| N° | Situation principale | Décision, découverte ou interaction spécifique |
|---|---|---|
| 1 | Le départ du régiment | Petit parcours à deux hauteurs : choisir l’ordre des trois passages et découvrir le bouclier marchepied. Une courte farce de lionceau annonce les animaux. |
| 2 | Le fruit trop haut | Faire tomber un fruit, puis utiliser sa trajectoire pour activer un mécanisme ; le tir sert à transformer le décor. |
| 3 | Le lion joue à cache-cache | Attirer le lionceau vers une cachette, profiter de sa récupération et faire passer le croco resté en arrière. |
| 4 | Le bac et son passager | Deux étages, un bac mobile : préparer l’embarquement et rendre le bac au dernier personnage. |
| 5 | Le toit qui voyage | Traverser une pluie de noix de coco en formation ; observer la cadence du vautour et choisir les refuges. |
| 6 | La première échappée | Petite synthèse : détour supérieur pour un croco, trajet protégé pour les deux autres, puis ouverture d’un retour commun. |
| 7 | La crue des nénuphars | L’eau monte et descend de façon annoncée ; choisir où attendre et exploiter un objet flottant. |
| 8 | L’hippopotame éternue | Orienter l’éternuement pour déplacer un objet utile. Se protéger au bon endroit devient une action de résolution. |
| 9 | L’arbre creux | Salle verticale avec chemins intérieur/extérieur ; repérer un raccourci permettant au dernier opérateur de remonter. |
| 10 | La collation du zèbre | Déplacer un appât pour guider le zèbre vers une interaction du décor ; son étoile reste un défi facultatif. |
| 11 | Trois branches, un nid | Répartir les héros sur des hauteurs différentes, récupérer un objet puis l’acheminer vers celui qui peut l’utiliser. |
| 12 | Le marais en mouvement | Combiner courant, bac et éternuement ; préparer un passage sans abandonner le gardien d’une commande. |
| 13 | L’ombre de l’éléphant | Le géant réagit au bruit. Créer une diversion depuis un étage pour dégager la route d’un autre personnage. |
| 14 | La cloche au mauvais endroit | Comprendre le trajet d’un projectile et sa déviation par un élément du décor ; déplacer le protecteur pour modifier ce trajet. |
| 15 | Le poids des choses | Un contrepoids sert successivement à deux postes ; prévoir le débarquement d’un passager avant de déplacer la ressource. |
| 16 | Le piège du couloir | Le chemin évident active un mécanisme gênant. Un détour vertical permet de le traverser dans un autre état. |
| 17 | Les portes de la ronde | Deux animaux aux cycles distincts ; créer une fenêtre de passage en influençant l’un des deux, avec refuges accessibles. |
| 18 | La tour des messagers | Les trois crocos se transmettent un objet à travers trois étages ; chacun doit ensuite quitter son poste. |
| 19 | Le grand vol | Choisir un point de départ et une hauteur pour planer ; une erreur mène à une plateforme de récupération plutôt qu’au début du niveau. |
| 20 | Le temple se retourne | Une action transforme les accès déjà visités. Relire la salle pour organiser le trajet de retour. |
| 21 | Le moulin à deux circuits | Une même source alimente deux machines incompatibles ; préparer les passagers avant la commutation. |
| 22 | Un bruit peut en cacher un autre | Couvrir le bruit d’une action avec celui d’une machine pour éviter la réaction de l’éléphant. |
| 23 | Les caisses et le lionceau | Utiliser l’intérêt du lion pour un objet afin de déplacer un obstacle ou maintenir un passage ; rester capable de récupérer l’appât. |
| 24 | L’atelier des ricochets | Modifier une ligne de tir à deux endroits ; déplacer les crocos et les objets dans un ordre qui conserve les accès. |
| 25 | La cheminée du moulin | Grande ascension : plateformes, abris et itinéraires différenciés. La caméra permet de voir les zones d’arrivée avant un engagement. |
| 26 | Le vautour collectionneur | Le vautour déplace un objet convoité ; comprendre sa ronde, le distraire puis récupérer l’objet à un poste préparé. |
| 27 | Le pont basculant | Le poids des héros et d’un objet change la pente ; stabiliser le pont, libérer le stabilisateur et organiser le dernier passage. |
| 28 | La panne générale | Réutiliser un espace exploré sous une autre configuration ; plusieurs accès changent ensemble et une diversion reste nécessaire. |
| 29 | L’expédition séparée | Départs dans trois secteurs visibles sur le plan ; chacun doit créer une possibilité pour un autre avant de se retrouver. |
| 30 | Le porteur et le passeur | Le héros qui récupère un objet doit revenir à un poste éloigné. La traversée exige une relève, pas un simple aller groupé. |
| 31 | La cour des grandes oreilles | Deux éléphants réagissent différemment à une même action. Déduire l’ordre des diversions à partir d’indices visuels. |
| 32 | L’ascension des farceurs | Énigme verticale et animaux se combinent : les abris se déplacent, mais les dangers restent annoncés et les reprises proches. |
| 33 | Le contrepoids voyageur | Acheminer une ressource entre plusieurs étages, sans bloquer le trajet de celui qui peut la déplacer. |
| 34 | La ronde détournée | Transformer une patrouille animale en élément du mécanisme, puis la détourner à nouveau pour libérer le passage final. |
| 35 | L’expédition aller-retour | Choisir qui part, qui commande et qui pourra revenir ; le plané ouvre une route, mais ne résout pas l’évacuation des autres. |
| 36 | Le fort change de visage | Trois phases de configuration d’un même espace vertical ; les commandes et les animaux changent de fonction selon la phase. |
| 37 | Personne ne reste derrière | Expédition vers un objectif éloigné, relèves de postes et transformation du trajet de retour. Le dernier opérateur doit être libéré par un plan préparé avant le départ. |

## Ordre de réalisation et validation

### Premier jalon : étalon de qualité

Construire trois niveaux représentatifs de toute la campagne : un début amusant, un milieu vertical utilisant un animal et une fin exigeant anticipation et retour. Ils servent à valider le moteur enrichi, la lecture des situations et la difficulté avant d’étendre la refonte aux 37 niveaux. Les cinq cartes expérimentales commencées après le premier retour ne constituent pas cet étalon : elles restent trop centrées sur les circuits, les leviers et les dalles.

### Deuxième jalon : campagne complète

Reprendre chaque niveau selon la table, par chapitres. Écrire d’abord le problème, les interactions et la logique de solution, puis la géométrie. Un niveau doit changer une décision du joueur ; un changement de décoration ne satisfait pas ce critère.

### Contrôles techniques

- Solution par commandes normales et trois étoiles atteignables.
- Vérification des faux raccourcis qui rendent les interactions centrales inutiles.
- Exploration des erreurs probables : mauvais ordre, objet déplacé, personnage laissé derrière, chute et reprise.
- Sauvegarde/rechargement pendant les mécanismes et réactions animales.
- Lisibilité des départs et arrivées, traversées au tactile, caméra verticale et paysage iPhone.
- Migration : conserver niveaux terminés et étoiles. Les tentatives d’une carte entièrement reconstruite nécessitent une reprise sûre annoncée au joueur.

### Contrôles d’expérience

Les observations humaines doivent distinguer : « je comprends et j’exécute », « je cherche une idée », « je ne comprends pas ce que le jeu me montre », « je sais quoi faire mais les commandes m’empêchent ». Seule la deuxième situation produit la difficulté de réflexion recherchée ; l’exécution peut apporter une tension modérée et prévisible.

Un test automatique qui gagne n’est pas une validation d’amusement. Le retour utilisateur sur les trois niveaux étalons doit déterminer les réglages avant la production des chapitres suivants.

## Besoins côté utilisateur

Les contraintes, références, personnages et objectifs fournis suffisent pour commencer. Aucun outil, abonnement, compte ou ressource graphique supplémentaire n’est requis pour cette refonte de conception. Les retours de parties constituent l’apport le plus utile : moment de déclic, temps passé à chercher, énigme trop évidente, répétition, difficulté de commande et moment amusant. Un enregistrement facultatif de quelques minutes aide à observer les hésitations sans demander au joueur de concevoir lui-même les niveaux.


## Premier jalon 0.9.0 réalisé

- Niveaux étalons : Le départ par les toits (hauteur 1 000), Le moulin enrhumé (1 500), Le fort des trois relais (2 200).
- Caméra verticale, plan complet, indicateurs des héros sur les deux axes et objectifs visibles.
- Récepteurs de noix et chariot à vent ; animaux indispensables temporairement étourdis plutôt que supprimés.
- Sauvegarde séparée et avis de difficulté exportable localement.
- Trois solutions par les commandes normales, avec trois étoiles et aucun rebond, reprises de sauvegardes et régressions de l’ancienne campagne vérifiées.
- Les parcours scriptés connaissent la solution et durent environ 28, 53 et 75 secondes : ces durées ne prédisent pas le temps de découverte. Validation humaine de l’amusement et de la difficulté encore attendue.
