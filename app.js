(() => {
  'use strict';
  const questions = window.CID_QUESTIONS;
  const $ = (id) => document.getElementById(id);
  const storageKey = 'stone-center-trivia-played-v1';
  let played = new Set();
  let current = null;
  let revealed = false;
  let lastTile = null;
  let helpOrigin = null;
  function clearFullscreenNotice() {
    if ($('status').classList.contains('fullscreen-notice')) {
      $('status').className = 'visually-hidden';
      $('status').textContent = '';
    }
  }
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) played = new Set(saved.filter(id => questions.some(q => q.id === id)));
    // Some browsers expose localStorage but deny writes, especially for local files.
    localStorage.setItem(storageKey, JSON.stringify([...played]));
  } catch {
    $('storage-notice').hidden = false;
  }

  const marks = [
    '<path d="M12 55h48M20 55V30h12v25M40 55V15h12v40M13 20l22-9"/>',
    '<circle cx="36" cy="36" r="23"/><path d="M36 21v30m8-24c-12-9-24 5-8 9s4 18-8 9"/>',
    '<path d="M10 47l13-20 14 11 15-21 12 8M10 57h54"/><circle cx="52" cy="17" r="4"/>',
    '<circle cx="36" cy="25" r="11"/><path d="M16 59c0-26 40-26 40 0M12 11l5 5m43-5-5 5"/>',
    '<path d="M10 33l26-23 26 23M17 29v31h38V29M30 60V42h12v18"/>',
    '<path d="M12 23h48M20 15v16m32-16v16M13 23v36h46V23"/><path d="M25 41l8 8 16-17"/>',
    '<circle cx="36" cy="16" r="6"/><circle cx="17" cy="50" r="6"/><circle cx="55" cy="50" r="6"/><path d="M31 26L22 40m19-14 9 14M28 50h16"/>',
    '<path d="M15 58V36h9v22m8 0V25h9v33m8 0V13h9v45M10 64h53"/>',
    '<path d="M12 17l18 11 12-8 18 13M12 55l18-11 12 8 18-13M12 36h48"/>',
    '<path d="M12 15h48v34H35L22 61V49H12zM23 27h27M23 37h18"/>',
    '<circle cx="24" cy="24" r="8"/><circle cx="49" cy="30" r="7"/><path d="M9 58V47c0-17 30-17 30 0v11m7-17c12-3 17 3 17 11v6"/>',
    '<path d="M11 59V31h15v28m7 0V13h14v46m7 0V39h9v20M7 59h59M33 24h14M33 35h14"/>'
  ];

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify([...played])); }
    catch { $('storage-notice').hidden = false; }
  }
  function renderBoard() {
    $('tiles').replaceChildren();
    questions.forEach((q, i) => {
      const button = document.createElement('button');
      button.className = `tile ${q.category === 'center' ? 'center-tile' : ''} ${played.has(q.id) ? 'played' : ''}`;
      button.dataset.id = q.id;
      const badge = document.createElement('span');
      badge.className = 'tile-badge';
      badge.textContent = q.category === 'center' ? 'Start here' : 'Research';
      const mark = document.createElement('span');
      mark.className = 'tile-art';
      mark.setAttribute('aria-hidden', 'true');
      mark.innerHTML = `<svg viewBox="0 0 72 72" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${marks[i]}</svg>`;
      const title = document.createElement('span');
      title.className = 'tile-title';
      title.textContent = q.tile;
      const bottom = document.createElement('span');
      bottom.className = 'tile-bottom';
      const state = document.createElement('span');
      state.className = 'tile-state';
      state.textContent = played.has(q.id) ? '✓ Played' : 'Explore';
      const arrow = document.createElement('span');
      arrow.textContent = '↗';
      arrow.setAttribute('aria-hidden', 'true');
      bottom.append(state, arrow);
      button.append(badge, mark, title, bottom);
      button.addEventListener('click', () => openQuestion(q, q.id));
      $('tiles').append(button);
    });
  }
  function openQuestion(q, origin = null) {
    clearFullscreenNotice();
    current = q;
    lastTile = origin;
    revealed = false;
    $('answer').hidden = true;
    // Clear previous reveal content as well as hiding its whole subtree.
    ['answer-title', 'explanation', 'researchers', 'source-label'].forEach(id => $(id).textContent = '');
    $('source-link').removeAttribute('href');
    $('vote-prompt').hidden = false;
    $('reveal').hidden = false;
    $('next').hidden = true;
    $('question-category').textContent = q.category === 'center' ? 'Start here · Meet the center' : 'Research · Look a little closer';
    $('question-topic').textContent = q.tile;
    $('question-title').textContent = q.question;
    $('question-screen').classList.toggle('long-question', q.question.length > 210);
    $('options').replaceChildren();
    q.options.forEach((option, i) => {
      const li = document.createElement('li');
      li.className = 'option';
      const letter = document.createElement('span');
      letter.className = 'option-letter';
      letter.textContent = 'ABCD'[i];
      const text = document.createElement('span');
      text.className = 'option-text';
      text.textContent = option;
      li.append(letter, text);
      $('options').append(li);
    });
    $('board').hidden = true;
    $('question-screen').hidden = false;
    window.scrollTo(0, 0);
    $('question-screen').focus({ preventScroll: true });
  }
  function revealAnswer() {
    if (!current || revealed) return;
    revealed = true;
    const letter = 'ABCD'[current.correct];
    const correct = $('options').children[current.correct];
    correct.classList.add('correct');
    const label = document.createElement('span');
    label.className = 'correct-label';
    label.textContent = '✓ Correct';
    correct.append(label);
    $('answer-title').textContent = `Correct answer: ${letter}. ${current.options[current.correct]}`;
    $('explanation').textContent = current.explanation;
    $('researchers').textContent = current.researchers;
    $('researchers').hidden = !current.researchers;
    $('source-label').textContent = current.source;
    $('source-link').href = current.url;
    $('vote-prompt').hidden = true;
    $('answer').hidden = false;
    $('reveal').hidden = true;
    $('next').hidden = false;
    played.add(current.id);
    save();
    renderBoard();
    $('answer-title').focus({ preventScroll: true });
  }
  function backToBoard(restore = true) {
    clearFullscreenNotice();
    current = null;
    revealed = false;
    $('question-screen').hidden = true;
    $('board').hidden = false;
    window.scrollTo(0, 0);
    const origin = restore && lastTile ? $('tiles').querySelector(`[data-id="${lastTile}"]`) : null;
    (origin || $('board')).focus({ preventScroll: true });
  }
  function randomQuestion() {
    const unplayed = questions.filter(q => !played.has(q.id));
    const pool = unplayed.length ? unplayed : questions;
    openQuestion(pool[Math.floor(Math.random() * pool.length)]);
  }
  $('surprise').addEventListener('click', randomQuestion);
  $('next').addEventListener('click', randomQuestion);
  $('reveal').addEventListener('click', revealAnswer);
  $('back').addEventListener('click', () => backToBoard());
  $('reset').addEventListener('click', () => {
    played.clear();
    save();
    renderBoard();
    backToBoard(false);
    $('status').textContent = 'Played questions reset. All 12 questions are available.';
  });
  $('help').addEventListener('click', () => {
    helpOrigin = $('help');
    $('help-dialog').showModal();
  });
  ['close-help', 'done-help'].forEach(id => $(id).addEventListener('click', () => $('help-dialog').close()));
  $('help-dialog').addEventListener('close', () => helpOrigin?.focus());
  document.addEventListener('keydown', event => {
    if ($('help-dialog').open || event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
    if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'Escape' && current) {
      event.preventDefault();
      backToBoard();
    } else if (event.key.toLowerCase() === 'n') {
      event.preventDefault();
      randomQuestion();
    } else if ((event.key === ' ' || event.key === 'Enter') && event.target === $('question-screen') && !revealed) {
      event.preventDefault();
      revealAnswer();
    }
  });
  if (document.fullscreenEnabled && document.documentElement.requestFullscreen) {
    $('fullscreen').hidden = false;
    $('fullscreen').addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
        clearFullscreenNotice();
      } catch {
        $('status').className = 'fullscreen-notice';
        $('status').textContent = 'Use your browser’s fullscreen command (Control+Command+F on Mac).';
      }
    });
    document.addEventListener('fullscreenchange', () => {
      $('fullscreen-label').textContent = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen';
      $('fullscreen').setAttribute('aria-pressed', String(Boolean(document.fullscreenElement)));
    });
  }
  renderBoard();
})();
