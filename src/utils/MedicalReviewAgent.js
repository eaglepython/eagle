export const MEDICAL_TOPIC_ROTATION_MS = 5 * 60 * 1000;

const sections = [
  {
    id: 'integrative',
    title: 'Integrative Medicine',
    book: 'Integrative Medicine, 5th edition',
    evidenceLabel: 'NCCIH evidence reviews',
    evidenceUrl: 'https://www.nccih.nih.gov/health/providers/litreviews',
    topics: [
      {
        title: 'Evaluate a therapy with an evidence-and-harm matrix',
        focus: 'Practice separating a plausible mechanism or promising study from evidence that a therapy improves an outcome that matters to patients.',
        keyIdeas: ['Define the health question, population, intervention, comparison, and outcome before searching.', 'Weigh study quality, consistency, effect size, and applicability; distinguish clinical evidence from tradition or marketing.', 'Assess the type and likelihood of harms, interactions, access barriers, and whether the therapy could delay effective care.'],
        reviewSteps: ['Choose one modality discussed in the book and write a one-sentence clinical question.', 'Use the book’s evidence-versus-harm framework, then compare it with a recent systematic review or NCCIH topic review.', 'Summarize what is known, uncertain, and potentially harmful; finish with a shared-decision question and an outcome to monitor.'],
        synthesis: 'What finding would change your view of this therapy, and what important harm could be missed by looking only at average benefit?',
        safety: 'This is an evidence-appraisal exercise, not a recommendation to start or stop a therapy.'
      },
      {
        title: 'Build a whole-person assessment before choosing an approach',
        focus: 'Connect a patient’s stated priorities and life context with conventional care and any complementary approach under consideration.',
        keyIdeas: ['Begin with the person’s goals, symptoms, function, beliefs, prior treatments, and barriers to care.', 'Separate the patient’s preferred outcome from a clinician’s assumed outcome.', 'Coordinate approaches across clinicians and define how progress and unwanted effects will be revisited.'],
        reviewSteps: ['Select a chapter case and list the person’s top two goals in their own terms.', 'Map relevant physical, emotional, social, and daily-life factors without treating the map as a diagnosis.', 'Draft three neutral questions that support shared decision-making and identify a measurable follow-up outcome.'],
        synthesis: 'How could two people with the same diagnosis reasonably choose different care goals?',
        safety: 'Respect patient preferences while checking safety, evidence, and the role of established care.'
      },
      {
        title: 'Reconcile supplements and check interaction risks',
        focus: 'Treat supplements and botanicals as exposures that need a clear history and an interaction check, not as automatically benign products.',
        keyIdeas: ['Record the exact product, ingredients, formulation, amount, frequency, and reason for use.', 'Review prescription and nonprescription medicines, allergies, relevant conditions, and planned procedures.', 'Check a reliable, current source for interactions and product-quality concerns; communicate findings to the care team.'],
        reviewSteps: ['Use a hypothetical case from a relevant chapter and build a supplement reconciliation table.', 'For each product, identify the intended benefit, evidence source, possible harms, and interaction questions.', 'Mark any uncertainty that needs a pharmacist or qualified clinician to resolve.'],
        synthesis: 'Which details would you need before you could assess the safety of a named botanical?',
        safety: 'Do not use this exercise to make an individual medication or supplement decision.'
      },
      {
        title: 'Compare multimodal approaches to chronic pain',
        focus: 'Review how a whole-person plan can combine conventional management with selected complementary options while keeping function and safety visible.',
        keyIdeas: ['Distinguish pain intensity from function, sleep, participation, and patient-defined quality of life.', 'Evaluate each modality on its own evidence and risks rather than assuming a class effect.', 'Look for contraindications, access and training needs, and risks of delaying assessment of new or worsening symptoms.'],
        reviewSteps: ['Choose a pain topic in the book and name a functional outcome that the patient values.', 'Compare two possible approaches using current evidence, expected benefit, burden, and risk.', 'Write a monitoring plan that includes a review point and a reason to reassess the approach.'],
        synthesis: 'Why might a modest change in function matter even when a symptom score changes little?',
        safety: 'New, severe, or worsening pain needs appropriate clinical assessment.'
      },
      {
        title: 'Review mindfulness and mind-body approaches critically',
        focus: 'Study mind-body options as specific interventions with defined goals, populations, delivery methods, evidence, and limits.',
        keyIdeas: ['Differentiate meditation, relaxation, guided imagery, yoga, and other modalities instead of grouping them together.', 'Ask what outcome was measured, how long follow-up lasted, and whether results apply to the person and setting.', 'Consider preference, access, instructor qualifications, physical limitations, and possible distress.'],
        reviewSteps: ['Select one mind-body chapter and describe the intervention precisely.', 'Locate a recent evidence review for the condition and compare its conclusion with the book.', 'Design a neutral conversation that offers the evidence and uncertainty without promising an outcome.'],
        synthesis: 'What parts of a study’s population or delivery method might limit how far its results can be generalized?',
        safety: 'Adapt physical practices to individual circumstances with appropriate professional guidance.'
      },
      {
        title: 'Translate lifestyle chapters into a patient-led plan',
        focus: 'Turn broad lifestyle concepts into a small, measurable, feasible step that reflects a person’s priorities and context.',
        keyIdeas: ['Identify the behavior or environment targeted and the health outcome it is intended to support.', 'Account for readiness, resources, culture, disability, competing demands, and patient choice.', 'Use a specific measure and follow-up date; revise the plan from the person’s experience.'],
        reviewSteps: ['Choose an exercise, nutrition, or sleep section and extract its proposed mechanism and evidence limits.', 'Write one patient-selected goal with a baseline, feasible first step, and check-in measure.', 'List at least two contextual barriers and ask how the plan could be adapted collaboratively.'],
        synthesis: 'How can a plan remain evidence-informed without becoming prescriptive or unrealistic?',
        safety: 'Personalized clinical or nutrition plans should be reviewed with an appropriate professional.'
      }
    ]
  },
  {
    id: 'nursing',
    title: 'Nursing',
    book: 'Nursing resources in your library',
    evidenceLabel: 'Current NANDA-I classification',
    evidenceUrl: 'https://nanda.org/nanda-book/',
    topics: [
      {
        title: 'Move from assessment cues to a defensible nursing diagnosis',
        book: 'Ackley and Ladwig’s Nursing Diagnosis Handbook',
        focus: 'Practice showing how the patient data support a nursing judgment instead of choosing a diagnosis from a keyword alone.',
        keyIdeas: ['Separate subjective reports, objective findings, context, and missing data.', 'Validate cues and consider plausible alternatives before selecting a diagnosis.', 'Distinguish the nursing response being addressed from a medical disease label.'],
        reviewSteps: ['Choose one handbook entry and create a two-column list of supporting cues and cues still needed.', 'State the nursing diagnosis and explain how each defining cue supports it.', 'Check the wording against current NANDA-I, then explain what assessment finding would make you reconsider.'],
        synthesis: 'Which cue is strongest, and what additional information would reduce the chance of a premature conclusion?',
        safety: 'Use current classification terminology and clinical judgment; a reference entry does not replace assessment.'
      },
      {
        title: 'Link outcomes, interventions, and evaluation',
        book: 'Ackley and Ladwig’s Nursing Diagnosis Handbook; Fundamentals of Nursing',
        focus: 'Build a care-plan chain where each nursing action has a reason and a way to determine whether it helped.',
        keyIdeas: ['Make outcomes patient-centered, observable, and time-bounded.', 'Choose interventions that address the assessed cause or response and fit the patient’s situation.', 'Evaluation compares observed results with the outcome and informs the next decision.'],
        reviewSteps: ['Select one diagnosis from the handbook and draft one measurable outcome.', 'For each proposed intervention, write a rationale and the observation that will show its effect.', 'Create a short evaluation note for met, partly met, and unmet outcomes.'],
        synthesis: 'If the outcome is unmet, what evidence helps distinguish an ineffective intervention from an unrealistic outcome?',
        safety: 'Follow current scope, orders, facility policy, and patient-specific assessment.'
      },
      {
        title: 'Use standard precautions as a risk-based routine',
        book: 'Davis’s Guide to Clinical Nursing Skills; Fundamentals of Nursing',
        focus: 'Review the safety logic behind applying infection-prevention practices to patient care and checking exposure risks.',
        keyIdeas: ['Base personal protective equipment choices on the anticipated exposure and current guidance.', 'Include hand hygiene, safe injection and medication practices, and appropriate equipment handling.', 'Treat local policy and current infection-control guidance as the operational reference.'],
        reviewSteps: ['Compare the older clinical-skills chapter with current CDC Standard Precautions.', 'For a hypothetical procedure, identify exposure points before, during, and after care.', 'Write a brief checklist and flag each step that depends on facility policy or training.'],
        synthesis: 'How does anticipating the exposure before a procedure change what must be prepared?',
        safety: 'Use current CDC and facility guidance; the 2008 skills guide is not a current protocol.'
      },
      {
        title: 'Trace a medication-safety check from order to evaluation',
        book: 'Davis’s Guide to Clinical Nursing Skills',
        focus: 'Study medication administration as a sequence of verification, patient communication, observation, and documentation.',
        keyIdeas: ['Confirm the current order and patient-specific factors before administration.', 'Explain the medication in plain language and respond to questions or refusal.', 'Observe the response, document according to policy, and escalate unexpected concerns through local procedures.'],
        reviewSteps: ['Choose a medication-administration procedure and list its pre-administration checks.', 'Mark the checks that must be verified against current policy, labeling, and scope.', 'Create a post-administration evaluation note that records response and follow-up needs.'],
        synthesis: 'Which safety checks depend on patient identity, and which depend on the specific medication or route?',
        safety: 'This is a study checklist only; actual administration follows current orders, training, and local policy.'
      },
      {
        title: 'Connect fundamentals to professional accountability',
        book: 'Fundamentals of Nursing: Standards and Practice',
        focus: 'Use the fundamentals text to examine how documentation, communication, delegation, and ethics affect continuity and safety.',
        keyIdeas: ['Documentation should communicate relevant observed facts and actions clearly.', 'Delegation depends on the task, patient situation, competence, supervision, and jurisdictional rules.', 'Ethical reasoning makes the patient’s values, consent, privacy, and safety explicit.'],
        reviewSteps: ['Select a fundamentals chapter and map one case across communication, documentation, and accountability.', 'Identify which decisions require current jurisdictional or organizational guidance.', 'Rewrite a sample note as concise, objective, and tied to assessment and response.'],
        synthesis: 'What information must another team member know to safely continue care?',
        safety: 'The 2010 text is foundational; verify current laws, standards, and employer policy.'
      },
      {
        title: 'Build a focused assessment from a changing patient picture',
        book: 'Davis’s Guide to Clinical Nursing Skills; Fundamentals of Nursing',
        focus: 'Practice organizing assessment data and trends so that priorities follow from what is changing and what remains uncertain.',
        keyIdeas: ['Collect relevant subjective and objective findings and compare them with the patient’s baseline.', 'Verify unexpected data and identify time-sensitive changes.', 'Communicate concerns through the current escalation pathway for the setting.'],
        reviewSteps: ['Use a fictional case to separate baseline findings from new findings.', 'Identify the most important missing assessment data and explain why it matters.', 'Draft a concise handoff with the change, supporting cues, action taken, and response.'],
        synthesis: 'Which trend would prompt you to reassess first, and what local escalation process applies?',
        safety: 'Do not use the exercise to triage a real person; follow local escalation procedures.'
      }
    ]
  },
  {
    id: 'pathophysiology',
    title: 'Medical Pathophysiology',
    book: 'Color Atlas of Pathophysiology',
    evidenceLabel: 'NLM Bookshelf',
    evidenceUrl: 'https://www.ncbi.nlm.nih.gov/books/',
    topics: [
      {
        title: 'Inflammation: connect the trigger to tissue signs',
        focus: 'Explain how a tissue response unfolds from an initiating insult to local changes and systemic signs.',
        keyIdeas: ['Identify the initiating stimulus and distinguish harmful triggers from the response itself.', 'Trace signaling, vascular changes, and immune-cell recruitment at a conceptual level.', 'Link the process to observable findings while remembering that similar findings can have different causes.'],
        reviewSteps: ['Use the atlas inflammation section to draw a trigger-to-response sequence.', 'For each major step, add one expected tissue or systemic consequence.', 'Identify one mechanism the atlas simplifies and verify it with a current pathophysiology source.'],
        synthesis: 'Which observed findings follow directly from the mechanism, and which require other explanations?',
        safety: 'A mechanism map helps learning but is not enough to diagnose a real illness.'
      },
      {
        title: 'Acid-base balance: reason through the disturbance',
        focus: 'Study how respiratory and metabolic processes affect pH, then explain compensation without treating a single number as a diagnosis.',
        keyIdeas: ['Start with the acid-base pattern and the system most consistent with the initial change.', 'Consider expected compensation and whether more than one process may be present.', 'Interpret laboratory results in clinical context and verify units, reference ranges, and sampling details.'],
        reviewSteps: ['Draw the normal relationship among ventilation, carbon dioxide, bicarbonate, and pH.', 'Work through a fictional result by describing the primary pattern and possible compensation.', 'Compare the mechanism with a current source and list the clinical context still needed.'],
        synthesis: 'What can a blood gas suggest, and what can it not establish without the patient context?',
        safety: 'This is a conceptual exercise; real laboratory interpretation belongs to qualified clinicians.'
      },
      {
        title: 'Anemia: compare loss, destruction, and reduced production',
        focus: 'Organize anemia mechanisms around red-cell loss, shortened survival, and impaired production, then connect them to oxygen delivery.',
        keyIdeas: ['Separate the mechanism from the shared downstream effect on oxygen-carrying capacity.', 'Use cell indices, reticulocyte response, and history as clues that need interpretation together.', 'Recognize that multiple mechanisms can coexist and that tests require context.'],
        reviewSteps: ['Create a three-column comparison for blood loss, hemolysis, and reduced production.', 'For each, connect a mechanism to one expected clue and a question that would refine the differential.', 'Check whether the atlas terminology or examples need updating against current references.'],
        synthesis: 'Why can two people with the same hemoglobin value have different underlying mechanisms?',
        safety: 'Do not use this comparison to interpret personal lab results or choose treatment.'
      },
      {
        title: 'Renal injury and fluid balance: follow the physiologic chain',
        focus: 'Review how changes in renal perfusion, tissue injury, and outflow can affect filtration and whole-body fluid and electrolyte balance.',
        keyIdeas: ['Distinguish a change in perfusion from structural injury or impaired drainage as a learning framework.', 'Trace how altered filtration and tubular handling can affect volume, electrolytes, and acid-base balance.', 'Treat laboratory trends, medications, volume status, and history as a combined clinical picture.'],
        reviewSteps: ['Draw a kidney-function map from blood flow through filtration and tubular handling.', 'Add one consequence of disruption at each stage using the atlas as a concept source.', 'List current clinical data that would be required before applying the model to a patient.'],
        synthesis: 'Which part of the pathway best explains a change in urine output, and what else would you need to know?',
        safety: 'The atlas dates to 2000; use current references for disease definitions and clinical decisions.'
      },
      {
        title: 'Cardiac dysfunction: distinguish pump changes from congestion',
        focus: 'Map how altered cardiac function can affect forward flow, compensatory responses, and fluid distribution.',
        keyIdeas: ['Separate impaired forward perfusion from elevated filling pressures and congestion as related but distinct consequences.', 'Connect compensatory mechanisms to both short-term support and potential longer-term burden.', 'Relate symptoms and signs to mechanisms while accounting for other possible causes.'],
        reviewSteps: ['Draw a sequence linking a hypothetical cardiac change to hemodynamic effects and symptoms.', 'Label which responses are compensatory and how prolonged activation may change the system.', 'Compare the atlas explanation with a current clinical or physiology reference.'],
        synthesis: 'How could one process contribute to both reduced exercise tolerance and fluid congestion?',
        safety: 'This mechanism review does not assess symptoms or guide treatment for an individual.'
      },
      {
        title: 'Endocrine feedback: model a hormone-control loop',
        focus: 'Use feedback loops to explain how a change in hormone production, signaling, or target-organ response can shift homeostasis.',
        keyIdeas: ['Identify the signal, source, target, response, and feedback direction.', 'Separate gland output from receptor or target-tissue responsiveness.', 'Connect a disrupted feedback step to a predicted pattern, then check the model against current evidence.'],
        reviewSteps: ['Choose one hormone system from the atlas and sketch its normal feedback loop.', 'Alter one step in the diagram and predict the downstream pattern.', 'Compare the prediction with a current physiology resource and note where the simplified model breaks down.'],
        synthesis: 'What pattern would help distinguish too little hormone production from reduced target-tissue response?',
        safety: 'A simplified feedback diagram supports learning and cannot replace clinical evaluation.'
      }
    ]
  }
];

export function getMedicalReviewTopics(now = Date.now()) {
  const slot = Math.floor(now / MEDICAL_TOPIC_ROTATION_MS);
  const nextRotationAt = (slot + 1) * MEDICAL_TOPIC_ROTATION_MS;

  return {
    slot,
    nextRotationAt,
    topics: sections.map((section) => {
      const topicIndex = slot % section.topics.length;
      return {
        id: section.id,
        section: section.title,
        book: section.topics[topicIndex].book || section.book,
        evidenceLabel: section.evidenceLabel,
        evidenceUrl: section.evidenceUrl,
        sequence: topicIndex + 1,
        total: section.topics.length,
        topic: section.topics[topicIndex]
      };
    })
  };
}
