# Ajouter des énigmes sans casser la progression

## Organisation

`content/campaign.json` contient `version`, `heroes` et `levels`. Ajouter les niveaux en fin de liste conserve l’ordre de déblocage. Chaque niveau doit recevoir un `id` inédit et permanent, par exemple `desert-01`. Ne pas renommer les identifiants des niveaux déjà distribués ; les sauvegardes les utilisent. Ajouter 163 niveaux à la campagne de 37 ne demande pas de réécrire le moteur ou les sauvegardes.

Les cartes de cette édition font entre 960 et 2700 unités de large. Les gabarits actuels sont assemblés explicitement dans content/author-campaign.cjs ; exécuter ce script remplace campaign.json. Modifier le script pour conserver durablement un changement généré. Le plan de jeu utilise des coordonnées absolues : x vers la droite, y vers le bas. Le sol des niveaux actuels est à y=520. La coordonnée `y` d’un personnage correspond à ses pieds.

## Champs d’un niveau

| Champ | Rôle |
| --- | --- |
| `id` | Identifiant stable, unique dans la campagne |
| `name`, `chapter`, `subtitle` | Textes de présentation |
| `intro`, `briefing` | Dialogue humoristique et objectif |
| `theme` | `morning`, `forest`, `temple`, `factory`, `fair`, `fort` (et ancien `sunset`) |
| `width` | Largeur du monde |
| `spawns` | Exactement 3 positions `{x,y}`, dans l’ordre des héros |
| `platforms` | Sols et plateformes `{x,y,w,h}` |
| `bridges` | Plateformes conditionnelles `{id,x,y,w,h,requires:[...]}` |
| `gates` | Obstacles solides tant que toutes leurs conditions ne sont pas actives |
| `switches` | Leviers `{id,x,y,label,toggle?:true}` ; `toggle` rend le levier réversible ; action à moins de 65 unités |
| `targets` | Cibles persistantes activées par le tir `{id,x,y,label,requires?:[...],hitDirection?:-1 ou 1}` |
| `plates` | Dalles `{id,x,y,w,hero?:0 ou 1 ou 2,label?:texte,latchWhen?:[...]}` actives si un héros est dessus ; `latchWhen` permet de maintenir le passage une fois une autre action réussie |
| `crates` | Obstacles `{id,x,y,w,h}` destructibles par la charge de Croquinet |
| `turrets` | Fleurs `{id,x,y,dir,off,period}` ; `off` référence une cible/condition qui les désactive |
| `exit` | Zone d’arrivée `{x,y,w}` ; doit pouvoir accueillir les 3 héros |
| `checkpoint` | Point de ralliement `{x,y}` ; activé quand les 3 sont passés et posés au sol |
| `stars` | Exactement 3 bonus `{id,x,y}` |
| `hints` | Indices du plus discret au plus explicite |
| `pads` | Fleurs indicatrices au sol `{x,y}`, utiles pour les marchepieds |
| `signs` | Panneaux décoratifs `{x,y,text}` |

Les listes absentes doivent être présentes sous la forme `[]`. Les conditions d’une porte ou d’un pont référencent les identifiants de leviers, cibles ou dalles du même niveau. `hero` réserve une dalle à un personnage. `hitDirection` indique le sens de déplacement du projectile accepté (−1 : tir vers la gauche, depuis la droite). `requires` peut aussi verrouiller une cible. `requires` est un ET logique : toutes les conditions doivent être remplies. `latchWhen` est un OU logique.

## Enveloppe de déplacement

- Croquinet : 335 unités/s ; impulsion verticale −640 ; gravité 1500 unités/s². Hauteur théorique de saut : environ 136 unités, avant les tolérances de collision.
- Croquefort : 250 unités/s ; bouclier horizontal de 96 unités, à 87 unités au-dessus des pieds. La hauteur réelle du personnage atterrit sur y=pieds−87. Descente au bouclier limitée à 105 unités/s.
- Croqueboum : 285 unités/s ; tir à 620 unités/s, durée de vie 1,5 s ; départ du projectile à y=pieds−38.
- Charge : 560 unités/s pendant 0,35 s ; elle ne traverse pas les murs ordinaires.
- Les héros peuvent se croiser. Seul le bouclier horizontal sert de plateforme à un autre héros.

