# Musique de Les Cro Cro Cros — v3.0.1

Arrangement instrumental de la mélodie traditionnelle « Ah ! Les crocodiles » : couplet et refrain en fa majeur, marche en 2/4. Un premier passage utilise un timbre d’anche synthétique ; la reprise passe à une flûte douce à l’octave. Basse alternée, accords courts et percussion brossée sont composés pour le jeu. Les ruines ralentissent la marche et enlèvent les percussions.

Références mélodiques consultées le 20 octobre 2026 :
- Breizh Partitions, transcription et arrangement en fa majeur, tempo 120, partition n° 1772 : https://www.partitions.bzh/partition/1772_Ah_!_Les_crocodiles (licence CC BY-SA annoncée par l’éditeur).
- Partition notée dans l’article allemand « Ah ! Les crocodiles », contributeurs Wikipédia : https://de.wikipedia.org/wiki/Ah_!_Les_crocodiles (CC BY-SA).

L’arrangement musical adapté de cette référence et sa notation dans src/music.js sont distribués sous CC BY-SA 4.0 : https://creativecommons.org/licenses/by-sa/4.0/ . Changements : instrumentation synthétique, accompagnement, articulation, reprises et variation de tempo. Cette mention concerne la musique ; les autres éléments du jeu sont créés séparément.

Le jeu synthétise tous ses sons localement avec Web Audio. Aucun enregistrement, texte chanté, fichier audio ou son des jeux The Lost Vikings n’est intégré. La musique se coupe indépendamment des effets dans les réglages. Cette version n’est pas un enregistrement orchestral.

## Correction du niveau de sortie — 23 octobre 2026

Les enveloppes des instruments étaient déjà faibles ; le réglage utilisateur les atténuait encore. Le rendu de la version 3.0.0, au réglage par défaut, mesurait environ −47,8 dBFS RMS pour la marche et −49,5 dBFS pour l’ambiance nocturne. Cela expliquait la faible audibilité, même avec un volume matériel élevé.

La version 3.0.1 calibre le gain musical, rééquilibre les bruitages et fait passer le mélange dans un compresseur de crêtes, avec une réserve en sortie. Les réglages sont « Coupée », « Discrète », « Normale » et « Forte ». Le réglage par défaut reste mémorisé sous sa valeur historique : aucune réinitialisation de progression n’est nécessaire. Le choix « Coupée » et le son général désactivé restent respectés, y compris à l’import d’une sauvegarde.

Les rendus réels de Web Audio dans Chromium mesurent désormais environ −23,0 dBFS RMS en mode Normal et −18,7 dBFS en mode Fort pour la marche. L’ambiance nocturne atteint respectivement −24,7 et −19,8 dBFS. Le gain mesuré au réglage par défaut est donc d’environ 25 dB par rapport à la version précédente. Ces valeurs décrivent le signal numérique, pas le niveau acoustique d’un casque.

`tests/audio-output.test.cjs` rend les deux arrangements complets, avec les reprises à la flûte et les trois volumes, ainsi que des mélanges avec plusieurs bruitages simultanés. Aucun échantillon écrêté n’a été observé ; le pic le plus élevé de ces mélanges est de 0,935, sous la limite numérique de 1. Le silence musical, les effets sans musique et l’extinction progressive sont aussi vérifiés. Les résultats sont dans `tests/audio-output-report.json`.

`tests/music-settings.test.cjs` vérifie les réglages dans le navigateur au format mobile, leur mémorisation, l’import, le respect du silence général et la reprise de l’AudioContext après pause. Les mesures ne sont pas un essai de Safari sur iPhone physique.
