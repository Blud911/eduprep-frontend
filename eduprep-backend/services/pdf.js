// ============================================================
// services/pdf.js
// Génération PDF format DREN/Inspection — EduPrep CI
// Utilise PDFKit (npm install pdfkit)
// ============================================================

const PDFDocument = require('pdfkit');

// Couleurs EduPrep / DREN
const COLORS = {
  forest:     '#1B5E20',
  forestMid:  '#2E7D32',
  gold:       '#F9A825',
  text:       '#1A1A1A',
  text2:      '#4A4A4A',
  text3:      '#757575',
  border:     '#C8E6C9',
  surface:    '#F1F8E9',
  white:      '#FFFFFF',
};

// ============================================================
// FICHE PÉDAGOGIQUE FORMAT DREN
// ============================================================
function generateFichePDF(fiche, meta) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 40, bottom: 40, left: 50, right: 50 },
      info: {
        Title: `Fiche — ${meta.titre_lecon}`,
        Author: meta.enseignant || 'EduPrep CI',
        Subject: `${meta.matiere} ${meta.classe}`,
        Creator: 'EduPrep CI — NexeraSecurité',
      },
    });

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageW = doc.page.width - 100; // largeur utile

    // ---- EN-TÊTE OFFICIEL ----
    // Rectangle vert en-tête
    doc.rect(50, 40, pageW, 65).fill(COLORS.forest);

    // Logo / Titre ministère
    doc.fontSize(8).fillColor(COLORS.white)
      .text('REPUBLIQUE DE COTE D\'IVOIRE', 55, 48, { width: pageW - 10 })
      .text('Ministère de l\'Education Nationale et de l\'Alphabétisation', 55, 58, { width: pageW - 10 })
      .text('Direction Régionale de l\'Education Nationale (DREN)', 55, 68, { width: pageW - 10 });

    doc.fontSize(14).font('Helvetica-Bold').fillColor(COLORS.gold)
      .text('FICHE DE PRÉPARATION DE COURS', 55, 82, { width: pageW - 10, align: 'right' });

    // ---- INFOS ENSEIGNANT ----
    doc.rect(50, 115, pageW, 1).fill(COLORS.border);
    doc.fontSize(9).font('Helvetica').fillColor(COLORS.text2);

    const col1 = 55, col2 = 300;
    let y = 122;

    const infoRow = (label, value, x, yPos) => {
      doc.font('Helvetica-Bold').text(label + ' : ', x, yPos, { continued: true })
        .font('Helvetica').text(value || '___________________');
    };

    infoRow('Enseignant(e)', meta.enseignant || '', col1, y);
    infoRow('Établissement', meta.etablissement || '', col2, y);
    y += 16;
    infoRow('Matière', meta.matiere || '', col1, y);
    infoRow('Classe', meta.classe || '', col2, y);
    y += 16;
    infoRow('Durée', (meta.duree_minutes || 55) + ' minutes', col1, y);
    infoRow('Type de séance', meta.type_seance || 'Découverte', col2, y);
    y += 16;
    infoRow('Date', meta.date || new Date().toLocaleDateString('fr-FR'), col1, y);
    infoRow('Année scolaire', meta.annee_scolaire || '2025-2026', col2, y);

    y += 20;
    doc.rect(50, y, pageW, 1).fill(COLORS.border);
    y += 8;

    // ---- TITRE LEÇON ----
    doc.rect(50, y, pageW, 28).fill(COLORS.surface);
    doc.fontSize(13).font('Helvetica-Bold').fillColor(COLORS.forest)
      .text(meta.titre_lecon || 'Titre de la leçon', 55, y + 7, { width: pageW - 10, align: 'center' });
    y += 36;

    // ---- SECTION : COMPÉTENCE ----
    // FIX 11/09/2026 : champs du format APC affichés à l'écran depuis le
    // 02/08/2026 (competence, exemple_situation, tableau_habiletes_contenus)
    // mais jamais ajoutés au rendu PDF — generateFichePDF ne lisait toujours
    // que l'ancien sous-ensemble de champs. Ordre aligné sur renderFiche()
    // (app.html) : Compétence → Exemple de situation → (Objectif général /
    // Objectifs spécifiques / Matériel, inchangés) → Tableau habiletés et
    // contenus → Déroulement.
    if (fiche.competence) {
      y = sectionTitle(doc, 'COMPÉTENCE', y, pageW);
      doc.fontSize(10).font('Helvetica').fillColor(COLORS.text)
        .text(fiche.competence, 55, y, { width: pageW - 10 });
      y = doc.y + 8;
    }

    // ---- SECTION : EXEMPLE DE SITUATION ----
    if (fiche.exemple_situation) {
      y = sectionTitle(doc, 'EXEMPLE DE SITUATION', y, pageW);
      doc.fontSize(10).font('Helvetica').fillColor(COLORS.text)
        .text(fiche.exemple_situation, 55, y, { width: pageW - 10 });
      y = doc.y + 8;
    }

    // Compétence + exemple de situation peuvent être longs (jusqu'à 2000
    // caractères pour exemple_situation, cf. plafonds content.js) — la suite
    // n'est plus garantie proche du haut de page comme avant ce correctif.
    if (y > 650) { doc.addPage(); y = 40; }

    // ---- SECTION : OBJECTIF GÉNÉRAL ----
    y = sectionTitle(doc, 'OBJECTIF GÉNÉRAL', y, pageW);
    doc.fontSize(10).font('Helvetica').fillColor(COLORS.text)
      .text(fiche.objectif_general || '', 55, y, { width: pageW - 10 });
    y = doc.y + 8;

    // ---- SECTION : OBJECTIFS SPÉCIFIQUES ----
    y = sectionTitle(doc, 'OBJECTIFS SPÉCIFIQUES', y, pageW);
    // Plafond défensif : /fiche-direct accepte du JSON brut du client (pas
    // seulement une fiche déjà générée par l'IA) — évite qu'un tableau
    // anormalement long ne fasse tourner le rendu PDFKit (synchrone/CPU)
    // pendant un temps disproportionné sur le CPU limité de Render Free.
    const objs = (fiche.objectifs_specifiques || []).slice(0, 30);
    objs.forEach((obj, i) => {
      doc.fontSize(10).font('Helvetica').fillColor(COLORS.text)
        .text(`${i + 1}. ${obj}`, 60, y, { width: pageW - 15 });
      y = doc.y + 3;
    });
    y += 5;

    // ---- SECTION : MATÉRIEL ----
    if (fiche.materiel && fiche.materiel.length) {
      y = sectionTitle(doc, 'MATÉRIEL DIDACTIQUE', y, pageW);
      doc.fontSize(10).font('Helvetica').fillColor(COLORS.text)
        .text(fiche.materiel.join(' · '), 55, y, { width: pageW - 10 });
      y = doc.y + 8;
    }

    // ---- SECTION : TABLEAU DES HABILETÉS ET DES CONTENUS ----
    const habiletes = (fiche.tableau_habiletes_contenus || []).slice(0, 60);
    if (habiletes.length) {
      if (y > 650) { doc.addPage(); y = 40; }
      y = sectionTitle(doc, 'TABLEAU DES HABILETÉS ET DES CONTENUS', y, pageW);
      y = drawHabiletesTable(doc, habiletes, y, pageW);
    }

    // ---- SECTION : DÉROULEMENT ----
    if (y > 680) { doc.addPage(); y = 40; }
    y = sectionTitle(doc, 'DÉROULEMENT DE LA SÉANCE', y, pageW);

    const phases = (fiche.phases || []).slice(0, 30);
    phases.forEach((phase, i) => {
      // Vérifier si on a besoin d'une nouvelle page
      if (y > 700) { doc.addPage(); y = 40; }

      // En-tête phase
      doc.rect(55, y, pageW - 5, 20).fill(COLORS.forestMid);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.white)
        .text(`${phase.nom || 'Phase ' + (i + 1)}`, 60, y + 5, { continued: true })
        .font('Helvetica').text(`  —  ${phase.duree || ''}`, { continued: false });
      y += 22;

      // Contenu phase
      doc.fontSize(9).font('Helvetica').fillColor(COLORS.text)
        .text(phase.desc || phase.description || '', 60, y, { width: pageW - 15 });
      y = doc.y;

      if (phase.methode) {
        doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.text3)
          .text('Méthode : ', 60, y + 3, { continued: true })
          .font('Helvetica').text(phase.methode);
        y = doc.y;
      }
      y += 6;
    });

    // ---- SECTION : ÉVALUATION ----
    if (fiche.evaluation) {
      if (y > 680) { doc.addPage(); y = 40; }
      y = sectionTitle(doc, 'ÉVALUATION FORMATIVE', y, pageW);
      doc.fontSize(10).font('Helvetica').fillColor(COLORS.text)
        .text(typeof fiche.evaluation === 'object' ? JSON.stringify(fiche.evaluation) : fiche.evaluation, 55, y, { width: pageW - 10 });
      y = doc.y + 8;
    }

    // ---- SECTION : COMPÉTENCES ----
    if (fiche.competences && fiche.competences.length) {
      if (y > 680) { doc.addPage(); y = 40; }
      y = sectionTitle(doc, 'COMPÉTENCES VISÉES', y, pageW);
      fiche.competences.slice(0, 30).forEach(comp => {
        doc.fontSize(10).font('Helvetica').fillColor(COLORS.text)
          .text('• ' + comp, 60, y, { width: pageW - 15 });
        y = doc.y + 2;
      });
      y += 5;
    }

    // ---- SIGNATURES ----
    if (y > 680) { doc.addPage(); y = 40; }
    y += 20;
    doc.rect(50, y, pageW, 1).fill(COLORS.border);
    y += 10;

    doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.text2);
    doc.text('Signature de l\'enseignant(e)', col1, y)
      .text('Visa du Directeur / Inspecteur', col2, y);
    y += 40;
    doc.rect(col1, y, 180, 1).fill(COLORS.text3);
    doc.rect(col2, y, 180, 1).fill(COLORS.text3);

    // ---- PIED DE PAGE ----
    const pageH = doc.page.height;
    doc.fontSize(7).fillColor(COLORS.text3)
      .text(
        `Généré par EduPrep CI — ${new Date().toLocaleDateString('fr-FR')} | Programme MENA officiel | NexeraSecurité © 2026`,
        50, pageH - 30, { width: pageW, align: 'center' }
      );

    doc.end();
  });
}

