-- ============================================================
-- REFERENTIEL MENA-CI - FRANCAIS COLLEGE
-- Orthographe, Grammaire, Conjugaison
-- 6eme, 5eme, 4eme, 3eme
-- ============================================================

-- ============================================================
-- 6EME - ORTHOGRAPHE
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','6eme','francais-orthographe',1,'Revision des accords de base - genre et nombre',
 ARRAY['Accorder determinant, nom et adjectif','Appliquer les regles de base du pluriel','Distinguer singulier et pluriel dans un texte'],
 ARRAY['accord','genre','nombre','singulier','pluriel','determinant','nom','adjectif','GN'],8,1),
('college','6eme','francais-orthographe',2,'Les homophones grammaticaux fondamentaux',
 ARRAY['Distinguer a et a','Distinguer on et ont','Distinguer son et sont','Distinguer et et est'],
 ARRAY['a/a','on/ont','son/sont','et/est','homophone','distinction','verbe','preposition'],8,2),
('college','6eme','francais-orthographe',3,'Le pluriel des noms et adjectifs - cas particuliers',
 ARRAY['Former le pluriel des noms en -al, -eau, -eu','Connaitre les pluriels irreguliers','Appliquer les regles en production ecrite'],
 ARRAY['pluriel','-al/-aux','-eau/-eaux','-eu/-eux','irregulier','exception','accord','production'],8,3),
('college','6eme','francais-orthographe',4,'Les lettres muettes et les consonnes doubles',
 ARRAY['Identifier les lettres muettes en fin de mot','Orthographier les mots avec consonnes doubles','Utiliser des strategies de memorisation'],
 ARRAY['lettre muette','consonne double','estrategie','memorisation','dictee','vigilance','erreur'],6,4),
('college','6eme','francais-orthographe',5,'Homophones lexicaux courants',
 ARRAY['Distinguer les homophones lexicaux frequents','Choisir la bonne graphie selon le sens','Enrichir son lexique orthographique'],
 ARRAY['homophone lexical','sens','graphie','contexte','dictionnaire','verification','orthographe'],6,5);

-- ============================================================
-- 6EME - GRAMMAIRE
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','6eme','francais-grammaire',1,'Les classes grammaticales - nature des mots',
 ARRAY['Identifier la nature des mots principaux','Distinguer mots variables et invariables','Utiliser le vocabulaire grammatical'],
 ARRAY['nom','verbe','adjectif','determinant','pronom','adverbe','preposition','conjonction','nature'],10,1),
('college','6eme','francais-grammaire',2,'La phrase simple - sujet et predicat',
 ARRAY['Identifier le sujet et le groupe verbal','Reconnaitre la phrase minimale','Distinguer les fonctions essentielles'],
 ARRAY['sujet','predicat','groupe verbal','GV','fonction','phrase minimale','GN sujet'],8,2),
('college','6eme','francais-grammaire',3,'Les complements du verbe - COD et COI',
 ARRAY['Identifier le complement d objet direct','Identifier le complement d objet indirect','Distinguer COD et COI'],
 ARRAY['COD','COI','complement d objet','direct','indirect','preposition','a','de','manipulation'],8,3),
('college','6eme','francais-grammaire',4,'Les complements circonstanciels',
 ARRAY['Identifier les CC de temps, lieu et maniere','Reconnaitre leur mobilite dans la phrase','Les employer pour enrichir un texte'],
 ARRAY['complement circonstanciel','CC temps','CC lieu','CC maniere','mobilite','suppression','deplacement'],8,4),
('college','6eme','francais-grammaire',5,'Les types et formes de phrases',
 ARRAY['Identifier les quatre types de phrases','Distinguer forme affirmative et negative','Transformer des phrases'],
 ARRAY['declarative','interrogative','exclamative','imperative','affirmative','negative','ne pas','transformation'],6,5);

-- ============================================================
-- 6EME - CONJUGAISON
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','6eme','francais-conjugaison',1,'Le present de l indicatif - revision et approfondissement',
 ARRAY['Conjuguer tous les groupes au present','Maitriser les verbes irreguliers courants','Employer le present en contexte'],
 ARRAY['present','1er groupe','2e groupe','3e groupe','irregulier','etre','avoir','aller','faire','venir'],10,1),