Pour une coopération obligatoire : une plateforme à 180 unités au-dessus du sol est inaccessible par un saut seul, mais accessible avec le bouclier intermédiaire. Les niveaux de référence illustrent des placements réellement testés.

## Méthode de création

1. Choisir une seule idée d’énigme, puis ses variantes.
2. Dupliquer un niveau proche dans `content/campaign.json`, attribuer un nouvel identifiant et ajuster ses données.
3. Prévoir une solution complète permettant aux trois personnages d’atteindre la sortie.
4. Éviter les leviers indispensables devenus inaccessibles, les dalles qui emprisonnent celui qui les tient et les sauts exigeant une précision au pixel. Utiliser un verrouillage persistant `latchWhen` après les séquences de tir coopératives.
5. Placer le ralliement dans une zone stable et suffisamment large pour les trois positions de réapparition (x−65, x, x+65).
6. Prévoir trois étoiles facultatives. Ne pas bloquer la campagne derrière leur collecte.
7. Ajouter des tests de solution, puis tester humainement sur petit écran.
8. Exécuter `python3 build.py`, publier seulement la nouvelle version de `dist/` quand elle est validée. L’identifiant du cache PWA change automatiquement avec le contenu.

Le moteur reste volontairement petit. De nouveaux mécanismes — transport d’objets, eau mobile, ennemis mobiles, etc. — demanderaient de nouveaux types de données et du code testé. La capacité de 200 énigmes signifie une architecture extensible, pas 200 énigmes déjà écrites ou une garantie automatique de leur qualité.

Chaque niveau possède une `revision`. L’incrémenter lors d’une refonte incompatible de sa géométrie. La sauvegarde conserve ses validations et ses étoiles, mais la tentative courante redémarre sur la géométrie nouvelle avec une notification.

## Mécanismes ajoutés en v0.3

| Donnée | Format et comportement |
| --- | --- |
| `keys` | `{id,x,y,hero?}` ; collecte automatique avec le bon héros à moins de 40 unités du centre du corps. Drapeau partagé permanent. |
| `ladders` | `{x,y,h}` ; `y` est le sommet. ↑ / ↓ à moins de 27 unités de x ; vitesse 210. Les terrasses accessibles utilisent `oneway:true`. |
| `lifts` | `{id,x,y,w,h,toY,speed,requires}` ; y initial et destination toY. Transporte les personnages posés dessus, y compris ceux non sélectionnés. Position sérialisée. |
| `portals` | `{id,x,y,toX,toY,requires?}` ; Espace à proximité. Départ et arrivée doivent offrir un support stable. |
| `springs` | `{x,y,w,requires?}` ; impulsion automatique −850 dès l’appui. Accessible aux trois héros. |
| `conveyors` | `{x,y,w,speed}` ; ajoute la vitesse du tapis aux personnages posés, même non sélectionnés. |
| `requiresOff` | Liste de drapeaux devant être faux. Se combine par ET avec `requires`. |
| `latchWhen` | Pour une porte/pont/ascenseur : un drapeau de cette liste vrai suffit à verrouiller l’ouverture. Pour une dalle : conserve son signal après cette action. |
| `crates.requires` | Une caisse protégée ne peut être cassée que si ses conditions sont remplies. Son id devient ensuite utilisable comme condition. |
| `turrets.awakeX` | Les tirs ne commencent que lorsqu’un personnage atteint ce x, pour éviter les tirs avant l’entrée dans le passage. |

Le carnet des solutions (`CARNET_ADAPTATION.md`) est généré en même temps que les cartes. Les recettes de test sont dans `tests/recipes.json`. Les tests produisent `tests/solution-report.json` ; `WRITE_ROUTES=1 node tests/engine.test.js` enregistre aussi chaque commande dans `tests/solutions.json`.