// ============================================================
// PROGRESSION ANNUELLE FORMAT DREN
// ============================================================
function generateProgressionPDF(progression, meta) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 35, bottom: 35, left: 40, right: 40 },
      info: {
        Title: `Progression — ${progression.matiere} ${progression.classe}`,
        Author: meta.enseignant || 'EduPrep CI',
        Creator: 'EduPrep CI — NexeraSecurité',
      },
    });

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageW = doc.page.width - 80;

    // EN-TÊTE
    doc.rect(40, 35, pageW, 50).fill(COLORS.forest);
    doc.fontSize(7).fillColor(COLORS.white)
      .text('REPUBLIQUE DE COTE D\'IVOIRE | Ministère de l\'Education Nationale', 45, 42, { width: pageW - 10 });
    doc.fontSize(14).font('Helvetica-Bold').fillColor(COLORS.gold)
      .text('PROGRESSION ANNUELLE', 45, 54, { width: pageW / 2 - 10 });
    doc.fontSize(11).font('Helvetica').fillColor(COLORS.white)
      .text(`${progression.matiere} — ${progression.classe} | Année ${progression.annee_scolaire}`, pageW / 2, 57, { width: pageW / 2 });

    let y = 95;

    // Infos
    doc.fontSize(9).font('Helvetica').fillColor(COLORS.text2);
    doc.font('Helvetica-Bold').text('Enseignant(e) : ', 45, y, { continued: true })
      .font('Helvetica').text(meta.enseignant || '_______________', { continued: true })
      .font('Helvetica-Bold').text('   |   Établissement : ', { continued: true })
      .font('Helvetica').text(meta.etablissement || '_______________');
    y += 12;

    if (progression.objectif_annuel) {
      doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.forest)
        .text('Objectif annuel : ', 45, y, { continued: true })
        .font('Helvetica').fillColor(COLORS.text2).text(progression.objectif_annuel, { width: pageW - 10 });
      y = doc.y + 6;
    }

    // TABLEAU PAR TRIMESTRE
    // Plafonds défensifs : /progression accepte du JSON brut du client —
    // évite qu'un tableau anormalement long ne fasse tourner le rendu
    // PDFKit (synchrone/CPU) pendant un temps disproportionné sur le CPU
    // limité de Render Free (jusqu'à 60 chapitres/an en usage réel).
    const trimestres = (progression.trimestres || []).slice(0, 10);
    trimestres.forEach(trim => {
      if (y > 480) { doc.addPage(); y = 40; }

      // En-tête trimestre
      doc.rect(40, y, pageW, 18).fill(COLORS.forestMid);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.white)
        .text(`${trim.label} — ${trim.periode} (${trim.nb_semaines} semaines)`, 45, y + 4, { width: pageW - 10 });
      y += 20;

      // En-tête colonnes
      const cols = { num: 30, titre: 180, heures: 50, semaines: 60, objectifs: 200, notions: 150, eval: 80 };
      const headers = ['N°', 'Titre du chapitre', 'Heures', 'Semaines', 'Objectifs', 'Notions clés', 'Évaluation'];
      let x = 40;
      doc.rect(40, y, pageW, 16).fill(COLORS.surface);
      doc.fontSize(7).font('Helvetica-Bold').fillColor(COLORS.forest);
      Object.values(cols).forEach((w, i) => {
        doc.text(headers[i], x + 2, y + 4, { width: w - 4 });
        x += w;
      });
      y += 18;

      // Lignes chapitres
      const chapitres = (trim.chapitres || []).slice(0, 100);
      chapitres.forEach((ch, idx) => {
        if (y > 490) { doc.addPage(); y = 40; }

        const rowH = 30;
        if (idx % 2 === 0) doc.rect(40, y, pageW, rowH).fill('#FAFFFE');
        else doc.rect(40, y, pageW, rowH).fill(COLORS.white);

        x = 40;
        doc.fontSize(7).font('Helvetica').fillColor(COLORS.text);
        const vals = [
          String(ch.numero || idx + 1),
          ch.titre || '',
          String(ch.duree_heures || '') + 'h',
          ch.semaines || String(ch.duree_semaines || '') + ' sem.',
          (ch.objectifs || []).join(' / ').substring(0, 100),
          (ch.notions_cles || []).join(', ').substring(0, 80),
          ch.evaluation || '',
        ];
        Object.values(cols).forEach((w, i) => {
          doc.text(vals[i] || '', x + 2, y + 3, { width: w - 4, height: rowH - 4, ellipsis: true });
          x += w;
        });

        // Ligne de séparation
        doc.rect(40, y + rowH - 1, pageW, 0.5).fill(COLORS.border);
        y += rowH;
      });

      // Évaluation trimestrielle
      if (trim.evaluation_trimestrielle) {
        doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.forest)
          .text('Composition trimestrielle : ', 45, y + 4, { continued: true })
          .font('Helvetica').fillColor(COLORS.text2)
          .text(trim.evaluation_trimestrielle);
        y = doc.y + 8;
      }

      y += 10;
    });

    // Récapitulatif
    if (progression.recapitulatif) {
      if (y > 460) { doc.addPage(); y = 40; }
      const r = progression.recapitulatif;
      doc.rect(40, y, pageW, 18).fill(COLORS.gold);
      doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.forest)
        .text(
          `RÉCAPITULATIF : ${r.total_chapitres || 0} chapitres | ${r.total_heures || 0}h de cours | ${r.heures_evaluation || 0}h d'évaluation | ${r.heures_remediation || 0}h de remédiation`,
          45, y + 4, { width: pageW - 10 }
        );
      y += 22;
    }

    // Signatures
    y += 10;
    doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.text2)
      .text('Signature de l\'enseignant(e)', 45, y)
      .text('Visa du Directeur', 300, y)
      .text('Visa de l\'Inspecteur', 550, y);
    y += 35;
    doc.rect(45, y, 160, 0.5).fill(COLORS.text3);
    doc.rect(300, y, 160, 0.5).fill(COLORS.text3);
    doc.rect(550, y, 160, 0.5).fill(COLORS.text3);

    // Pied de page
    const pageH = doc.page.height;
    doc.fontSize(6).fillColor(COLORS.text3)
      .text(`Généré par EduPrep CI — ${new Date().toLocaleDateString('fr-FR')} | Programme MENA officiel | NexeraSecurité © 2026`,
        40, pageH - 25, { width: pageW, align: 'center' });

    doc.end();
  });
}