('college','6eme','francais-conjugaison',2,'Le passe compose - revision et accord du PP',
 ARRAY['Former le passe compose avec avoir et etre','Accorder correctement le participe passe','Distinguer les deux auxiliaires'],
 ARRAY['passe compose','auxiliaire avoir','auxiliaire etre','participe passe','accord','COD','mouvement'],10,2),
('college','6eme','francais-conjugaison',3,'L imparfait de l indicatif',
 ARRAY['Conjuguer a l imparfait','Comprendre ses valeurs - description, habitude, duree','L employer dans un recit'],
 ARRAY['imparfait','terminaison','-ais','-ait','-ions','description','habitude','duree','recit'],8,3),
('college','6eme','francais-conjugaison',4,'Le futur simple',
 ARRAY['Conjuguer au futur simple','Maitriser les radicaux irreguliers','Employer le futur pour exprimer une action a venir'],
 ARRAY['futur simple','radical','irregulier','etre','avoir','aller','faire','venir','avenir','projet'],8,4),
('college','6eme','francais-conjugaison',5,'Le futur et le conditionnel present - distinction',
 ARRAY['Distinguer futur simple et conditionnel','Comprendre la valeur du conditionnel','Employer le conditionnel pour exprimer une hypothese'],
 ARRAY['futur','conditionnel','hypothese','si','politesse','souhait','distinction','terminaison'],6,5);

-- ============================================================
-- 5EME - ORTHOGRAPHE
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','5eme','francais-orthographe',1,'L accord du verbe avec son sujet - cas complexes',
 ARRAY['Accorder le verbe avec un sujet eloigne','Gerer les sujets multiples','Maitriser l inversion du sujet'],
 ARRAY['accord sujet-verbe','sujet eloigne','sujets multiples','inversion','qui','pronom relatif','complexe'],8,1),
('college','5eme','francais-orthographe',2,'Les homophones avances - quand/quant/qu en, quel/quelle',
 ARRAY['Distinguer quand, quant et qu en','Distinguer quel, quelle, qu elle','Appliquer les regles en contexte'],
 ARRAY['quand','quant','qu en','quel','quelle','qu elle','homophone','distinction','regles'],8,2),
('college','5eme','francais-orthographe',3,'L accord du participe passe avec avoir',
 ARRAY['Appliquer la regle d accord du PP avec avoir','Identifier le COD avant le verbe','Analyser des phrases complexes'],
 ARRAY['participe passe','auxiliaire avoir','COD','accord','antecedent','genre','nombre','analyse'],10,3),
('college','5eme','francais-orthographe',4,'Les suffixes et prefixes - orthographe des derives',
 ARRAY['Orthographier les mots derives','Utiliser la morphologie pour eviter les erreurs','Etendre son vocabulaire'],
 ARRAY['suffixe','prefixe','derive','morphologie','famille de mots','radical','formation','sens'],8,4),
('college','5eme','francais-orthographe',5,'Dictee et auto-correction',
 ARRAY['Identifier ses erreurs recurrentes','Developper des strategies de correction','Progresser en autonomie orthographique'],
 ARRAY['dictee','erreur','correction','strategie','autonomie','relecture','progres','bilan'],6,5);

-- ============================================================
-- 5EME - GRAMMAIRE
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','5eme','francais-grammaire',1,'Les pronoms - personnels, possessifs, demonstratifs',
 ARRAY['Identifier et employer les pronoms','Utiliser les pronoms pour eviter les repetitions','Accorder les pronoms'],
 ARRAY['pronom personnel','possessif','demonstratif','relatif','substitution','accord','reference'],10,1),
('college','5eme','francais-grammaire',2,'La phrase complexe - coordination et juxtaposition',
 ARRAY['Distinguer phrase simple et complexe','Identifier les conjonctions de coordination','Analyser les relations entre propositions'],
 ARRAY['phrase complexe','coordination','juxtaposition','et','mais','ou','donc','car','ni','or'],8,2),
('college','5eme','francais-grammaire',3,'La proposition subordonnee relative',
 ARRAY['Identifier la subordonnee relative','Utiliser les pronoms relatifs','Analyser l antecedent'],
 ARRAY['subordonnee relative','antecedent','pronom relatif','qui','que','dont','ou','lequel','enrichissement'],10,3),
