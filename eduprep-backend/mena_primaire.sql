-- ============================================================
-- REFERENTIEL MENA-CI - CYCLE PRIMAIRE
-- EduPrep CI - Programme officiel Cote d Ivoire
-- CP1, CP2, CE1, CE2, CM1, CM2
-- Francais (Orthographe, Grammaire, Conjugaison, Lecture-Expression)
-- Mathematiques, Eveil (Sciences, Histoire-Geo, Education civique), Anglais
-- ============================================================

-- ============================================================
-- CP1
-- ============================================================

-- FRANCAIS CP1 - LECTURE ET DECOUVERTE
INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('primaire','CP1','francais-lecture',1,'Decouverte des lettres et sons - voyelles',
 ARRAY['Reconnaitre et ecrire les voyelles','Associer lettre et son','Lire des syllabes simples'],
 ARRAY['voyelle','a','e','i','o','u','son','lettre','syllabe'],10,1),
('primaire','CP1','francais-lecture',2,'Les consonnes et syllabes directes',
 ARRAY['Identifier les consonnes courantes','Former des syllabes directes','Lire des mots simples'],
 ARRAY['consonne','syllabe directe','CV','mot','lecture syllabique'],12,2),
('primaire','CP1','francais-lecture',3,'Lecture de mots et de phrases courtes',
 ARRAY['Lire des mots usuels','Comprendre une phrase simple','Respecter la ponctuation de base'],
 ARRAY['mot','phrase','point','majuscule','sens','lecture courante'],10,3),
('primaire','CP1','francais-lecture',4,'Expression orale et decouverte de textes',
 ARRAY['S exprimer oralement en phrases','Ecouter et comprendre un texte lu','Repondre a des questions simples'],
 ARRAY['expression orale','ecoute','comprehension','question','reponse','texte court'],8,4);

-- FRANCAIS CP1 - ORTHOGRAPHE
INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('primaire','CP1','francais-orthographe',1,'Les lettres de l alphabet',
 ARRAY['Connaitre l ordre alphabetique','Distinguer majuscule et minuscule','Ecrire les lettres en cursive'],
 ARRAY['alphabet','majuscule','minuscule','cursive','ordre alphabetique'],8,1),
('primaire','CP1','francais-orthographe',2,'Les sons simples et leur graphie',
 ARRAY['Associer un son a sa graphie','Ecrire des mots simples sous dictee','Distinguer des sons proches'],
 ARRAY['graphie','son','phoneme','grapheme','dictee preparee','mot simple'],10,2),
('primaire','CP1','francais-orthographe',3,'Les mots usuels a connaitre par coeur',
 ARRAY['Memoriser les mots outils frequents','Ecrire sans erreur les mots de la liste','Utiliser ces mots en context'],
 ARRAY['mots outils','mots invariables','memorisation','dictee','frequence'],8,3);

-- FRANCAIS CP1 - GRAMMAIRE
INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('primaire','CP1','francais-grammaire',1,'La phrase',
 ARRAY['Reconnaitre une phrase','Distinguer phrase et non-phrase','Identifier le debut et la fin d une phrase'],
 ARRAY['phrase','majuscule','point','sens','groupe de mots'],6,1),
('primaire','CP1','francais-grammaire',2,'Les types de phrases simples',
 ARRAY['Distinguer phrase affirmative et negative','Reconnaitre la phrase interrogative','Transformer des phrases'],
 ARRAY['phrase affirmative','negative','interrogative','transformation','ne pas'],6,2);

-- FRANCAIS CP1 - CONJUGAISON
INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('primaire','CP1','francais-conjugaison',1,'Le verbe - notion de base',
 ARRAY['Identifier le verbe dans une phrase simple','Comprendre que le verbe exprime une action','Reconnaitre les verbes courants'],
 ARRAY['verbe','action','etat','infinitif','phrase','sujet'],6,1),
('primaire','CP1','francais-conjugaison',2,'Le present de l indicatif - verbes etre et avoir',
 ARRAY['Conjuguer etre et avoir au present','Utiliser correctement etre et avoir','Construire des phrases avec ces verbes'],
 ARRAY['present','indicatif','etre','avoir','conjugaison','pronom personnel'],8,2);

-- MATHEMATIQUES CP1
INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('primaire','CP1','mathematiques',1,'Denombrement et nombres de 0 a 10',
 ARRAY['Compter jusqu a 10','Associer chiffre et quantite','Comparer des collections'],
 ARRAY['chiffre','nombre','quantite','compter','plus','moins','egal','zero'],10,1),
('primaire','CP1','mathematiques',2,'Nombres de 11 a 20',
 ARRAY['Lire et ecrire les nombres jusqu a 20','Decomposer les nombres en dizaine et unites','Ordonner les nombres'],
 ARRAY['dizaine','unite','vingt','ordre','suite numerique','decomposition'],10,2),
('primaire','CP1','mathematiques',3,'Addition de nombres inferieurs a 20',
 ARRAY['Comprendre le sens de l addition','Calculer des additions simples','Resoudre des problemes additifs'],
 ARRAY['addition','plus','somme','probleme','calcul mental','resultat'],10,3),