// ============================================================
// DEVOIR FORMAT OFFICIEL
// ============================================================
function generateDevoirPDF(devoir, meta) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 40, bottom: 40, left: 50, right: 50 },
      info: {
        Title: devoir.titre || 'Devoir',
        Creator: 'EduPrep CI — NexeraSecurité',
      },
    });

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageW = doc.page.width - 100;

    // EN-TÊTE
    doc.rect(50, 40, pageW, 55).fill(COLORS.forest);
    doc.fontSize(7).fillColor(COLORS.white)
      .text('REPUBLIQUE DE COTE D\'IVOIRE | Ministère de l\'Education Nationale', 55, 46, { width: pageW - 10 });
    doc.fontSize(13).font('Helvetica-Bold').fillColor(COLORS.gold)
      .text(devoir.titre || 'DEVOIR SURVEILLÉ', 55, 57, { width: pageW - 10, align: 'center' });
    doc.fontSize(10).font('Helvetica').fillColor(COLORS.white)
      .text(`${meta.matiere} | ${meta.classe} | Durée : ${meta.duree_minutes || 55} min | Coefficient : ${meta.coefficient || 1}`, 55, 74, { width: pageW - 10, align: 'center' });

    let y = 105;

    // Infos
    doc.fontSize(9).font('Helvetica').fillColor(COLORS.text2);
    doc.font('Helvetica-Bold').text('Nom & Prénom : ', 55, y, { continued: true })
      .font('Helvetica').text('_________________________________', { continued: true })
      .font('Helvetica-Bold').text('   N° : ', { continued: true })
      .font('Helvetica').text('_________', { continued: true })
      .font('Helvetica-Bold').text('   Note : ', { continued: true })
      .font('Helvetica').text('_________ / ' + (meta.total_points || 20));
    y += 16;
    doc.font('Helvetica-Bold').text('Date : ', 55, y, { continued: true })
      .font('Helvetica').text(meta.date || new Date().toLocaleDateString('fr-FR'), { continued: true })
      .font('Helvetica-Bold').text('   Établissement : ', { continued: true })
      .font('Helvetica').text(meta.etablissement || '________________________');

    y += 16;
    doc.rect(50, y, pageW, 1).fill(COLORS.border);
    y += 8;

    // Consigne
    if (devoir.consigne) {
      doc.rect(50, y, pageW, 2).fill(COLORS.gold);
      y += 6;
      doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.text)
        .text('CONSIGNE GÉNÉRALE : ', 55, y, { continued: true })
        .font('Helvetica').text(devoir.consigne, { width: pageW - 10 });
      y = doc.y + 10;
    }

    // Questions
    // Plafond défensif (rendu PDFKit synchrone/CPU sur Render Free) — voir
    // le même plafond sur generateFichePDF/generateProgressionPDF.
    const questions = (devoir.questions || []).slice(0, 200);
    questions.forEach((q, i) => {
      if (y > 700) { doc.addPage(); y = 40; }

      // En-tête question
      doc.rect(50, y, pageW, 18).fill(COLORS.surface);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.forest)
        .text(`Question ${q.numero || i + 1}`, 55, y + 4, { continued: true })
        .fillColor(COLORS.text3).font('Helvetica')
        .text(`  (${q.type || 'Question'} — ${q.points || 0} point${q.points > 1 ? 's' : ''})`, { continued: true })
        .text('', { align: 'right', continued: false });
      y += 20;

      doc.fontSize(10).font('Helvetica').fillColor(COLORS.text)
        .text(q.enonce || '', 55, y, { width: pageW - 10 });
      y = doc.y + 4;

      // Options QCM
      if (q.options && q.options.length) {
        q.options.forEach(opt => {
          doc.fontSize(9).text('     ' + opt, 60, y, { width: pageW - 20 });
          y = doc.y + 2;
        });
      }

      // Espace réponse
      const espaceH = Math.max(30, 10 - (q.options?.length || 0) * 5);
      y += espaceH;
      doc.rect(55, y, pageW - 10, 0.5).fill(COLORS.border);
      y += 12;
    });

    // Pied de page
    const pageH = doc.page.height;
    doc.fontSize(7).fillColor(COLORS.text3)
      .text(`Généré par EduPrep CI — Programme MENA officiel | NexeraSecurité © 2026`,
        50, pageH - 30, { width: pageW, align: 'center' });

    doc.end();
  });
}