('college','5eme','francais-grammaire',4,'Les expansions du nom',
 ARRAY['Identifier les differentes expansions du nom','Utiliser adjectif, complement du nom et relative','Enrichir le GN'],
 ARRAY['expansion du nom','adjectif','complement du nom','proposition relative','GN','enrichissement','style'],8,4),
('college','5eme','francais-grammaire',5,'Analyse grammaticale de la phrase simple',
 ARRAY['Analyser tous les constituants de la phrase simple','Identifier nature et fonction','Utiliser le vocabulaire grammatical precis'],
 ARRAY['analyse','nature','fonction','sujet','verbe','COD','COI','CC','attribut','epithete'],8,5);

-- ============================================================
-- 5EME - CONJUGAISON
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','5eme','francais-conjugaison',1,'Le passe simple - 1er et 2e groupes',
 ARRAY['Conjuguer les verbes reguliers au passe simple','Identifier les terminaisons caracteristiques','Reconnaitre le passe simple en lecture'],
 ARRAY['passe simple','1er groupe','2e groupe','terminaison','-ai','-as','-a','-ames','-ates','-erent','recit'],10,1),
('college','5eme','francais-conjugaison',2,'Le passe simple - verbes irreguliers',
 ARRAY['Conjuguer etre, avoir et les irreguliers au passe simple','Distinguer passe simple et passe compose','Employer le passe simple dans un recit'],
 ARRAY['passe simple','irregulier','etre','avoir','faire','venir','prendre','voir','vouloir','distinction'],10,2),
('college','5eme','francais-conjugaison',3,'L imparfait et le passe simple dans le recit',
 ARRAY['Distinguer les valeurs de l imparfait et du passe simple','Employer les deux temps en coherence','Analyser leur alternance dans un texte'],
 ARRAY['imparfait','passe simple','premier plan','arriere-plan','duree','action','recit','alternance'],10,3),
('college','5eme','francais-conjugaison',4,'Le subjonctif present - formation et emploi',
 ARRAY['Former le subjonctif present','Identifier ses contextes d emploi','Conjuguer les verbes courants au subjonctif'],
 ARRAY['subjonctif','que','vouloir que','falloir que','bien que','pour que','formation','mode','emploi'],8,4),
('college','5eme','francais-conjugaison',5,'Les modes - indicatif, subjonctif, conditionnel, imperatif',
 ARRAY['Distinguer les quatre modes principaux','Comprendre la valeur de chaque mode','Employer le bon mode en contexte'],
 ARRAY['mode','indicatif','subjonctif','conditionnel','imperatif','valeur','certitude','doute','ordre','hypothese'],8,5);

-- ============================================================
-- 4EME - ORTHOGRAPHE
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','4eme','francais-orthographe',1,'L accord du participe passe - revision et cas complexes',
 ARRAY['Maitriser l accord du PP avec avoir et etre','Traiter les cas du PP employe avec faire','Analyser des phrases complexes'],
 ARRAY['participe passe','avoir','etre','faire','accord','COD','sujet','cas complexe','analyse'],10,1),
('college','4eme','francais-orthographe',2,'Homophones complexes - davantage/d avantage, quoi que/quoique',
 ARRAY['Distinguer les homophones complexes','Appliquer les regles d emploi','Produire des phrases correctes'],
 ARRAY['davantage','d avantage','quoi que','quoique','sans que','sans','homophone complexe','distinction'],8,2),
('college','4eme','francais-orthographe',3,'L orthographe des verbes - confusions frequentes',
 ARRAY['Distinguer -er et -e pour les verbes du 1er groupe','Ne pas confondre infinitif et participe passe','Orthographier correctement en contexte'],
 ARRAY['infinitif -er','participe passe -e','confusion','1er groupe','contexte','substitution','avoir'],8,3),
('college','4eme','francais-orthographe',4,'La ponctuation expressive et ses effets de style',
 ARRAY['Employer la ponctuation de maniere expressive','Comprendre l effet des points de suspension','Utiliser les guillemets et le tiret'],
 ARRAY['ponctuation','points de suspension','guillemets','tiret','parentheses','effet de style','expressivite'],6,4),
