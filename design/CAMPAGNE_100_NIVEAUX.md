# Les Cro Cro Cros — conception d’une campagne de 100 niveaux

Date : 20 octobre 2026. Statut : **dossier de conception initial. Une campagne jouable de 100 cartes portant ces noms est désormais implémentée en version 1.0.0 ; les détails ci-dessous restent des intentions, certaines adaptées au moteur. Voir LIVRAISON_100_NIVEAUX.md pour le périmètre réel et les validations.**

Ce document étend l’objectif de campagne de 37 à 100 niveaux. Il remplace la cible quantitative et la progression envisagées dans REFONTE_CAMPAGNE.md, qui reste l’historique du diagnostic et de l’atelier 0.9.0. Le retour utilisateur sur cet atelier est désormais connu : encore trop simple et sommaire. Sa réalisation technique ne constitue donc pas un étalon de qualité validé.

## Intention

Une aventure de plateforme et de réflexion en solo, avec trois crocos complémentaires, des animaux malicieux et une difficulté croissante. Chaque grande énigme doit poser une question spatiale ou causale : qui peut atteindre cet endroit, avec quel objet, dans quel état du décor, et comment récupérer ensuite les autres ?

La quête proposée : rejoindre le grand rassemblement des animaux en remettant en service les passages d’une vallée. Les éléphants intimident les crocos au début ; apprendre à comprendre leurs réactions permet progressivement de coopérer avec eux. La finale rassemble les animaux rencontrés. C’est une proposition narrative, pas une modification déjà présente dans le jeu.

Le rire doit provenir d’une action jouable : un lion rate son bond et s’assoit dans un seau ; un hippopotame éternue dans son propre linge ; un vautour constate que sa noix a servi d’ascenseur aux crocos. Ces scènes restent brèves, réactives et ne bloquent pas les commandes.

## Références consultées et transposition

Les résumés suivants décrivent les sources. Le catalogue et les énigmes qui suivent sont nos propositions originales, non des niveaux tirés de ces jeux. Les guides Thonky sont des sources secondaires pour les solutions ; les sites des studios et Nintendo sont des sources primaires pour les principes annoncés.

