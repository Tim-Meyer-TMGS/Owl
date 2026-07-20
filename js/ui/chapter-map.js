(() => {
  'use strict';

  const levels = [...(window.OWL_LEVEL_DATA?.levels || [])].sort((a, b) => a.order - b.order);
  const chapters = window.OWL_STORY_DATA?.chapters || [];
  const overlay = document.getElementById('chapterMapOverlay');
  const scroller = document.getElementById('chapterMapScroller');
  const track = document.getElementById('chapterMapTrack');
  const preview = document.getElementById('chapterMapPreview');
  const openButton = document.getElementById('openMapBtn');
  const closeButton = document.getElementById('closeMapBtn');
  const startOverlay = document.getElementById('startOverlay');
  const progressKey = 'owl-flight-progress-v1';
  const checkpointKey = 'owl-flight-checkpoint-v1';
  let selectedScene = 0;

  if (!levels.length || !chapters.length || !overlay || !track || !preview) return;

  const icon = name => `<svg class="uiIcon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const clampScene = value => Math.max(1, Math.min(levels.length, Math.floor(Number(value) || 1)));
  const readJson = (key, fallback) => {
    try { return { ...fallback, ...JSON.parse(localStorage.getItem(key) || '{}') }; }
    catch (_) { return fallback; }
  };
  const readProgress = () => {
    const data = readJson(progressKey, { highestScene: 1, completedScenes: [], sceneRecords: {} });
    const checkpoint = readJson(checkpointKey, { version: 0, phaseIndex: -1 });
    const checkpointScene = checkpoint.version === 1 ? clampScene(checkpoint.phaseIndex + 1) : 1;
    return {
      highestScene: Math.max(clampScene(data.highestScene), checkpointScene),
      completedScenes: new Set(Array.isArray(data.completedScenes) ? data.completedScenes.map(clampScene) : []),
      sceneRecords: data.sceneRecords && typeof data.sceneRecords === 'object' ? data.sceneRecords : {},
      selectedOwl: data.selectedOwl || 'tawny'
    };
  };
  const chapterFor = scene => chapters.find(chapter => scene >= chapter.startLevel && scene <= chapter.endLevel) || chapters[0];
  const sceneRecord = (progress, scene) => progress.sceneRecords[String(scene)] || {};

  function sceneStatus(progress, scene) {
    if (scene > progress.highestScene) return 'locked';
    if (progress.completedScenes.has(scene)) return 'complete';
    return scene === progress.highestScene ? 'current' : 'open';
  }

  function statusIcon(status) {
    if (status === 'locked') return icon('lock');
    if (status === 'complete') return icon('check');
    return '';
  }

  function buildMap() {
    const progress = readProgress();
    selectedScene = Math.min(selectedScene || progress.highestScene, progress.highestScene);
    track.replaceChildren();

    chapters.forEach((chapter, chapterIndex) => {
      const chapterLevels = levels.filter(level => level.order >= chapter.startLevel && level.order <= chapter.endLevel);
      const section = document.createElement('section');
      section.className = 'mapChapter';
      section.dataset.chapter = chapter.id;
      section.style.setProperty('--scene-count', chapterLevels.length);
      section.innerHTML = `
        <div class="mapChapterHeading">
          <span>${chapter.number}</span>
          <strong>${chapter.title}</strong>
        </div>
        <div class="mapLandmark mapLandmark${(chapterIndex % 4) + 1}" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="mapPath" aria-hidden="true"></div>
        <div class="mapNodes"></div>`;
      const nodeRow = section.querySelector('.mapNodes');

      chapterLevels.forEach((level, index) => {
        const scene = level.order;
        const status = sceneStatus(progress, scene);
        const record = sceneRecord(progress, scene);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `mapNode ${status}${scene === selectedScene ? ' selected' : ''}${(scene === 1 || scene === levels.length) ? ' major' : ''}`;
        button.dataset.scene = scene;
        button.style.setProperty('--node-index', index);
        button.disabled = status === 'locked';
        button.setAttribute('aria-label', status === 'locked'
          ? `Szene ${scene}, gesperrt. Erreiche zuerst Szene ${scene - 1}.`
          : `Szene ${scene}: ${level.name}${status === 'complete' ? ', abgeschlossen' : ''}`);
        button.innerHTML = `
          <span class="mapNodeDisc">${statusIcon(status)}<b>${scene}</b></span>
          <span class="mapNodeName">${level.name}</span>
          <span class="mapNodeMarks" aria-hidden="true">
            <i class="${record.bonus ? 'earned' : ''}">${icon('star')}</i>
            <i class="${record.memory ? 'earned' : ''}">${icon('feather')}</i>
          </span>`;
        nodeRow.appendChild(button);
      });
      track.appendChild(section);
    });

    track.querySelectorAll('.mapNode:not(:disabled)').forEach(button => button.addEventListener('click', () => {
      selectedScene = Number(button.dataset.scene);
      track.querySelectorAll('.mapNode.selected').forEach(node => node.classList.remove('selected'));
      button.classList.add('selected');
      renderPreview();
    }));
    renderPreview();
  }

  function renderPreview() {
    const progress = readProgress();
    const level = levels[selectedScene - 1] || levels[0];
    const chapter = chapterFor(level.order);
    const status = sceneStatus(progress, level.order);
    const record = sceneRecord(progress, level.order);
    const completed = status === 'complete';
    const owlLabel = record.owlName || (record.owl || progress.selectedOwl);
    preview.innerHTML = `
      <div class="mapPreviewIdentity">
        <span class="mapPreviewNumber">${String(level.order).padStart(2, '0')}</span>
        <p><small>${chapter.number}</small><strong>${level.name}</strong></p>
      </div>
      <div class="mapPreviewGoals" aria-label="Szenenstatus">
        <span class="${completed ? 'earned' : ''}" title="Abschluss">${icon(completed ? 'check' : 'nest')}<b>${level.objective.target}</b></span>
        <span class="${record.bonus ? 'earned' : ''}" title="Bonusziel">${icon('star')}</span>
        <span class="${record.memory ? 'earned' : ''}" title="Erinnerungsfund">${icon('feather')}</span>
        <span title="Bester Punktestand">${icon('moon')}<b>${Math.max(0, Number(record.bestScore) || 0)}</b></span>
      </div>
      <span class="mapPreviewOwl" aria-label="Verwendete Eule">${owlLabel}</span>
      <button class="mapPlayButton" type="button" ${status === 'locked' ? 'disabled' : ''}>
        ${status === 'locked' ? `${icon('lock')} Erst Szene ${level.order - 1}` : `${icon('feather')} Szene spielen`}
      </button>`;
    const playButton = preview.querySelector('.mapPlayButton');
    if (!playButton.disabled) playButton.addEventListener('click', () => {
      close();
      window.dispatchEvent(new CustomEvent('owl:select-level', { detail: { scene: level.order } }));
    });
  }

  function scrollToProgress(behavior = 'smooth') {
    requestAnimationFrame(() => {
      const target = track.querySelector(`[data-scene="${readProgress().highestScene}"]`);
      if (target) target.scrollIntoView({ behavior, block: 'nearest', inline: 'center' });
    });
  }

  function open() {
    buildMap();
    startOverlay?.classList.add('hidden');
    overlay.classList.remove('hidden');
    scrollToProgress('auto');
    closeButton?.focus({ preventScroll: true });
  }

  function close() {
    overlay.classList.add('hidden');
    startOverlay?.classList.remove('hidden');
    openButton?.focus({ preventScroll: true });
  }

  openButton?.addEventListener('click', open);
  closeButton?.addEventListener('click', close);
  overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
  overlay.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });

  window.OWL_CHAPTER_MAP = { open, close, refresh: buildMap, scrollToProgress };
})();