('college','4eme','francais-orthographe',5,'Bilan orthographique et dictee de niveau',
 ARRAY['Evaluer ses acquis orthographiques','Identifier ses erreurs types','Produire une dictee sans faute'],
 ARRAY['bilan','evaluation','dictee','erreur type','progres','correction','revision','niveau'],6,5);

-- ============================================================
-- 4EME - GRAMMAIRE
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','4eme','francais-grammaire',1,'Les propositions subordonnees conjonctives',
 ARRAY['Identifier les subordonnees conjonctives','Distinguer completive et circonstancielle','Analyser les relations logiques'],
 ARRAY['subordonnee conjonctive','completive','circonstancielle','que','quand','si','parce que','pour que'],10,1),
('college','4eme','francais-grammaire',2,'Les propositions subordonnees circonstancielles - valeurs',
 ARRAY['Identifier la valeur des subordonnees circonstancielles','Distinguer temps, cause, consequence, but, concession','Employer les bons connecteurs'],
 ARRAY['temps','cause','consequence','but','concession','condition','conjonction','valeur','connecteur'],10,2),
('college','4eme','francais-grammaire',3,'La voix passive',
 ARRAY['Distinguer voix active et passive','Transformer une phrase active en passive','Comprendre l effet de la voix passive'],
 ARRAY['voix active','voix passive','complement d agent','par','transformation','sujet','effet','style'],8,3),
('college','4eme','francais-grammaire',4,'Le discours rapporte - direct et indirect',
 ARRAY['Transformer discours direct en indirect','Appliquer les changements de temps et de personnes','Identifier les verbes introducteurs'],
 ARRAY['discours direct','indirect','verbe introducteur','concordance des temps','personne','transformation','guillemets'],10,4),
('college','4eme','francais-grammaire',5,'Analyse grammaticale de la phrase complexe',
 ARRAY['Analyser une phrase complexe','Identifier toutes les propositions','Determiner nature et fonction de chaque element'],
 ARRAY['analyse grammaticale','phrase complexe','proposition','nature','fonction','subordonnee','principale','independante'],10,5);

-- ============================================================
-- 4EME - CONJUGAISON
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','4eme','francais-conjugaison',1,'Le subjonctif - approfondissement',
 ARRAY['Maitriser le subjonctif present et passe','Identifier tous les contextes d emploi','Distinguer indicatif et subjonctif'],
 ARRAY['subjonctif present','subjonctif passe','emploi','doute','volonte','sentiment','opposition','distinction'],10,1),
('college','4eme','francais-conjugaison',2,'Le conditionnel - present et passe',
 ARRAY['Conjuguer au conditionnel present et passe','Comprendre les valeurs du conditionnel','Employer le conditionnel dans une hypothese'],
 ARRAY['conditionnel present','conditionnel passe','hypothese','si','politesse','souhait','regret','irreel'],10,2),
('college','4eme','francais-conjugaison',3,'La concordance des temps dans le discours indirect',
 ARRAY['Appliquer la concordance des temps','Transformer le discours direct en indirect','Maitriser les changements temporels'],
 ARRAY['concordance des temps','discours indirect','present->imparfait','futur->conditionnel','passe compose->plus-que-parfait'],10,3),
('college','4eme','francais-conjugaison',4,'Le plus-que-parfait et l anteriorite',
 ARRAY['Former et employer le plus-que-parfait','Exprimer l anteriorite par rapport a un autre passe','L analyser dans des textes litteraires'],
 ARRAY['plus-que-parfait','formation','anteriorite','apres que','avant que','quand','recit','passe'],8,4),
('college','4eme','francais-conjugaison',5,'Revision des modes et des temps - tableau de synthese',
 ARRAY['Recapituler tous les modes et leurs valeurs','Choisir le bon mode et temps en contexte','Produire des textes avec variete temporelle'],
 ARRAY['revision','synthese','modes','temps','valeur','indicatif','subjonctif','conditionnel','imperatif','choix'],8,5);

-- ============================================================
-- 3EME - ORTHOGRAPHE
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','3eme','francais-orthographe',1,'Maitrise des homophones grammaticaux - bilan complet',
 ARRAY['Maitriser tous les homophones grammaticaux du college','Produire des textes sans erreurs d homophones','S auto-corriger efficacement'],
 ARRAY['homophones','bilan','maitrise','revision','auto-correction','production ecrite','vigilance'],8,1),
