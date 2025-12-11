// Verdant Guided Product Discovery Flow
(function() {
  'use strict';

  const STORAGE_KEY = 'verdantGuidedFlow';

  // Question tree defining all questions and their flow
  const QUESTION_TREE = {
    'q1_primary_intent': {
      id: 'q1_primary_intent',
      text: 'What do you need?',
      type: 'single-choice',
      options: [
        {
          value: 'medical',
          label: 'Medical',
          description: 'CBD-focused products for therapeutic use'
        },
        {
          value: 'recreational',
          label: 'Recreational',
          description: 'THC products for personal enjoyment'
        },
        {
          value: 'unsure',
          label: "I'm not sure yet",
          description: 'Help me figure it out'
        }
      ],
      next: (answer) => {
        if (answer === 'medical') return 'q2_medical_conditions';
        if (answer === 'recreational') return 'q2_recreational_effects';
        return 'q2_unsure_symptoms';
      }
    },

    // Unsure path
    'q2_unsure_symptoms': {
      id: 'q2_unsure_symptoms',
      text: 'Are you looking to address specific symptoms or medical conditions?',
      type: 'single-choice',
      options: [
        {
          value: 'yes',
          label: 'Yes, I have specific symptoms',
          description: 'Pain, anxiety, inflammation, etc.'
        },
        {
          value: 'no',
          label: 'No, I want recreational effects',
          description: 'Relaxation, energy, creativity, etc.'
        }
      ],
      next: (answer) => {
        return answer === 'yes' ? 'q2_medical_conditions' : 'q2_recreational_effects';
      }
    },

    // Medical path
    'q2_medical_conditions': {
      id: 'q2_medical_conditions',
      text: 'Which conditions are you looking to address?',
      subtitle: 'Select all that apply',
      type: 'multi-choice',
      options: [
        { value: 'chronic pain', label: 'Chronic Pain' },
        { value: 'anxiety', label: 'Anxiety' },
        { value: 'inflammation', label: 'Inflammation' },
        { value: 'epilepsy', label: 'Epilepsy' },
        { value: 'insomnia', label: 'Insomnia' },
        { value: 'depression', label: 'Depression' },
        { value: 'migraines', label: 'Migraines' },
        { value: 'muscle spasms', label: 'Muscle Spasms' }
      ],
      next: () => 'q3_medical_effects'
    },

    'q3_medical_effects': {
      id: 'q3_medical_effects',
      text: 'What effects are most important to you?',
      subtitle: 'Select up to 3',
      type: 'multi-choice',
      maxSelections: 3,
      options: [
        { value: 'pain relief', label: 'Pain Relief' },
        { value: 'anti-inflammatory', label: 'Anti-Inflammatory' },
        { value: 'relaxation', label: 'Relaxation' },
        { value: 'focus', label: 'Focus' },
        { value: 'anti-anxiety', label: 'Anti-Anxiety' },
        { value: 'sedation', label: 'Sleep/Sedation' }
      ],
      next: () => 'q4_medical_format'
    },

    'q4_medical_format': {
      id: 'q4_medical_format',
      text: 'How would you prefer to consume it?',
      type: 'single-choice',
      options: [
        { value: 'Tincture', label: 'Tincture/Oil', description: 'Under the tongue, precise dosing' },
        { value: 'Capsules', label: 'Capsules', description: 'Easy to take, discreet' },
        { value: 'Flower', label: 'Flower', description: 'Smoke or vaporize' },
        { value: 'Vape Cartridge', label: 'Vape', description: 'Quick onset, portable' },
        { value: 'any', label: 'No preference', description: 'Show me all options' }
      ],
      next: () => 'q5_medical_cbd'
    },

    'q5_medical_cbd': {
      id: 'q5_medical_cbd',
      text: 'What CBD content level do you prefer?',
      type: 'single-choice',
      options: [
        { value: 'high', label: 'High CBD (15%+)', description: 'Maximum therapeutic benefits' },
        { value: 'medium', label: 'Medium CBD (5-15%)', description: 'Balanced approach' },
        { value: 'low', label: 'Low CBD (0-5%)', description: 'Minimal CBD content' },
        { value: 'any', label: 'No preference', description: 'Any CBD level' }
      ],
      next: () => 'results'
    },

    // Recreational path
    'q2_recreational_effects': {
      id: 'q2_recreational_effects',
      text: 'What effects are you looking for?',
      subtitle: 'Select all that apply',
      type: 'multi-choice',
      options: [
        { value: 'euphoria', label: 'Euphoria' },
        { value: 'relaxation', label: 'Relaxation' },
        { value: 'energy', label: 'Energy' },
        { value: 'creativity', label: 'Creativity' },
        { value: 'focus', label: 'Focus' },
        { value: 'sedation', label: 'Sedation/Sleep' }
      ],
      next: () => 'q3_recreational_mood'
    },

    'q3_recreational_mood': {
      id: 'q3_recreational_mood',
      text: 'What mood are you aiming for?',
      subtitle: 'Select up to 3',
      type: 'multi-choice',
      maxSelections: 3,
      options: [
        { value: 'happy', label: 'Happy' },
        { value: 'relaxed', label: 'Relaxed' },
        { value: 'uplifted', label: 'Uplifted' },
        { value: 'energized', label: 'Energized' },
        { value: 'creative', label: 'Creative' },
        { value: 'sleepy', label: 'Sleepy' },
        { value: 'giggly', label: 'Giggly' }
      ],
      next: () => 'q4_recreational_time'
    },

    'q4_recreational_time': {
      id: 'q4_recreational_time',
      text: 'When do you plan to use it?',
      type: 'single-choice',
      options: [
        { value: 'daytime', label: 'Daytime', description: 'Active, social, productive' },
        { value: 'evening', label: 'Evening', description: 'Wind down, relax, sleep' },
        { value: 'anytime', label: 'Anytime', description: 'Flexible use' }
      ],
      next: () => 'q5_recreational_format'
    },

    'q5_recreational_format': {
      id: 'q5_recreational_format',
      text: 'How would you prefer to consume it?',
      type: 'single-choice',
      options: [
        { value: 'Flower', label: 'Flower', description: 'Classic experience' },
        { value: 'Vape', label: 'Vape', description: 'Discreet and portable' },
        { value: 'Edible', label: 'Edible', description: 'Long-lasting effects' },
        { value: 'Concentrate', label: 'Concentrate', description: 'High potency' },
        { value: 'any', label: 'No preference', description: 'Show me all options' }
      ],
      next: () => 'q6_recreational_potency'
    },

    'q6_recreational_potency': {
      id: 'q6_recreational_potency',
      text: 'What THC potency level?',
      type: 'single-choice',
      options: [
        { value: 'low', label: 'Low THC (0-15%)', description: 'Gentle, controlled experience' },
        { value: 'medium', label: 'Medium THC (15-23%)', description: 'Balanced potency' },
        { value: 'high', label: 'High THC (23%+)', description: 'Strong effects' },
        { value: 'any', label: 'No preference', description: 'Any potency level' }
      ],
      next: () => 'results'
    }
  };

  // Flow state
  let flowState = null;
  let currentQuestion = null;
  let selectedAnswers = [];

  // ==================== INITIALIZATION ====================

  function init() {
    // Check for existing session
    loadFlowState();

    // Setup event listeners
    const guidedBtn = document.getElementById('guidedFlowBtn');
    if (guidedBtn) {
      guidedBtn.addEventListener('click', startFlow);
    }

    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      backBtn.addEventListener('click', goBack);
    }

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', goNext);
    }

    // Close on overlay click
    const overlay = document.querySelector('.guided-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', closeModal);
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('guidedFlowModal');
        if (modal && modal.classList.contains('active')) {
          closeModal();
        }
      }
    });
  }

  // ==================== FLOW STATE MANAGEMENT ====================

  function createFlowState() {
    return {
      sessionId: `gf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: null,
      answers: {},
      currentQuestionId: 'q1_primary_intent',
      questionHistory: [],
      startedAt: Date.now(),
      lastUpdated: Date.now()
    };
  }

  function loadFlowState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        flowState = JSON.parse(stored);
        // Check if session is stale (older than 24 hours)
        if (Date.now() - flowState.lastUpdated > 86400000) {
          clearFlowState();
        }
      }
    } catch (error) {
      console.error('Error loading flow state:', error);
      clearFlowState();
    }
  }

  function saveFlowState() {
    if (!flowState) return;
    flowState.lastUpdated = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flowState));
    } catch (error) {
      console.error('Error saving flow state:', error);
    }
  }

  function clearFlowState() {
    flowState = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  // ==================== MODAL CONTROL ====================

  function startFlow() {
    // Create new flow state
    flowState = createFlowState();
    saveFlowState();

    // Open modal
    openModal();

    // Load first question
    loadQuestion('q1_primary_intent');
  }

  function openModal() {
    const modal = document.getElementById('guidedFlowModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    const modal = document.getElementById('guidedFlowModal');
    if (!modal) return;

    // Confirm if user has started answering
    if (flowState && flowState.questionHistory.length > 0) {
      if (!confirm('Are you sure you want to exit? Your progress will be saved.')) {
        return;
      }
    }

    modal.classList.remove('active');
    document.body.style.overflow = 'auto';

    // Save state before closing
    saveFlowState();
  }

  // ==================== NAVIGATION ====================

  function loadQuestion(questionId) {
    currentQuestion = QUESTION_TREE[questionId];
    if (!currentQuestion) {
      console.error('Question not found:', questionId);
      return;
    }

    flowState.currentQuestionId = questionId;
    selectedAnswers = [];

    // Restore previously selected answers if user navigates back
    if (flowState.answers[questionId]) {
      if (Array.isArray(flowState.answers[questionId])) {
        selectedAnswers = [...flowState.answers[questionId]];
      } else {
        selectedAnswers = [flowState.answers[questionId]];
      }
    }

    // Update UI
    renderQuestion();
    updateProgress();
    updateNavigation();

    saveFlowState();
  }

  function goNext() {
    if (selectedAnswers.length === 0) return;

    // Save answers
    saveAnswers();

    // Add to history
    flowState.questionHistory.push(currentQuestion.id);

    // Determine next question or show results
    const nextQuestionId = getNextQuestion();

    if (nextQuestionId === 'results') {
      showResults();
    } else {
      loadQuestion(nextQuestionId);
    }
  }

  function goBack() {
    if (flowState.questionHistory.length === 0) return;

    // Remove current answers
    removeCurrentAnswers();

    // Go to previous question
    const previousQuestionId = flowState.questionHistory.pop();
    loadQuestion(previousQuestionId);
  }

  function getNextQuestion() {
    if (currentQuestion.next) {
      if (typeof currentQuestion.next === 'function') {
        const answer = currentQuestion.type === 'single-choice' ? selectedAnswers[0] : selectedAnswers;
        return currentQuestion.next(answer);
      }
      return currentQuestion.next;
    }
    return 'results';
  }

  // ==================== ANSWER MANAGEMENT ====================

  function saveAnswers() {
    const questionId = currentQuestion.id;

    if (currentQuestion.type === 'single-choice') {
      flowState.answers[questionId] = selectedAnswers[0];

      // Update category if this is the primary intent question
      if (questionId === 'q1_primary_intent') {
        const answer = selectedAnswers[0];
        if (answer === 'medical' || answer === 'recreational') {
          flowState.category = answer;
        }
      }

      // Update category if coming from unsure path
      if (questionId === 'q2_unsure_symptoms') {
        flowState.category = selectedAnswers[0] === 'yes' ? 'medical' : 'recreational';
      }
    } else {
      flowState.answers[questionId] = [...selectedAnswers];
    }

    saveFlowState();
  }

  function removeCurrentAnswers() {
    delete flowState.answers[currentQuestion.id];
    saveFlowState();
  }

  // ==================== UI RENDERING ====================

  function renderQuestion() {
    // Update title and subtitle
    const titleEl = document.getElementById('questionTitle');
    if (titleEl) {
      titleEl.textContent = currentQuestion.text;
    }

    const subtitleEl = document.getElementById('questionSubtitle');
    if (subtitleEl) {
      subtitleEl.textContent = currentQuestion.subtitle || '';
      subtitleEl.style.display = currentQuestion.subtitle ? 'block' : 'none';
    }

    // Render options
    renderOptions();
  }

  function renderOptions() {
    const container = document.getElementById('optionsContainer');
    if (!container) return;

    container.innerHTML = '';

    const isMultiChoice = currentQuestion.type === 'multi-choice';

    currentQuestion.options.forEach((option) => {
      const optionEl = document.createElement('div');
      optionEl.className = `guided-option${isMultiChoice ? ' multi-choice' : ''}`;
      optionEl.dataset.value = option.value;
      optionEl.setAttribute('role', isMultiChoice ? 'checkbox' : 'radio');
      optionEl.setAttribute('tabindex', '0');

      let content = `<div class="guided-option-label">${escapeHtml(option.label)}</div>`;
      if (option.description) {
        content += `<div class="guided-option-description">${escapeHtml(option.description)}</div>`;
      }
      optionEl.innerHTML = content;

      // Check if this option was previously selected
      if (selectedAnswers.includes(option.value)) {
        optionEl.classList.add('selected');
        optionEl.setAttribute('aria-checked', 'true');
      }

      // Click handler
      optionEl.addEventListener('click', () => handleOptionClick(option.value));

      // Keyboard navigation
      optionEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOptionClick(option.value);
        }
      });

      container.appendChild(optionEl);
    });
  }

  function handleOptionClick(value) {
    const isMultiChoice = currentQuestion.type === 'multi-choice';

    if (isMultiChoice) {
      // Toggle selection
      const index = selectedAnswers.indexOf(value);
      if (index > -1) {
        selectedAnswers.splice(index, 1);
      } else {
        // Check max selections
        const maxSelections = currentQuestion.maxSelections || 999;
        if (selectedAnswers.length < maxSelections) {
          selectedAnswers.push(value);
        } else {
          // Show feedback
          showMaxSelectionsMessage(maxSelections);
          return;
        }
      }
    } else {
      // Single selection
      selectedAnswers = [value];
    }

    // Update UI
    updateOptionSelection();
    updateNextButton();
  }

  function updateOptionSelection() {
    const options = document.querySelectorAll('.guided-option');
    options.forEach((option) => {
      const value = option.dataset.value;
      if (selectedAnswers.includes(value)) {
        option.classList.add('selected');
        option.setAttribute('aria-checked', 'true');
      } else {
        option.classList.remove('selected');
        option.setAttribute('aria-checked', 'false');
      }
    });
  }

  function updateNextButton() {
    const nextBtn = document.getElementById('nextBtn');
    if (!nextBtn) return;

    if (selectedAnswers.length > 0) {
      nextBtn.disabled = false;
    } else {
      nextBtn.disabled = true;
    }
  }

  function updateProgress() {
    // Calculate progress based on question tree depth
    const totalQuestions = estimateTotalQuestions();
    const currentStep = flowState.questionHistory.length + 1;
    const percentage = (currentStep / totalQuestions) * 100;

    // Update progress bar
    const progressBar = document.querySelector('.guided-progress-bar');
    if (progressBar) {
      const afterEl = progressBar.querySelector('::after');
      if (afterEl) {
        afterEl.style.width = `${percentage}%`;
      } else {
        // Fallback: update via CSS variable or inline style
        progressBar.style.setProperty('--progress-width', `${percentage}%`);
      }

      // Find the ::after pseudo-element and update it
      const style = document.querySelector('style') || document.head.appendChild(document.createElement('style'));
      style.textContent = `.guided-progress-bar::after { width: ${percentage}% !important; }`;
    }

    // Update text
    const progressText = document.getElementById('progressText');
    if (progressText) {
      progressText.textContent = `Question ${currentStep} of ${totalQuestions}`;
    }
  }

  function estimateTotalQuestions() {
    // Estimate based on category
    if (flowState.category === 'medical') return 5;
    if (flowState.category === 'recreational') return 6;
    return 5; // Default estimate
  }

  function updateNavigation() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      // Show/hide back button
      if (flowState.questionHistory.length > 0) {
        backBtn.style.visibility = 'visible';
      } else {
        backBtn.style.visibility = 'hidden';
      }
    }

    // Update next button text for last question
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      const isLastQuestion = getNextQuestion() === 'results';
      const textSpan = nextBtn.querySelector('.btn-text') || nextBtn;
      textSpan.textContent = isLastQuestion ? 'See Results' : 'Next';
    }

    // Update state
    updateNextButton();
  }

  function showMaxSelectionsMessage(max) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'guided-toast';
    toast.innerHTML = `<div class="guided-toast-content">You can select up to ${max} options</div>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('active');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // ==================== RESULTS & REDIRECTION ====================

  function showResults() {
    // Build filter object from answers
    const filters = buildFilterObject();

    // Encode filters as URL parameters
    const urlParams = encodeFiltersToURL(filters);

    // Determine target page
    const targetPage = flowState.category === 'medical' ? 'medical.html' : 'recreational.html';

    // Clear flow state
    clearFlowState();

    // Redirect with filters
    window.location.href = `${targetPage}?${urlParams}`;
  }

  function buildFilterObject() {
    const filters = {};
    const answers = flowState.answers;

    if (flowState.category === 'medical') {
      // Conditions
      if (answers.q2_medical_conditions && answers.q2_medical_conditions.length > 0) {
        filters.conditions = answers.q2_medical_conditions;
      }

      // Effects
      if (answers.q3_medical_effects && answers.q3_medical_effects.length > 0) {
        filters.effects = answers.q3_medical_effects;
      }

      // Format
      if (answers.q4_medical_format && answers.q4_medical_format !== 'any') {
        filters.format = [answers.q4_medical_format];
      }

      // CBD Level
      if (answers.q5_medical_cbd && answers.q5_medical_cbd !== 'any') {
        filters.cbdRange = answers.q5_medical_cbd;
      }
    } else if (flowState.category === 'recreational') {
      // Effects
      if (answers.q2_recreational_effects && answers.q2_recreational_effects.length > 0) {
        filters.effects = [...answers.q2_recreational_effects];
      }

      // Mood (also add to effects)
      if (answers.q3_recreational_mood && answers.q3_recreational_mood.length > 0) {
        if (filters.effects) {
          filters.effects = [...filters.effects, ...answers.q3_recreational_mood];
        } else {
          filters.effects = [...answers.q3_recreational_mood];
        }
      }

      // Format
      if (answers.q5_recreational_format && answers.q5_recreational_format !== 'any') {
        filters.format = [answers.q5_recreational_format];
      }

      // THC Potency
      if (answers.q6_recreational_potency && answers.q6_recreational_potency !== 'any') {
        filters.thcRange = answers.q6_recreational_potency;
      }
    }

    return filters;
  }

  function encodeFiltersToURL(filters) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value)) {
        // Multiple values: use comma-separated
        params.set(key, value.join(','));
      } else {
        params.set(key, value);
      }
    }

    // Add a flag to indicate this came from guided flow
    params.set('guided', '1');

    return params.toString();
  }

  // ==================== UTILITY FUNCTIONS ====================

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ==================== EXPORT & INITIALIZATION ====================

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export to window for external access if needed
  window.verdantGuidedFlow = {
    start: startFlow,
    close: closeModal,
    clearState: clearFlowState
  };
})();