Les séquences de commande et le rapport sont des vérifications techniques, pas une mesure du temps de résolution d’un joueur découvrant l’énigme. Une géométrie nouvelle doit être vérifiée physiquement ; changer uniquement le nom d’une recette ne crée pas un nouveau problème.

## Cartes spécifiques et contrepoids — v0.4

`content/handcrafted.cjs` remplace les six premiers niveaux après l’assemblage de la campagne. Chaque carte comporte `handcrafted:true`, une géométrie spécifique, des indices, un résumé de victoire et une révision propre. Les solutions sont jouées par `tests/opening-solutions.cjs` avec les mêmes contrôles que le joueur.

`blocks` est une liste de contrepoids `{id,x,y,w,h,minX,maxX}`. Ils restent à une hauteur fixe sur un rail ; seuls les contacts horizontaux de Croquefort les déplacent. Ils ne sont pas des caisses destructibles. Une dalle avec `acceptBlock:true` accepte un contrepoids dont le centre se trouve dans sa largeur et dont le bas est posé à sa hauteur. Le champ `hero` continue de limiter les personnages pouvant l’activer directement.

Prévoir une façon de contourner le contrepoids après l’avoir placé, et un rail dont les extrémités n’emprisonnent jamais le joueur. `snapshot.blocks` conserve la coordonnée x de chaque objet et valide les bornes lors de l’import. Les anciennes cartes sans contrepoids ne nécessitent pas de migration de leur état.

Le texte `victory` résume la coopération accomplie. Il ne doit pas donner la solution avant la réussite. `difficulty` est un intitulé pédagogique, pas une note mesurée.


## Ajouts v0.5

`enemies` : identifiant, espèce (`hippo`, `lion`, `vulture`), position initiale x/y (y = pieds), minX/maxX, vitesse et direction ±1. Un animal endormi active son identifiant comme condition de mécanisme. Un vautour oscille verticalement ; les autres restent à la hauteur fixée. Les bornes doivent reposer sur une zone praticable sans portes ou trous. L’ennemi doit être neutralisable avant une collision inévitable.

`elephants` : x/y, radius de réaction, requires/latchWhen et, pour le portage, identifiant `lift`. Une porte de type `elephant:true` garde ses collisions habituelles mais s’affiche comme la trompe correspondante. Un ascenseur du même type s’affiche comme une selle portée par la trompe. Tester leur alignement visuel et la libération de celui qui les commande.

`exit.requires` permet une sortie initialement scellée. `scenery` choisit parmi harbour/canopy/falls/mill/ruins/moon/savannah/fair/fort. `zebra` associe une position au sol à l’identifiant d’une étoile facultative. `questReward` indique le morceau de bannière donné à la réussite ; les étapes de récompense sont définies dans quest.milestones.

Les états ennemis et l’accroche aux échelles sont sauvegardés. Toute modification de géométrie ou d’ennemis d’une carte doit augmenter sa révision pour préserver les anciennes victoires tout en réinitialisant la tentative devenue incompatible.


## Lisibilité des départs (0.8.2)

La silhouette dessinée dépasse largement le corps utilisé pour les collisions : réserver environ 65 unités de chaque côté et 110 au-dessus des pieds. Le générateur `content/clear-starts.cjs` détecte les leviers, dalles, échelles, arches, cibles et clés masqués ; il ajoute si nécessaire une zone de départ de 160 unités en translatant ensemble tous les éléments de l’énigme. Le test `tests/start-visibility.test.cjs` vérifie les 37 départs et leur stabilité sans commande.

Pour les cartes livrées en révision 7, la révision 8 et `startOffset` permettent une migration par translation des sauvegardes. Ne réutiliser cette migration que pour une translation pure ; une refonte de géométrie exige une nouvelle révision et une stratégie de sauvegarde adaptée.