('college','3eme','francais-orthographe',2,'L accord dans les groupes complexes',
 ARRAY['Accorder dans des GN etendus et complexes','Gerer les accords a distance','Analyser des phrases litteraires'],
 ARRAY['accord complexe','GN etendu','distance','adjectif epithete','attribut','apposition','litterature'],10,2),
('college','3eme','francais-orthographe',3,'Les neologismes et emprunts - orthographe',
 ARRAY['Orthographier les mots empruntes au francais moderne','Adapter les mots etrangers','Enrichir son lexique actif'],
 ARRAY['neologisme','emprunt','anglicisme','adaptation','lexique','orthographe','moderne','usage'],6,3),
('college','3eme','francais-orthographe',4,'Preparation au BEPC - orthographe et dictee',
 ARRAY['S entrainer a la dictee de niveau BEPC','Identifier les difficultes specifiques au BEPC','Developper une strategie de relecture'],
 ARRAY['BEPC','dictee','preparation','strategie','relecture','difficulte','niveau','examen'],10,4);

-- ============================================================
-- 3EME - GRAMMAIRE
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','3eme','francais-grammaire',1,'Analyse grammaticale complete - revision',
 ARRAY['Analyser toutes les structures de phrase','Maitriser le vocabulaire grammatical','Produire une analyse precise et complete'],
 ARRAY['analyse complete','nature','fonction','phrase simple','complexe','proposition','subordonnee','revision'],12,1),
('college','3eme','francais-grammaire',2,'Les figures de style - etude approfondie',
 ARRAY['Identifier et analyser les figures de style','Comprendre leur effet dans un texte','Les employer dans sa propre production'],
 ARRAY['metaphore','comparaison','personnification','hyperbole','antithese','ironie','anaphore','effet','production'],10,2),
('college','3eme','francais-grammaire',3,'La modalisation - expression du point de vue',
 ARRAY['Identifier les marques de modalisation','Comprendre la subjectivite dans le texte','Analyser le point de vue de l auteur'],
 ARRAY['modalisation','point de vue','subjectivite','adverbe modal','verbe modal','certainement','probablement','peut-etre'],8,3),
('college','3eme','francais-grammaire',4,'Preparation au BEPC - grammaire et analyse',
 ARRAY['S entrainer aux exercices de grammaire du BEPC','Maitriser la methode d analyse','Repondre avec precision aux questions'],
 ARRAY['BEPC','grammaire','analyse','methode','precision','exercice','preparation','examen'],10,4);

-- ============================================================
-- 3EME - CONJUGAISON
-- ============================================================

INSERT INTO programmes_mena (cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence) VALUES
('college','3eme','francais-conjugaison',1,'Revision generale de tous les temps de l indicatif',
 ARRAY['Maitriser tous les temps de l indicatif','Distinguer leurs valeurs respectives','Les employer avec precision dans un texte'],
 ARRAY['indicatif','present','imparfait','passe compose','passe simple','futur','conditionnel','plus-que-parfait','valeur'],12,1),
('college','3eme','francais-conjugaison',2,'Le subjonctif - revision et cas particuliers',
 ARRAY['Maitriser le subjonctif present et passe','Identifier tous les contextes d emploi','Analyser le subjonctif dans des textes litteraires'],
 ARRAY['subjonctif','present','passe','emploi','bien que','pour que','doute','volonte','litterature'],10,2),
('college','3eme','francais-conjugaison',3,'Les verbes difficiles - conjugaison des irreguliers',
 ARRAY['Conjuguer les verbes irreguliers difficiles a tous les temps','Eviter les erreurs frequentes','Maitriser les formes rares'],
 ARRAY['irregulier','difficile','vaincre','coudre','moudre','absoudre','naitre','connaitre','croitre','forme rare'],10,3),
('college','3eme','francais-conjugaison',4,'Preparation au BEPC - conjugaison et expression',
 ARRAY['S entrainer aux exercices de conjugaison du BEPC','Employer les temps avec pertinence dans l expression ecrite','Corriger les erreurs de conjugaison'],
 ARRAY['BEPC','conjugaison','expression ecrite','pertinence','correction','erreur','preparation','examen','niveau'],10,4);