// ============================================================
// FICHE DE REMÉDIATION FORMAT DREN
// Ajouté le 03/08/2026 — même structure générale que generateFichePDF,
// adaptée au schéma spécifique de /api/ai/remediation (diagnostic,
// objectif_remediation, prerequis_a_consolider, activites,
// exercices_cibles, criteres_reussite, conseils_enseignant).
// ============================================================
function generateRemediationPDF(remediation, meta) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 40, bottom: 40, left: 50, right: 50 },
      info: {
        Title: `Remédiation — ${meta.titre_lecon || ''}`,
        Author: meta.enseignant || 'EduPrep CI',
        Subject: `${meta.matiere} ${meta.classe}`,
        Creator: 'EduPrep CI — NexeraSecurité',
      },
    });

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageW = doc.page.width - 100;

    // ---- EN-TÊTE OFFICIEL ----
    doc.rect(50, 40, pageW, 65).fill(COLORS.forest);
    doc.fontSize(8).fillColor(COLORS.white)
      .text('REPUBLIQUE DE COTE D\'IVOIRE', 55, 48, { width: pageW - 10 })
      .text('Ministère de l\'Education Nationale et de l\'Alphabétisation', 55, 58, { width: pageW - 10 })
      .text('Direction Régionale de l\'Education Nationale (DREN)', 55, 68, { width: pageW - 10 });

    doc.fontSize(14).font('Helvetica-Bold').fillColor(COLORS.gold)
      .text('FICHE DE REMÉDIATION', 55, 82, { width: pageW - 10, align: 'right' });

    // ---- INFOS ENSEIGNANT ----
    doc.rect(50, 115, pageW, 1).fill(COLORS.border);
    doc.fontSize(9).font('Helvetica').fillColor(COLORS.text2);

    const col1 = 55, col2 = 300;
    let y = 122;

    const infoRow = (label, value, x, yPos) => {
      doc.font('Helvetica-Bold').text(label + ' : ', x, yPos, { continued: true })
        .font('Helvetica').text(value || '___________________');
    };

    infoRow('Enseignant(e)', meta.enseignant || '', col1, y);
    infoRow('Établissement', meta.etablissement || '', col2, y);
    y += 16;
    infoRow('Matière', meta.matiere || '', col1, y);
    infoRow('Classe', meta.classe || '', col2, y);
    y += 16;
    infoRow('Durée de la séance', (meta.duree_minutes || 30) + ' minutes', col1, y);
    infoRow('Date', meta.date || new Date().toLocaleDateString('fr-FR'), col2, y);

    y += 20;
    doc.rect(50, y, pageW, 1).fill(COLORS.border);
    y += 8;

    // ---- NOTION NON MAÎTRISÉE ----
    doc.rect(50, y, pageW, 28).fill(COLORS.surface);
    doc.fontSize(13).font('Helvetica-Bold').fillColor(COLORS.forest)
      .text(meta.titre_lecon || 'Notion à retravailler', 55, y + 7, { width: pageW - 10, align: 'center' });
    y += 36;

    if (meta.difficulte_observee) {
      doc.fontSize(8).font('Helvetica-Oblique').fillColor(COLORS.text3)
        .text('Difficulté observée : ' + meta.difficulte_observee, 55, y, { width: pageW - 10 });
      y = doc.y + 8;
    }

    // ---- DIAGNOSTIC ----
    y = sectionTitle(doc, 'DIAGNOSTIC', y, pageW);
    doc.fontSize(10).font('Helvetica').fillColor(COLORS.text)
      .text(remediation.diagnostic || '', 55, y, { width: pageW - 10 });
    y = doc.y + 8;

    // ---- OBJECTIF DE LA REMÉDIATION ----
    if (remediation.objectif_remediation) {
      y = sectionTitle(doc, 'OBJECTIF DE LA REMÉDIATION', y, pageW);
      doc.fontSize(10).font('Helvetica').fillColor(COLORS.text)
        .text(remediation.objectif_remediation, 55, y, { width: pageW - 10 });
      y = doc.y + 8;
    }

    // ---- PRÉREQUIS À CONSOLIDER ----
    const prerequis = remediation.prerequis_a_consolider || [];
    if (prerequis.length) {
      if (y > 680) { doc.addPage(); y = 40; }
      y = sectionTitle(doc, 'PRÉREQUIS À CONSOLIDER', y, pageW);
      prerequis.slice(0, 30).forEach(p => {
        doc.fontSize(10).font('Helvetica').fillColor(COLORS.text)
          .text('• ' + p, 60, y, { width: pageW - 15 });
        y = doc.y + 2;
      });
      y += 5;
    }

    // ---- ACTIVITÉS ----
    if (y > 650) { doc.addPage(); y = 40; }
    y = sectionTitle(doc, 'ACTIVITÉS', y, pageW);
    const activites = (remediation.activites || []).slice(0, 30);
    activites.forEach((act, i) => {
      if (y > 700) { doc.addPage(); y = 40; }
      doc.rect(55, y, pageW - 5, 20).fill(COLORS.forestMid);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.white)
        .text(`${act.nom || 'Activité ' + (i + 1)}`, 60, y + 5, { continued: true })
        .font('Helvetica').text(`  —  ${act.duree || ''}`, { continued: false });
      y += 22;
      doc.fontSize(9).font('Helvetica').fillColor(COLORS.text)
        .text(act.desc || '', 60, y, { width: pageW - 15 });
      y = doc.y;
      if (act.materiel) {
        doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.text3)
          .text('Matériel : ', 60, y + 3, { continued: true })
          .font('Helvetica').text(act.materiel);
        y = doc.y;
      }
      y += 6;
    });

    // ---- EXERCICES DE VÉRIFICATION ----
    const exercices = (remediation.exercices_cibles || []).slice(0, 50);
    if (exercices.length) {
      if (y > 650) { doc.addPage(); y = 40; }
      y = sectionTitle(doc, 'EXERCICES DE VÉRIFICATION', y, pageW);
      exercices.forEach((ex, i) => {
        if (y > 690) { doc.addPage(); y = 40; }
        doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.text)
          .text(`Exercice ${i + 1}. `, 60, y, { continued: true })
          .font('Helvetica').text(ex.enonce || '', { width: pageW - 20 });
        y = doc.y + 3;
        if (ex.correction) {
          doc.fontSize(9).font('Helvetica-Oblique').fillColor(COLORS.text2)
            .text('Corrigé : ' + ex.correction, 65, y, { width: pageW - 25 });
          y = doc.y + 3;
        }
        if (ex.point_de_vigilance) {
          doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.forestMid)
            .text('Point de vigilance : ', 65, y, { continued: true })
            .font('Helvetica').fillColor(COLORS.text3).text(ex.point_de_vigilance, { width: pageW - 25 });
          y = doc.y;
        }
        y += 8;
      });
    }

    // ---- CRITÈRES DE RÉUSSITE ----
    const criteres = remediation.criteres_reussite || [];
    if (criteres.length) {
      if (y > 680) { doc.addPage(); y = 40; }
      y = sectionTitle(doc, 'CRITÈRES DE RÉUSSITE', y, pageW);
      criteres.slice(0, 30).forEach(c => {
        doc.fontSize(10).font('Helvetica').fillColor(COLORS.text)
          .text('• ' + c, 60, y, { width: pageW - 15 });
        y = doc.y + 2;
      });
      y += 5;
    }

    // ---- CONSEILS ----
    if (remediation.conseils_enseignant) {
      if (y > 680) { doc.addPage(); y = 40; }
      y = sectionTitle(doc, 'CONSEILS À L\'ENSEIGNANT', y, pageW);
      doc.fontSize(10).font('Helvetica').fillColor(COLORS.text)
        .text(remediation.conseils_enseignant, 55, y, { width: pageW - 10 });
      y = doc.y + 8;
    }

    // ---- SIGNATURES ----
    if (y > 680) { doc.addPage(); y = 40; }
    y += 20;
    doc.rect(50, y, pageW, 1).fill(COLORS.border);
    y += 10;

    doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.text2);
    doc.text('Signature de l\'enseignant(e)', col1, y)
      .text('Visa du Directeur / Inspecteur', col2, y);
    y += 40;
    doc.rect(col1, y, 180, 1).fill(COLORS.text3);
    doc.rect(col2, y, 180, 1).fill(COLORS.text3);

    // ---- PIED DE PAGE ----
    const pageH = doc.page.height;
    doc.fontSize(7).fillColor(COLORS.text3)
      .text(
        `Généré par EduPrep CI — ${new Date().toLocaleDateString('fr-FR')} | Programme MENA officiel | NexeraSecurité © 2026`,
        50, pageH - 30, { width: pageW, align: 'center' }
      );

    doc.end();
  });
}