('primaire','CP1','mathematiques',4,'Soustraction de nombres inferieurs a 20',
 ARRAY['Comprendre le sens de la soustraction','Calculer des soustractions simples','Resoudre des problemes soustractifs'],
 ARRAY['soustraction','moins','difference','reste','probleme','calcul mental'],10,4),
('primaire','CP1','mathematiques',5,'Geometrie - formes et figures',
 ARRAY['Reconnaitre les formes geometriques usuelles','Decrire les figures','Trier et classer des objets'],
 ARRAY['carre','rectangle','triangle','cercle','cote','sommet','forme'],8,5);

-- ============================================================
-- CP2
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- FRANCAIS CP2 - ORTHOGRAPHE
('primaire','CP2','francais-orthographe',1,'Les sons complexes - graphies multiples',
 ARRAY['Identifier les sons complexes','Choisir la bonne graphie','Ecrire correctement sous dictee'],
 ARRAY['son complexe','ou','on','an','in','eau','eu','graphie','dictee'],10,1),
('primaire','CP2','francais-orthographe',2,'Les accents et la cedille',
 ARRAY['Distinguer e accent aigu, grave et circonflexe','Utiliser la cedille','Ecrire correctement les mots avec accents'],
 ARRAY['accent aigu','accent grave','accent circonflexe','cedille','e accent','ca'],8,2),
('primaire','CP2','francais-orthographe',3,'Accord du nom - singulier et pluriel',
 ARRAY['Former le pluriel des noms','Appliquer la regle du s au pluriel','Connaitre les exceptions courantes'],
 ARRAY['singulier','pluriel','s','x','nom','accord','exception'],8,3),