| Code | Référence précise | Observation sourcée | Principe retenu |
|---|---|---|---|
| R1 | [The Lost Vikings, monde 4 niveau 3](https://www.thonky.com/the-lost-vikings/world-4-level-3) | Olaf protège un passage ; Baleog récupère de nouvelles flèches et revient neutraliser l’obstacle. | Un partenaire aidé revient libérer celui qui l’a aidé. |
| R2 | [The Lost Vikings, monde 4 niveau 4](https://www.thonky.com/the-lost-vikings/world-4-level-4) | Le parcours combine plateformes friables, tir depuis un ascenseur et descente en plané. | Trois itinéraires différents modifient les possibilités des autres. |
| R3 | [The Lost Vikings, monde 4 niveau 8](https://www.thonky.com/the-lost-vikings/world-4-level-8) | Une machine sert d’abord, puis doit être détruite ; tirer sur une chaîne libère une charge. | L’utilité d’un équipement change au cours de l’expédition. |
| R4 | [The Lost Vikings, monde 5 niveau 5](https://www.thonky.com/the-lost-vikings/world-5-level-5) | Des clés sont collectées séparément et transmises ; le bouclier sert aussi de support. | La possession et le transport comptent autant que la découverte. |
| R5 | [Toki Tori 2+, site officiel](https://tokitori2.com/) et [Two Tribes, principes de conception](https://blog.playstation.com/?p=167869) | Observer les créatures et influencer leurs comportements avec un petit nombre d’actions produit des puzzles complexes. | Peu de règles, des effets cohérents et des combinaisons à découvrir. |
| R6 | [Trine 2, Frozenbyte](https://www.frozenbyte.com/games/trine-2/) | Puzzles physiques mobilisant notamment l’eau et la gravité, avec trois héros. | Causes physiques visibles, espaces verticaux, interactions du décor. |
| R7 | [Captain Toad: Treasure Tracker, Nintendo](https://www.nintendo.com/us/store/products/captain-toad-treasure-tracker-switch/) | Exploration de niveaux à obstacles, secrets et points de vue différents. | Donner une identité spatiale à chaque lieu et des objectifs secondaires de découverte. Aucune caméra 3D n’est proposée pour les crocos. |
| R8 | [Baba Is You, Hempuli](https://hempuli.com/baba/) | Les règles représentées dans les niveaux peuvent être modifiées. | Retenir le changement de fonction comme déclencheur de découverte, sans importer le système de mots ni changer arbitrairement les règles du jeu. |

## Progression et dimensions

Les minutes sont des objectifs de première découverte humaine, sans indice, et non des durées mesurées ou des promesses. Le nombre de salles mesure des zones jouables reliées, pas une obligation de remplir un rectangle. Une salle correspond approximativement à une vue de jeu au zoom normal, hors interface.

| Niveaux | Expérience dominante | Taille indicative | Durée cible |
|---|---|---|---|
| 1–10 | Prise en main, une idée à la fois, premières entraides | 1–3 salles, 1–2 étages | 1–4 min |
| 11–20 | Observer et exploiter les réactions animales | 2–4 salles, 2–3 étages | 3–6 min |
| 21–40 | Préparer un retour, transmettre, choisir un itinéraire | 3–6 salles, 2–4 étages | 5–10 min |
| 41–60 | Ressources partagées, configurations incompatibles | 4–8 salles, 3–5 étages | 7–15 min |
| 61–80 | Plans en plusieurs phases et conséquences différées | 5–10 salles, 3–6 étages | 10–20 min |
| 81–100 | Synthèses exigeantes et évacuations préparées | 6–12 salles, 4–6 étages | 12–25 min |

Des respirations plus courtes restent présentes jusqu’à la fin. Une grande carte peut être facile ; une salle compacte peut demander une excellente idée. Ne jamais réduire les personnages à des points pour montrer toute la carte. Le plan général sert à réfléchir ; la caméra de jeu garde une échelle lisible sur iPhone.

Répartition de rythme proposée sur 100 niveaux : 20 apprentissages ou respirations, 50 énigmes de combinaison, 20 grandes expéditions et 10 finales de chapitre. Les dix chapitres ci-dessous donnent des identités de lieux, pas dix copies d’une même courbe. Le dosage définitif dépendra des essais.

## Règles de construction

- Dès que les capacités de base sont connues, chaque niveau principal doit contenir une découverte qui modifie le plan du joueur. Ajouter un troisième levier ne suffit pas.
- Apprendre une règle en sécurité ; la combiner ; la réutiliser dans une fonction inattendue. Exemple : arrêter une noix, l’envoyer dans un panier, puis décider de ne plus l’arrêter pour charger un contrepoids.
- Montrer l’effet des commandes par des câbles, rails, canaux, mouvements ou vues ponctuelles. Ne pas afficher les emplacements de solution « W ici / X ici ».
- Les trois héros restent contrôlés successivement. Aucun passage ne doit exiger de déplacer deux personnages simultanément à la main. Les poses de protection persistent ; mécanismes à cliquet, commandes mémorisées et refuges rendent la coordination possible.
- Plusieurs solutions sont bienvenues si elles respectent les règles et demandent une vraie décision. Les raccourcis à corriger sont ceux qui annulent gratuitement l’idée centrale, pas toute créativité du joueur.
- Les étoiles restent facultatives. Leur obtention peut proposer un défi expert local sans bloquer la campagne. Aucun quota d’étoiles ne doit transformer les zèbres en corvée obligatoire.
- Les changements d’état doivent être réversibles, ou précédés d’un point de reprise complet. Un objet essentiel perdu revient dans un réceptacle identifiable. Une simple réapparition d’un héros ne doit pas permettre de téléporter une ressource et court-circuiter l’énigme.
- Le temps de trajet seul n’est pas de la difficulté. Un retour long doit modifier une relation, découvrir un chemin ou profiter d’un raccourci débloqué.
- Pas d’ennemi qui attaque hors champ sans signal. Pas de chronomètre global par défaut. Les séquences rythmées sont courtes, annoncées et reprises localement.
- Réutiliser les règles, varier les problèmes : ni génération automatique par assemblage de couloirs, ni série de cent configurations identiques d’interrupteurs.

## Systèmes à développer ou renforcer

Lecture ciblée du snapshot local 0.9.0 : src/engine.js, src/wildlife.js, src/art.js et design/REFONTE_CAMPAGNE.md. Ce repérage n’est pas un audit exhaustif du dépôt distant.

| Famille | Éléments déjà visibles dans le code examiné | Extension nécessaire pour le catalogue |
|---|---|---|
| Coopération | Saut/charge, tir, protection, plané, bouclier support de collision | Transport fiable d’un passager sur support mobile ; transferts d’objets physiques ; présentation claire de l’objet porté |
| Objets | Caisses cassables, blocs sur rails | Objets récupérables, propriétaires, dépôt, passage par guichet, plateaux et poches de récupération |
| Animaux | Patrouille, préparation, attaque, récupération ; noix, souffle et onde | Perception et ciblage stables, bruit occulté par paroi, appâts durables, transport d’objets par vautour, réactions croisées |
| Machines | Leviers, portes, plateformes, monte-charges, récepteurs | Cales amovibles, rails et aiguillages, contrepoids conservant une charge, freins et changement de fonction |
| Eau et vent | Souffle d’hippopotame poussant certains chariots | Bassins à niveaux discrets, courant et flotteurs guidés, volets de ventilation. Une simulation générale de fluides n’est pas nécessaire |
| Espace | Hauteur de carte et suivi vertical de l’atelier | Boucles fiables, zones de caméra, aperçu des atterrissages, refuges et raccourcis |
| Reprise | Historique, sauvegardes et état animal | Sauvegarde de chaque nouveau système, annulation atomique d’une transformation, points de reprise de sous-énigme |
| Dessin | Animations et dessin Canvas existants | Trompe à contour fermé, base large et pointe amincie ; poses de repos, alerte et saisie cohérentes avec les collisions |

Priorités de dépendance : coopération et objets → machines et récupération → perception animale → eau/vent contrôlés → combinaisons avancées. L’introduction d’une famille se fait d’abord dans une scène courte, puis dans une énigme ; on ne produit pas cinquante niveaux autour d’un comportement encore instable.

## Bestiaire : même règle, plusieurs fonctions

| Animal | Règle lisible proposée | Gêne | Usage dans une solution | Expression et contrepartie |
|---|---|---|---|---|
| Éléphant | Se tourne vers un bruit localisé, annonce son appui lourd ; sa masse agit sur certains plateaux | Bloque, projette une onde, fait vibrer les supports | Contrepoids, déplacement d’une charge, ouverture d’un accès par vibration | Oreilles levées puis pied en l’air ; se couvre les oreilles devant une cloche |
| Hippopotame | Inspire, puis souffle dans une direction verrouillée après préparation | Repousse personnages et objets exposés | Pousse chariot, gonfle voile, déplace une noix | Joues gonflées, yeux fermés, mouchoir qui s’envole |
| Lionceau | Suit un jouet visible ; prépare un bond vers le dernier point repéré | Coupe un passage, embarque un objet accessible | Déclenche un plateau, déplace un jouet, emprunte un détour | Queue qui frétille, bond trop fier, réception ridicule et reprise lente |
| Vautour | Transporte un objet admissible vers un nid ; lâche une noix après une visée annoncée | Bombarde ou détourne un petit colis | Livre un objet inaccessible aux crocos, charge un panier | Sourire avant le lâcher, air vexé si la noix profite au joueur |
| Zèbre | Curieux ou gourmand selon un indice visuel stable | Détour bonus, compétition amicale | Fait découvrir un itinéraire facultatif, garde un tempo visible | S’arrête pour regarder en arrière, mâchonne ; jamais une capture imposée à chaque arrivée |

Tous ces usages sont des propositions à prototyper. Les exceptions à une règle doivent être perceptibles dans l’objet : panier ajouré, butée, pente, poids indiqué par une animation. Éviter les permissions arbitraires par couleur de héros.

## Catalogue des 100 intentions

D = difficulté de réflexion visée de 1 à 10 ; ce n’est pas une mesure validée. Les baisses ponctuelles sont volontaires. Les descriptions donnent l’idée déterminante, pas une géométrie terminée ni une solution certifiée. Les références associées à chaque chapitre désignent des principes, pas l’origine littérale de chaque idée.

### 1. Le village du départ — niveaux 1 à 10

Pilotis, petits toits, linge, école et verger. Apprendre les trois rôles avec des objectifs immédiats. Principes R1, R2, R5.

| N° | Titre | Forme / D | Idée déterminante et situation amusante |
|---|---|---|---|
| 01 | Trois crocos à l’appel | Cour / 1 | Rejoindre les camarades sur trois petits paliers accessibles ; découvrir la sélection et le déplacement. Les crocos se saluent et le dernier arrive en faisant semblant d’être ponctuel. Aucun danger. |
| 02 | Le melon perché | Verger à deux hauteurs / 1 | Croquinet rejoint la branche et libère l’échelle commune ; le melon roule à portée des autres. Premier détour utile, avec filet de récupération sous la branche. |
| 03 | Le panier coincé | Grange / 1 | Croqueboum vise le loquet derrière une ouverture trop petite pour passer. Le panier tombe dans du foin et révèle la sortie. L’angle de tir, pas une serrure colorée, explique son rôle. |
| 04 | Un toit pour trois | Passage couvert / 2 | Garder le bouclier levé pendant que les partenaires traversent une courte chute de noix. Un auvent permanent permet ensuite au protecteur de rejoindre les autres. Le vautour en fait tomber une sur sa propre tête. |
| 05 | Le coup de pouce | Cour et balcon / 2 | Le bouclier sert de marchepied à l’éclaireur, qui déploie un escalier pour tout le monde. Découvrir qu’un équipement défensif peut créer un chemin. |
| 06 | Le petit lion fait le fier | Petite boucle / 2 | Observer l’accroupissement du lion, provoquer son bond depuis un refuge et passer pendant qu’il se remet. Le retour de patrouille est visible ; aucune poursuite interminable. |
| 07 | La planche qu’il faut garder | Deux rives / 2 | Une planche cassable gêne une étoile, mais sert encore au passage de l’équipe. Finir le trajet principal avant de décider comment récupérer le bonus. Première conséquence d’une destruction. |
| 08 | Le zèbre curieux | Clairière / 1 | Respiration : le zèbre s’approche si le croco cesse de le poursuivre. L’étoile est facultative ; le joueur peut aussi observer les mimiques sans arrêter sa progression. |
| 09 | Le passeur oublié | Petit bac / 3 | Faire passer deux crocos, ramener le bac vide, puis utiliser une corde de rappel depuis l’autre rive pour récupérer le dernier. L’arrivée des premiers ne résout pas celle du passeur. |
| 10 | Le goûter sur les toits | Boucle de trois salles / 3 | Monter par le verger, libérer une échelle au tir, utiliser le bouclier sous le nid et ouvrir un retour court au protecteur. Petite synthèse sans mécanique nouvelle, avec goûter final chahuté par le lion. |

### 2. Le marais des éternuements — niveaux 11 à 20

Roseaux, pontons, radeaux, paniers et linge qui sèche. Observer avant d’agir. Principes R5, R6.

| N° | Titre | Forme / D | Idée déterminante et situation amusante |
|---|---|---|---|
| 11 | À vos souhaits ! | Berge et rail / 2 | Attirer le regard de l’hippopotame, sortir de l’axe, puis laisser son souffle pousser un chariot vers une butée utile. La préparation de l’animal montre quand sa direction se verrouille. |
| 12 | Le souffle de trop | Rail à trois arrêts / 3 | Le premier éternuement aligne la passerelle ; le second la décale. Installer une cale récupérable avant de provoquer le souffle. L’hippo croit avoir réussi et applaudit trop tôt. |
| 13 | La noix qui rend service | Puits et panier / 3 | Se placer pour que le vautour vise au-dessus d’un panier, puis s’abriter. La noix charge un petit monte-charge. Une noix ratée tombe dans un bac accessible. |
| 14 | Séchage express | Deux berges / 2 | Respiration : orienter une voile de radeau vers l’hippo pour traverser. Le linge se gonfle comiquement ; une corde ramène le radeau si le départ a lieu sans passager. |
| 15 | Le bon côté du museau | Boucle autour d’un îlot / 3 | Un appât derrière une palissade ne se voit pas. Faire le détour pour attirer le lion, puis franchir la passerelle qu’il surveillait. Apprendre que les parois coupent la perception. |
| 16 | Un panier, deux emplois | Puits à deux niveaux / 4 | Utiliser le panier lesté pour monter, puis le vider depuis le haut pour libérer l’itinéraire inférieur. Transporter la noix vers une poche de récupération, au lieu de la perdre. |
| 17 | Le bouclier de travers | Galerie et gouttière / 3 | Dévier une noix vers une gouttière plutôt que l’arrêter. Deux orientations fixes du déflecteur rendent la trajectoire lisible et évitent un réglage au pixel. |
| 18 | Le lion sous le pont | Pont et soubassement / 4 | Lancer le jouet dans un passage bas pour déplacer le lion ; utiliser ensuite ce même passage pour récupérer le jouet sans ramener immédiatement l’animal sur le pont. |
| 19 | Le détour des nénuphars | Bassin en boucle / 3 | Une étoile visible depuis le départ s’atteint en faisant le tour et en ouvrant un raccourci. Les nénuphars donnent une lecture de profondeur ; le chemin obligatoire reste court. |
| 20 | Le pique-nique flottant | Trois salles reliées / 4 | Une noix charge le panier qui libère la cale du radeau ; l’hippo pousse le radeau ; le tireur rend ensuite la voie au dernier croco. Préparer les passagers avant de retirer la cale. |

### 3. La canopée des messagers — niveaux 21 à 30

Arbres creux, passerelles suspendues et nids. Transporter et transmettre. Principes R2, R4, R7.

| N° | Titre | Forme / D | Idée déterminante et situation amusante |
|---|---|---|---|
| 21 | Le guichet des feuilles | Deux salles séparées / 3 | Croquinet récupère une manivelle par le haut et la passe à Croqueboum par une fente. Le détenteur de l’objet compte ; sa collecte ne déverrouille rien à distance. |
| 22 | Livraison au mauvais nid | Arbre à embranchements / 4 | Le vautour emporte un colis vers le nid disponible. Occuper le mauvais réceptacle avec une noix pour obtenir la bonne livraison ; le vautour vérifie son adresse en penchant la tête. |
| 23 | La descente sans échelle | Puits latéral / 4 | Transmettre la manivelle au protecteur avant son plané, puis l’utiliser en bas pour ouvrir un retour aux partenaires. Une nacelle permet de récupérer un objet oublié sans recommencer le niveau. |
| 24 | Le grand huit des branches | Boucle verticale / 4 | Atteindre d’abord le sommet pour déployer deux échelles ; descendre par un autre versant et comprendre que le raccourci dessert aussi le croco resté au pied de l’arbre. |
| 25 | L’ascenseur trop chargé | Arbre et contrepoids / 5 | Un panier ne monte qu’après retrait du colis, mais le colis est nécessaire au sommet. L’envoyer séparément par la goulotte ; faire voyager personnes et objet par des voies différentes. |
| 26 | Les jumelles du vautour | Deux nids visibles / 3 | Défi court d’observation : deux oiseaux portent des objets différents. Suivre visuellement le bon colis jusqu’à son réceptacle, sans choix aléatoire ni combinaison secrète à mémoriser. |
| 27 | Le marchepied voyageur | Galerie étagée / 5 | Croquefort déplace Croqueboum sur son bouclier jusqu’à une corniche ; celui-ci libère un pont pour le protecteur. Les arrêts intermédiaires sont sûrs pour changer de personnage. |
| 28 | L’échelle dans le colis | Tour et balcon extérieur / 5 | L’échelle repliée ne passe pas par la petite trappe. La déposer dans la nacelle, rejoindre le balcon autrement puis la déployer pour le reste de l’équipe. |
| 29 | Le facteur et le gardien | Deux branches croisées / 5 | L’éclaireur ouvre un raccourci au tireur ; ce dernier récupère un leurre et revient détourner le vautour qui immobilise le protecteur. Entraide avec inversion des rôles. |
| 30 | Le nid des trois routes | Quatre salles verticales / 6 | Trois voies se croisent sans permettre le passage des mêmes charges. Faire circuler un colis, une cale et les trois héros ; terminer par la libération du poste central, pas par trois sorties indépendantes. |

### 4. Le canyon des grandes oreilles — niveaux 31 à 40

Falaises ocre, carrières, ponts de corde et cloches. Transformer un danger en outil. Principes R1, R3, R5.

| N° | Titre | Forme / D | Idée déterminante et situation amusante |
|---|---|---|---|
| 31 | Qui a fait ce bruit ? | Cour et galerie haute / 4 | Tirer sur une cloche latérale pour orienter l’éléphant loin du passage. Oreilles et regard indiquent sa cible ; la diversion est préparée depuis une zone protégée. |
| 32 | Le pied sur la bonne dalle | Terrasse et balcon / 5 | Amener l’éléphant sur un plateau porteur, puis provoquer son appui lourd pour soulever une plateforme éloignée. Le plateau révèle visuellement la transmission du mouvement. |
| 33 | Une sieste très sonore | Canyon à refuges / 4 | Une roue bruyante masque les pas devant l’éléphant ; s’arrêter dans les niches quand elle ralentit. La pulsation est visible à l’écran pour jouer sans son. |
| 34 | La cloche à emporter | Deux cours reliées / 5 | Une seule cloche portative sert à attirer l’éléphant, puis à le rappeler après le passage des premiers crocos. La laisser au mauvais étage oblige à organiser sa récupération. |
| 35 | Celui qui tient le passage | Galerie en boucle / 6 | Le protecteur bloque une attaque ; le tireur passe récupérer le leurre, revient par le balcon et détourne l’animal. L’éclaireur déploie le raccourci qui rend ce retour possible. |
| 36 | Une étoile sous la casquette | Petite place / 4 | Respiration facultative autour du zèbre : le laisser suivre un ruban qui traverse un porche, puis récupérer l’étoile déposée près du banc. Pas de poursuite ni de capture en tenaille. |
| 37 | Le pont qui penche | Ravin et deux appuis / 6 | Le poids de l’éléphant incline le pont utile à l’aller. Installer une butée depuis la rive atteinte avant de le faire partir, pour laisser passer le dernier croco. |
| 38 | La caisse qu’il ne faut pas casser | Carrière à trois hauteurs / 6 | Une caisse gêne un raccourci mais doit servir de marche et de cale. La déplacer avant d’ouvrir le raccourci ; l’option de la casser reste possible après sa dernière utilité. |
| 39 | Le grand écart | Deux falaises / 6 | Le plané du protecteur atteint la rive basse ; il doit d’abord recevoir la corde qui permettra de ramener le bac. L’éclaireur n’est pas celui qu’il faut envoyer en premier. |
| 40 | La parade des éléphants | Canyon en double boucle / 7 | Déplacer successivement deux éléphants entre une bascule et une arche, avec une seule cloche et une butée réutilisée. Le passage final dépend de l’ordre de retrait des charges. |

### 5. Le moulin des fausses bonnes idées — niveaux 41 à 50

Roues, sacs de farine, courroies et passerelles. Comprendre ce qu’une transformation empêche. Principes R1, R3, R6.

| N° | Titre | Forme / D | Idée déterminante et situation amusante |
|---|---|---|---|
| 41 | Le moulin qui ferme la porte | Salle centrale et deux ailes / 5 | Faire tourner la roue ouvre l’accès au haut mais ferme une trappe basse. Placer la manivelle du bon côté avant de lancer la machine ; l’arrêt rend les erreurs récupérables. |
| 42 | La scierie du grand éternuement | Trois étages, retour en boucle / 7 | Le souffle déplace la passerelle et coupe la retraite du protecteur. Préparer une échelle de secours, récupérer un jouet puis revenir libérer le partenaire resté sous la menace du lion. |
| 43 | Du grain pour les malins | Atelier compact / 5 | Un sac peut lester un plateau ou alimenter une trémie. Choisir le lest non consommable avant d’ouvrir le sac ; un petit circuit récupère le grain si la tentative échoue. |
| 44 | Le tireur à l’étage | Ascenseur et fenêtres / 6 | Croqueboum doit atteindre deux hauteurs de tir dans un ordre déterminé par les volets ouverts. Bloquer l’ascenseur à un palier sûr avant de changer de croco. |
| 45 | L’ascenseur à noix | Tour à trois arrêts / 7 | Les noix qui alimentent le contrepoids deviennent un obstacle si le panier reste chargé. Faire monter le tireur, le faire descendre par une galerie et vider le panier pour récupérer le protecteur. |
| 46 | Bataille de farine | Atelier court / 5 | Gag jouable : une rafale blanchit les animaux et révèle les empreintes du lion sur une passerelle. Lire son itinéraire pour choisir le refuge, puis laver le décor avec une petite vanne. |
| 47 | Le ruban à l’envers | Deux tapis roulants / 7 | Inverser la courroie facilite le transport de la charge, mais repousse le porteur loin de la commande. Déposer une cale et préparer une sortie latérale avant l’inversion. |
| 48 | Le dernier sac | Deux balances reliées / 7 | Un seul sac sert successivement à deux contrepoids. Il faut créer un verrou mécanique sur le premier, puis transférer le sac ; réunir des clés n’est pas la solution. |
| 49 | La panne utile | Machine et souterrain / 7 | Arrêter volontairement une roue permet de passer entre ses pales. Utiliser auparavant cette roue pour monter l’échelle qui servira à ressortir quand le courant sera coupé. |
| 50 | Le moulin travaille pour nous | Grande boucle à quatre étages / 8 | Démarrer la machine pour livrer une charge, transférer la force à l’ascenseur puis l’arrêter pour évacuer par son conduit. Les trois phases changent l’usage du même lieu. |

### 6. Les bassins suspendus — niveaux 51 à 60

Aqueduc, écluses, jardins en terrasses et baignoires d’hippos. Modifier des trajets par l’eau. Principes R4, R6.

| N° | Titre | Forme / D | Idée déterminante et situation amusante |
|---|---|---|---|
| 51 | Le bouchon voyageur | Deux bassins superposés / 5 | Le même bouchon retient l’eau en haut ou ferme l’évacuation en bas. Le faire descendre par un conduit accessible ; ouvrir une vanne sans préparer le bassin inférieur ne sert à rien. |
| 52 | Le radeau sous la porte | Bassin à deux états / 6 | Faire passer le radeau sous une arche à niveau bas, puis monter l’eau pour atteindre un balcon. L’arche rend l’ordre des opérations physiquement visible. |
| 53 | La clé qui flotte | Aqueduc en boucle / 6 | Une petite boîte flottante transporte la clé à travers une grille. Régler d’abord la bifurcation du courant, sinon elle rejoint une poche de récupération éloignée. |
| 54 | Le bain du lionceau | Jardin compact / 5 | Respiration : monter doucement l’eau pour déplacer un jouet flottant ; le lion préfère faire le tour à pied. Exploiter cette différence d’itinéraire pour rejoindre la sortie, sans le mettre en danger. |
| 55 | Deux portes, une seule eau | Écluse à deux chambres / 7 | Les deux bassins partagent un volume limité. Faire passer le bac dans la première chambre, isoler celle-ci, puis transférer l’eau à la seconde ; les vannes gardent leur position. |
| 56 | Le pont devenu bateau | Ravin inondable / 7 | La passerelle attachée devient un radeau quand on libère ses amarres. Monter d’abord l’échelle sur la rive d’arrivée, car on perd le pont permanent. |
| 57 | L’hippo de service | Canal et plateforme à voile / 7 | Utiliser le souffle pour déplacer le radeau pendant que le courant va dans l’autre sens. Abriter les crocos au quai et verrouiller le radeau avant de récupérer celui qui a provoqué le souffle. |
| 58 | Le retour au sec | Boucle avec passage bas / 8 | Une montée d’eau a ouvert le sommet mais submergé le trajet de retour. Préparer une dérivation et déplacer le colis essentiel avant d’inonder ; l’erreur est réversible depuis une vanne haute. |
| 59 | La cascade postale | Tour de bassins / 8 | Transmettre un objet par l’eau de palier en palier, tandis que les personnages suivent des escaliers différents. Les clapets doivent être réglés avant de relâcher la boîte flottante. |
| 60 | Le barrage des trois rives | Six salles, quatre étages / 8 | Un seul flotteur sert de bac, de support de tir puis de poids sur une vanne. Choisir les niveaux d’eau qui permettent ces trois usages et libérer le dernier régulateur. |

### 7. Le cirque des animaux farceurs — niveaux 61 à 70

Chapiteau, gradins, roulottes et piste. Faire coopérer involontairement les animaux. Principes R5, R6, R7.

| N° | Titre | Forme / D | Idée déterminante et situation amusante |
|---|---|---|---|
| 61 | Le numéro du ballon | Deux pistes reliées / 6 | Orienter l’hippo pour faire rouler le ballon ; le lion le poursuit et quitte le passage. Le croco doit se retirer de l’axe après avoir déclenché le souffle. |
| 62 | Le jongleur involontaire | Scène et coulisses / 7 | Le vautour lâche une noix sur une toile inclinée ; elle rejoint une bascule. Installer le support de la toile depuis les coulisses avant d’attirer le tir. |
| 63 | La ménagerie en désordre | Salle centrale à trois sorties / 7 | Changer la place du jouet déplace le lion, dont la nouvelle ronde gêne une autre branche. Reconfigurer un passage latéral pour conserver l’accès à la réserve. |
| 64 | Le zèbre mène la danse | Petite piste / 5 | Respiration : suivre un rythme de plateformes montré par le zèbre, avec signaux visuels et sans exigence de musique audible. Le bonus récompense une traversée sans arrêt ; il n’est pas obligatoire. |
| 65 | Le lion monte la garde | Deux cours et balcon / 8 | Détourner le lion vers le plateau qui maintient un accès, puis remplacer son poids par une caisse avant de reprendre le jouet. Le croco doit préparer la relève de l’animal. |
| 66 | Le clown à grandes oreilles | Piste à bascule / 7 | Placer l’éléphant à l’extrémité d’une bascule pour lever une roulotte. Le faire ensuite reculer sans déclencher une onde qui ferait tomber le colis en cours de transfert. |
| 67 | Le vautour chapardeur | Deux nids et une nacelle / 8 | Faire voler le bon objet en présentant un leurre au premier nid. Le bec ne transporte qu’un colis ; choisir quand reprendre le leurre pour ne pas détourner le retour. |
| 68 | La répétition générale | Cirque en anneau / 8 | Rétablir l’ordre de trois accessoires qui influencent les trajets des animaux. Les placer tous au plus près de la sortie produit une impasse ; chacun doit d’abord jouer son rôle dans la piste. |
| 69 | Salut depuis les cintres | Tour et descentes latérales / 8 | Installer les décors pour l’ascension, puis utiliser leurs contrepoids pour redescendre avec le colis. Le chemin spectaculaire de l’éclaireur n’achemine pas automatiquement les deux autres. |
| 70 | Le spectacle sans dompteur | Chapiteau à trois étages / 9 | Programmer spatialement une chaîne : ballon poussé, bond du lion, plateau abaissé, noix réceptionnée. Les crocos quittent leurs postes grâce aux effets persistants ; aucune action simultanée au clavier n’est requise. |

### 8. Les falaises du vent — niveaux 71 à 80

Moulins de falaise, cheminées, ponts suspendus, observatoire. Composer avec les trajets de l’air et les descentes. Principes R2, R3, R6.

| N° | Titre | Forme / D | Idée déterminante et situation amusante |
|---|---|---|---|
| 71 | Le courant contraire | Deux cheminées / 6 | Choisir le puits sous le vent pour le plané du protecteur ; le puits le plus proche ramène au palier de départ. Des rubans montrent en permanence la direction de l’air. |
| 72 | La voile en panne | Falaise et rail incliné / 7 | Acheminer un panneau de voile par l’ascenseur, puis le monter sur le chariot. Un souffle seul ne suffit pas : il faut préparer la surface qui le reçoit. |
| 73 | Les trois balcons | Tour à descentes décalées / 8 | Croquefort peut atteindre trois balcons depuis le sommet, mais chacun coupe l’accès à un autre. Décider où déposer la corde et le colis avant la première descente. |
| 74 | Le chapeau qui revient | Boucle aérienne courte / 6 | Une étoile portée par un petit panier revient grâce au courant circulaire. Observer et la récupérer au quai sûr ; courir après la trajectoire complique inutilement le défi facultatif. |
| 75 | La cheminée à double usage | Ascension et conduit central / 8 | Le ventilateur fait monter la nacelle mais empêche la descente finale. Monter une butée, bloquer la nacelle au sommet, puis couper le vent et utiliser le conduit libéré. |
| 76 | La carte postale volante | Deux tours avec guichets / 8 | Une lettre lestée rejoint une tour, une boîte trop lourde tombe à mi-chemin. Choisir le contenant adapté et transférer le contenu après livraison, sans changer arbitrairement la règle du vent. |
| 77 | Le nid derrière la rafale | Falaises en boucle / 8 | Le vautour ne peut livrer contre le courant. Fermer un volet pour son aller, préparer l’abri du protecteur, puis rouvrir pour le trajet de retour de la nacelle. |
| 78 | Le pont tient à un fil | Ravin à trois paliers / 9 | Une corde retient la charge qui tend le pont. La couper ouvre le passage inférieur, mais condamne le haut ; installer d’abord une liaison de secours pour le tireur. |
| 79 | Le gardien du vent | Tour et deux galeries / 9 | Un héros tient ouvert le volet nécessaire au premier passage. Les autres doivent atteindre sa commande secondaire et y poser une cale avant de le rappeler. La difficulté porte sur leur trajet de retour. |
| 80 | L’observatoire décroché | Huit salles, cinq étages / 9 | Alimenter successivement la nacelle, le pont et la descente du protecteur avec le même courant. Transporter les accessoires entre les phases sans perdre l’accès au distributeur central. |

### 9. La cité des passages réversibles — niveaux 81 à 90

Canaux, place de marché, beffroi et portes d’écluse. Réutiliser des lieux sous plusieurs configurations. Principes R1, R3, R4, R6.

| N° | Titre | Forme / D | Idée déterminante et situation amusante |
|---|---|---|---|
| 81 | Trois départs, un rendez-vous | Trois secteurs reliés / 7 | Chaque croco commence avec un accès utile à un autre. Le premier objectif est de faire circuler une manivelle par deux guichets pour ouvrir un point de rencontre central. |
| 82 | Le marché des objets perdus | Place et trois ateliers / 8 | Une même cale peut servir de marche, de blocage ou de lest. Prévoir l’ordre des emplois et un emplacement de dépôt accessible à tous, au lieu d’accumuler des objets équivalents. |
| 83 | L’ascenseur qui change de camp | Deux tours et nacelle / 9 | Le contrepoids peut desservir l’une ou l’autre tour. Transférer les passagers à un palier intermédiaire avant de changer son ancrage, puis rendre un chemin au mécanicien. |
| 84 | La pause du facteur | Petite place verticale / 6 | Respiration d’observation : organiser une livraison facultative pendant que le vautour fait une pause. L’étoile s’obtient en préparant son prochain arrêt, sans le poursuivre. |
| 85 | Le retour par la fenêtre | Grande boucle / 9 | L’ouverture du portail final bloque le couloir principal. Acheminer une échelle à la fenêtre avant la commutation, puis emprunter le retour par les toits. |
| 86 | Le colis trop encombrant | Canaux et ruelles / 9 | Les crocos franchissent les ruelles, mais la grande charge exige le canal. Changer le niveau de l’eau pour la livrer puis rétablir un passage piéton pour son destinataire. |
| 87 | Une cloche pour deux géants | Deux places à portillons / 9 | Les deux éléphants entendent la même cloche si les portillons sont ouverts. Isoler les espaces acoustiquement pour les déplacer séparément, avec indices visuels de portée du son. |
| 88 | Le beffroi désaccordé | Tour centrale et galeries / 9 | Un tir ouvre un volet mais libère aussi un courant qui déplace la nacelle. Préparer sa butée avant le tir, puis exploiter le nouveau courant pour livrer une charge. |
| 89 | La place tourne autrement | Réseau à trois états / 9 | Un aiguillage de passerelles change les liaisons entre quartiers. Répartir les crocos et leurs objets avant chaque configuration ; un escalier de maintenance permet toujours de réviser le plan. |
| 90 | La ville se remet en marche | Dix salles, cinq étages / 10 | Remettre en route eau, courrier et ascenseur, puis les placer dans une configuration commune d’évacuation. Les solutions locales doivent rester compatibles ; un raccourci ouvert tôt devient essentiel au dernier retour. |

### 10. La grande réunion — niveaux 91 à 100

Fort, ateliers et vallée parcourue par les animaux. Synthèses sans règle nouvelle surprise. Principes R1 à R6 ; mise en scène R7.

| N° | Titre | Forme / D | Idée déterminante et situation amusante |
|---|---|---|---|
| 91 | Le convoi des farceurs | Longue boucle avec trois haltes / 8 | Faire traverser un petit convoi d’objets et d’animaux. Aux haltes sûres, changer l’ordre du convoi pour que l’animal utile au prochain obstacle ne reste pas bloqué derrière son chargement. |
| 92 | La clé n’est pas le problème | Tour et deux ailes / 9 | La clé est visible et accessible tôt, mais son destinataire ne peut quitter son poste. Construire la relève, puis transmettre la clé par le trajet adapté au porteur. |
| 93 | Le pont qu’on doit perdre | Ravin, canal et chemin haut / 10 | Démonter le pont est nécessaire à la livraison du flotteur final. Avoir fait passer les bons objets et préparé une route distincte pour chaque héros avant de libérer ses amarres. |
| 94 | Le casse du pique-nique | Petite salle à interactions / 7 | Respiration exigeante mais courte : obtenir une étoile gardée par le lion et le vautour sans les endormir, en échangeant la place de deux appâts. Les deux animaux découvrent qu’ils ont échangé leurs goûters. |
| 95 | Le fort sans gardien | Trois boucles imbriquées / 10 | Les postes de protection, d’alimentation et d’ouverture doivent successivement fonctionner sans leur opérateur. Les remplacements sont physiques : abri construit, charge retenue, butée posée. |
| 96 | Trois colis, deux passages | Trois étages et guichets / 9 | Deux voies ont des contraintes de taille et de sens. Organiser une zone de dépôt intermédiaire et l’ordre des transferts pour que personne ne reste du mauvais côté avec le dernier objet. |
| 97 | Le dernier éternuement | Salle centrale et galeries / 10 | Le souffle qui déplace la plateforme finale emporte aussi la cale utilisée plus tôt. Protéger cette cale ou en transférer la fonction avant le souffle, puis récupérer le déclencheur. |
| 98 | Tout le monde change de rôle | Grande boucle à quatre phases / 10 | Le protecteur commence passeur, devient porteur puis passager ; le tireur libère puis referme un accès ; l’éclaireur prépare la relève. Aucun personnage ne reste toute l’énigme sur une dalle. |
| 99 | Préparer la grande parade | Vallée à plusieurs branches / 9 | Installer les haltes, raccourcis et charges d’un parcours commun. Le joueur peut inspecter et corriger chaque préparation avant de lancer la dernière traversée ; aucune mauvaise surprise irréversible. |
| 100 | Personne ne reste derrière | Douze salles maximum, six étages / 10 | Trois actes : préparer l’expédition, transformer le fort, évacuer crocos et animaux. Une même charge relie les actes. Chaque opérateur doit disposer d’une relève préparée ; la dernière victoire est un regroupement festif, pas une série de combats. |

## Cinq énigmes développées pour éprouver la profondeur

Ces fiches vont au-delà d’un intitulé. Elles fixent un problème et une séquence plausible. Elles restent à convertir en plans cotés, à simuler et à tester : les possibilités de passage, durées et contraintes ne sont pas prouvées.

### Niveau 42 — La scierie du grand éternuement

**Question : comment traverser sans abandonner le protecteur lorsque la passerelle change de rive ?**

Disposition proposée : trois étages. En bas, l’entrée et le lion surveillant la galerie. Au milieu, un chariot-passerelle sur rail, poussé vers la droite par le souffle de l’hippopotame. En haut, une coursive accessible à l’éclaireur permet de déployer une échelle vers la galerie d’entrée. La réserve de jouets est à droite, derrière un loquet que seul un projectile peut atteindre à travers une fente.

État initial : les trois héros à gauche ; chariot à gauche ; échelle repliée ; jouet dans la réserve. Une corde de rappel accessible à gauche ramène le chariot pour corriger une erreur. Le chariot dispose d’une butée droite ; il ne repart pas pendant les changements de personnage.

Dépendances :
1. Croquinet emprunte les poutres du haut et déploie l’échelle de retour. Il peut ensuite atteindre le poste d’observation de l’hippo par une galerie haute.
2. Croquefort, protégé au bord de la galerie, détourne les bonds du lion de l’accès au chariot. Croqueboum embarque.
3. Croquinet provoque le souffle depuis un refuge ; le chariot transporte Croqueboum à droite.
4. Croqueboum ouvre la réserve au tir, prend le jouet, rejoint la coursive par l’escalier droit et revient par l’échelle préparée.
5. Il dépose le jouet dans l’alcôve latérale. Le lion y entre, ce qui libère Croquefort.
6. Croquefort rappelle le chariot, monte ; Croquinet déclenche un second souffle et emprunte son propre chemin haut. Croqueboum les rejoint par la coursive. Le jouet reste en place jusqu’au dernier passage.

Déclic : préparer le trajet de celui qui reviendra aider, avant d’utiliser la passerelle.

Erreur instructive : omettre l’échelle laisse le tireur bloqué à droite, mais une commande de rappel et un escalier de maintenance permettent de recommencer la traversée. Ne pas imposer la reprise de toute la scène.

Raccourcis à examiner : saut de l’éclaireur jusqu’à la réserve ; tir depuis l’entrée ; lion endormi durablement par une boulette ; retour par réapparition avec le jouet. Si le lion peut être neutralisé durablement, cette énigme perd son enjeu : la règle de récupération du lion doit avoir été apprise auparavant, avec une réaction comique cohérente.

Bonus : rapporter le jouet au panier après avoir ouvert l’accès commun ; nécessite une dernière diversion, sans bloquer la sortie principale.

### Niveau 45 — L’ascenseur à noix

**Question : la protection qui sauve les crocos empêche-t-elle aussi la machine de fonctionner ?**

Disposition : tour à trois paliers. La nacelle transporte les crocos, le panier de noix joue le contrepoids sur l’autre côté. Le vautour vise la zone du panier ; une galerie latérale descend du palier supérieur à une trappe de vidange, inaccessible depuis le bas tant que son loquet n’a pas été ouvert au tir.

Règles à annoncer : une noix dans le panier fait monter la nacelle jusqu’au cran suivant ; une butée mémorise le palier. Vider le panier permet une descente commandée. Le toit du quai protège les héros en attente ; le bouclier peut aussi bloquer la noix avant qu’elle ne tombe dans le panier. Le vautour recharge depuis une réserve visible.

Séquence proposée :
1. Croquinet ouvre l’accès à l’aire de visée par le balcon.
2. Croquefort protège Croqueboum lors de l’embarquement. Il se place ensuite sous l’auvent fixe et abaisse son bouclier pour laisser les noix alimenter le panier.
3. Croquinet attire les lâchers depuis les alcôves protégées ; Croqueboum monte et ouvre le loquet supérieur.
4. Le tireur descend par la galerie latérale et atteint la trappe de vidange. Il vide le panier, puis actionne le rappel de la nacelle.
5. Croquefort embarque ; un second chargement l’amène en haut.
6. Croquinet rejoint le sommet par les prises qu’il a ouvertes. Croqueboum remonte par la galerie désormais accessible. Personne n’a besoin de commander et de voyager simultanément.

Déclic : alterner protection et alimentation, puis libérer le trajet du contrepoids pour réutiliser l’ascenseur.

Gag : le vautour regarde avec fierté la nacelle monter, puis réalise qu’il a aidé les crocos.

Risques à vérifier : capacité du bouclier à transporter tout le monde sans le cycle ; tir direct sur la trappe ; déclenchements hors champ ; noix détruisant le colis ; déséquilibre pendant une sauvegarde. Le panier ne doit pas exiger un nombre arbitraire de projectiles : ses crans correspondent à des positions visibles.

### Niveau 65 — Le lion monte la garde

**Question : comment récupérer ce qui maintient justement la porte ouverte ?**

Disposition : deux cours reliées par une porte sur contrepoids. Un plateau abaisse la porte. Une caisse est enfermée dans la cour droite ; le jouet du lion est dans la cour gauche. Une petite voie haute autorise le retour de Croquinet et le passage du jouet par un guichet, mais pas celui de la caisse.

Règles : lion attiré par jouet visible ; plateau sensible à toute masse suffisante ; caisse poussable ; porte retenue brièvement par son cliquet pendant la relève. Toutes ces règles ont été présentées avant ce niveau. Le jouet doit être livré ensuite dans une nacelle, il ne peut donc pas rester auprès du lion.

Séquence :
1. Croqueboum fait tomber le jouet sur le plateau par un tir sur son support.
2. Le lion s’y installe ; la porte s’ouvre.
3. Croquefort traverse, déplace la caisse jusqu’au plateau depuis le côté droit ; Croquinet ouvre le petit accès haut.
4. La caisse est posée sur la zone élargie du plateau avant qu’on retire le jouet. La géométrie permet la présence temporaire de la caisse et de l’animal.
5. Croquinet récupère le jouet depuis le guichet haut ; le lion descend vers lui par son détour, la caisse conserve l’ouverture.
6. Le jouet est transmis à Croqueboum qui le dépose dans la nacelle ; Croquefort et Croquinet rejoignent le quai.

Déclic : remplacer un gardien vivant par un poids inerte avant de reprendre son appât.

Erreur : récupérer le jouet trop tôt ferme la porte, mais le guichet permet de le remettre sur le plateau. La caisse ne peut pas se coincer dans un angle irrécupérable.

Raccourcis : plateau activable par les trois crocos puis passage par-dessus la porte ; lion endormi gardant son poids indéfiniment ; jouet accessible depuis n’importe où. Accepter une autre solution fondée sur un remplacement physique ; rejeter seulement le contournement gratuit.

Gag : le lion revient s’asseoir sur la caisse, persuadé qu’elle a pris sa place.

### Niveau 93 — Le pont qu’on doit perdre

**Question : quand faut-il cesser de préserver le chemin de l’aller ?**

Disposition : deux rives, canal inférieur et corniche supérieure. Un pont constitué d’un flotteur amarré couvre le canal. Le flotteur doit finalement transporter une lourde charge jusqu’au quai de sortie. Une échelle et une corde de rappel sont récupérables sur la rive initiale. Le retour par corniche n’est accessible qu’après installation de l’échelle.

Règles : le flotteur peut être pont ou bateau ; sa libération enlève réellement la surface de marche. Les amarres se déclipsent et peuvent être refixées depuis un quai de récupération. La charge ne se porte pas à dos de croco, mais peut être poussée sur le flotteur amarré.

Séquence :
1. Faire passer l’échelle, la corde et Croqueboum sur la rive droite pendant que le pont est stable.
2. Croquinet monte par la voie haute ; Croqueboum installe l’échelle qui donne un retour depuis cette rive.
3. Croquefort pousse la charge sur le flotteur ; la corde est fixée au quai d’arrivée.
4. Le tireur ouvre au tir l’amarrage inaccessible, puis rejoint la galerie haute par l’échelle.
5. Le protecteur accompagne la charge sous le bouclier ; le courant transporte le flotteur. L’éclaireur ouvre le dernier passage depuis les corniches.
6. La corde guide l’accostage ; les deux héros de la voie haute descendent au quai, puis le protecteur fait débarquer la charge.

Déclic : l’objet qui permettait de passer doit devenir le moyen de transport de ce qui ne passe pas ailleurs.

Erreur : libérer le flotteur trop tôt l’envoie au quai de récupération ; la corde de rappel permet de le réamarrer. Si un héros chute, reprise locale atomique avant le décrochage, avec restitution de la charge et des amarres.

Raccourcis : planer avec la charge ; sauter la rive avec un objet sur le bouclier ; couper l’amarre depuis un lieu donnant accès à toute la suite. Vérifier les masses et dimensions réelles du moteur, pas seulement un dessin de plan.

### Niveau 100 — Personne ne reste derrière

**Question : comment rendre toute l’installation autonome suffisamment longtemps pour quitter les postes ?**

Pas de nouvelle capacité ni d’animal inconnu. Carte de 8 à 12 salles au maximum, regroupées en trois sous-ensembles lisibles. Les solutions des actes ne sont pas montrées par des icônes de héros.

Acte I — Préparer : ouvrir une boucle entre ateliers et fort ; acheminer une caisse-cale vers le haut et une corde vers le canal. Un vautour livre le petit accessoire que le colis principal ne peut pas transporter. Point de reprise après réunion dans la cour centrale.

Acte II — Transformer : utiliser l’éléphant comme contrepoids, le souffle pour déplacer le chariot et le tireur pour libérer un amarrage. Le but est de créer un chemin commun ; chaque mécanisme possède un arrêt stable. On peut inspecter l’état final de chaque secteur avant de poursuivre. Point de reprise avant l’évacuation.

Acte III — Libérer : substituer une butée à la présence du protecteur, une charge à celle de l’éléphant et un verrou mécanique à la commande de passage. Le tireur revient ouvrir le dernier refuge ; l’éclaireur rappelle le bac ; le protecteur accompagne les derniers passagers. Les animaux doivent rejoindre une zone sûre par des trajets préparés, avec pauses automatiques aux haltes.

Difficulté recherchée : anticiper les états compatibles de plusieurs secteurs et l’acheminement des objets. Les animaux ne suivent pas tous activement le joueur en permanence ; les haltes permettent de penser et de changer de croco.

Récupération : trois actes sauvegardés, réinitialisation locale avant chaque transformation irréversible, objets essentiels toujours traçables dans le plan. Aucun échec tardif ne doit obliger à refaire vingt minutes de déplacements.

Gag final : le plus petit lion tient la bannière trop grande ; l’éléphant la remet droite avec sa trompe ; les crocos réalisent qu’ils n’ont plus peur de lui. Cette animation célèbre une évacuation réellement réussie.

Risques : explosion du nombre d’états, longueurs, dépendances trop éloignées, finales locales incompatibles. Réduire le nombre de secteurs si le joueur ne peut pas expliquer les effets de ses actions. La scène finale doit réemployer les règles maîtrisées, pas accumuler toutes les fonctionnalités.

## Comment vérifier que les énigmes ont vraiment progressé

### Une fiche complète avant chaque carte

Compléter : idée précise ; règle déjà apprise ; référence de principe ; carte des pièces et passages ; objets et détenteurs ; état initial ; conséquence de chaque action ; dépendances ; solution prévue ; autre solution admissible ; fausse bonne idée ; récupération ; gag ; défi bonus ; règles de caméra.

Une ligne du catalogue est une piste. Elle n’est acceptée en production qu’après cette fiche et un prototype. Les cinq fiches développées ci-dessus sont encore dépourvues de géométrie cotée et de validation.

### Recherche de contournements

Tester d’abord les raccourcis les plus probables : finir avec un héros inutile, neutraliser définitivement l’animal essentiel, tirer depuis le départ, sauter une porte, porter l’équipe sur le bouclier, réapparaître avec une clé, réinitialiser un mécanisme en conservant son bénéfice, sortir au mauvais étage, viser hors champ.

Pour une énigme donnée, désactiver temporairement le mécanisme supposé central dans un test peut révéler qu’il n’est pas nécessaire. L’échec d’un script connu dans ce test ne prouve toutefois pas l’absence d’une autre solution. Explorer les états abstraits, puis confirmer les chemins par les commandes du jeu.

### Indicateurs utiles, limites explicites

- Évaluer séparément déduction, coordination, orientation et précision motrice. Une mauvaise visibilité ne doit pas augmenter artificiellement la note de difficulté.
- Comparer deux graphes de solution après suppression des noms et positions : si les mêmes étapes restent dans le même ordre, la nouveauté est probablement décorative. Le diagnostic demande une relecture, pas une décision automatique fondée seulement sur des étiquettes.
- Observer le premier déclic, les erreurs intéressantes, les moments où le joueur prépare un retour, et les temps de déplacement sans décision.
- Chronométrer la première découverte humaine et le parcours déjà connu séparément. Un script très rapide peut résoudre un excellent puzzle ; le rallonger ne le rend pas meilleur.
- Recueillir facultativement : « qu’avez-vous compris ? », « qu’aviez-vous mal anticipé ? », « qu’est-ce qui vous a amusé ? ». Conserver les retours localement et n’exporter qu’à l’initiative du joueur.

### Exigences de confort

En paysage sur téléphone : personnages et mécanismes lisibles, commandes distinctes de la scène, caméra qui montre la réception d’un saut, sélection rapide des trois héros, plan consultable en pause. La couleur n’est pas le seul marqueur d’identité. Les signaux de son ont leur équivalent visuel.

Le rembobinage et les points de reprise doivent inclure objets transportés, animaux, paniers, eau, cordes, plateformes et verrous. Aucun rétablissement partiel ne doit créer un objet en double ou laisser un compagnon inaccessible.

Les décors ont trois couches séparées : fond animé ; éléments jouables nettement lisibles ; premier plan discret. L’enrichissement ne masque ni un levier, ni une trajectoire, ni une entrée. Les grandes oreilles et la trompe de l’éléphant doivent aussi indiquer une réaction, pas seulement embellir le dessin.

## Ordre de réalisation proposé

1. Construire les règles de transport/transfert et de substitution de poids avec reprise fiable, puis les comportements animaux correspondants.
2. Développer un parcours d’apprentissage et les prototypes 42, 65 et 93. Ils éprouvent trois qualités différentes : libérer son protecteur, remplacer un animal, transformer le trajet.
3. Vérifier la faisabilité, les contournements et les erreurs ; faire un essai de découverte sans indications de solution. Les retours déjà reçus excluent de qualifier à nouveau de « difficile » un niveau seulement parce qu’il contient plusieurs étages.
4. Construire les chapitres 1 à 3 à mesure que le moteur se stabilise. Ils enseignent les règles nécessaires aux prototypes avancés.
5. Produire et tester les autres chapitres par lots de dix, avec revues de diversité entre chapitres. Maintenir quelques énigmes brèves après les plus longues.
6. Intégrer la campagne de 100 niveaux avec migration documentée de la progression. Les identifiants des anciennes et nouvelles cartes doivent rester distincts ; ne pas convertir une ancienne victoire en validation d’une nouvelle énigme non jouée.

**Livrable de ce travail : un catalogue de 100 intentions, une progression, un socle de règles et cinq fiches avancées. Ce document ne constitue ni 100 niveaux jouables, ni une validation de difficulté, ni un déploiement du jeu.**