// ============================================================
// HELPER : Titre de section
// ============================================================
function sectionTitle(doc, title, y, pageW) {
  doc.rect(50, y, pageW, 16).fill(COLORS.forest);
  doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.white)
    .text(title, 55, y + 4, { width: pageW - 10 });
  return y + 20;
}

// ============================================================
// HELPER : Tableau des habiletés et des contenus (format APC)
// Deux colonnes (Habileté / Contenu), hauteur de ligne calculée sur le
// texte le plus haut des deux colonnes, avec saut de page si une ligne ne
// tient pas sur la page courante — même logique de pagination défensive
// que le reste du fichier (rendu PDFKit synchrone/CPU).
// ============================================================
function drawHabiletesTable(doc, rows, y, pageW) {
  const col1X = 55, col1W = Math.round((pageW - 18) * 0.38);
  const col2X = col1X + col1W + 8;
  const col2W = pageW - 10 - col1W - 8;
  const rowPad = 5;

  // En-tête du tableau
  doc.rect(50, y, pageW, 18).fill(COLORS.forestMid);
  doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.white)
    .text('Habiletés', col1X, y + 5, { width: col1W })
    .text('Contenus', col2X, y + 5, { width: col2W });
  y += 18;

  rows.forEach((h, i) => {
    const habilete = h.habilete || '';
    const contenu = h.contenu || '';
    doc.fontSize(9).font('Helvetica');
    const rowH = Math.max(
      doc.heightOfString(habilete, { width: col1W }),
      doc.heightOfString(contenu, { width: col2W }),
      12
    ) + rowPad * 2;

    if (y + rowH > 760) { doc.addPage(); y = 40; }

    if (i % 2 === 1) doc.rect(50, y, pageW, rowH).fill(COLORS.surface);
    doc.fillColor(COLORS.text).font('Helvetica')
      .text(habilete, col1X, y + rowPad, { width: col1W })
      .text(contenu, col2X, y + rowPad, { width: col2W });
    doc.rect(col2X - 4, y, 1, rowH).fill(COLORS.border);
    y += rowH;
  });

  doc.rect(50, y, pageW, 1).fill(COLORS.border);
  return y + 8;
}

module.exports = { generateFichePDF, generateProgressionPDF, generateDevoirPDF, generateRemediationPDF };