('primaire','CP2','francais-orthographe',4,'Majuscule et ponctuation de base',
 ARRAY['Utiliser la majuscule en debut de phrase','Employer le point et le point d interrogation','Reconnaitre la virgule'],
 ARRAY['majuscule','point','point d interrogation','point d exclamation','virgule','ponctuation'],6,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- FRANCAIS CP2 - GRAMMAIRE
('primaire','CP2','francais-grammaire',1,'Le nom - commun et propre',
 ARRAY['Distinguer nom commun et nom propre','Identifier le nom dans la phrase','Utiliser le bon article'],
 ARRAY['nom commun','nom propre','article','determinant','le','la','les','un','une'],8,1),
('primaire','CP2','francais-grammaire',2,'Le groupe nominal - determinant et nom',
 ARRAY['Identifier le groupe nominal','Accorder le determinant avec le nom','Enrichir le GN avec un adjectif'],
 ARRAY['groupe nominal','GN','determinant','nom','adjectif','accord'],8,2),
('primaire','CP2','francais-grammaire',3,'Le sujet et le verbe',
 ARRAY['Identifier le sujet et le verbe','Comprendre l accord sujet-verbe','Reconnaitre le groupe sujet'],
 ARRAY['sujet','verbe','accord','groupe sujet','pronom','il','elle','ils','elles'],8,3);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- FRANCAIS CP2 - CONJUGAISON
('primaire','CP2','francais-conjugaison',1,'Le present de l indicatif - verbes du 1er groupe',
 ARRAY['Conjuguer les verbes en -er au present','Identifier les terminaisons','Accorder le verbe avec son sujet'],
 ARRAY['present','1er groupe','-er','terminaison','je','tu','il','nous','vous','ils'],10,1),
('primaire','CP2','francais-conjugaison',2,'Le present - verbes aller, faire, venir, dire',
 ARRAY['Conjuguer les verbes irreguliers frequents au present','Memoriser les formes irregulieres','Les employer en contexte'],
 ARRAY['verbe irregulier','aller','faire','venir','dire','present','forme'],8,2),
('primaire','CP2','francais-conjugaison',3,'L infinitif et identification du verbe conjugue',
 ARRAY['Distinguer verbe conjugue et infinitif','Trouver l infinitif d un verbe conjugue','Identifier le groupe du verbe'],
 ARRAY['infinitif','verbe conjugue','groupe','1er','2e','3e','identification'],6,3);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- MATHEMATIQUES CP2
('primaire','CP2','mathematiques',1,'Nombres jusqu a 100',
 ARRAY['Lire, ecrire et ordonner les nombres jusqu a 100','Decomposer en dizaines et unites','Connaitre la suite numerique'],
 ARRAY['centaine','dizaine','unite','cent','ordre','suite','decomposition','valeur positionnelle'],12,1),
('primaire','CP2','mathematiques',2,'Addition posee avec retenue',
 ARRAY['Poser et calculer une addition','Gerer la retenue','Verifier le resultat'],
 ARRAY['addition posee','retenue','somme','calcul','verification','operande'],10,2),
('primaire','CP2','mathematiques',3,'Soustraction posee',
 ARRAY['Poser et calculer une soustraction','Comprendre la notion d emprunt','Resoudre des problemes'],
 ARRAY['soustraction posee','emprunt','difference','probleme','verification'],10,3),
('primaire','CP2','mathematiques',4,'Introduction a la multiplication',
 ARRAY['Comprendre la multiplication comme addition repetee','Apprendre les tables de 2 et 3','Resoudre des problemes multiplicatifs'],
 ARRAY['multiplication','table','produit','fois','addition repetee','probleme'],10,4),
('primaire','CP2','mathematiques',5,'Mesures - longueurs et masses',
 ARRAY['Connaitre les unites de longueur et de masse','Mesurer avec une regle','Comparer des masses'],
 ARRAY['metre','centimetre','kilogramme','gramme','mesure','comparaison','regle'],8,5);

-- ============================================================
-- CE1
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- FRANCAIS CE1 - ORTHOGRAPHE
('primaire','CE1','francais-orthographe',1,'Les homophones grammaticaux - a et a, est et et',
 ARRAY['Distinguer a (verbe) et a (preposition)','Distinguer est et et','Appliquer les regles d emploi'],
 ARRAY['homophone','a verbe','a preposition','est','et','distinction','contexte'],8,1),
('primaire','CE1','francais-orthographe',2,'Accord de l adjectif qualificatif',
 ARRAY['Accorder l adjectif en genre et en nombre','Identifier l adjectif dans le GN','Appliquer les regles d accord'],
 ARRAY['adjectif qualificatif','accord','genre','nombre','masculin','feminin','singulier','pluriel'],10,2),
('primaire','CE1','francais-orthographe',3,'Le pluriel des noms - cas particuliers',
 ARRAY['Former le pluriel des noms en -eau, -eu, -al','Connaitre les pluriels irreguliers','Ecrire correctement sous dictee'],
 ARRAY['pluriel','eau','eux','al','aux','irregulier','exception','dictee'],8,3),
('primaire','CE1','francais-orthographe',4,'Les lettres muettes et les doublets',
 ARRAY['Identifier les lettres muettes en fin de mot','Connaitre les consonnes doubles frequentes','Memoriser des mots avec doublets'],
 ARRAY['lettre muette','consonne double','ll','tt','pp','nn','accord','memoire'],8,4),
('primaire','CE1','francais-orthographe',5,'Homophones lexicaux courants',
 ARRAY['Distinguer des homophones frequents','Choisir la bonne graphie selon le sens','Employer les mots corrects en contexte'],
 ARRAY['homophone','mer','mere','maire','verre','vert','vers','pain','pin','sens'],8,5);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- FRANCAIS CE1 - GRAMMAIRE
('primaire','CE1','francais-grammaire',1,'La nature des mots - nom, verbe, adjectif, determinant',
 ARRAY['Identifier la nature des mots principaux','Classer les mots selon leur nature','Utiliser le vocabulaire grammatical'],
 ARRAY['nom','verbe','adjectif','determinant','nature','classe grammaticale','identification'],10,1),
('primaire','CE1','francais-grammaire',2,'Le groupe nominal etendu',
 ARRAY['Identifier et etendre le GN','Utiliser des adjectifs pour enrichir le GN','Accorder tous les elements du GN'],
 ARRAY['GN','determinant','nom','adjectif','expansion','accord en genre et nombre'],8,2),
('primaire','CE1','francais-grammaire',3,'Le groupe verbal et les complements',
 ARRAY['Identifier le groupe verbal','Distinguer complement d objet direct et indirect','Reconstituer la phrase minimale'],
 ARRAY['groupe verbal','GV','COD','COI','complement','phrase minimale','sujet','predicat'],10,3),
('primaire','CE1','francais-grammaire',4,'Les types et formes de phrases',
 ARRAY['Identifier les 4 types de phrases','Distinguer phrase affirmative et negative','Transformer des phrases'],
 ARRAY['phrase declarative','interrogative','exclamative','imperative','affirmative','negative','ne pas'],8,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- FRANCAIS CE1 - CONJUGAISON
('primaire','CE1','francais-conjugaison',1,'Le present de l indicatif - verbes du 2e groupe',
 ARRAY['Conjuguer les verbes en -ir au present','Identifier les terminaisons du 2e groupe','Les distinguer des verbes du 3e groupe'],
 ARRAY['2e groupe','-ir','present','finir','choisir','terminaison','-is','-it','-issons'],10,1),
('primaire','CE1','francais-conjugaison',2,'Le futur simple',
 ARRAY['Conjuguer les verbes reguliers au futur','Identifier le radical du futur','Employer le futur pour exprimer l avenir'],
 ARRAY['futur simple','radical','-rai','-ras','-ra','-rons','-rez','-ront','avenir'],10,2),
('primaire','CE1','francais-conjugaison',3,'Le passe compose - auxiliaire avoir',
 ARRAY['Former le passe compose avec avoir','Choisir et accorder le participe passe','Employer le passe compose a l oral et a l ecrit'],
 ARRAY['passe compose','auxiliaire avoir','participe passe','accord','action passee'],10,3),
('primaire','CE1','francais-conjugaison',4,'L imparfait de l indicatif',
 ARRAY['Conjuguer les verbes a l imparfait','Identifier les terminaisons','Employer l imparfait pour la description'],
 ARRAY['imparfait','terminaison','-ais','-ait','-ions','-iez','-aient','description','duree'],10,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- MATHEMATIQUES CE1
('primaire','CE1','mathematiques',1,'Nombres jusqu a 1000',
 ARRAY['Lire, ecrire et ordonner jusqu a 1000','Comprendre la valeur positionnelle','Comparer et encadrer des nombres'],
 ARRAY['centaine','dizaine','unite','mille','valeur positionnelle','encadrement','comparaison'],12,1),
('primaire','CE1','mathematiques',2,'Tables de multiplication - de 1 a 5',
 ARRAY['Memoriser les tables de 1 a 5','Utiliser les tables pour calculer','Resoudre des problemes multiplicatifs'],
 ARRAY['table de multiplication','produit','facteur','memorisation','calcul mental','probleme'],12,2),
('primaire','CE1','mathematiques',3,'Division - partage et contenance',
 ARRAY['Comprendre la division comme partage','Calculer des divisions simples','Resoudre des problemes de partage'],
 ARRAY['division','partage','quotient','diviseur','dividende','reste','probleme'],10,3),
('primaire','CE1','mathematiques',4,'Fractions simples - demi, quart, tiers',
 ARRAY['Comprendre la notion de fraction','Reconnaitre et nommer des fractions simples','Partager des objets en parts egales'],
 ARRAY['fraction','demi','quart','tiers','numerateur','denominateur','parts egales'],8,4),
('primaire','CE1','mathematiques',5,'Mesures - perimetre et surfaces',
 ARRAY['Calculer le perimetre de figures simples','Comparer des surfaces','Utiliser les unites de longueur'],
 ARRAY['perimetre','surface','cote','rectangle','carre','metre','centimetre','comparaison'],8,5);

-- ============================================================
-- CE2
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- FRANCAIS CE2 - ORTHOGRAPHE
('primaire','CE2','francais-orthographe',1,'Homophones grammaticaux - on/ont, son/sont, mes/mais',
 ARRAY['Distinguer on et ont','Distinguer son et sont','Distinguer mes et mais'],
 ARRAY['on','ont','son','sont','mes','mais','homophone grammatical','distinction','verbe avoir'],8,1),
('primaire','CE2','francais-orthographe',2,'Accord sujet-verbe',
 ARRAY['Accorder le verbe avec son sujet','Identifier le sujet meme eloigne','Appliquer la regle d accord'],
 ARRAY['accord','sujet','verbe','nombre','singulier','pluriel','sujet eloigne','inversion'],10,2),
('primaire','CE2','francais-orthographe',3,'Le feminin des noms et adjectifs',
 ARRAY['Former le feminin des noms et adjectifs','Connaitre les regles de formation','Identifier les exceptions'],
 ARRAY['feminin','masculin','-e','doublement de consonne','exception','formation','accord'],8,3),
('primaire','CE2','francais-orthographe',4,'Les prefixes et suffixes courants',
 ARRAY['Identifier les prefixes et suffixes','Comprendre leur role dans la formation des mots','Deduire le sens de nouveaux mots'],
 ARRAY['prefixe','suffixe','re-','de-','in-','-tion','-eur','-ment','formation des mots','sens'],8,4),
('primaire','CE2','francais-orthographe',5,'Dictee preparee et correction autonome',
 ARRAY['Preparer une dictee en identifiant les difficultes','Corriger ses erreurs','Developper l autonomie orthographique'],
 ARRAY['dictee','difficulte orthographique','correction','relecture','autonomie','regle'],6,5);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- FRANCAIS CE2 - GRAMMAIRE
('primaire','CE2','francais-grammaire',1,'Les pronoms personnels sujets et COD',
 ARRAY['Identifier les pronoms personnels','Utiliser les pronoms pour eviter les repetitions','Distinguer pronom sujet et COD'],
 ARRAY['pronom personnel','sujet','COD','le','la','les','lui','leur','substitution'],8,1),
('primaire','CE2','francais-grammaire',2,'Les determinants - articles et possessifs',
 ARRAY['Identifier et employer les articles definis et indefinis','Utiliser les determinants possessifs','Accorder les determinants'],
 ARRAY['article defini','indefini','partitif','determinant possessif','mon','ton','son','notre','leur'],8,2),
('primaire','CE2','francais-grammaire',3,'La proposition et la phrase complexe',
 ARRAY['Distinguer phrase simple et complexe','Identifier la coordination','Comprendre la juxtaposition'],
 ARRAY['phrase simple','phrase complexe','proposition','coordination','juxtaposition','et','mais','ou','donc'],8,3),
('primaire','CE2','francais-grammaire',4,'Les adverbes de temps, lieu et maniere',
 ARRAY['Identifier les adverbes','Utiliser les adverbes pour preciser le verbe','Classer les adverbes'],
 ARRAY['adverbe','temps','lieu','maniere','hier','demain','ici','la','vite','bien','mal'],8,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- FRANCAIS CE2 - CONJUGAISON
('primaire','CE2','francais-conjugaison',1,'Le present - revision et verbes irreguliers',
 ARRAY['Reviser la conjugaison au present','Conjuguer les verbes irreguliers frequents','Distinguer les groupes'],
 ARRAY['present','irregulier','partir','savoir','pouvoir','vouloir','prendre','mettre','revision'],10,1),
('primaire','CE2','francais-conjugaison',2,'Le passe compose avec etre',
 ARRAY['Identifier les verbes conjugues avec etre','Accorder le participe passe avec etre','Maitriser les verbes de mouvement'],
 ARRAY['passe compose','auxiliaire etre','participe passe','accord','mouvement','aller','venir','partir','arriver'],10,2),
('primaire','CE2','francais-conjugaison',3,'Le futur - verbes irreguliers',
 ARRAY['Conjuguer les verbes irreguliers au futur','Memoriser les radicaux irreguliers','Employer le futur a bon escient'],
 ARRAY['futur','irregulier','radical','etre','avoir','aller','faire','venir','pouvoir','vouloir'],8,3),
('primaire','CE2','francais-conjugaison',4,'Le conditionnel present - introduction',
 ARRAY['Connaitre la formation du conditionnel','Comprendre son emploi pour exprimer une condition','Conjuguer les verbes usuels'],
 ARRAY['conditionnel present','si','hypothese','-rais','-rait','-rions','politesse','souhait'],8,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- MATHEMATIQUES CE2
('primaire','CE2','mathematiques',1,'Nombres jusqu a 10000',
 ARRAY['Lire, ecrire et ordonner jusqu a 10000','Comprendre la classe des unites et des milliers','Comparer et ranger'],
 ARRAY['millier','centaine','dizaine','unite','valeur positionnelle','comparaison','ordre'],12,1),
('primaire','CE2','mathematiques',2,'Tables de multiplication - de 6 a 9',
 ARRAY['Memoriser les tables de 6 a 9','Utiliser toutes les tables pour calculer','Resoudre des problemes'],
 ARRAY['table de 6','table de 7','table de 8','table de 9','produit','memorisation','calcul rapide'],12,2),
('primaire','CE2','mathematiques',3,'Multiplication posee',
 ARRAY['Poser et calculer une multiplication','Multiplier par un nombre a deux chiffres','Verifier le resultat'],
 ARRAY['multiplication posee','facteur','produit','retenue','calcul pose','verification'],10,3),
('primaire','CE2','mathematiques',4,'Division posee',
 ARRAY['Poser et effectuer une division euclidienne','Identifier quotient et reste','Resoudre des problemes'],
 ARRAY['division posee','dividende','diviseur','quotient','reste','euclidienne','probleme'],10,4),
('primaire','CE2','mathematiques',5,'Les fractions et les decimaux - introduction',
 ARRAY['Comprendre les fractions simples','Decouvrir les nombres decimaux','Lire les prix et les mesures decimales'],
 ARRAY['fraction','decimal','virgule','dixieme','centieme','prix','mesure','nombre decimal'],10,5);

-- ============================================================
-- CM1
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- FRANCAIS CM1 - ORTHOGRAPHE
('primaire','CM1','francais-orthographe',1,'Homophones grammaticaux avances - ces/ses, c est/s est, la/l a/la',
 ARRAY['Distinguer ces et ses','Distinguer c est et s est','Distinguer la adverbe, la article et l a'],
 ARRAY['ces','ses','c est','s est','la','l a','homophone','distinction','regles'],10,1),
('primaire','CM1','francais-orthographe',2,'Accord du participe passe',
 ARRAY['Accorder le participe passe employe avec etre','Comprendre l accord avec avoir','Appliquer les regles en contexte'],
 ARRAY['participe passe','accord','auxiliaire etre','auxiliaire avoir','COD','genre','nombre'],10,2),
('primaire','CM1','francais-orthographe',3,'Les mots invariables - liste etendue',
 ARRAY['Connaitre et orthographier les mots invariables','Employer les adverbes et prepositions courants','Developper la vigilance orthographique'],
 ARRAY['mot invariable','adverbe','preposition','conjonction','liste','orthographe','vigilance'],8,3),
('primaire','CM1','francais-orthographe',4,'La formation des mots - famille de mots',
 ARRAY['Identifier la famille de mots','Utiliser le radical pour deduire le sens','Orthographier les mots d une famille'],
 ARRAY['famille de mots','radical','derivation','prefixe','suffixe','sens','orthographe'],8,4),
('primaire','CM1','francais-orthographe',5,'Revision et dictee bilan',
 ARRAY['Consolider toutes les regles d orthographe','Ecrire sans erreur sous dictee','Corriger et s auto-evaluer'],
 ARRAY['revision','bilan','dictee','correction','auto-evaluation','regles','consolidation'],6,5);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- FRANCAIS CM1 - GRAMMAIRE
('primaire','CM1','francais-grammaire',1,'La fonction des mots - sujet, verbe, complement',
 ARRAY['Distinguer nature et fonction','Identifier les fonctions dans la phrase','Analyser des phrases simples et complexes'],
 ARRAY['nature','fonction','sujet','verbe','COD','COI','complement circonstanciel','analyse'],10,1),
('primaire','CM1','francais-grammaire',2,'Les propositions - independante, principale, subordonnee',
 ARRAY['Identifier les differentes propositions','Reconnaitre les conjonctions de subordination','Analyser une phrase complexe'],
 ARRAY['proposition independante','principale','subordonnee','conjonction','que','quand','si','parce que'],10,2),
('primaire','CM1','francais-grammaire',3,'Les complements circonstanciels',
 ARRAY['Identifier les CC de temps, lieu, maniere, cause','Reconnaitre leur mobilite dans la phrase','Les manipuler et les employer'],
 ARRAY['complement circonstanciel','temps','lieu','maniere','cause','CC','mobilite','suppression'],8,3),
('primaire','CM1','francais-grammaire',4,'Le discours direct et indirect - initiation',
 ARRAY['Distinguer discours direct et indirect','Transformer discours direct en indirect','Identifier les verbes introducteurs'],
 ARRAY['discours direct','indirect','verbe introducteur','guillemets','tiret','transformation','temps'],8,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- FRANCAIS CM1 - CONJUGAISON
('primaire','CM1','francais-conjugaison',1,'Revision des temps de l indicatif',
 ARRAY['Reviser present, passe compose, imparfait et futur','Distinguer les valeurs des temps','Employer les temps en contexte'],
 ARRAY['present','passe compose','imparfait','futur','valeur','contexte','revision','indicatif'],10,1),
('primaire','CM1','francais-conjugaison',2,'Le passe simple - 1er et 2e groupes',
 ARRAY['Conjuguer les verbes reguliers au passe simple','Identifier les terminaisons','Employer le passe simple a l ecrit'],
 ARRAY['passe simple','terminaison','-ai','-as','-a','-ames','-ates','-erent','ecrit','recit'],10,2),
('primaire','CM1','francais-conjugaison',3,'Le passe simple - verbes irreguliers',
 ARRAY['Conjuguer etre, avoir et les irreguliers au passe simple','Reconnaitre le passe simple en lecture','Distinguer passe simple et passe compose'],
 ARRAY['passe simple','irregulier','etre','avoir','faire','venir','prendre','voir','distinction'],10,3),
('primaire','CM1','francais-conjugaison',4,'Le subjonctif present - initiation',
 ARRAY['Connaitre la formation du subjonctif','Comprendre son emploi apres certains verbes','Conjuguer les verbes courants'],
 ARRAY['subjonctif','que','vouloir que','falloir que','-e','-es','-ions','emploi','doute'],8,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- MATHEMATIQUES CM1
('primaire','CM1','mathematiques',1,'Grands nombres et numeration',
 ARRAY['Lire et ecrire les grands nombres','Comprendre les classes de nombres','Arrondir et estimer'],
 ARRAY['million','milliard','classe des millions','arrondi','estimation','numeration','tableau de numeration'],12,1),
('primaire','CM1','mathematiques',2,'Operations sur les nombres decimaux',
 ARRAY['Additionner et soustraire des decimaux','Multiplier un decimal par un entier','Resoudre des problemes'],
 ARRAY['decimal','virgule','addition','soustraction','multiplication','probleme','alignement'],12,2),
('primaire','CM1','mathematiques',3,'Fractions et equivalences',
 ARRAY['Comparer et ordonner des fractions','Reconnaitre des fractions equivalentes','Convertir fractions et decimaux'],
 ARRAY['fraction','equivalence','simplification','comparaison','decimal','conversion','PGCD'],10,3),
('primaire','CM1','mathematiques',4,'Geometrie - angles et constructions',
 ARRAY['Identifier et mesurer des angles','Construire des figures geometriques','Connaitre les proprietes des figures'],
 ARRAY['angle','droit','aigu','obtus','rapporteur','construction','propriete','figure'],10,4),
('primaire','CM1','mathematiques',5,'Proportionnalite et pourcentages',
 ARRAY['Reconnaitre une situation proportionnelle','Calculer une valeur manquante','Calculer un pourcentage simple'],
 ARRAY['proportionnalite','coefficient','pourcentage','tableau de proportionnalite','probleme','echelle'],10,5);

-- ============================================================
-- CM2
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- FRANCAIS CM2 - ORTHOGRAPHE
('primaire','CM2','francais-orthographe',1,'Revision generale des homophones grammaticaux',
 ARRAY['Maitriser tous les homophones grammaticaux du programme','Appliquer les regles sans hesitation','Corriger ses erreurs'],
 ARRAY['homophone','a/a','on/ont','son/sont','ces/ses','la/l a','ou/ou','revision','maitrise'],10,1),
('primaire','CM2','francais-orthographe',2,'Accord dans le groupe nominal - bilan',
 ARRAY['Accorder tous les elements du GN','Identifier les accords complexes','Appliquer les regles en production ecrite'],
 ARRAY['accord','GN','determinant','nom','adjectif','genre','nombre','bilan','production ecrite'],10,2),
('primaire','CM2','francais-orthographe',3,'L accord du verbe avec son sujet - cas complexes',
 ARRAY['Accorder le verbe avec un sujet collectif','Gerer les sujets multiples','Maitriser l inversion du sujet'],
 ARRAY['accord sujet-verbe','sujet collectif','sujets multiples','inversion','qui','accord complexe'],10,3),
('primaire','CM2','francais-orthographe',4,'Preparation au CEP - dictee et expression',
 ARRAY['Consolider toutes les competences orthographiques','S entrainer a la dictee de niveau CEP','Corriger et evaluer ses performances'],
 ARRAY['CEP','dictee','correction','performance','bilan','orthographe','preparation examen'],10,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- FRANCAIS CM2 - GRAMMAIRE
('primaire','CM2','francais-grammaire',1,'Analyse grammaticale complete',
 ARRAY['Analyser la nature et la fonction de tous les mots','Analyser des phrases complexes','Utiliser le vocabulaire grammatical correct'],
 ARRAY['nature','fonction','analyse','nom','verbe','adjectif','pronom','adverbe','preposition','conjonction'],12,1),
('primaire','CM2','francais-grammaire',2,'La voix active et la voix passive',
 ARRAY['Distinguer voix active et passive','Transformer une phrase active en passive','Comprendre l effet de style'],
 ARRAY['voix active','voix passive','sujet','complement d agent','transformation','par','style'],10,2),
('primaire','CM2','francais-grammaire',3,'Les figures de style - initiation',
 ARRAY['Identifier la comparaison et la metaphore','Reconnaitre la personnification','Comprendre leur effet expressif'],
 ARRAY['comparaison','metaphore','personnification','comme','figure de style','expressivite','sens'],8,3),
('primaire','CM2','francais-grammaire',4,'Preparation au CEP - revision grammaire',
 ARRAY['Consolider toutes les notions de grammaire','S entrainer aux exercices de type CEP','Analyser et corriger des textes'],
 ARRAY['CEP','revision','analyse','exercice','correction','bilan','grammaire','preparation'],10,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- FRANCAIS CM2 - CONJUGAISON
('primaire','CM2','francais-conjugaison',1,'Revision de tous les temps - indicatif',
 ARRAY['Maitriser tous les temps de l indicatif','Distinguer les valeurs de chaque temps','Employer les bons temps en production ecrite'],
 ARRAY['indicatif','present','imparfait','passe compose','passe simple','futur','temps','valeur','revision'],12,1),
('primaire','CM2','francais-conjugaison',2,'Le conditionnel et le subjonctif - approfondissement',
 ARRAY['Conjuguer au conditionnel et au subjonctif','Comprendre leur emploi respectif','Les employer correctement en contexte'],
 ARRAY['conditionnel','subjonctif','hypothese','doute','volonte','emploi','contexte','mode'],10,2),
('primaire','CM2','francais-conjugaison',3,'Les verbes du 3e groupe - irreguliers',
 ARRAY['Conjuguer les principaux irreguliers a tous les temps','Identifier les irregularites','Memoriser les formes difficiles'],
 ARRAY['3e groupe','irregulier','prendre','mettre','battre','suivre','courir','mourir','naitre','connaitre'],12,3),
('primaire','CM2','francais-conjugaison',4,'Preparation au CEP - conjugaison',
 ARRAY['Consolider toutes les competences en conjugaison','S entrainer aux exercices de type CEP','Reviser les verbes irreguliers'],
 ARRAY['CEP','conjugaison','revision','exercice','irregulier','temps','mode','preparation examen'],10,4);

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
-- MATHEMATIQUES CM2
('primaire','CM2','mathematiques',1,'Operations sur les decimaux - bilan',
 ARRAY['Maitriser les quatre operations sur les decimaux','Resoudre des problemes complexes','Verifier et estimer les resultats'],
 ARRAY['decimal','addition','soustraction','multiplication','division','probleme complexe','verification','estimation'],12,1),
('primaire','CM2','mathematiques',2,'Geometrie - perimetre, aire et volume',
 ARRAY['Calculer perimetre et aire de figures diverses','Decouvrir la notion de volume','Resoudre des problemes de mesure'],
 ARRAY['perimetre','aire','volume','rectangle','triangle','cercle','cube','parallelepipede','unite'],12,2),
('primaire','CM2','mathematiques',3,'Statistiques et probabilites - initiation',
 ARRAY['Lire et construire des graphiques','Calculer la moyenne','Comprendre la notion de chance'],
 ARRAY['graphique','tableau','moyenne','probabilite','frequence','chance','certain','impossible'],8,3),
('primaire','CM2','mathematiques',4,'Preparation au CEP - mathematiques',
 ARRAY['Consolider toutes les notions mathematiques','S entrainer sur des exercices de type CEP','Gerer le temps en situation d examen'],
 ARRAY['CEP','revision','probleme','calcul','geometrie','mesure','numeraltion','preparation examen'],10,4);

-- ============================================================
-- EVEIL - SCIENCES CP1 -> CM2
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('primaire','CP1','eveil-sciences',1,'Le corps humain - les parties du corps',
 ARRAY['Nommer les principales parties du corps','Connaitre les organes des sens','Prendre soin de son corps'],
 ARRAY['tete','tronc','membres','organes des sens','hygiene','sante','corps humain'],6,1),
('primaire','CP2','eveil-sciences',1,'Les etres vivants et le milieu',
 ARRAY['Distinguer etres vivants et non vivants','Decrire le milieu de vie des animaux','Observer la nature'],
 ARRAY['etre vivant','non vivant','milieu','habitat','observation','animal','plante'],6,1),
('primaire','CE1','eveil-sciences',1,'L eau dans la nature',
 ARRAY['Identifier les etats de l eau','Decrire le cycle de l eau','Comprendre l importance de l eau'],
 ARRAY['eau','solide','liquide','vapeur','cycle','pluie','evaporation','nuage','importance'],8,1),
('primaire','CE2','eveil-sciences',1,'La sante et l hygiene',
 ARRAY['Identifier les maladies courantes','Comprendre les moyens de prevention','Adopter des comportements sains'],
 ARRAY['maladie','paludisme','diarrhee','prevention','vaccination','hygiene','sante','comportement'],8,1),
('primaire','CM1','eveil-sciences',1,'L alimentation et la nutrition',
 ARRAY['Connaitre les groupes alimentaires','Comprendre les besoins nutritifs','Elaborer un menu equilibre'],
 ARRAY['aliment','nutriment','glucide','lipide','proteine','vitamine','equilibre','menu'],8,1),
('primaire','CM2','eveil-sciences',1,'L environnement et le developpement durable',
 ARRAY['Identifier les problemes environnementaux locaux','Comprendre le developpement durable','Proposer des actions eco-responsables'],
 ARRAY['environnement','pollution','deforestation','biodiversite','durable','recyclage','eco-responsable'],8,1);

-- ============================================================
-- EVEIL - HISTOIRE-GEO PRIMAIRE
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('primaire','CE1','eveil-histoire-geo',1,'Ma famille et mon quartier',
 ARRAY['Decrire sa famille et son environnement proche','Reconnaitre les membres de la famille','Situer son quartier'],
 ARRAY['famille','quartier','voisinage','plan','rue','maison','relation','parents'],6,1),
('primaire','CE2','eveil-histoire-geo',1,'La Cote d Ivoire - ma region et ma ville',
 ARRAY['Identifier sa region dans la Cote d Ivoire','Connaitre les activites economiques locales','Lire une carte simple'],
 ARRAY['region','ville','chef-lieu','carte','activite','agriculture','commerce','district'],8,1),
('primaire','CM1','eveil-histoire-geo',1,'La Cote d Ivoire - histoire et geographie',
 ARRAY['Connaitre les grandes etapes de l histoire de la Cote d Ivoire','Localiser les regions','Decrire l organisation du pays'],
 ARRAY['colonisation','independance','Houphouet-Boigny','region','district','capitale','Abidjan','Yamoussoukro'],10,1),
('primaire','CM2','eveil-histoire-geo',1,'L Afrique et le monde',
 ARRAY['Situer la Cote d Ivoire en Afrique et dans le monde','Connaitre les continents et oceans','Comprendre les echanges mondiaux'],
 ARRAY['Afrique','continent','ocean','planisphere','echange','commerce','mondialisation','CEDEAO'],10,1);

-- ============================================================
-- ANGLAIS PRIMAIRE (CE1 -> CM2)
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('primaire','CE1','anglais',1,'Colours, numbers and classroom',
 ARRAY['Nommer les couleurs et chiffres de 1 a 20','Identifier les objets de la classe','Comprendre des consignes simples'],
 ARRAY['colours','numbers 1-20','classroom','pencil','book','chair','table','instructions'],8,1),
('primaire','CE2','anglais',1,'My family and my body',
 ARRAY['Nommer les membres de la famille','Decrire les parties du corps','Utiliser have got et to be'],
 ARRAY['family','body parts','have got','to be','mother','father','head','arm','leg'],8,1),
('primaire','CM1','anglais',1,'Animals and environment',
 ARRAY['Nommer les animaux domestiques et sauvages','Decrire l environnement','Utiliser can pour exprimer la capacite'],
 ARRAY['animals','wild','domestic','can','environment','farm','forest','run','swim','fly'],8,1),
('primaire','CM2','anglais',1,'My country and the world',
 ARRAY['Parler de la Cote d Ivoire en anglais','Decrire le temps qu il fait','Preparer au college'],
 ARRAY['Ivory Coast','capital','weather','sunny','rainy','hot','country','flag','preparation'],8,1);

