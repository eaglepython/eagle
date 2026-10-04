export const MEDICAL_RESOURCE_REVIEWS = [
  {
    id: 'integrative-medicine-rakel',
    category: 'Integrative Medicine',
    title: 'Integrative Medicine',
    authors: 'David Rakel, MD, and Vincent Minichiello, MD',
    edition: '5th edition · 2023 copyright',
    fileName: 'IntegrativeMedicineRakel5th.pdf',
    sourceFolder: 'medical',
    scope: 'Whole-person care, evidence-versus-harm grading, lifestyle and mind-body approaches, and disease-oriented integrative options.',
    review: 'A broad clinical reference that puts the healing relationship and whole-person assessment alongside conventional care and complementary approaches. Its evidence-versus-harm framework is a useful starting point for weighing options.',
    strengths: ['Connects patient goals and context with clinical care.', 'Organizes options by condition and modality.', 'Explicitly considers evidence and potential harm.'],
    caution: 'Evidence changes by therapy and condition. Check current evidence, contraindications, supplement interactions, and conventional treatment options before drawing clinical conclusions.',
    proposedReview: ['Choose one condition and list the patient-centered goals.', 'Compare one conventional option with one complementary option using current evidence and safety sources.', 'Write a short shared-decision plan that includes interactions, uncertainty, and follow-up measures.'],
    currentSourceLabel: 'NCCIH: evidence reviews and safety',
    currentSourceUrl: 'https://www.nccih.nih.gov/health/providers/litreviews'
  },
  {
    id: 'nursing-diagnosis-ackley',
    category: 'Nursing',
    title: 'Ackley and Ladwig’s Nursing Diagnosis Handbook',
    authors: 'Mary Beth Flynn Makic and Marina Martinez-Kratz',
    edition: '13th edition · 2023',
    fileName: 'Ackley and Ladwig’s Nursing Diagnosis Handbook.pdf',
    sourceFolder: 'medical',
    scope: 'Evidence-based nursing process, clinical reasoning, diagnoses, outcomes, interventions, and care planning across a large range of conditions.',
    review: 'A practical bridge from assessment cues to a nursing diagnosis, measurable outcomes, interventions, and evaluation. It is strongest as a structured reasoning and care-planning aid used with the patient’s actual assessment.',
    strengths: ['Connects diagnoses to outcomes and interventions.', 'Useful for practicing cue validation and care-plan logic.', 'Broad condition-based lookup structure.'],
    caution: 'Confirm diagnosis labels and definitions against the current NANDA-I classification; the current 2024–2026 classification postdates this handbook.',
    proposedReview: ['Select one case and separate observed cues from assumptions.', 'Build a diagnosis-to-outcome-to-intervention chain and explain the rationale for each link.', 'Check the diagnosis wording against current NANDA-I and revise the plan based on patient response.'],
    currentSourceLabel: 'NANDA International: current 2024–2026 classification',
    currentSourceUrl: 'https://nanda.org/nanda-book/'
  },
  {
    id: 'clinical-nursing-skills-davis',
    category: 'Nursing',
    title: 'Davis’s Guide to Clinical Nursing Skills',
    authors: 'Jacqueline Rhoads, PhD, and Bonnie Juvé Meeker, DNS, RN',
    edition: '2008 edition',
    fileName: "Davis's Guide to Clinical Nursing Skills.pdf",
    sourceFolder: 'medical',
    scope: 'Stepwise procedures spanning infection control, assessment, medication administration, respiratory and cardiovascular care, wound care, and specimen collection.',
    review: 'A clear procedural checklist reference organized by skill, with preparation, performance, and follow-up steps. The structure is helpful for deliberate practice and spotting safety checkpoints.',
    strengths: ['Broad, easy-to-scan procedure organization.', 'Emphasizes preparation, patient identification, privacy, and follow-up.', 'Supports skills rehearsal and self-checking.'],
    caution: 'This 2008 edition is historical reference material. Do not use it as the current procedure authority; check current facility policy, device instructions, scope of practice, and guidelines first.',
    proposedReview: ['Choose one skill and make a checklist of indications, preparation, infection prevention, monitoring, and documentation.', 'Compare each step with current facility policy and current guidance.', 'Record differences and have an instructor or qualified clinician validate the practice checklist.'],
    currentSourceLabel: 'CDC: standard precautions for patient care',
    currentSourceUrl: 'https://www.cdc.gov/infection-control/hcp/basics/standard-precautions.html'
  },
  {
    id: 'fundamentals-nursing-delaune',
    category: 'Nursing',
    title: 'Fundamentals of Nursing: Standards and Practice',
    authors: 'Sue C. DeLaune and Patricia K. Ladner',
    edition: '4th edition · 2010',
    fileName: 'Fundamentals of Nursing_ Standards and Practice.pdf',
    sourceFolder: 'medical',
    scope: 'Nursing theory, evidence-based practice, the nursing process, clinical judgment, professional accountability, ethics, communication, and care fundamentals.',
    review: 'A wide-ranging foundation text that links assessment, diagnosis, planning, implementation, and evaluation to professional nursing responsibilities. Its chapter structure works well for concept review and case-based practice.',
    strengths: ['Explains the nursing process as a connected cycle.', 'Includes evidence-based practice, ethics, communication, and quality.', 'Useful for building a broad concept map before a focused case review.'],
    caution: 'Published in 2010; use it for foundational concepts and historical context, then verify current legal, ethical, scope-of-practice, informatics, and clinical standards.',
    proposedReview: ['Map a short patient case through assessment, priorities, outcomes, interventions, and evaluation.', 'Identify one ethical, communication, or safety consideration at each stage.', 'Compare any practice or policy claims with current authoritative guidance.'],
    currentSourceLabel: 'CDC: current core infection-prevention practices',
    currentSourceUrl: 'https://www.cdc.gov/infection-control/hcp/core-practices/'
  },
  {
    id: 'pathophysiology-color-atlas',
    category: 'Medical Pathophysiology',
    title: 'Color Atlas of Pathophysiology',
    authors: 'Stefan Silbernagl and Florian Lang',
    edition: '2000 edition',
    fileName: 'Color Atlas of Pathophysiology.pdf',
    sourceFolder: 'medical',
    scope: 'Visual mechanisms across cellular fundamentals, temperature and energy, blood, respiration and acid-base balance, renal regulation, digestion, circulation, metabolism, hormones, and neuromuscular systems.',
    review: 'A concise visual atlas for connecting pathophysiologic mechanisms with organ-system changes. Its diagrams support conceptual understanding and recall, especially when paired with a patient case.',
    strengths: ['Strong system-by-system visual organization.', 'Encourages mechanism-based explanations instead of memorizing isolated findings.', 'Useful for drawing cause-to-effect concept maps.'],
    caution: 'This is a 2000 atlas. Some terminology, disease mechanisms, tests, and treatment context may have changed; use current sources for clinical decisions and updated science.',
    proposedReview: ['Choose one disorder and diagram cause → cellular change → organ dysfunction → signs, symptoms, and complications.', 'Explain how selected findings follow from the mechanism.', 'Check terminology and any diagnostic or treatment claims against a current textbook or guideline.'],
    currentSourceLabel: 'NLM Bookshelf: search current clinical reviews',
    currentSourceUrl: 'https://www.ncbi.nlm.nih.gov/books/'
  }
];

export const MEDICAL_RESOURCE_CATEGORIES = [
  'All',
  'Integrative Medicine',
  'Nursing',
  'Medical Pathophysiology'
];
