(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const shell = document.getElementById('shell');

  const ui = {
    score:document.getElementById('score'),
    hearts:document.getElementById('hearts'),
    combo:document.getElementById('comboText'),
    phase:document.getElementById('phaseName'),
    delivered:document.getElementById('delivered'),
    target:document.getElementById('target'),targetUnit:document.getElementById('targetUnit'),
    energy:document.getElementById('energyFill'),
    time:document.getElementById('timeFill'),
    timeText:document.getElementById('timeText'),
    mission:document.getElementById('missionBanner'),
    bonus:document.getElementById('bonusGoal'),
    toast:document.getElementById('toast'),
    storyBubble:document.getElementById('storyBubble'),storyBubbleAvatar:document.getElementById('storyBubbleAvatar'),storyBubbleName:document.getElementById('storyBubbleName'),storyBubbleText:document.getElementById('storyBubbleText'),
    start:document.getElementById('startOverlay'),
    story:document.getElementById('storyOverlay'),storyNumber:document.getElementById('storyChapterNumber'),storyTitle:document.getElementById('storyChapterTitle'),storyAvatar:document.getElementById('storyAvatar'),storySpeaker:document.getElementById('storySpeaker'),storyText:document.getElementById('storyText'),giftChoices:document.getElementById('giftChoices'),storyNext:document.getElementById('storyNextBtn'),storySkip:document.getElementById('storySkipBtn'),
    pause:document.getElementById('pauseOverlay'),
    level:document.getElementById('levelOverlay'),
    end:document.getElementById('endOverlay'),
    endEyebrow:document.getElementById('endEyebrow'),
    endTitle:document.getElementById('endTitle'),
    endText:document.getElementById('endText'),
    resultScore:document.getElementById('resultScore'),
    resultPrey:document.getElementById('resultPrey'),
    resultBest:document.getElementById('resultBest'),
    resultXp:document.getElementById('resultXp'),finalHoot:document.getElementById('finalHootBtn'),
    levelTitle:document.getElementById('levelCompleteTitle'),levelFood:document.getElementById('levelFoodResult'),levelUnit:document.getElementById('levelResultUnit'),levelScore:document.getElementById('levelScoreResult'),levelBonus:document.getElementById('levelBonusResult'),levelXp:document.getElementById('levelXpResult'),
    playerLevel:document.getElementById('playerLevel'),xpCurrent:document.getElementById('xpCurrent'),xpNext:document.getElementById('xpNext'),xpFill:document.getElementById('xpFill'),
    upgradePoints:document.getElementById('upgradePoints'),owlPicker:document.getElementById('owlPicker'),owlDetail:document.getElementById('owlDetail'),
    upgradeInfo:document.getElementById('upgradeInfo'),
    owlUpgradeLevel:document.getElementById('owlUpgradeLevel'),nestUpgradeLevel:document.getElementById('nestUpgradeLevel'),
    upgradeOwl:document.getElementById('upgradeOwlBtn'),upgradeNest:document.getElementById('upgradeNestBtn'),
    continueGame:document.getElementById('continueBtn'),saveExit:document.getElementById('saveExitBtn'),
    newGame:document.getElementById('startBtn'),replayIntros:document.getElementById('replayIntros'),
    sound:document.getElementById('soundBtn'),hootCharge:document.getElementById('hootChargeText'),hootButton:document.querySelector('[data-action="hoot"]'),hootContextUse:document.getElementById('hootContextUse'),diveButton:document.querySelector('[data-action="dive"]')
  };

  const levelData=window.OWL_LEVEL_DATA;
  if(!levelData||levelData.formatVersion!==1||!Array.isArray(levelData.levels)||!levelData.levels.length){
    throw new Error('Keine gültigen Leveldaten geladen. Bitte tools/build-levels.ps1 ausführen.');
  }
  const campaign=levelData.campaign;
  const rosterData=window.OWL_ROSTER_DATA;
  if(!rosterData||rosterData.formatVersion!==1||!Array.isArray(rosterData.owls)||!rosterData.owls.length){
    throw new Error('Keine gültigen Eulendaten geladen.');
  }
  const owlRoster=rosterData.owls;
  const storyData=window.OWL_STORY_DATA;
  if(!storyData||storyData.formatVersion!==1||!Array.isArray(storyData.chapters)||!storyData.chapters.length){throw new Error('Keine gültigen Storydaten geladen.')}
  const worldLoader=window.OWL?.worlds,camera=window.OWL?.camera?.create(),parallax=window.OWL?.parallax,perches=window.OWL?.perches,hootSystem=window.OWL?.hoot,storySystem=window.OWL?.story,tutorialSystem=window.OWL?.tutorial;
  if(!worldLoader||worldLoader.count!==levelData.levels.length||!camera||!parallax||!perches||!hootSystem||hootSystem.sceneCount!==levelData.levels.length||!storySystem||storySystem.sceneCount!==levelData.levels.length||!tutorialSystem){throw new Error('Welt-, Kamera-, Parallax-, Ast-, Huuu-, Story- oder Tutorialmodul fehlt.')}
  const progressKey='owl-flight-progress-v1';
  const checkpointKey='owl-flight-checkpoint-v1';
  const progress=(()=>{
    const fallback={level:1,xp:0,goldPoints:0,selectedOwl:'tawny',owlUpgrade:0,nestUpgrade:0,highestScene:1,completedScenes:[],sceneRecords:{},seenChapters:[],replayIntros:false};
    try{return {...fallback,...JSON.parse(localStorage.getItem(progressKey)||'{}')}}catch(_){return fallback}
  })();
  progress.level=Math.max(1,Math.floor(Number(progress.level)||1));
  progress.xp=Math.max(0,Math.floor(Number(progress.xp)||0));
  progress.goldPoints=Math.max(0,Math.floor(Number(progress.goldPoints)||0));
  progress.owlUpgrade=Math.max(0,Math.min(rosterData.xp.maximumUpgradeLevel,Math.floor(Number(progress.owlUpgrade)||0)));
  progress.nestUpgrade=Math.max(0,Math.min(rosterData.xp.maximumUpgradeLevel,Math.floor(Number(progress.nestUpgrade)||0)));
  progress.highestScene=Math.max(1,Math.min(levelData.levels.length,Math.floor(Number(progress.highestScene)||1)));
  progress.completedScenes=Array.isArray(progress.completedScenes)?[...new Set(progress.completedScenes.map(value=>Math.floor(Number(value))).filter(value=>value>=1&&value<=levelData.levels.length))]:[];
  progress.sceneRecords=progress.sceneRecords&&typeof progress.sceneRecords==='object'&&!Array.isArray(progress.sceneRecords)?progress.sceneRecords:{};
  progress.seenChapters=Array.isArray(progress.seenChapters)?[...new Set(progress.seenChapters.filter(id=>storyData.chapters.some(chapter=>chapter.id===id)))]:[];progress.replayIntros=Boolean(progress.replayIntros);
  if(!owlRoster.some(entry=>entry.id===progress.selectedOwl&&entry.unlockLevel<=progress.level))progress.selectedOwl='tawny';
  const saveProgress=()=>{try{localStorage.setItem(progressKey,JSON.stringify(progress))}catch(_){}window.OWL_CHAPTER_MAP?.refresh()};
  const xpNeeded=level=>rosterData.xp.basePerLevel+(level-1)*rosterData.xp.growthPerLevel;
  const availableUpgradePoints=()=>progress.goldPoints;
  const selectedOwl=()=>owlRoster.find(entry=>entry.id===progress.selectedOwl)||owlRoster[0];
  const playerStats=()=>{
    const chosen=selectedOwl(),upgrade=progress.owlUpgrade;
    return {
      ...chosen.stats,...chosen.flight,ability:chosen.ability,colors:chosen.colors,
      speed:chosen.flightSpeed,size:chosen.size,resistance:chosen.stats.resistance*(1+upgrade*.04),
      maximumEnergy:Math.round(100*chosen.stats.energy+upgrade*8),
      diveEnergyCost:Math.max(10,Math.round(22*chosen.stats.diveCost*(1-upgrade*.04))),
      hootRadius:(chosen.ability==='wideHoot'?390:320),
      hootRechargeRate:(chosen.stats.hootRecharge||1)*(1+upgrade*.05)/14
    };
  };
  const expandPreyWeights=weights=>Object.entries(weights).flatMap(([type,weight])=>Array(Math.max(0,Math.round(weight))).fill(type));
  const phases=[...levelData.levels].sort((a,b)=>a.order-b.order).map(level=>({
    id:level.id,name:level.name,target:level.objective.target,requiredType:level.objective.requiredPrey,objectiveType:level.objective.type,
    nestSlot:(level.order-1)%6,
    timeBonus:level.timeBonusSeconds,theme:level.presentation.theme,intro:level.presentation.intro,
    terrain:level.presentation.scenery.terrain,treeTypes:level.presentation.scenery.trees,obstacleTypes:level.presentation.scenery.obstacles,
    introShort:level.name,mission:level.presentation.mission||`Sammle ${level.objective.target} Futterpunkte im Nest.`,missionShort:level.presentation.shortMission||`${level.objective.target} Futterpunkte`,
    preyTypes:expandPreyWeights(level.population.prey),startMice:level.population.startingPrey,
    mouseCap:level.population.maximumPrey,mouseDelay:[level.population.spawnDelaySeconds.min,level.population.spawnDelaySeconds.max],
    waveSize:level.waves.size,waveBreak:level.waves.breakSeconds,branchCount:level.hazards.branches,
    batCap:level.hazards.maximumBats,batDelay:[level.hazards.batSpawnDelaySeconds.min,level.hazards.batSpawnDelaySeconds.max],
    rivalCap:level.hazards.maximumRivalOwls||0,rivalDelay:[level.hazards.rivalOwlSpawnDelaySeconds.min,level.hazards.rivalOwlSpawnDelaySeconds.max],
    fireflyCap:level.pickups.maximumFireflies,fireflyDelay:[level.pickups.fireflySpawnDelaySeconds.min,level.pickups.fireflySpawnDelaySeconds.max],
    speedMultiplier:level.difficulty.speedMultiplier,timeDrainMultiplier:level.difficulty.timeDrainMultiplier,
    hitPenaltySeconds:level.difficulty.hitPenaltySeconds,audioChord:level.audio.chordHz
  }));

  const state = {
    w:0,h:0,dpr:1,groundY:0,gameScale:1,touchMode:false,tabletMode:false,tabletLandscapeMode:false,landscapePhoneMode:false,world:null,cameraPulse:0,
    running:false,paused:false,ended:false,
    score:0,hearts:campaign.startingHearts,maxHearts:campaign.maximumHearts,energy:100,time:campaign.startingTimeSeconds,maxTime:campaign.startingTimeSeconds,
    phaseIndex:0,phaseDelivered:0,totalDelivered:0,totalFood:0,runXp:0,phaseRewarded:false,
    combo:0,bestCombo:0,comboClock:0,
    mouseClock:0,batClock:0,fireflyClock:0,rivalClock:0,wave:1,waveRemaining:0,waveBreak:0,
    keys:new Set(),pointer:{active:false,x:0,y:0,screenX:0,screenY:0,targetScreenX:0,targetScreenY:0,touch:false,id:null,landingTap:false,startScreenX:0,startScreenY:0},
    mice:[],bats:[],rivals:[],branches:[],safePerches:[],bushes:[],groundDetails:[],fireflies:[],particles:[],floaters:[],rings:[],stars:[],clouds:[],grass:[],hootContexts:[],hootEchoes:[],edgeSignals:[],leafMotions:[],
    hootCharge:1,shake:0,transition:0,transitionQueued:false,
    last:0,muted:false,elapsed:0,phaseElapsed:0,musicClock:.4,wildlifeClock:2,
    bonus:null,levelHits:0,levelPreyCounts:{},levelPreyTypes:new Set(),eliteSpawned:false,lastPhaseXp:0,lastBonusAwarded:false,
    shownStories:new Set(),activeStory:null,storyLineIndex:0,storyBeatIndex:0,storyChoosingGift:false,selectedGift:null,landedPerches:new Set(),storyScene:null,storyDialogueQueue:[],storyDebug:false,lastSafePoint:null,tutorial:null
  };

  const owl = {
    x:260,y:230,vx:0,vy:0,r:35,angle:0,
    dive:false,diveTime:0,diveDirX:0,diveDirY:1,flightState:'flying',targetPerchId:null,perchId:null,stumbleTime:0,facing:1,turnTime:0,
    invuln:0,wing:0,carrying:null
  };

  let audioCtx = null,masterGain=null,ambienceGain=null,noiseBuffer=null;

  const iconSvg=name=>`<svg class="uiIcon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  function setMobileMission(html,desktopText){
    const content=state.touchMode?html:desktopText;
    if(ui.mission.dataset.content===content)return;
    ui.mission.dataset.content=content;
    if(state.touchMode) ui.mission.innerHTML=`<span class="iconSequence">${html}</span>`;
    else ui.mission.textContent=desktopText;
  }
  function phaseMissionIcons(phase){
    const gold=phase.requiredType==='gold'?`${iconSvg('star')} `:'';
    const danger=phase.batCap>=8?` · ${iconSvg('bat')} !`:'';
    return `${gold}${iconSvg('star')} ${phase.target} → ${iconSvg('nest')}${danger}`;
  }
  function initBonusGoal(){
    const tier=Math.floor(state.phaseIndex/8),kind=['untouched','combo','rabbit','variety','gold'][state.phaseIndex%5];
    const definitions={
      untouched:{label:'Ohne Treffer',target:1},combo:{label:`Kombo ×${2+Math.min(2,tier)}`,target:2+Math.min(2,tier)},
      rabbit:{label:`${1+Math.min(2,tier)} Kaninchen`,target:1+Math.min(2,tier)},variety:{label:`${2+Math.min(2,tier)} Tierarten`,target:2+Math.min(2,tier)},
      gold:{label:'1 Goldtier',target:1}
    };
    state.bonus={kind,...definitions[kind],progress:0,complete:false,failed:false,awarded:false};
    state.levelHits=0;state.levelPreyCounts={};state.levelPreyTypes=new Set();state.lastBonusAwarded=false;updateBonusHud();
  }
  function updateBonusHud(){
    if(!state.bonus)return;
    const bonus=state.bonus,status=bonus.failed?'✕':(bonus.complete?'✓':`${Math.min(bonus.progress,bonus.target)}/${bonus.target}`);
    ui.bonus.textContent=`☆ ${bonus.label} · ${status}`;ui.bonus.style.color=bonus.failed?'#ff8c88':(bonus.complete?'#7ee09b':'#ffd469');
  }
  function updateBonusProgress(type){
    const bonus=state.bonus;if(!bonus||bonus.complete||bonus.failed)return;
    state.levelPreyCounts[type]=(state.levelPreyCounts[type]||0)+1;state.levelPreyTypes.add(type);
    if(bonus.kind==='rabbit')bonus.progress=state.levelPreyCounts.rabbit||0;
    if(bonus.kind==='gold')bonus.progress=state.levelPreyCounts.gold||0;
    if(bonus.kind==='variety')bonus.progress=state.levelPreyTypes.size;
    if(bonus.progress>=bonus.target)bonus.complete=true;updateBonusHud();
  }
  function evaluateBonusGoal(){
    const bonus=state.bonus;if(!bonus)return 0;
    if(bonus.kind==='untouched'){bonus.progress=state.levelHits===0?1:0;bonus.complete=state.levelHits===0;bonus.failed=!bonus.complete}
    if(bonus.complete&&!bonus.awarded){bonus.awarded=true;state.lastBonusAwarded=true;state.score+=300+state.phaseIndex*10;updateBonusHud();return 30}
    updateBonusHud();return 0;
  }
  const chapterForLevel=(index=state.phaseIndex)=>storyData.chapters.find(chapter=>index+1>=chapter.startLevel&&index+1<=chapter.endLevel)||storyData.chapters[0];
  const storyCharacter=id=>storyData.characters[id]||storyData.characters.lumi;
  function storyPortrait(id){
    if(id==='glow')return '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="7" fill="#f5ffb4"/><path d="M20 22C9 12 8 28 20 26M28 22c11-10 12 6 0 4" fill="none" stroke="#334a45" stroke-width="3"/><circle cx="24" cy="24" r="16" fill="none" stroke="#dfff8d" stroke-width="2" opacity=".55"/></svg>';
    const colors={lumi:['#9b693f','#f0c889'],fynn:['#80664d','#b99469'],ava:['#716454','#d9c7a4'],bruno:['#6d4934','#c59a70'],kauz:['#596348','#b9c990']}[id]||['#80664d','#d2b07e'];
    return `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 19 15 7l7 9h4l7-9 6 12v14c-4 7-10 11-15 11S9 40 9 33Z" fill="${colors[0]}" stroke="#17202a" stroke-width="3"/><path d="M13 21c3-7 9-7 11 0 2-7 8-7 11 0-2 11-7 15-11 15s-9-4-11-15Z" fill="${colors[1]}"/><circle cx="18" cy="23" r="4" fill="#f6efdc"/><circle cx="30" cy="23" r="4" fill="#f6efdc"/><circle cx="18" cy="23" r="1.7"/><circle cx="30" cy="23" r="1.7"/><path d="m24 26-4 5h8Z" fill="#e6aa36"/></svg>`;
  }
  let storyBubbleTimer=null;
  function showStoryBubble(speakerId,text,duration=3600){
    const speaker=storyCharacter(speakerId);clearTimeout(storyBubbleTimer);ui.storyBubble.classList.remove('hidden');ui.storyBubble.style.setProperty('--speaker-color',speaker.color);ui.storyBubbleAvatar.style.background=speaker.color;ui.storyBubbleAvatar.innerHTML=storyPortrait(speakerId);ui.storyBubbleName.textContent=speaker.name;ui.storyBubbleName.style.color=speaker.color;ui.storyBubbleText.textContent=text;dialogueMotif(speakerId);
    ui.storyBubble.getAnimations().forEach(animation=>animation.cancel());ui.storyBubble.animate([{opacity:0,transform:state.landscapePhoneMode?'translateY(10px)':'translate(-50%,10px)'},{opacity:1,transform:state.landscapePhoneMode?'none':'translate(-50%,0)'}],{duration:240,easing:'ease-out'});
    storyBubbleTimer=setTimeout(()=>{ui.storyBubble.classList.add('hidden');storyBubbleTimer=null;playNextStoryBubble()},duration);
  }
  function queueStoryBubble(speaker,text,duration=3200){
    state.storyDialogueQueue.push({speaker,text,duration});playNextStoryBubble();
  }
  function playNextStoryBubble(){
    if(storyBubbleTimer||!state.storyDialogueQueue.length)return;const next=state.storyDialogueQueue.shift();showStoryBubble(next.speaker,next.text,next.duration);
  }
  function renderGiftChoices(){
    state.storyChoosingGift=true;ui.storyNumber.textContent=state.activeStory.number;ui.storyTitle.textContent=state.activeStory.title;ui.giftChoices.classList.remove('hidden');ui.giftChoices.innerHTML=storyData.giftChoices.map(gift=>`<button type="button" class="giftChoice${state.selectedGift===gift.id?' selected':''}" data-gift="${gift.id}"><b>${gift.icon}</b>${gift.name}</button>`).join('');
    ui.giftChoices.querySelectorAll('[data-gift]').forEach(button=>button.addEventListener('click',()=>{state.selectedGift=button.dataset.gift;ui.giftChoices.querySelectorAll('.giftChoice').forEach(choice=>choice.classList.toggle('selected',choice===button));ui.storyNext.disabled=false;ui.storyNext.textContent='Geschenk mitnehmen'}));
    ui.storySpeaker.textContent='Für Fynn';ui.storyText.textContent='Welches Erinnerungsstück soll Lumi ihm schenken?';ui.storyAvatar.innerHTML=storyPortrait('fynn');ui.storyAvatar.style.background=storyCharacter('fynn').color;ui.storyNext.disabled=!state.selectedGift;ui.storyNext.textContent=state.selectedGift?'Geschenk mitnehmen':'Geschenk wählen';
  }
  function renderStoryLine(){
    const chapter=state.activeStory,line=chapter?.lines[state.storyLineIndex];
    if(!line){if(chapter?.requiresGift&&!state.selectedGift){renderGiftChoices();return}finishStoryChapter();return}
    const speaker=storyCharacter(line.speaker);ui.storyNumber.textContent=chapter.number;ui.storyTitle.textContent=chapter.title;ui.storyAvatar.innerHTML=storyPortrait(line.speaker);ui.storyAvatar.style.background=speaker.color;ui.storyAvatar.parentElement.style.setProperty('--speaker-color',speaker.color);ui.storySpeaker.textContent=speaker.name;ui.storyText.textContent=line.text;ui.giftChoices.classList.add('hidden');ui.storyNext.disabled=false;ui.storyNext.textContent=state.storyLineIndex===chapter.lines.length-1&&!chapter.requiresGift?'Losfliegen':'Weiter';dialogueMotif(line.speaker);
  }
  function showStoryForCurrentLevel(){
    const chapter=chapterForLevel();if(state.phaseIndex+1!==chapter.startLevel||state.shownStories.has(chapter.id))return false;
    if(progress.seenChapters.includes(chapter.id)&&!progress.replayIntros){state.shownStories.add(chapter.id);return false}
    state.activeStory=chapter;state.storyLineIndex=0;state.storyChoosingGift=false;state.paused=true;camera.setMode('dialogue');setAudioFocus(false);ui.storyBubble.classList.add('hidden');ui.story.classList.remove('hidden');renderStoryLine();return true;
  }
  function finishStoryChapter(){
    if(!state.activeStory)return;const completedChapter=state.activeStory.id;state.shownStories.add(completedChapter);if(!progress.seenChapters.includes(completedChapter)){progress.seenChapters.push(completedChapter);saveProgress()}state.activeStory=null;state.storyChoosingGift=false;camera.setMode(state.world.cameraMode);ui.story.classList.add('hidden');ui.giftChoices.classList.add('hidden');state.paused=false;setAudioFocus(true);if(state.phaseIndex===0)startTutorialCinematic();saveCheckpoint();state.last=performance.now();requestAnimationFrame(loop);
  }
  function nextStoryLine(){
    if(state.storyChoosingGift){if(state.selectedGift)finishStoryChapter();return}
    state.storyLineIndex++;renderStoryLine();
  }
  function skipStoryChapter(){
    if(state.activeStory?.requiresGift&&!state.selectedGift)state.selectedGift=storyData.giftChoices[0].id;finishStoryChapter();
  }
  function checkStoryBeat(){
    const chapter=chapterForLevel();if(state.phaseIndex+1!==chapter.startLevel)return;const beat=chapter.beats?.[state.storyBeatIndex];if(!beat)return;
    if(state.phaseDelivered/currentPhase().target>=beat.progress){state.storyBeatIndex++;showStoryBubble(beat.speaker,beat.text)}
  }
  function updateStorySystem(dt){
    if(!state.storyScene)return;const goal={x:state.world.goal.x,y:state.world.goal.y};
    storySystem.updateCompanions(state.storyScene,{owl,goal,lastSafe:state.lastSafePoint,worldWidth:state.world.width,groundY:state.groundY,playTop:playTop(),scale:state.gameScale},dt);
    const landedIds=new Set([...state.landedPerches].map(key=>String(key).replace(/^\d+:/,'')));if(owl.perchId)landedIds.add(owl.perchId);
    const events=storySystem.nextEvents(state.storyScene,{owl,objectiveProgress:state.phaseDelivered/Math.max(1,currentPhase().target),landedPerches:landedIds,hootContextIds:new Set(hootSystem.completedIds(state.hootContexts)),elapsed:state.elapsed,scale:state.gameScale},1);
    for(const event of events){
      queueStoryBubble(event.speaker,event.text,3300);const companion=storySystem.applyAction(state.storyScene,event.action);
      if(companion&&Number.isFinite(event.action?.courage))floater(companion.x,companion.y-30,`MUT +${event.action.courage}`,'#9fe7ff',15);
      if(event.once)saveCheckpoint();
    }
  }
  function renderProgressHub(){
    const needed=xpNeeded(progress.level),points=availableUpgradePoints(),maximum=rosterData.xp.maximumUpgradeLevel;
    ui.playerLevel.textContent=progress.level;ui.xpCurrent.textContent=progress.xp;ui.xpNext.textContent=needed;
    ui.xpFill.style.width=clamp(progress.xp/needed*100,0,100)+'%';ui.upgradePoints.textContent=points;
    ui.owlUpgradeLevel.textContent=progress.owlUpgrade;ui.nestUpgradeLevel.textContent=progress.nestUpgrade;ui.replayIntros.checked=progress.replayIntros;
    ui.upgradeOwl.disabled=points<1||progress.owlUpgrade>=maximum;ui.upgradeNest.disabled=points<1||progress.nestUpgrade>=maximum;
    ui.owlPicker.innerHTML=owlRoster.map(entry=>{
      const locked=progress.level<entry.unlockLevel,active=entry.id===selectedOwl().id;
      const pips=Array.from({length:rosterData.xp.maximumUpgradeLevel},(_,index)=>`<i class="${index<progress.owlUpgrade?'on':''}"></i>`).join('');
      return `<button type="button" class="owlChoice${active?' selected':''}${locked?' locked':''}" data-owl="${entry.id}" aria-pressed="${active}" aria-label="${locked?`Ab Level ${entry.unlockLevel}: `:''}${entry.name}" style="--owl-color:${entry.colors.body}"><span class="owlAvatar">${locked?'🔒':entry.symbol}</span><span class="owlUpgradePips">${pips}</span><small>${entry.name}</small></button>`;
    }).join('');
    const chosen=selectedOwl();
    ui.owlDetail.innerHTML=`<strong>${chosen.name}</strong> · ◉${Math.round(chosen.size*100)}% · ➤${Math.round(chosen.flightSpeed*100)}% · <span class="owlPlus">+ ${chosen.strength}</span> · <span class="owlMinus">− ${chosen.weakness}</span>`;
    const visualStages=['Naturgefieder','Leuchtfedern','Energiekern','Mondaugen','Goldklauen','Sternenaura'];
    const current=`+${progress.owlUpgrade*8} Energie · −${progress.owlUpgrade*4}% Sturzflug · +${progress.owlUpgrade*5}% Huuu-Ladung · +${progress.owlUpgrade*4}% Schutz`;
    const next=progress.owlUpgrade<maximum?'Nächste Stufe: +8 Energie · −4% Sturzflug · +5% Huuu-Ladung · +4% Schutz · kostet 1 Goldtier':'Maximale Eulenstufe erreicht';
    ui.upgradeInfo.innerHTML=`<strong>Stufe ${progress.owlUpgrade} · ${visualStages[progress.owlUpgrade]}</strong><br>${current} · <span class="next">${next}</span>`;
    ui.upgradeOwl.title=next;ui.upgradeOwl.setAttribute('aria-label',`Eule verbessern. ${next}`);
    ui.upgradeNest.title='Nest verbessern · kostet 1 Goldtier';ui.upgradeNest.setAttribute('aria-label','Nest verbessern. Kostet 1 Goldtier.');
    ui.owlPicker.querySelectorAll('[data-owl]').forEach(button=>button.addEventListener('click',()=>{
      const candidate=owlRoster.find(entry=>entry.id===button.dataset.owl);
      if(progress.level<candidate.unlockLevel){ui.owlDetail.textContent=`Freischaltung mit Spielerlevel ${candidate.unlockLevel}`;return}
      progress.selectedOwl=candidate.id;saveProgress();renderProgressHub();reset();draw();
    }));
  }
  function grantXp(amount){
    let levelUps=0;progress.xp+=Math.max(0,Math.round(amount));
    while(progress.xp>=xpNeeded(progress.level)){
      progress.xp-=xpNeeded(progress.level);progress.level++;levelUps++;
    }
    saveProgress();renderProgressHub();return levelUps;
  }
  function buyUpgrade(type){
    const key=type==='owl'?'owlUpgrade':'nestUpgrade';
    if(availableUpgradePoints()<1||progress[key]>=rosterData.xp.maximumUpgradeLevel)return;
    progress[key]++;progress.goldPoints--;saveProgress();renderProgressHub();reset();draw();haptic(18);
  }
  function haptic(pattern){
    if(state.touchMode&&navigator.vibrate) navigator.vibrate(pattern);
  }

  function initAudio(){
    if(state.muted) return;
    if(!audioCtx){
      const A = window.AudioContext || window.webkitAudioContext;
      if(A){
        audioCtx = new A();
        masterGain=audioCtx.createGain();masterGain.gain.value=.72;masterGain.connect(audioCtx.destination);
        startAmbience();
      }
    }
    if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }

  function startAmbience(){
    if(!audioCtx||ambienceGain)return;
    ambienceGain=audioCtx.createGain();ambienceGain.gain.value=.75;ambienceGain.connect(masterGain);
    const length=audioCtx.sampleRate*2,buffer=audioCtx.createBuffer(1,length,audioCtx.sampleRate),data=buffer.getChannelData(0);
    let smooth=0;
    for(let i=0;i<length;i++){smooth=smooth*.985+(Math.random()*2-1)*.015;data[i]=smooth}
    const wind=audioCtx.createBufferSource(),filter=audioCtx.createBiquadFilter(),windGain=audioCtx.createGain();
    wind.buffer=buffer;wind.loop=true;filter.type='lowpass';filter.frequency.value=520;windGain.gain.value=.17;
    wind.connect(filter).connect(windGain).connect(ambienceGain);wind.start();
    const nightHum=audioCtx.createOscillator(),humGain=audioCtx.createGain();
    nightHum.type='sine';nightHum.frequency.value=48;humGain.gain.value=.012;
    nightHum.connect(humGain).connect(ambienceGain);nightHum.start();
  }

  function setAudioFocus(active){
    if(!audioCtx||!masterGain)return;
    const target=state.muted?0:(active ? 0.72 : 0.16);
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setTargetAtTime(target,audioCtx.currentTime,.12);
  }

  function tone(freq=440,duration=.12,type='sine',gain=.035,slide=0,delay=0){
    if(state.muted) return;
    initAudio();
    if(!audioCtx) return;
    const t = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const vol = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq,t);
    if(slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40,freq+slide),t+duration);
    vol.gain.setValueAtTime(.0001,t);
    vol.gain.exponentialRampToValueAtTime(gain,t+.015);
    vol.gain.exponentialRampToValueAtTime(.0001,t+duration);
    osc.connect(vol).connect(masterGain||audioCtx.destination);
    osc.start(t);osc.stop(t+duration+.02);
  }

  function spatialTone(freq,duration,type,gain,pan=0,delay=0,slide=0){
    if(state.muted)return;initAudio();if(!audioCtx)return;const t=audioCtx.currentTime+delay,osc=audioCtx.createOscillator(),vol=audioCtx.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,t);if(slide)osc.frequency.exponentialRampToValueAtTime(Math.max(40,freq+slide),t+duration);vol.gain.setValueAtTime(.0001,t);vol.gain.exponentialRampToValueAtTime(gain,t+.018);vol.gain.exponentialRampToValueAtTime(.0001,t+duration);
    if(audioCtx.createStereoPanner){const panner=audioCtx.createStereoPanner();panner.pan.value=clamp(pan,-1,1);osc.connect(vol).connect(panner).connect(masterGain||audioCtx.destination)}else osc.connect(vol).connect(masterGain||audioCtx.destination);osc.start(t);osc.stop(t+duration+.03);
  }

  function dialogueMotif(speakerId){
    if(state.muted||!state.running)return;const motif=storyCharacter(speakerId).motif||[330,410];spatialTone(motif[0],.11,'triangle',.012,0);spatialTone(motif[1],.16,'sine',.009,0,.08,-12);
  }

  function playHootResponse(response){
    const pan=clamp((response.x-camera.centerX)/(state.w*.5),-1,1),kind=response.audioResponse;
    if(kind==='chime'){spatialTone(740,.18,'sine',.026,pan);spatialTone(990,.25,'triangle',.018,pan,.1)}
    else if(kind==='rustle'||kind==='wind'){spatialTone(kind==='wind'?260:330,.32,'triangle',.018,pan,0,-90);noiseBurst(.28,.012,kind==='wind'?620:900,'bandpass')}
    else if(kind==='discovery'){spatialTone(520,.12,'triangle',.03,pan);spatialTone(780,.2,'sine',.022,pan,.09,120)}
    else if(kind==='calm'){spatialTone(392,.28,'sine',.022,pan);spatialTone(494,.36,'sine',.018,pan,.15,-25)}
    else if(kind==='bruno'){spatialTone(185,.4,'triangle',.03,pan,0,-30);spatialTone(247,.3,'sine',.018,pan,.22,-18)}
    else if(kind==='fynn'){spatialTone(440,.24,'sine',.025,pan);spatialTone(554,.28,'triangle',.018,pan,.16,-35)}
    else if(kind==='ava'){spatialTone(294,.42,'sine',.026,pan);spatialTone(392,.36,'triangle',.016,pan,.22,-18)}
    else if(kind==='echo'){spatialTone(330,.32,'sine',.024,pan);spatialTone(247,.46,'sine',.018,pan,.26,-30)}
    else if(kind==='chorus'){[262,330,392,523].forEach((frequency,index)=>spatialTone(frequency,.5,'sine',.021,clamp(pan+(index-1.5)*.18,-1,1),index*.12,-12))}
    else{spatialTone(310,.3,'sine',.022,pan,0,-40);spatialTone(410,.35,'triangle',.014,pan,.18,-55)}
  }

  function noiseBurst(duration=.16,gain=.018,frequency=850,filterType='bandpass',delay=0){
    if(state.muted)return;initAudio();if(!audioCtx)return;
    if(!noiseBuffer){
      noiseBuffer=audioCtx.createBuffer(1,Math.ceil(audioCtx.sampleRate*.7),audioCtx.sampleRate);const data=noiseBuffer.getChannelData(0);
      for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length*.35);
    }
    const t=audioCtx.currentTime+delay,source=audioCtx.createBufferSource(),filter=audioCtx.createBiquadFilter(),vol=audioCtx.createGain();
    source.buffer=noiseBuffer;filter.type=filterType;filter.frequency.value=frequency;filter.Q.value=filterType==='bandpass'?1.4:.7;
    vol.gain.setValueAtTime(.0001,t);vol.gain.exponentialRampToValueAtTime(gain,t+.018);vol.gain.exponentialRampToValueAtTime(.0001,t+duration);
    source.connect(filter).connect(vol).connect(masterGain);source.start(t);source.stop(t+Math.min(duration,.68));
  }

  function padTone(freq,duration=2,gain=.009,delay=0){
    if(state.muted)return;
    initAudio();if(!audioCtx)return;
    const t=audioCtx.currentTime+delay,osc=audioCtx.createOscillator(),filter=audioCtx.createBiquadFilter(),vol=audioCtx.createGain();
    osc.type='triangle';osc.frequency.value=freq;filter.type='lowpass';filter.frequency.value=900;
    vol.gain.setValueAtTime(.0001,t);vol.gain.exponentialRampToValueAtTime(gain,t+.35);vol.gain.exponentialRampToValueAtTime(.0001,t+duration);
    osc.connect(filter).connect(vol).connect(masterGain);osc.start(t);osc.stop(t+duration+.04);
  }

  function playMusicPhrase(){
    const chord=currentPhase().audioChord;
    chord.forEach((f,i)=>padTone(f,2.8,.007,i*.12));
    padTone(chord[0]/2,3.4,.009,.04);
    const shimmer=currentPhase().theme==='gold'?2:(currentPhase().theme==='storm'?.5:1);
    tone(chord[1]*shimmer,1.8,'sine',.004,-8,.55);
  }

  function playWildlife(){
    if(state.phaseIndex===0&&Math.random()<.55){
      tone(310,.045,'square',.006,35);tone(355,.04,'square',.005,20,.09);tone(325,.04,'square',.004,-15,.18);
    }else if(Math.random()<.5){
      tone(190,.42,'sine',.016,-45);tone(165,.48,'sine',.013,-30,.5);
    }else{
      tone(720,.055,'triangle',.006,-160);tone(610,.05,'triangle',.005,-120,.07);
    }
    if(Math.random()<.45)noiseBurst(rand(.18,.38),.004,420,'lowpass',.08);
  }

  function updateAudio(dt){
    if(state.muted||!audioCtx)return;
    state.musicClock-=dt;state.wildlifeClock-=dt;
    if(state.musicClock<=0){playMusicPhrase();state.musicClock=rand(6.5,9.5)}
    if(state.wildlifeClock<=0){playWildlife();state.wildlifeClock=rand(4,8)}
  }

  function sfx(name){
    if(name==='land'){noiseBurst(.16,.009,520,'lowpass');tone(330,.1,'triangle',.018,-55);tone(247,.16,'sine',.012,-28,.08)}
    if(name==='rustle'){noiseBurst(.42,.025,760,'bandpass');tone(180,.18,'triangle',.012,-45,.08)}
    if(name==='dive'){noiseBurst(.34,.038,1250,'highpass');tone(280,.2,'sawtooth',.024,-150);tone(520,.11,'triangle',.018,-210,.03)}
    if(name==='catch'){noiseBurst(.12,.018,1650,'bandpass');tone(510,.1,'triangle',.04,220);tone(780,.18,'sine',.03,150,.06);tone(1040,.08,'sine',.012,-80,.16)}
    if(name==='deliver'){noiseBurst(.22,.012,720,'lowpass');tone(392,.14,'sine',.034,70);tone(587,.17,'sine',.032,100,.10);tone(784,.22,'triangle',.028,130,.22);tone(1175,.28,'sine',.012,-70,.34)}
    if(name==='hit'){noiseBurst(.3,.055,340,'lowpass');tone(145,.24,'sawtooth',.052,-70);tone(82,.34,'square',.022,-28,.025)}
    if(name==='hoot'){noiseBurst(.8,.018,310,'lowpass');tone(215,1.12,'sine',.058,-72);tone(430,.92,'triangle',.016,-125,.02);tone(168,.68,'sine',.034,-34,.5);tone(112,.5,'sine',.018,-18,.64)}
    if(name==='power'){tone(620,.1,'sine',.03,210);tone(910,.13,'sine',.024,130,.08);tone(1280,.2,'triangle',.012,-90,.17)}
    if(name==='phase'){[392,494,587,784].forEach((f,i)=>tone(f,.22,'triangle',.025,30,i*.09))}
    if(name==='wave'){tone(220,.12,'triangle',.018,80);tone(330,.16,'triangle',.015,100,.12)}
    if(name==='frog'){tone(155,.1,'square',.012,90);tone(218,.13,'square',.01,95,.1);noiseBurst(.08,.006,500,'bandpass')}
    if(name==='rabbit'){noiseBurst(.1,.01,1250,'highpass');tone(500,.05,'triangle',.011,150);tone(710,.07,'triangle',.009,95,.065)}
    if(name==='beetle'){noiseBurst(.11,.012,2100,'bandpass');tone(112,.04,'square',.008,24);tone(142,.035,'square',.006,-18,.055)}
    if(name==='bat'){noiseBurst(.2,.01,1900,'highpass');tone(980,.065,'sawtooth',.008,-390);tone(690,.085,'triangle',.006,-260,.055)}
    if(name==='rival'){noiseBurst(.28,.014,560,'bandpass');tone(238,.3,'triangle',.019,-60);tone(181,.36,'sine',.014,-38,.25)}
    if(name==='steal'){noiseBurst(.18,.022,980,'bandpass');tone(440,.1,'sawtooth',.019,-175);tone(270,.15,'triangle',.014,-95,.075)}
    if(name==='scare'){noiseBurst(.2,.025,1050,'highpass');tone(255,.13,'sawtooth',.023,200);tone(540,.18,'triangle',.019,230,.085)}
    if(name==='win'){[523,659,784,1047].forEach((f,i)=>tone(f,.28,'sine',.032,60,i*.12))}
    if(name==='lose'){tone(330,.28,'triangle',.035,-80);tone(220,.35,'triangle',.03,-90,.18)}
  }

  function resize(){
    const rect = shell.getBoundingClientRect();
    const previousScale = state.gameScale || 1;
    state.dpr = Math.min(window.devicePixelRatio || 1,2);
    canvas.width = Math.round(rect.width*state.dpr);
    canvas.height = Math.round(rect.height*state.dpr);
    canvas.style.width = rect.width+'px';
    canvas.style.height = rect.height+'px';
    ctx.setTransform(state.dpr,0,0,state.dpr,0,0);
    state.w = rect.width;
    state.h = rect.height;
    const coarsePointer=window.matchMedia('(any-pointer:coarse)').matches;
    state.touchMode=state.w<=820||coarsePointer;
    state.tabletMode=coarsePointer&&Math.min(state.w,state.h)>=700;
    state.tabletLandscapeMode=state.tabletMode&&state.w>state.h;
    state.landscapePhoneMode=state.touchMode&&state.h<600&&state.w>state.h;
    state.gameScale = clamp(Math.min(state.w/760,state.h/620),.46,1);
    state.groundY = state.h-(state.tabletLandscapeMode?132:(state.tabletMode?118:(state.landscapePhoneMode?92:(state.touchMode?78:48))));
    loadCurrentWorld(Boolean(state.world));

    const radiusRatio=state.gameScale/previousScale;
    [...state.mice,...state.bats,...state.rivals,...state.fireflies].forEach(item=>{item.r*=radiusRatio;if(item.speed)item.speed*=radiusRatio});
    state.branches.forEach(branch=>branch.scale=state.gameScale);
    state.rings.forEach(ring=>ring.r*=radiusRatio);
    state.particles.forEach(particle=>particle.size*=radiusRatio);
    state.floaters.forEach(floater=>floater.size*=radiusRatio);
    owl.vx*=radiusRatio;owl.vy*=radiusRatio;
    owl.r=35*state.gameScale*playerStats().size;
    if(state.groundDetails.length)setupGroundDetails();

    if(!state.stars.length){
      for(let i=0;i<120;i++) state.stars.push({x:Math.random(),y:Math.random()*.65,s:.4+Math.random()*1.8,a:.2+Math.random()*.8,p:Math.random()*6});
      for(let i=0;i<7;i++) state.clouds.push({x:Math.random(),y:.08+Math.random()*.42,s:.6+Math.random()*1.2,v:.002+Math.random()*.004,a:.025+Math.random()*.06});
      for(let i=0;i<140;i++) state.grass.push({x:Math.random(),h:7+Math.random()*24,b:Math.random()*6});
    }

    const edge=owl.r+5*state.gameScale;
    const top=state.h<600?74:(state.tabletLandscapeMode?115:(state.touchMode?105:88));
    owl.x = Math.min(Math.max(edge,owl.x || state.world.start.x),state.world.width-edge);
    owl.y = Math.min(Math.max(top,owl.y || state.h*.32),state.groundY-20*state.gameScale);
  }
  const handleViewportChange=()=>{resize();if(!state.running)draw()};
  addEventListener('resize',handleViewportChange);
  addEventListener('orientationchange',handleViewportChange);
  if(window.visualViewport) window.visualViewport.addEventListener('resize',handleViewportChange);
  resize();

  function rand(min,max){return min+Math.random()*(max-min)}
  function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
  function playTop(){return state.h<600?74:(state.tabletLandscapeMode?115:(state.touchMode?105:88))}
  function dist2(a,b){const dx=a.x-b.x,dy=a.y-b.y;return dx*dx+dy*dy}
  function collide(a,b,pad=0){const rr=(a.r+b.r+pad*state.gameScale);return dist2(a,b)<rr*rr}
  function currentPhase(){return phases[state.phaseIndex]}
  function loadCurrentWorld(preservePositions=false){
    const previousWidth=state.world?.width||0,completedHoot=state.hootContexts?.length?hootSystem.completedIds(state.hootContexts):[],completedStory=state.storyScene?storySystem.completedIds(state.storyScene):[],companionSnapshot=state.storyScene?.companions.map(item=>({id:item.id,state:item.state,x:item.x,y:item.y,courage:item.courage}))||[],completedTutorial=state.tutorial?tutorialSystem.completedIds(state.tutorial):[],deliveredTutorial=state.tutorial?[...state.tutorial.deliveredPackageIds]:[];
    state.world=worldLoader.load(state.phaseIndex+1,{width:state.w,height:state.h,groundY:state.groundY,playTop:playTop()});
    if(preservePositions&&previousWidth>0&&previousWidth!==state.world.width){
      const ratio=state.world.width/previousWidth;
      owl.x*=ratio;
      companionSnapshot.forEach(item=>item.x*=ratio);
      [...state.mice,...state.bats,...state.rivals,...state.fireflies,...state.branches,...state.safePerches,...state.bushes,...state.groundDetails,...state.particles,...state.floaters,...state.rings].forEach(item=>{if(Number.isFinite(item.x))item.x*=ratio});
    }
    camera.resize({width:state.w,height:state.h},state.world);camera.setMode(state.world.cameraMode);
    if(preservePositions)state.safePerches=state.world.safeBranches.map(branch=>({...branch,scale:state.gameScale,r:24*state.gameScale}));
    if(preservePositions){setupHootContexts(completedHoot);setupStoryScene(completedStory,companionSnapshot);setupTutorial(completedTutorial,deliveredTutorial)}
  }
  function setupHootContexts(completedIds=[]){
    state.hootContexts=hootSystem.createScene(state.phaseIndex+1,state.world,{height:state.h,groundY:state.groundY,playTop:playTop()},completedIds);
  }
  function setupStoryScene(completedIds=[],companionSnapshot=[]){
    state.storyScene=storySystem.createScene(state.phaseIndex+1,state.world,{height:state.h,groundY:state.groundY,playTop:playTop()},completedIds);const byId=new Map(companionSnapshot.map(item=>[item.id,item]));
    state.storyScene.companions.forEach(companion=>{const saved=byId.get(companion.id);if(!saved)return;companion.state=saved.state||companion.state;companion.x=Number(saved.x)||companion.x;companion.y=Number(saved.y)||companion.y;companion.courage=Number(saved.courage??companion.courage)});
  }
  function setupTutorial(completedIds=[],deliveredPackageIds=[]){
    state.tutorial=state.phaseIndex===0?tutorialSystem.create(state.world,{height:state.h,groundY:state.groundY},completedIds,deliveredPackageIds):null;
  }
  function startTutorialCinematic(){
    if(!state.tutorial||tutorialSystem.completedIds(state.tutorial).length||state.tutorial.cinematic.active)return;state.tutorial.cinematic={active:true,time:0,windReleased:false};camera.setMode('cinematic');state.keys.clear();state.pointer.active=false;
  }
  function updateTutorialCinematic(dt){
    const cinematic=state.tutorial?.cinematic;if(!cinematic?.active)return false;cinematic.time+=dt;const config=tutorialSystem.source.cinematic,progress=clamp(cinematic.time/config.duration,0,1),fynn=state.storyScene?.companions.find(item=>item.id==='fynn');
    if(fynn){fynn.balanceAmount=cinematic.time<1.5?Math.sin(cinematic.time*12)*Math.min(1,cinematic.time*2):0;fynn.x=nest().x+72*state.gameScale;fynn.y=nest().y-15*state.gameScale-Math.sin(cinematic.time*7)*3*state.gameScale}
    if(cinematic.time>=config.windAt&&!cinematic.windReleased){cinematic.windReleased=true;state.shake=.22;noiseBurst(.8,.026,780,'bandpass');for(const packageItem of state.tutorial.packages){for(let i=0;i<7;i++)state.leafMotions.push({x:nest().x+i*5,y:nest().y+20,vx:(95+i*16)*state.gameScale,vy:(-125+i*13)*state.gameScale,rotation:i*.7,spin:i%2?3:-3,life:2.2,max:2.2,color:i%2?'#d7e9bd':'#e7c778'})}}
    let focusX=nest().x;if(cinematic.time>=config.windAt&&cinematic.time<config.returnAt){const travel=clamp((cinematic.time-config.windAt)/(config.returnAt-config.windAt),0,1),far=state.tutorial.packages[state.tutorial.packages.length-1];focusX=nest().x+(far.x-nest().x)*travel}else if(cinematic.time>=config.returnAt){const back=clamp((cinematic.time-config.returnAt)/(config.duration-config.returnAt),0,1),far=state.tutorial.packages[state.tutorial.packages.length-1];focusX=far.x+(owl.x-far.x)*back}
    camera.update({x:focusX,y:state.h*.4,vx:0},dt,{});state.shake=Math.max(0,state.shake-dt);updateHootResponses(dt);
    if(progress>=1){cinematic.active=false;if(fynn){fynn.balanceAmount=0;fynn.state='wait';fynn.anchorX=fynn.x;fynn.anchorY=fynn.y}camera.setMode(state.world.cameraMode);camera.snap(owl);queueStoryBubble('ava','Erst fliegen. Dann landen. Eins nach dem anderen.',3300)}
    updateHud();return true;
  }

  function updateTutorialProgress(){
    if(!state.tutorial||state.tutorial.cinematic.active||state.paused)return;if(state.tutorial.complete){tryCompleteLevel();return}const step=tutorialSystem.evaluate(state.tutorial,{owl,delivered:state.tutorial.deliveredPackageIds.size,hootContextIds:new Set(hootSystem.completedIds(state.hootContexts)),scale:state.gameScale});if(!step)return;
    storySystem.applyAction(state.storyScene,step.action);floater(owl.x,owl.y-48,'GESCHAFFT','#9fe7ff',17);showToast(`${step.label} · ✓`,'#9fe7ff',850);spatialTone(520,.12,'triangle',.022,0);spatialTone(760,.2,'sine',.016,0,.08);saveCheckpoint();if(state.tutorial.complete)tryCompleteLevel();
  }
  function placeOwlAtWorldStart(){
    owl.x=state.world.start.x;owl.y=state.world.start.y;owl.vx=0;owl.vy=0;camera.snap(owl);
  }

  function nest(){
    const s=state.gameScale;
    return {
      x:state.world.nest.x,
      y:state.world.nest.y,
      r:58*s
    };
  }
  function owlInNest(){
    const n=nest();
    return dist2(owl,n)<(n.r+owl.r-8*state.gameScale)**2;
  }
  const isLargeCarried=()=>Boolean(owl.carrying&&['rabbit'].includes(owl.carrying.type));
  const perchById=id=>state.safePerches.find(perch=>perch.id===id)||null;
  function leavePerch(pushX=0,pushY=-55*state.gameScale){
    if(owl.flightState==='flying')return;
    owl.flightState='flying';owl.targetPerchId=null;owl.perchId=null;owl.y-=7*state.gameScale;owl.vx+=pushX;owl.vy+=pushY;
  }
  function requestLanding(perch){
    if(!perch||owl.flightState==='stumbling'||owl.dive)return false;
    const destination=perches.target(perch,owl.r),distance=Math.hypot(destination.x-owl.x,destination.y-owl.y),maximum=Math.max(230,330*state.gameScale);
    if(distance>maximum){showToast('AST ZU WEIT','#a9d7b0',520);return false}
    if(owl.flightState==='perched'&&owl.perchId===perch.id)return true;
    owl.flightState='approach';owl.targetPerchId=perch.id;owl.perchId=null;owl.dive=false;showToast('LANDEANFLUG','#a9d7b0',520);return true;
  }
  function finishLanding(perch){
    const destination=perches.target(perch,owl.r);owl.x=destination.x;owl.y=destination.y;owl.vx=0;owl.vy=0;owl.angle=0;owl.flightState='perched';owl.targetPerchId=null;owl.perchId=perch.id;
    state.lastSafePoint={x:destination.x,y:destination.y,perchId:perch.id};
    const visitKey=`${state.phaseIndex}:${perch.id}`;if(!state.landedPerches.has(visitKey)){state.landedPerches.add(visitKey);showStoryBubble('lumi','Von hier sieht der Wald gleich viel übersichtlicher aus.',2200)}
    saveCheckpoint();showToast('SICHERER AST','#a9d7b0',700);floater(owl.x,owl.y-48,'SICHER','#a9d7b0',16);haptic([16,25,20]);sfx('land');
  }
  function dropCarriedAtPerch(){
    const perch=perchById(owl.perchId);if(!perch||!owl.carrying)return false;const item=owl.carrying;owl.carrying=null;
    state.mice.push({type:item.type,packageId:item.packageId,x:perch.x,y:perch.y-18*state.gameScale,dir:owl.facing,speed:0,r:(item.baseR||16)*state.gameScale,value:item.value,food:item.food,color:item.color,phase:0,turn:2,dash:0,glow:0,hidden:0,behaviorClock:2,perched:true,perchId:perch.id});
    showToast('AUF DEM AST ABGELEGT','#a9d7b0',720);floater(perch.x,perch.y-42,'ABGELEGT','#a9d7b0',15);haptic(14);updateHud();return true;
  }
  function beginStumble(source=null){
    if(owl.invuln>0||owl.flightState==='stumbling')return false;
    const away=source?(owl.x-source.x||1):(Math.random()>.5?1:-1);owl.flightState='stumbling';owl.targetPerchId=null;owl.perchId=null;owl.stumbleTime=.62;owl.dive=false;owl.invuln=1.6;owl.vx=Math.sign(away)*150*state.gameScale;owl.vy=-95*state.gameScale;owl.turnTime=.3;return true;
  }
  function softBushLanding(){
    const visible=state.bushes.filter(bush=>camera.isVisible(bush,80)),pool=visible.length?visible:state.bushes;
    const bush=pool.reduce((best,item)=>!best||Math.abs(item.x-owl.x)<Math.abs(best.x-owl.x)?item:best,null);
    if(bush){owl.x=bush.x;owl.y=state.groundY-owl.r*.8}else{const n=nest();owl.x=n.x;owl.y=n.y}
    owl.flightState='flying';owl.vx=0;owl.vy=-120*state.gameScale;owl.invuln=1.8;camera.snap(owl);showToast('WEICHE BUSCHLANDUNG','#9fe7ff',850);showStoryBubble('fynn','Das war bestimmt wieder Absicht.',2400);burst(owl.x,owl.y,'#7ca977',24,145);sfx('rustle');
  }

  function reset(startPhase=0){
    const stats=playerStats();
    state.score=0;state.hearts=campaign.startingHearts;state.maxHearts=campaign.maximumHearts;state.energy=stats.maximumEnergy;state.time=campaign.startingTimeSeconds;state.maxTime=campaign.startingTimeSeconds;
    state.phaseIndex=clamp(Math.floor(Number(startPhase)||0),0,phases.length-1);state.phaseDelivered=0;state.totalDelivered=0;state.totalFood=0;state.runXp=0;state.phaseRewarded=false;
    loadCurrentWorld(false);
    state.combo=0;state.bestCombo=0;state.comboClock=0;
    state.mouseClock=.35;state.batClock=1.8;state.fireflyClock=.45;state.rivalClock=3.5;state.wave=1;state.waveRemaining=currentPhase().waveSize;state.waveBreak=0;
    state.mice=[];state.bats=[];state.rivals=[];state.branches=[];state.safePerches=[];state.bushes=[];state.groundDetails=[];state.fireflies=[];state.particles=[];state.floaters=[];state.rings=[];state.hootContexts=[];state.hootEchoes=[];state.edgeSignals=[];state.leafMotions=[];
    state.pointer.active=false;state.pointer.id=null;state.pointer.landingTap=false;
    state.hootCharge=1;state.cameraPulse=0;state.shake=0;state.transition=0;state.transitionQueued=false;state.elapsed=0;state.phaseElapsed=0;state.eliteSpawned=false;state.musicClock=.35;state.wildlifeClock=2;
    state.shownStories=new Set();state.activeStory=null;state.storyLineIndex=0;state.storyBeatIndex=0;state.storyChoosingGift=false;state.selectedGift=null;state.landedPerches=new Set();state.storyScene=null;state.storyDialogueQueue=[];state.tutorial=null;clearTimeout(storyBubbleTimer);storyBubbleTimer=null;
    owl.r=35*state.gameScale*stats.size;state.lastSafePoint={x:nest().x,y:nest().y,perchId:null};
    placeOwlAtWorldStart();owl.angle=0;owl.dive=false;owl.diveTime=0;owl.invuln=0;owl.carrying=null;owl.flightState='flying';owl.targetPerchId=null;owl.perchId=null;owl.stumbleTime=0;owl.facing=1;owl.turnTime=0;
    initBonusGoal();setupBranches();setupBushes();setupGroundDetails();setupHootContexts();setupStoryScene();setupTutorial();
    if(state.tutorial)spawnTutorialPackages();else for(let i=0;i<currentPhase().startMice;i++) spawnMouse(i<2?'normal':undefined);
    for(let i=0;i<3;i++) spawnFirefly();
    updateHud();
  }

  function setupBranches(){
    state.branches=[];
    state.safePerches=state.world.safeBranches.map(branch=>({...branch,scale:state.gameScale,r:24*state.gameScale}));
    const count=Math.max(currentPhase().branchCount,Math.round(currentPhase().branchCount*state.world.widthScreens*.72));
    const nestPosition=nest();
    for(let i=0;i<count;i++){
      const type=currentPhase().obstacleTypes[i%currentPhase().obstacleTypes.length];
      let x,y,w;
      for(let attempt=0;attempt<8;attempt++){
        x=state.world.width*(.08+i/(Math.max(1,count-1))*.84)+rand(-45,45);
        y=type==='rock'||type==='stump'?state.h*rand(.52,.68):state.h*rand(.30,.66);
        w=rand(95,175);
        const obstacleCenter={x:x+w*.5*state.gameScale,y};
        const nearSafe=state.safePerches.some(perch=>Math.hypot(obstacleCenter.x-perch.x,obstacleCenter.y-perch.y)<135*state.gameScale);
        if(Math.hypot(obstacleCenter.x-nestPosition.x,obstacleCenter.y-nestPosition.y)>150*state.gameScale&&!nearSafe)break;
      }
      state.branches.push({
        x,y,w,scale:state.gameScale,
        angle:type==='rock'||type==='stump'?rand(-.08,.08):rand(-.18,.14),type,
        sway:rand(0,6),
        r:28
      });
    }
  }

  function setupBushes(){
    state.bushes=[];const count=Math.round((4+Math.min(5,Math.floor(state.phaseIndex/4)))*state.world.widthScreens*.72);
    for(let i=0;i<count;i++){
      const x=state.world.width*(.04+i/Math.max(1,count-1)*.92)+rand(-38,38),size=rand(24,42)*state.gameScale;
      state.bushes.push({x:clamp(x,24,state.world.width-24),y:state.groundY-5*state.gameScale,size,phase:rand(0,6),berries:Math.random()<.35});
    }
  }

  function setupGroundDetails(){
    state.groundDetails=[];
    const terrain=currentPhase().terrain,pools={
      cliffs:['stone','stone','twig','pinecone'],
      marsh:['reed','stone','leaf','mushroom','twig'],
      deadlands:['twig','twig','stone','pinecone'],
      'autumn-hills':['leaf','leaf','twig','stone','mushroom'],
      'deep-forest':['twig','pinecone','mushroom','leaf','stone'],
      'rolling-hills':['stone','leaf','twig','mushroom']
    },types=pools[terrain]||pools['rolling-hills'];
    const count=clamp(Math.round(state.world.width/68),24,110),groundDepth=Math.max(34,state.h-state.groundY);
    for(let i=0;i<count;i++){
      const type=types[Math.floor(Math.random()*types.length)],scale=rand(.65,1.2)*state.gameScale;
      state.groundDetails.push({type,x:rand(16,state.world.width-16),y:state.groundY+rand(7,Math.max(12,groundDepth-10)),scale,angle:rand(-.65,.65),variant:Math.floor(rand(0,3))});
    }
  }

  function loadCheckpoint(){
    try{
      const saved=JSON.parse(localStorage.getItem(checkpointKey)||'null');
      return saved&&saved.version===1&&Number.isInteger(saved.phaseIndex)&&saved.phaseIndex>=0&&saved.phaseIndex<phases.length?saved:null;
    }catch(_){return null}
  }
  function refreshContinueButton(){
    const saved=loadCheckpoint();
    ui.continueGame.classList.toggle('hidden',!saved);
    ui.newGame.classList.toggle('secondary',Boolean(saved));
    if(saved)ui.continueGame.textContent=`Fortsetzen · Level ${saved.phaseIndex+1}`;
  }
  function saveCheckpoint(){
    if(!state.running||state.ended)return false;
    if(state.transitionQueued&&state.phaseIndex<phases.length-1){state.transition=0;advancePhase()}
    const payload={
      version:1,savedAt:Date.now(),phaseIndex:state.phaseIndex,phaseDelivered:state.phaseDelivered,phaseRewarded:state.phaseRewarded,
      score:state.score,hearts:state.hearts,energy:state.energy,time:state.time,maxTime:state.maxTime,
      totalDelivered:state.totalDelivered,totalFood:state.totalFood,runXp:state.runXp,bestCombo:state.bestCombo,
      bonus:state.bonus,levelHits:state.levelHits,levelPreyCounts:state.levelPreyCounts,levelPreyTypes:[...state.levelPreyTypes],phaseElapsed:state.phaseElapsed,eliteSpawned:state.eliteSpawned,hootCharge:state.hootCharge,
      shownStories:[...state.shownStories],selectedGift:state.selectedGift,storyBeatIndex:state.storyBeatIndex,landedPerches:[...state.landedPerches],hootContextIds:hootSystem.completedIds(state.hootContexts),storyEventIds:storySystem.completedIds(state.storyScene),companions:state.storyScene?.companions.map(item=>({id:item.id,state:item.state,x:item.x,y:item.y,courage:item.courage}))||[],tutorialStepIds:tutorialSystem.completedIds(state.tutorial),tutorialDeliveredIds:state.tutorial?[...state.tutorial.deliveredPackageIds]:[],lastSafePoint:state.lastSafePoint,owl:{x:owl.x,y:owl.y,flightState:owl.flightState,perchId:owl.perchId}
    };
    try{localStorage.setItem(checkpointKey,JSON.stringify(payload));refreshContinueButton();return true}catch(_){return false}
  }
  function clearCheckpoint(){
    try{localStorage.removeItem(checkpointKey)}catch(_){}
    refreshContinueButton();
  }
  function resumeCheckpoint(){
    const saved=loadCheckpoint();if(!saved)return;
    initAudio();setAudioFocus(true);reset();
    state.phaseIndex=saved.phaseIndex;loadCurrentWorld(false);initBonusGoal();state.phaseDelivered=Math.max(0,saved.phaseDelivered||0);state.phaseRewarded=Boolean(saved.phaseRewarded);
    progress.highestScene=Math.max(progress.highestScene,state.phaseIndex+1);saveProgress();
    state.score=Math.max(0,saved.score||0);state.hearts=clamp(saved.hearts||1,1,state.maxHearts);state.energy=clamp(saved.energy||0,0,playerStats().maximumEnergy);
    state.time=Math.max(0,Number.isFinite(saved.time)?saved.time:campaign.startingTimeSeconds);state.maxTime=Math.max(state.time,Number(saved.maxTime)||campaign.startingTimeSeconds);
    state.totalDelivered=Math.max(0,saved.totalDelivered||0);state.totalFood=Math.max(0,saved.totalFood||0);state.runXp=Math.max(0,saved.runXp||0);state.bestCombo=Math.max(0,saved.bestCombo||0);
    if(saved.bonus)state.bonus={...state.bonus,...saved.bonus};state.levelHits=Math.max(0,saved.levelHits||0);state.levelPreyCounts=saved.levelPreyCounts||{};state.levelPreyTypes=new Set(saved.levelPreyTypes||[]);state.phaseElapsed=Math.max(0,saved.phaseElapsed||0);state.eliteSpawned=Boolean(saved.eliteSpawned);state.hootCharge=clamp(Number(saved.hootCharge??1),0,1);updateBonusHud();
    state.shownStories=new Set(saved.shownStories||[]);state.selectedGift=saved.selectedGift||null;state.storyBeatIndex=Math.max(0,saved.storyBeatIndex||0);state.landedPerches=new Set(saved.landedPerches||[]);
    state.mice=[];state.bats=[];state.rivals=[];state.fireflies=[];state.hootEchoes=[];state.edgeSignals=[];state.leafMotions=[];owl.carrying=null;setupBranches();setupBushes();setupGroundDetails();setupHootContexts(saved.hootContextIds||[]);setupStoryScene(saved.storyEventIds||[],saved.companions||[]);setupTutorial(saved.tutorialStepIds||[],saved.tutorialDeliveredIds||[]);
    if(state.tutorial)spawnTutorialPackages();else for(let i=0;i<currentPhase().startMice;i++)spawnMouse();for(let i=0;i<3;i++)spawnFirefly();
    state.wave=1;state.waveRemaining=currentPhase().waveSize;state.mouseClock=.3;state.batClock=1.3;state.fireflyClock=.6;state.rivalClock=2.8;
    const n=nest(),savedOwl=saved.owl,savedPerch=perchById(savedOwl?.perchId);owl.x=clamp(Number(savedOwl?.x)||n.x,owl.r,state.world.width-owl.r);owl.y=clamp(Number(savedOwl?.y)||n.y,playTop(),state.groundY-20*state.gameScale);owl.vx=0;owl.vy=0;owl.flightState='flying';owl.perchId=null;owl.targetPerchId=null;
    if(savedOwl?.flightState==='perched'&&savedPerch){const target=perches.target(savedPerch,owl.r);owl.x=target.x;owl.y=target.y;owl.flightState='perched';owl.perchId=savedPerch.id}state.lastSafePoint=saved.lastSafePoint||{x:n.x,y:n.y,perchId:null};camera.snap(owl);
    state.running=true;state.paused=false;state.ended=false;ui.start.classList.add('hidden');ui.end.classList.add('hidden');ui.pause.classList.add('hidden');ui.level.classList.add('hidden');ui.story.classList.add('hidden');
    updateHud();showToast('Spielstand geladen','#82e7ff',900);state.last=performance.now();if(!showStoryForCurrentLevel())requestAnimationFrame(loop);
  }
  function saveAndExit(){
    if(!saveCheckpoint())return;
    state.running=false;state.paused=false;setAudioFocus(false);ui.pause.classList.add('hidden');ui.start.classList.remove('hidden');
    renderProgressHub();draw();
  }

  function startGame(){
    clearCheckpoint();
    initAudio();
    setAudioFocus(true);
    reset();
    state.running=true;state.paused=false;state.ended=false;
    ui.start.classList.add('hidden');ui.end.classList.add('hidden');ui.pause.classList.add('hidden');ui.level.classList.add('hidden');ui.story.classList.add('hidden');ui.finalHoot.classList.add('hidden');
    showToast('Lumis Reise beginnt', '#ffd469', 900);
    state.last=performance.now();
    if(!showStoryForCurrentLevel()){if(state.phaseIndex===0)startTutorialCinematic();requestAnimationFrame(loop)}
  }

  function startGameAtScene(scene){
    const phaseIndex=clamp(Math.floor(Number(scene)||1)-1,0,Math.max(0,progress.highestScene-1));
    clearCheckpoint();initAudio();setAudioFocus(true);reset(phaseIndex);
    state.running=true;state.paused=false;state.ended=false;
    ui.start.classList.add('hidden');ui.end.classList.add('hidden');ui.pause.classList.add('hidden');ui.level.classList.add('hidden');ui.story.classList.add('hidden');ui.finalHoot.classList.add('hidden');
    setMobileMission(phaseMissionIcons(currentPhase()),currentPhase().intro);
    showToast(currentPhase().name,'#ffd469',900);state.last=performance.now();
    if(!showStoryForCurrentLevel()){if(state.phaseIndex===0)startTutorialCinematic();requestAnimationFrame(loop)}
  }

  function pauseGame(force){
    if(!state.running || state.ended) return;
    state.paused = typeof force==='boolean' ? force : !state.paused;
    setAudioFocus(!state.paused);
    ui.pause.classList.toggle('hidden',!state.paused);
    if(!state.paused){state.last=performance.now();requestAnimationFrame(loop)}
  }

  function finish(win){
    if(state.ended) return;
    state.ended=true;state.running=false;setAudioFocus(false);
    const finishXp=win?400:Math.min(35,Math.round(state.totalFood*.08));
    if(finishXp>0){state.runXp+=finishXp;grantXp(finishXp)}
    if(win)clearCheckpoint();else refreshContinueButton();
    ui.level.classList.add('hidden');ui.story.classList.add('hidden');ui.end.classList.remove('hidden');
    const gift=storyData.giftChoices.find(item=>item.id===state.selectedGift);
    ui.endEyebrow.textContent=win?'Das Fest der ersten Nacht':'Kurze Pause';
    ui.endTitle.textContent=win?'Fynns erster Flug':'Zurück zum sicheren Ast';
    ui.endText.textContent=win
      ? `Fynn ist gesprungen. Lumi schenkt ihm ${gift?gift.name:'eine Erinnerung aus dem Wald'}. Mut beginnt manchmal mit einem einzigen Flügelschlag.`
      : 'Lumi sammelt sich kurz im Nest und versucht es noch einmal.';
    ui.finalHoot.classList.toggle('hidden',!win);ui.finalHoot.disabled=false;ui.finalHoot.textContent='HUUU · Gemeinsam rufen';
    ui.resultScore.textContent=state.score;
    ui.resultPrey.textContent=state.totalFood;
    ui.resultBest.textContent=state.bestCombo+'×';
    ui.resultXp.textContent='+'+state.runXp;
    renderProgressHub();
    sfx(win?'win':'lose');
  }

  function playFinalHoot(){
    ui.finalHoot.disabled=true;ui.finalHoot.textContent='Der Wald antwortet …';showToast('HUUU!','#82e7ff',1300);sfx('hoot');
    tone(260,.75,'sine',.025,-35,.5);tone(330,.7,'triangle',.018,-40,.85);tone(196,.9,'sine',.022,-24,1.2);haptic([30,50,45,60,60]);
    ui.endText.textContent='Ava, Fynn, Bruno und die Tiere des Waldes antworten. Das Fest beginnt im Mondlicht.';
  }

  function recordSceneCompletion(){
    const scene=state.phaseIndex+1,key=String(scene),record=progress.sceneRecords[key]||{};
    if(!progress.completedScenes.includes(scene))progress.completedScenes.push(scene);
    progress.completedScenes.sort((a,b)=>a-b);
    progress.highestScene=Math.max(progress.highestScene,Math.min(phases.length,scene+1));
    progress.sceneRecords[key]={
      ...record,bestScore:Math.max(Number(record.bestScore)||0,state.score),bonus:Boolean(record.bonus||state.lastBonusAwarded),
      memory:Boolean(record.memory),owl:progress.selectedOwl,completedAt:Date.now()
    };
    saveProgress();
  }

  function openStartMenu(){
    state.running=false;state.ended=false;setAudioFocus(false);
    ui.end.classList.add('hidden');ui.pause.classList.add('hidden');ui.level.classList.add('hidden');ui.story.classList.add('hidden');ui.storyBubble.classList.add('hidden');ui.start.classList.remove('hidden');
    renderProgressHub();refreshContinueButton();reset();draw();
  }

  function updateHud(){
    const phase=currentPhase();
    ui.score.textContent=state.score;
    ui.hearts.textContent='♥'.repeat(Math.max(0,state.hearts))+'♡'.repeat(Math.max(0,state.maxHearts-state.hearts));
    ui.hearts.style.color=state.hearts===1?'var(--red)':'#ff9b9b';
    ui.combo.textContent=state.combo>1?`${state.combo}× Kombo · ${state.comboClock.toFixed(1)} s`:'Keine Kombo';
    ui.phase.textContent=phase.name;
    ui.delivered.textContent=state.phaseDelivered;
    ui.target.textContent=phase.target;
    ui.targetUnit.textContent=phase.objectiveType==='bundles'?'Päckchen':'Futterpunkte';
    ui.energy.style.width=clamp(state.energy/playerStats().maximumEnergy*100,0,100)+'%';
    ui.energy.style.background=state.energy<25?'linear-gradient(90deg,#ff6d68,#ff9a74)':'linear-gradient(90deg,#54c97b,#9ff0af)';
    const hootPercent=Math.round(state.hootCharge*100),hootReady=state.hootCharge>=.999,hootRadius=playerStats().hootRadius*state.gameScale;
    const nearbyHoot=hootSystem.preview(state.hootContexts,owl,hootRadius),enemyHoot=[...state.bats,...state.rivals].some(enemy=>Math.hypot(enemy.x-owl.x,enemy.y-owl.y)<=hootRadius+enemy.r);
    const hootKind=nearbyHoot?hootSystem.functionFor(nearbyHoot):(enemyHoot?'repel':'none'),hootStyle=hootSystem.styleFor(hootKind);
    ui.hootCharge.textContent=hootReady?`HUU · ${hootStyle.label}`:`HUU ${hootPercent}%`;
    ui.hootButton.style.setProperty('--charge-angle',`${state.hootCharge*360}deg`);ui.hootButton.dataset.charge=hootReady?'✓':`${hootPercent}%`;
    ui.hootButton.style.setProperty('--context-color',hootStyle.color);ui.hootContextUse?.setAttribute('href',`#i-${hootStyle.icon}`);
    ui.hootButton.classList.toggle('charging',!hootReady);ui.hootButton.setAttribute('aria-label',hootReady?`Huuu-Ruf bereit: ${hootStyle.label}`:`Huuu-Ruf lädt: ${hootPercent} Prozent`);
    const dropMode=owl.flightState==='perched'&&Boolean(owl.carrying),diveMode=dropMode?'drop':'dive';
    if(ui.diveButton.dataset.mode!==diveMode){ui.diveButton.dataset.mode=diveMode;ui.diveButton.innerHTML=iconSvg(dropMode?'drop':'bolt');ui.diveButton.setAttribute('aria-label',dropMode?'Getragenes Objekt auf dem Ast ablegen':'Sturzflug')}
    ui.time.style.width=clamp(state.time/state.maxTime*100,0,100)+'%';
    ui.timeText.textContent=state.time>0?Math.ceil(state.time):'bereit';
    const tutorialStep=tutorialSystem.current(state.tutorial);
    shell.dataset.tutorial=tutorialStep?.type||'';
    if(tutorialStep){const index=state.tutorial.steps.indexOf(tutorialStep)+1;ui.bonus.textContent=`✦ Lernen ${index}/${state.tutorial.steps.length} · ${tutorialStep.label}`;ui.bonus.style.color='#9fe7ff';setMobileMission(iconSvg(tutorialStep.icon),tutorialStep.text)}
    else if(dropMode)setMobileMission(`${iconSvg('drop')} · ${iconSvg('perch')}`,'Hier ablegen oder weiterfliegen.');
    else if(owl.carrying) setMobileMission(`${iconSvg('mouse')} → ${iconSvg('nest')}`,'Beute im Fang. Bring sie zum Nest.');
    else if(owl.flightState==='perched')setMobileMission(`${iconSvg('perch')} · ${Math.round(state.energy/playerStats().maximumEnergy*100)}%`,'Sicherer Ast. Lenken zum Abflug.');
    else if(owlInNest())setMobileMission(`${iconSvg('nest')} · ${iconSvg('heart')}`,'Nestschutz aktiv. Hier bist du sicher.');
    else setMobileMission(phaseMissionIcons(phase),phase.mission);
  }

  function showToast(text,color='#fff',duration=900){
    ui.toast.textContent=text;ui.toast.style.color=color;
    ui.toast.getAnimations().forEach(a=>a.cancel());
    ui.toast.animate([
      {opacity:0,transform:'translate(-50%,-35%) scale(.55)'},
      {opacity:1,transform:'translate(-50%,-50%) scale(1.08)',offset:.22},
      {opacity:1,transform:'translate(-50%,-50%) scale(1)',offset:.72},
      {opacity:0,transform:'translate(-50%,-70%) scale(.94)'}
    ],{duration,easing:'cubic-bezier(.2,.8,.2,1)'});
  }

  function floater(x,y,text,color='#fff',size=20){
    state.floaters.push({x,y,text,color,size:size*state.gameScale,life:1,max:1});
  }

  function burst(x,y,color,count=20,power=180){
    power*=state.gameScale;
    for(let i=0;i<count;i++){
      const a=Math.random()*Math.PI*2,s=rand(35,power);
      state.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(.45,1),max:1,color,size:rand(2,6)*state.gameScale,spin:rand(-5,5)});
    }
  }

  function spawnMouse(forcedType){
    let type=forcedType;
    const phase=currentPhase();
    if(!type){
      type=phase.preyTypes[Math.floor(Math.random()*phase.preyTypes.length)];
      const storyChapter=chapterForLevel();if(storyChapter.id==='meadow'&&Math.random()<.22)type='berry';if(storyChapter.id==='firefly'&&Math.random()<.18)type='herb';
    }
    if(phase.requiredType==='gold'&&!owl.carrying&&!state.mice.some(m=>m.type==='gold')&&state.phaseDelivered<phase.target)type='gold';

    let fromRight=owl.x<camera.centerX;
    if(Math.random()<.18)fromRight=!fromRight;
    const s=state.gameScale;
    const bounds=camera.bounds(0),spawnDistance=45*s;
    let spawnX=fromRight?Math.min(state.world.width-24*s,bounds.right+spawnDistance):Math.max(24*s,bounds.left-spawnDistance);
    if(Math.abs(spawnX-owl.x)<150*s){fromRight=!fromRight;spawnX=fromRight?Math.min(state.world.width-24*s,bounds.right+spawnDistance):Math.max(24*s,bounds.left-spawnDistance)}
    const config={
      normal:{speed:rand(70,105),r:16,value:120,food:10,color:'#aeb4c0'},
      swift:{speed:rand(125,165),r:15,value:220,food:16,color:'#d07c69'},
      gold:{speed:rand(105,145),r:17,value:850,food:50,color:'#ffd469'},
      rabbit:{speed:rand(105,145),r:18,value:260,food:30,color:'#d7c2a1'},
      frog:{speed:rand(72,108),r:16,value:210,food:22,color:'#71c879'},
      beetle:{speed:rand(48,72),r:12,value:160,food:18,color:'#70a6c7'},
      berry:{speed:0,r:13,value:130,food:12,color:'#d85f6b'},
      herb:{speed:0,r:14,value:180,food:16,color:'#8fcf83'}
      ,bundle:{speed:0,r:17,value:100,food:1,color:'#e2b56f'}
    }[type];
    state.mice.push({
      type,x:spawnX,y:state.groundY-rand(17,25)*s,
      dir:fromRight?-1:1,speed:config.speed*s*phase.speedMultiplier,r:config.r*s,value:config.value,food:config.food,color:config.color,
      phase:rand(0,6),turn:rand(1.8,4.5),dash:0,glow:rand(0,6),hidden:0,behaviorClock:rand(1.5,4)
    });
  }

  function spawnTutorialPackages(){
    if(!state.tutorial)return;
    for(const item of state.tutorial.packages.filter(packageItem=>!packageItem.delivered)){
      spawnMouse('bundle');const bundle=state.mice[state.mice.length-1];bundle.x=item.x;bundle.y=state.groundY-22*state.gameScale;bundle.color=item.color;bundle.packageId=item.id;bundle.speed=0;bundle.dir=1;
    }
  }

  function spawnBat(){
    let fromRight=owl.x<camera.centerX;
    if(Math.random()<.2)fromRight=!fromRight;
    const s=state.gameScale;
    let y=state.h*rand(.23,.65);
    const bounds=camera.bounds(0),edgeX=fromRight?Math.min(state.world.width-30*s,bounds.right+55*s):Math.max(30*s,bounds.left-55*s);
    for(let i=0;i<5&&Math.hypot(edgeX-owl.x,y-owl.y)<180*s;i++)y=state.h*rand(.23,.65);
    state.bats.push({
      x:edgeX,y,dir:fromRight?-1:1,
      speed:rand(105,175)*s*currentPhase().speedMultiplier,r:23*s,phase:rand(0,6),turn:rand(1,3)
    });
    if(state.running&&Math.random()<.3)sfx('bat');
  }

  function spawnFirefly(){
    const margin=70*state.gameScale;
    const bounds=camera.bounds(0),left=clamp(bounds.left,margin,state.world.width-margin),right=clamp(bounds.right,margin,state.world.width-margin);
    let x=rand(Math.min(left,right),Math.max(left,right)),y=rand(state.h*.30,state.groundY-margin);
    for(let i=0;i<5&&Math.hypot(x-owl.x,y-owl.y)<90*state.gameScale;i++){x=rand(Math.min(left,right),Math.max(left,right));y=rand(state.h*.30,state.groundY-margin)}
    state.fireflies.push({x,y,r:11*state.gameScale,phase:rand(0,6),life:rand(8,14)});
  }

  function spawnRivalOwl(elite=false){
    const s=state.gameScale,fromRight=owl.x<camera.centerX,bounds=camera.bounds(0);
    state.rivals.push({
      x:fromRight?Math.min(state.world.width-35*s,bounds.right+70*s):Math.max(35*s,bounds.left-70*s),y:state.h*rand(.24,.48),vx:0,vy:0,dir:fromRight?-1:1,
      speed:rand(elite?132:118,elite?158:150)*s*currentPhase().speedMultiplier,r:(elite?41:30)*s,wing:rand(0,6),carrying:null,elite,hits:elite?2:1
    });
    if(elite){showToast('ELITE-RIVALE','#c99cff',1200);haptic([20,35,20]);sfx('rival')}
    else if(Math.random()<.65)sfx('rival');
  }

  function dropRivalPrey(rival){
    if(!rival.carrying)return;
    const prey=rival.carrying;
    if(!Number.isFinite(prey.speed))prey.speed=(prey.baseSpeed||95)*state.gameScale*currentPhase().speedMultiplier;
    if(!Number.isFinite(prey.r))prey.r=(prey.baseR||16)*state.gameScale;
    if(!Number.isFinite(prey.phase))prey.phase=0;
    if(!Number.isFinite(prey.glow))prey.glow=0;
    prey.hidden=0;if(!Number.isFinite(prey.behaviorClock))prey.behaviorClock=2;
    prey.x=clamp(rival.x,24*state.gameScale,state.world.width-24*state.gameScale);
    prey.y=state.groundY-22*state.gameScale;prey.dir=Math.random()>.5?1:-1;prey.turn=1.5;prey.dash=.25;
    state.mice.push(prey);rival.carrying=null;
  }

  function scareRival(index){
    const rival=state.rivals[index];
    if(rival.elite&&rival.hits>1){
      rival.hits--;dropRivalPrey(rival);rival.vx+=(rival.x<owl.x?-260:260)*state.gameScale;rival.vy-=120*state.gameScale;
      burst(rival.x,rival.y,'#c99cff',18,170);floater(rival.x,rival.y-30,'NOCH 1 TREFFER','#c99cff',17);haptic([18,20,18]);sfx('scare');return;
    }
    dropRivalPrey(rival);state.rivals.splice(index,1);
    const reward=rival.elite?350:80;state.score+=reward;
    burst(rival.x,rival.y,rival.elite?'#c99cff':'#9fc7dc',rival.elite?34:22,rival.elite?250:190);floater(rival.x,rival.y-28,`VERTRIEBEN +${reward}`,rival.elite?'#c99cff':'#82e7ff',18);
    haptic([20,25,30]);sfx('scare');
  }

  function activateDive(){
    const diveCost=playerStats().diveEnergyCost;
    if(!state.running||state.paused||owl.dive||owl.flightState==='stumbling')return;
    if(owl.flightState==='perched'&&owl.carrying){dropCarriedAtPerch();return}
    if(isLargeCarried()||state.energy<diveCost)return;
    if(owl.flightState==='perched'||owl.flightState==='approach')leavePerch(0,-70*state.gameScale);
    let dx=0,dy=0;
    if(state.keys.has('ArrowRight')||state.keys.has('KeyD')) dx+=1;
    if(state.keys.has('ArrowLeft')||state.keys.has('KeyA')) dx-=1;
    if(state.keys.has('ArrowDown')||state.keys.has('KeyS')) dy+=1;
    if(state.keys.has('ArrowUp')||state.keys.has('KeyW')) dy-=1;
    if(state.pointer.active){dx=state.pointer.x-owl.x;dy=state.pointer.y-owl.y}
    if(Math.hypot(dx,dy)<.1){dx=Math.cos(owl.angle);dy=Math.sin(owl.angle);if(Math.abs(dy)<.25)dy=.55}
    const len=Math.hypot(dx,dy)||1;
    owl.diveDirX=dx/len;owl.diveDirY=dy/len;
    owl.dive=true;owl.diveTime=.58;state.energy-=diveCost;
    owl.vx+=owl.diveDirX*720*state.gameScale;owl.vy+=owl.diveDirY*720*state.gameScale;
    state.rings.push({x:owl.x,y:owl.y,r:12*state.gameScale,life:.35,max:.35,color:'rgba(255,212,105,.8)'});
    haptic(18);
    sfx('dive');
  }

  function queueHootEcho(context,extraDelay=0,overrides={}){
    const distance=Math.hypot(context.x-owl.x,context.y-owl.y);
    state.hootEchoes.push({time:state.elapsed+.18+distance/420+extraDelay,x:context.x,y:context.y,type:context.type,audioResponse:context.audioResponse,color:context.color,icon:context.icon,speaker:context.speaker||'',...overrides});
  }

  function resolveHootContext(context){
    context.revealed=true;context.visibleUntil=state.elapsed+10;context.completed=true;
    if(context.type==='hiddenObject'){
      spawnMouse(context.reward||'berry');const reward=state.mice[state.mice.length-1];reward.x=context.x;reward.y=state.groundY-22*state.gameScale;reward.dir=owl.x<context.x?1:-1;
      if(context.memory){const key=String(state.phaseIndex+1),record=progress.sceneRecords[key]||{};progress.sceneRecords[key]={...record,memory:true};saveProgress()}
    }else if(context.type==='calmFireflies'){
      state.fireflies.forEach(firefly=>{firefly.life+=5;state.rings.push({x:firefly.x,y:firefly.y,r:5*state.gameScale,life:.65,max:.65,color:'rgba(159,231,176,.72)'})});
    }else if(context.type==='leafBurst'){
      for(let i=0;i<14;i++){const angle=-1.9+i*.19;state.leafMotions.push({x:context.x+Math.sin(i)*18*state.gameScale,y:context.y+Math.cos(i)*10*state.gameScale,vx:Math.cos(angle)*(45+i*4)*state.gameScale,vy:Math.sin(angle)*(32+i*2)*state.gameScale,rotation:i*.73,spin:(i%2?1:-1)*(2+i*.08),life:1.8+i*.035,max:2.3,color:i%3===0?'#d7e9bd':context.color})}
    }
    if(context.type==='finaleChain'){
      const names=['ava','bruno','fynn','chorus'];
      names.forEach((speaker,index)=>queueHootEcho(context,index*.48,{speaker,audioResponse:speaker==='chorus'?'chorus':speaker,x:clamp(context.x+(index-1.5)*170*state.gameScale,30,state.world.width-30)}));
    }else queueHootEcho(context);
  }

  function hootReplyText(response){
    if(response.speaker==='ava')return ['ava','Ich höre dich, Lumi.'];
    if(response.speaker==='bruno')return ['bruno','Hier drüben! Und ja, die Brille sitzt.'];
    if(response.speaker==='fynn')return ['fynn',response.type==='calmFynn'?'Das Huuu macht den Wind kleiner.':'Ich bin noch da. Ich höre dich.'];
    if(response.speaker==='chorus'||response.type==='finaleChain')return ['ava','Der ganze Wald antwortet. Das Fest kann beginnen!'];
    return null;
  }

  function updateHootResponses(dt){
    for(let i=state.hootEchoes.length-1;i>=0;i--){
      const echo=state.hootEchoes[i];if(echo.time>state.elapsed)continue;state.hootEchoes.splice(i,1);playHootResponse(echo);
      state.edgeSignals.push({...echo,life:2.25,max:2.25});burst(echo.x,echo.y,echo.color||'#82e7ff',echo.type==='finaleChain'?18:9,110);
      const reply=hootReplyText(echo);if(reply)showStoryBubble(reply[0],reply[1],2600);
    }
    for(const signal of state.edgeSignals)signal.life-=dt;state.edgeSignals=state.edgeSignals.filter(signal=>signal.life>0);
    for(const leaf of state.leafMotions){leaf.life-=dt;leaf.x+=leaf.vx*dt;leaf.y+=leaf.vy*dt;leaf.vx*=Math.pow(.35,dt);leaf.vy+=35*state.gameScale*dt;leaf.rotation+=leaf.spin*dt}
    state.leafMotions=state.leafMotions.filter(leaf=>leaf.life>0);
  }

  function activateHoot(){
    const stats=playerStats();
    if(!state.running||state.paused)return;
    if(state.hootCharge<.999){showToast(`HUU LÄDT · ${Math.round(state.hootCharge*100)}%`,'#82e7ff',520);return}
    const tutorialStep=tutorialSystem.current(state.tutorial);if(tutorialStep&&tutorialStep.type!=='hoot'){showToast('HUUU KOMMT GLEICH','#b9dfe8',650);return}
    const radius=stats.hootRadius*state.gameScale,contexts=hootSystem.candidates(state.hootContexts,owl,radius);
    const batsInRange=state.bats.filter(enemy=>Math.hypot(enemy.x-owl.x,enemy.y-owl.y)<=radius+enemy.r),rivalsInRange=state.rivals.filter(enemy=>Math.hypot(enemy.x-owl.x,enemy.y-owl.y)<=radius+enemy.r);
    if(state.phaseIndex===0&&!contexts.length&&!batsInRange.length&&!rivalsInRange.length){
      state.rings.push({x:owl.x,y:owl.y,r:18*state.gameScale,life:.45,max:.45,color:'rgba(130,231,255,.45)',hoot:true,targetRadius:radius*.42,seed:1});
      showToast('Hier antwortet gerade nichts','#b9dfe8',900);floater(owl.x,owl.y-42,'?','#b9dfe8',24);spatialTone(290,.18,'sine',.012,0,0,-55);return;
    }
    const kind=contexts.length?hootSystem.functionFor(contexts[0]):((batsInRange.length||rivalsInRange.length)?'repel':'none'),style=hootSystem.styleFor(kind);
    state.hootCharge=0;camera.pulse(.16);let drivenAway=0;
    for(let i=state.bats.length-1;i>=0;i--){
      const enemy=state.bats[i];if(Math.hypot(enemy.x-owl.x,enemy.y-owl.y)>radius+enemy.r)continue;
      state.bats.splice(i,1);burst(enemy.x,enemy.y,'#82e7ff',14,150);drivenAway++;
    }
    for(const enemy of rivalsInRange){
      dropRivalPrey(enemy);enemy.scaredTime=2.25;const away=Math.sign(enemy.x-owl.x)||1;enemy.vx=away*(enemy.elite?320:370)*state.gameScale;enemy.vy=-150*state.gameScale;burst(enemy.x,enemy.y,enemy.elite?'#c99cff':'#82e7ff',enemy.elite?28:18,190);drivenAway++;
    }
    contexts.forEach(resolveHootContext);
    state.batClock=Math.max(state.batClock,2.2);state.rivalClock=Math.max(state.rivalClock,3);
    state.rings.push({x:owl.x,y:owl.y,r:18*state.gameScale,life:.95,max:.95,color:style.color,hoot:true,targetRadius:radius,seed:state.phaseIndex*17+contexts.length*3});
    floater(owl.x,owl.y-45,drivenAway?`${drivenAway} VERTRIEBEN`:style.label.toUpperCase(),style.color,20);
    haptic([25,45,38]);showToast(drivenAway?`HUUU · ${drivenAway} WEG`:`HUUU · ${style.label}`,style.color,900);sfx('hoot');
    if(contexts.some(context=>context.oneShot))saveCheckpoint();
  }

  function dropPrey(){
    if(!owl.carrying) return;
    const p=owl.carrying;
    state.mice.push({
      type:p.type,packageId:p.packageId,x:owl.x,y:state.groundY-22*state.gameScale,dir:Math.random()>.5?1:-1,
      speed:(p.baseSpeed||95)*state.gameScale,r:(p.baseR||16)*state.gameScale,value:p.value,food:p.food,
      color:p.color,phase:0,turn:2,dash:.45,glow:0,hidden:0,behaviorClock:2
    });
    owl.carrying=null;
    showToast('BEUTE VERLOREN','#ff7772',750);
  }

  function catchMouse(index){
    const m=state.mice[index];
    state.mice.splice(index,1);
    owl.carrying={type:m.type,packageId:m.packageId,value:m.value,food:m.food,color:m.color,baseSpeed:m.speed/state.gameScale,baseR:m.r/state.gameScale};
    state.score+=Math.round(m.value*.35);
    state.combo++;state.bestCombo=Math.max(state.bestCombo,state.combo);state.comboClock=7;
    if(state.bonus?.kind==='combo'){state.bonus.progress=Math.max(state.bonus.progress,state.combo);if(state.bonus.progress>=state.bonus.target)state.bonus.complete=true;updateBonusHud()}
    burst(m.x,m.y,m.color,26,230);state.shake=.13;
    floater(m.x,m.y-25,'GEFANGEN!',m.color,22);
    const preyName={gold:'Goldene Maus',rabbit:'Kaninchen',frog:'Frosch',beetle:'Käfer',berry:'Beeren',herb:'Duftkräuter',bundle:'Vorratspäckchen'}[m.type]||'Beute';
    showToast(preyName+' gefangen',m.color,750);
    haptic([18,25,28]);
    sfx('catch');if(['frog','rabbit','beetle'].includes(m.type))sfx(m.type);
  }

  function deliverPrey(){
    if(!owl.carrying) return;
    const p=owl.carrying;
    const valid=!currentPhase().requiredType||p.type===currentPhase().requiredType;
    const comboMult=1+Math.min(4,Math.max(0,state.combo-1))*.2;
    const gain=Math.round(p.value*comboMult);
    const foodGain=Math.max(1,Math.round(p.food*(1+progress.nestUpgrade*.06)));
    updateBonusProgress(p.type);
    state.score+=gain;state.totalDelivered++;
    state.totalFood+=foodGain;if(valid) state.phaseDelivered+=foodGain;
    state.time=Math.min(state.maxTime,state.time+4+progress.nestUpgrade*.6);
    const n=nest();burst(n.x,n.y,p.color,35,260);state.shake=.18;
    floater(n.x+15,n.y-50,`+${foodGain} Futter`,p.color,22);
    if(p.type==='gold'){
      progress.goldPoints++;saveProgress();renderProgressHub();
      floater(n.x,n.y-82,'+1 UPGRADE','#ffd469',20);showToast('Goldtier · +1 Upgrade','#ffd469',1050);
    }
    if(p.type==='bundle'&&state.tutorial&&p.packageId){state.tutorial.deliveredPackageIds.add(p.packageId);const source=state.tutorial.packages.find(item=>item.id===p.packageId);if(source)source.delivered=true}
    owl.carrying=null;
    if(p.type!=='gold')showToast(valid?'Im Nest abgeliefert':'Zusätzliche Beute',valid?'#7ee09b':'#ffd469',750);
    haptic([22,35,22,35,35]);
    sfx('deliver');

    tryCompleteLevel();
  }

  function tryCompleteLevel(){
    if(state.phaseDelivered<currentPhase().target||state.phaseRewarded)return false;
    if(state.phaseIndex===0&&state.tutorial&&!state.tutorial.complete)return false;
    {
      if(!state.phaseRewarded){
        state.phaseRewarded=true;
        const bonusXp=evaluateBonusGoal(),xpGain=Math.round(30+state.phaseIndex*3+currentPhase().target*.18)+bonusXp;
        state.lastPhaseXp=xpGain;state.runXp+=xpGain;const levels=grantXp(xpGain);
        recordSceneCompletion();
        if(levels)showToast(`LEVEL ${progress.level} · +${xpGain} XP`,'#82e7ff',1300);
      }
      if(state.phaseIndex===phases.length-1){finish(true);return}
      showLevelComplete();sfx('phase');
    }
    return true;
  }

  function showLevelComplete(){
    state.paused=true;setAudioFocus(false);ui.level.classList.remove('hidden');
    ui.levelTitle.textContent=currentPhase().name;ui.levelFood.textContent=state.phaseDelivered;ui.levelUnit.textContent=currentPhase().objectiveType==='bundles'?'Päckchen':'Futter';ui.levelScore.textContent=state.score;
    ui.levelBonus.textContent=state.lastBonusAwarded?'✓ +30 XP':'Nicht geschafft';ui.levelBonus.style.color=state.lastBonusAwarded?'#7ee09b':'#ff9b9b';ui.levelXp.textContent='+'+state.lastPhaseXp;
    haptic([25,35,45]);
  }

  function continueToNextLevel(){
    ui.level.classList.add('hidden');advancePhase();
    if(!showStoryForCurrentLevel()){state.paused=false;setAudioFocus(true);state.last=performance.now();requestAnimationFrame(loop)}
  }

  function advancePhase(){
    state.phaseIndex++;
    progress.highestScene=Math.max(progress.highestScene,state.phaseIndex+1);saveProgress();
    loadCurrentWorld(false);placeOwlAtWorldStart();owl.flightState='flying';owl.perchId=null;owl.targetPerchId=null;owl.stumbleTime=0;
    state.phaseDelivered=0;state.phaseRewarded=false;
    state.phaseElapsed=0;state.eliteSpawned=false;state.storyBeatIndex=0;initBonusGoal();
    state.time=Math.min(state.maxTime+phases[state.phaseIndex].timeBonus,state.time+phases[state.phaseIndex].timeBonus);
    state.maxTime=Math.max(state.maxTime,state.time);
    state.mice=[];state.bats=[];state.rivals=[];state.fireflies=[];owl.carrying=null;
    setupBranches();setupBushes();setupGroundDetails();setupHootContexts();setupStoryScene();setupTutorial();state.storyDialogueQueue=[];
    for(let i=0;i<currentPhase().startMice;i++) spawnMouse();
    for(let i=0;i<Math.min(2+state.phaseIndex,4);i++) spawnBat();
    for(let i=0;i<Math.min(4+state.phaseIndex,6);i++) spawnFirefly();
    state.mouseClock=.25;state.batClock=1.1;state.fireflyClock=.5;state.rivalClock=2.8;state.wave=1;state.waveRemaining=currentPhase().waveSize;state.waveBreak=0;
    state.transitionQueued=false;
    saveCheckpoint();
    showToast(phases[state.phaseIndex].name,'#82e7ff',1000);
    setMobileMission(phaseMissionIcons(phases[state.phaseIndex]),phases[state.phaseIndex].intro);
  }

  function damage(source=null){
    if(!beginStumble(source))return;
    state.levelHits++;if(state.bonus?.kind==='untouched'){state.bonus.failed=true;updateBonusHud()}
    state.combo=0;state.comboClock=0;state.shake=.3;
    dropPrey();burst(owl.x,owl.y,'#ffb37b',22,190);floater(owl.x,owl.y-40,'HOPPLA','#ffb37b',18);sfx('hit');
    haptic([55,35,70]);
  }

  function update(dt){
    const phase=currentPhase(),stats=playerStats();
    state.elapsed+=dt;state.phaseElapsed+=dt;updateAudio(dt);
    if(updateTutorialCinematic(dt))return;
    state.time=Math.max(0,state.time-dt*phase.timeDrainMultiplier);
    state.hootCharge=Math.min(1,state.hootCharge+stats.hootRechargeRate*dt);
    state.shake=Math.max(0,state.shake-dt);
    owl.invuln=Math.max(0,owl.invuln-dt);
    owl.wing+=dt*(owl.flightState==='perched'?2:(owl.dive?19:10));owl.turnTime=Math.max(0,owl.turnTime-dt);

    if(state.comboClock>0){state.comboClock-=dt;if(state.comboClock<=0)state.combo=0}

    if(state.transition>0){
      state.transition-=dt;
      if(state.transition<=0&&state.transitionQueued)advancePhase();
    }

    let ax=0,ay=0;
    if(state.keys.has('ArrowRight')||state.keys.has('KeyD'))ax++;
    if(state.keys.has('ArrowLeft')||state.keys.has('KeyA'))ax--;
    if(state.keys.has('ArrowDown')||state.keys.has('KeyS'))ay++;
    if(state.keys.has('ArrowUp')||state.keys.has('KeyW'))ay--;

    if(state.pointer.active){
      const pointerWorld=camera.screenToWorld(state.pointer.targetScreenX,state.pointer.targetScreenY);state.pointer.x=pointerWorld.x;state.pointer.y=pointerWorld.y;
      const dx=state.pointer.x-owl.x,dy=state.pointer.y-owl.y,d=Math.hypot(dx,dy);
      if(d>18){ax+=dx/d;ay+=dy/d}
    }
    const inputLength=Math.hypot(ax,ay);if(inputLength>1){ax/=inputLength;ay/=inputLength}const manualInput=inputLength>.08;
    if(manualInput&&(owl.flightState==='perched'||owl.flightState==='approach'))leavePerch(ax*70*state.gameScale,ay*70*state.gameScale-40*state.gameScale);

    if(owl.flightState==='perched'){
      const perch=perchById(owl.perchId);
      if(!perch)leavePerch();
      else{const target=perches.target(perch,owl.r);owl.x=target.x;owl.y=target.y;owl.vx=0;owl.vy=0;owl.angle=0;state.energy=Math.min(stats.maximumEnergy,state.energy+stats.perchRecharge*dt)}
    }else if(owl.flightState==='approach'){
      const perch=perchById(owl.targetPerchId);
      if(!perch)leavePerch();
      else if(perches.approach(owl,perch,dt,{landSpeed:stats.landingSpeed*state.gameScale,approachResponse:stats.turnResponse})){finishLanding(perch)}
      else{owl.x+=owl.vx*dt;owl.y+=owl.vy*dt;owl.angle=Math.atan2(owl.vy,owl.vx)}
    }else if(owl.flightState==='stumbling'){
      owl.stumbleTime-=dt;owl.vx*=Math.pow(.3,dt);owl.vy+=260*state.gameScale*dt;owl.x+=owl.vx*dt;owl.y+=owl.vy*dt;owl.angle+=dt*8;
      if(owl.stumbleTime<=0)softBushLanding();
    }else{
      const largeCarry=isLargeCarried(),acceleration=stats.acceleration*state.gameScale;
      owl.vx+=ax*acceleration*dt;owl.vy+=ay*acceleration*(largeCarry&&ay<0?.68:1)*dt;
      const damping=Math.pow(owl.dive?.22:(largeCarry?Math.min(.24,stats.brakeDrag+.07):stats.brakeDrag),dt);owl.vx*=damping;owl.vy*=damping;
      if(owl.dive){
        owl.diveTime-=dt;owl.vx+=owl.diveDirX*500*state.gameScale*dt;owl.vy+=owl.diveDirY*500*state.gameScale*dt;
        if(owl.diveTime<=0)owl.dive=false;
        if(Math.random()<.65)state.particles.push({x:owl.x-rand(-8,8),y:owl.y+rand(-5,5),vx:-owl.diveDirX*rand(80,170),vy:-owl.diveDirY*rand(80,170),life:.25,max:.25,color:'rgba(255,232,168,.75)',size:rand(2,5),spin:0});
      }
      const speedLimit=(owl.dive?700:(largeCarry?430*stats.carrySpeed:430))*state.gameScale*stats.speed,sp=Math.hypot(owl.vx,owl.vy);
      if(sp>speedLimit){owl.vx=owl.vx/sp*speedLimit;owl.vy=owl.vy/sp*speedLimit}
      if(sp>8)owl.angle=Math.atan2(owl.vy,owl.vx);
      if(Math.abs(owl.vx)>28&&Math.sign(owl.vx)!==owl.facing){owl.facing=Math.sign(owl.vx);owl.turnTime=.22}
      owl.x+=owl.vx*dt;owl.y+=owl.vy*dt;
    }

    const owlEdge=owl.r+5*state.gameScale;
    if(owl.flightState==='flying'&&owl.y>=state.groundY-20*state.gameScale&&owl.vy>150*state.gameScale)beginStumble({x:owl.x,y:state.groundY+40});
    owl.x=clamp(owl.x,owlEdge,state.world.width-owlEdge);
    owl.y=clamp(owl.y,playTop(),state.groundY-20*state.gameScale);
    updateStorySystem(dt);
    const focusCompanion=state.storyScene?.companions.find(item=>item.id!=='glow'),companionFocus=focusCompanion?{x:focusCompanion.x,y:focusCompanion.y}:null;
    camera.update(owl,dt,{dive:owl.dive,companion:companionFocus});
    const n=nest(),atNest=owlInNest();

    const slow=1;
    if(!state.tutorial&&state.waveRemaining<=0){
      state.waveBreak-=dt;
      if(state.waveBreak<=0){
        state.wave++;state.waveRemaining=phase.waveSize+Math.min(3,state.wave-1);
        showToast(`Welle ${state.wave}`,'#82e7ff',520);
        sfx('wave');
      }
    }
    state.mouseClock-=dt;
    if(!state.tutorial&&state.mouseClock<=0&&state.waveRemaining>0&&state.mice.length<phase.mouseCap){
      spawnMouse();state.waveRemaining--;state.mouseClock=rand(phase.mouseDelay[0],phase.mouseDelay[1]);
      if(state.waveRemaining===0)state.waveBreak=phase.waveBreak;
    }
    state.batClock-=dt;
    if(state.batClock<=0&&state.bats.length<phase.batCap){
      spawnBat();state.batClock=rand(phase.batDelay[0],phase.batDelay[1]);
    }
    state.fireflyClock-=dt;
    if(state.fireflyClock<=0&&state.fireflies.length<phase.fireflyCap){
      spawnFirefly();state.fireflyClock=rand(phase.fireflyDelay[0],phase.fireflyDelay[1]);
    }
    state.rivalClock-=dt;
    if(phase.rivalCap>0&&state.rivalClock<=0&&state.rivals.length<phase.rivalCap){
      spawnRivalOwl();state.rivalClock=rand(phase.rivalDelay[0],phase.rivalDelay[1]);
    }
    if((state.phaseIndex+1)%5===0&&!state.eliteSpawned&&state.phaseElapsed>=5){state.eliteSpawned=true;spawnRivalOwl(true)}

    for(const m of state.mice){
      m.phase+=dt*(8+m.speed/45);m.glow+=dt*4;m.turn-=dt;m.behaviorClock=(m.behaviorClock||0)-dt;m.hidden=Math.max(0,(m.hidden||0)-dt);m.freeze=Math.max(0,(m.freeze||0)-dt);
      if(m.perched){const perch=perchById(m.perchId);if(perch){m.x=perch.x;m.y=perch.y-18*state.gameScale;continue}m.perched=false;m.perchId=null;m.y=state.groundY-22*state.gameScale;m.speed=70*state.gameScale}
      if(m.hidden>0)continue;
      if(m.type==='berry'||m.type==='herb'||m.type==='bundle')continue;
      const owlDistance=Math.hypot(m.x-owl.x,m.y-owl.y),nearBush=state.bushes.find(bush=>Math.abs(bush.x-m.x)<bush.size*.75);
      if(m.behaviorClock<=0){
        m.behaviorClock=rand(2,4.5);
        if(m.type==='rabbit'&&nearBush){m.hidden=rand(.65,1.15);continue}
        if(m.type==='frog'){m.dash=.48;m.dir=owl.x<m.x?1:-1}
        if(m.type==='beetle'&&owlDistance<125*state.gameScale)m.freeze=.8;
      }
      if(['normal','swift','rabbit'].includes(m.type)&&owlDistance<135*state.gameScale){m.dir=owl.x<m.x?1:-1;m.dash=Math.max(m.dash,.35)}
      if(m.turn<=0){
        m.turn=rand(1.4,4.2);
        if(Math.random()<.28)m.dir*=-1;
        const dashChance={swift:.65,rabbit:.78,frog:.58}[m.type]||0;
        if(Math.random()<dashChance)m.dash=m.type==='frog'?.38:.55;
      }
      m.dash=Math.max(0,m.dash-dt);
      const ms=m.speed*(m.dash>0?1.75:1)*(m.freeze>0 ? .18 : 1)*slow;
      m.x+=m.dir*ms*dt;
      const mouseEdge=22*state.gameScale;
      if(m.x<mouseEdge){m.x=mouseEdge;m.dir=1}if(m.x>state.world.width-mouseEdge){m.x=state.world.width-mouseEdge;m.dir=-1}
    }

    for(const b of state.bats){
      b.phase+=dt*10;b.turn-=dt;
      if(b.turn<=0){b.turn=rand(1,2.7);if(Math.random()<.35)b.dir*=-1}
      b.x+=b.dir*b.speed*slow*dt;b.y+=Math.sin(b.phase)*22*dt*slow;
      if(b.x<-65*state.gameScale)b.x=state.world.width+60*state.gameScale;if(b.x>state.world.width+65*state.gameScale)b.x=-60*state.gameScale;
      b.y=clamp(b.y,state.h*.2,state.groundY-95*state.gameScale);
    }

    for(let i=state.rivals.length-1;i>=0;i--){
      const rival=state.rivals[i];rival.wing+=dt*11;
      rival.scaredTime=Math.max(0,(rival.scaredTime||0)-dt);
      if(rival.scaredTime>0){
        rival.x+=rival.vx*dt;rival.y+=rival.vy*dt;rival.vx*=Math.pow(.28,dt);rival.vy*=Math.pow(.34,dt);rival.dir=rival.vx<0?-1:1;
        rival.x=clamp(rival.x,-70*state.gameScale,state.world.width+70*state.gameScale);rival.y=clamp(rival.y,playTop(),state.groundY-55*state.gameScale);continue;
      }
      let tx,ty;
      if(rival.carrying){
        tx=rival.exitDir<0?-100*state.gameScale:state.world.width+100*state.gameScale;ty=80*state.gameScale;
      }else if(owl.carrying&&!atNest){
        tx=owl.x;ty=owl.y;
      }else if(state.mice.some(prey=>prey.hidden<=0)){
        const visiblePrey=state.mice.filter(prey=>prey.hidden<=0);let target=visiblePrey[0],best=dist2(rival,target);
        for(let j=1;j<visiblePrey.length;j++){const d=dist2(rival,visiblePrey[j]);if(d<best){target=visiblePrey[j];best=d}}
        tx=target.x;ty=target.y;
      }else{tx=nest().x;ty=state.groundY-80*state.gameScale}
      const dx=tx-rival.x,dy=ty-rival.y,d=Math.hypot(dx,dy)||1,blend=Math.min(1,dt*2.6);
      rival.vx+=(dx/d*rival.speed-rival.vx)*blend;rival.vy+=(dy/d*rival.speed-rival.vy)*blend;
      rival.x+=rival.vx*dt;rival.y+=rival.vy*dt;rival.dir=rival.vx<0?-1:1;
      if(!rival.carrying){
        for(let j=state.mice.length-1;j>=0;j--){
          if(state.mice[j].hidden<=0&&collide(rival,state.mice[j],3)){
            rival.carrying=state.mice.splice(j,1)[0];rival.exitDir=rival.x<state.world.width*.5?-1:1;
            burst(rival.x,rival.y,rival.carrying.color,13,110);floater(rival.x,rival.y-22,'WEGGESCHNAPPT','#ff9b78',16);sfx('steal');
            break;
          }
        }
      }else if(rival.x<-90*state.gameScale||rival.x>state.world.width+90*state.gameScale){
        state.rivals.splice(i,1);
      }
    }

    for(const f of state.fireflies){f.phase+=dt*4;f.life-=dt;f.x+=Math.sin(f.phase*.7)*6*dt;f.y+=Math.cos(f.phase)*5*dt}
    state.fireflies=state.fireflies.filter(f=>f.life>0);

    for(let i=state.mice.length-1;i>=0;i--){
      const earlyCatchAssist=state.phaseIndex<3?18:(state.phaseIndex<6?12:8);
      if(!owl.carrying&&owl.dive&&state.mice[i].hidden<=0&&collide(owl,state.mice[i],earlyCatchAssist)){catchMouse(i);break}
    }
    for(let i=state.rivals.length-1;i>=0;i--){
      const rival=state.rivals[i];
      if(collide(owl,rival,-5)){
        if(atNest||owl.flightState==='perched'){rival.vx+=(rival.x-owl.x)*2;rival.vy+=(rival.y-owl.y)*2}
        else if(owl.dive||stats.ability==='intimidate')scareRival(i);
        else if(owl.carrying&&!rival.carrying){
          rival.carrying=owl.carrying;owl.carrying=null;rival.exitDir=rival.x<state.world.width*.5?-1:1;
          owl.invuln=.8;burst(owl.x,owl.y,rival.carrying.color,18,150);floater(owl.x,owl.y-28,'BEUTE GERAUBT','#ff9b78',17);
          haptic([30,25,45]);sfx('steal');updateHud();
        }else if(owl.invuln<=0)damage(rival);
        break;
      }
    }

    if(owl.carrying&&atNest)deliverPrey();

    if(!atNest&&owl.flightState!=='perched'&&owl.invuln<=0){
      for(const b of state.bats){if(collide(owl,b,-8)){damage(b);break}}
      if(owl.invuln<=0){
        for(const br of state.branches){
          const isStump=br.type==='stump';
          const radiusFactor={rock:.23,stump:.22,trunk:.2,thorn:.18,branch:.25}[br.type]||.22;
          const hazard={
            x:br.x+(isStump?br.w*.5:Math.cos(br.angle)*br.w*.5)*br.scale,
            y:br.y+(isStump?0:Math.sin(br.angle)*br.w*.5)*br.scale,
            r:Math.min(38,br.w*radiusFactor)*br.scale
          };
          if(collide(owl,hazard,-7)){damage(hazard);break}
        }
      }
    }

    for(let i=state.fireflies.length-1;i>=0;i--){
      if(collide(owl,state.fireflies[i],-9)){
        const f=state.fireflies[i];state.fireflies.splice(i,1);const fireflyEnergy=stats.ability==='fireflyBoost'?45:30;state.energy=Math.min(stats.maximumEnergy,state.energy+fireflyEnergy);state.time=Math.min(state.maxTime,state.time+2.5);
        burst(f.x,f.y,'#bffb8c',18,150);floater(f.x,f.y-20,'+KRAFT','#bffb8c',18);sfx('power');
      }
    }

    for(let i=state.particles.length-1;i>=0;i--){
      const p=state.particles[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=110*dt;p.vx*=Math.pow(.2,dt);p.spin+=dt*5;
      if(p.life<=0)state.particles.splice(i,1);
    }
    for(let i=state.floaters.length-1;i>=0;i--){
      const f=state.floaters[i];f.life-=dt;f.y-=38*dt;if(f.life<=0)state.floaters.splice(i,1);
    }
    for(let i=state.rings.length-1;i>=0;i--){
      const r=state.rings[i];r.life-=dt;
      if(r.hoot){const startRadius=18*state.gameScale,targetRadius=Math.max(startRadius,Number(r.targetRadius)||startRadius);r.r+=dt*(targetRadius-startRadius)/r.max}
      else r.r+=dt*260*state.gameScale;
      r.r=Math.max(0,r.r);if(r.life<=0)state.rings.splice(i,1);
    }

    updateHootResponses(dt);
    updateTutorialProgress();

    updateHud();
  }

  function roundRectPath(x,y,w,h,r){
    const rr=Math.min(r,w/2,h/2);
    ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
  }

  function drawTerrainBackdrop(terrain){
    const base=state.h*.76;
    if(terrain==='cliffs'){
      ctx.fillStyle='#202d34';ctx.beginPath();ctx.moveTo(0,base);
      for(let x=0;x<=state.w+120;x+=120)ctx.lineTo(x,base-45-(x/120%3)*32);
      ctx.lineTo(state.w,base);ctx.closePath();ctx.fill();return;
    }
    if(terrain==='marsh'){
      ctx.fillStyle='#263d38';
      for(let x=-80;x<state.w+100;x+=145){ctx.beginPath();ctx.ellipse(x,base,115,34,0,Math.PI,Math.PI*2);ctx.fill()}return;
    }
    if(terrain==='deadlands'){
      ctx.fillStyle='#33272d';ctx.beginPath();ctx.moveTo(0,base);
      for(let x=0;x<=state.w+90;x+=90)ctx.lineTo(x,base-28-(x/90%2)*46);
      ctx.lineTo(state.w,base);ctx.closePath();ctx.fill();return;
    }
    ctx.fillStyle=terrain==='autumn-hills'?'#45432c':(terrain==='deep-forest'?'#20372b':'#24382d');
    for(let i=0;i<8;i++){
      const x=i*state.w/7-90,peak=state.h*((terrain==='deep-forest' ? .51 : .55)+(i%3)*.025);
      ctx.beginPath();ctx.moveTo(x,base);ctx.quadraticCurveTo(x+100,peak,x+220,base);ctx.closePath();ctx.fill();
    }
  }

  function drawDistantTree(type,x,base,size){
    ctx.save();ctx.translate(x,base);ctx.globalAlpha=.95;
    if(type==='pine'){
      ctx.fillStyle='#14261d';for(let y=0;y<3;y++){ctx.beginPath();ctx.moveTo(0,-size+y*18);ctx.lineTo(-24-y*5,-15+y*18);ctx.lineTo(24+y*5,-15+y*18);ctx.closePath();ctx.fill()}
    }else if(type==='oak'){
      ctx.fillStyle='#263124';ctx.fillRect(-4,-size*.55,8,size*.55);ctx.beginPath();ctx.arc(0,-size*.65,size*.28,0,Math.PI*2);ctx.arc(-18,-size*.56,size*.22,0,Math.PI*2);ctx.arc(18,-size*.56,size*.22,0,Math.PI*2);ctx.fill();
    }else if(type==='birch'){
      ctx.fillStyle='#7d8580';ctx.fillRect(-3,-size*.7,6,size*.7);ctx.fillStyle='#25372a';ctx.beginPath();ctx.ellipse(0,-size*.72,size*.24,size*.32,0,0,Math.PI*2);ctx.fill();
    }else if(type==='willow'){
      ctx.fillStyle='#27362d';ctx.fillRect(-5,-size*.62,10,size*.62);ctx.beginPath();ctx.ellipse(0,-size*.7,size*.34,size*.22,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#334a3e';ctx.lineWidth=3;for(const ox of [-22,-10,10,22]){ctx.beginPath();ctx.moveTo(ox,-size*.68);ctx.quadraticCurveTo(ox*1.3,-size*.35,ox,-8);ctx.stroke()}
    }else{
      ctx.strokeStyle='#241b20';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-size*.72);ctx.lineTo(-20,-size);ctx.moveTo(0,-size*.55);ctx.lineTo(25,-size*.82);ctx.moveTo(-2,-size*.38);ctx.lineTo(-28,-size*.58);ctx.stroke();
    }
    ctx.restore();
  }

  function drawNestTree(){
    const n=nest(),s=state.gameScale,types=currentPhase().treeTypes;
    const type=types[0]||'oak';
    const baseY=state.groundY+18,branchY=n.y+25*s,height=Math.max(70*s,baseY-branchY);
    const bark=type==='birch'?['#aeb3ad','#4f5551']:(type==='dead'?['#4b3833','#241d1c']:['#775035','#30231c']);
    ctx.save();
    const nestLight=ctx.createRadialGradient(n.x,n.y,5*s,n.x,n.y,150*s);nestLight.addColorStop(0,'rgba(255,222,142,.22)');nestLight.addColorStop(1,'rgba(255,222,142,0)');ctx.fillStyle=nestLight;ctx.beginPath();ctx.arc(n.x,n.y,150*s,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=.88;ctx.lineCap='round';ctx.lineJoin='round';

    // Stamm und Wurzeln: reine Hintergrundgrafik, ohne Kollisionsobjekt.
    const trunk=ctx.createLinearGradient(n.x-24*s,0,n.x+24*s,0);trunk.addColorStop(0,bark[1]);trunk.addColorStop(.42,bark[0]);trunk.addColorStop(1,bark[1]);
    ctx.fillStyle=trunk;ctx.strokeStyle='#211916';ctx.lineWidth=4*s;ctx.beginPath();
    ctx.moveTo(n.x-25*s,baseY);ctx.bezierCurveTo(n.x-17*s,baseY-height*.45,n.x-15*s,branchY+height*.18,n.x-10*s,branchY);
    ctx.lineTo(n.x+10*s,branchY);ctx.bezierCurveTo(n.x+17*s,branchY+height*.2,n.x+20*s,baseY-height*.4,n.x+28*s,baseY);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle=bark[1];ctx.lineWidth=12*s;ctx.beginPath();ctx.moveTo(n.x-8*s,baseY-4*s);ctx.lineTo(n.x-48*s,baseY+12*s);ctx.moveTo(n.x+9*s,baseY-4*s);ctx.lineTo(n.x+50*s,baseY+12*s);ctx.stroke();

    // Breiter Ast und zwei Stützen tragen das Nest sichtbar.
    ctx.strokeStyle='#211916';ctx.lineWidth=22*s;ctx.beginPath();ctx.moveTo(n.x-70*s,branchY);ctx.quadraticCurveTo(n.x,branchY+5*s,n.x+70*s,branchY);ctx.stroke();
    ctx.strokeStyle=bark[0];ctx.lineWidth=14*s;ctx.stroke();
    ctx.strokeStyle=bark[1];ctx.lineWidth=11*s;ctx.beginPath();ctx.moveTo(n.x-4*s,branchY+55*s);ctx.lineTo(n.x-54*s,branchY+2*s);ctx.moveTo(n.x+4*s,branchY+48*s);ctx.lineTo(n.x+56*s,branchY+1*s);ctx.stroke();

    if(type==='birch'){
      ctx.strokeStyle='rgba(41,45,43,.72)';ctx.lineWidth=3*s;for(let y=branchY+38*s;y<baseY-18*s;y+=28*s){ctx.beginPath();ctx.moveTo(n.x-14*s,y);ctx.lineTo(n.x+5*s,y-4*s);ctx.stroke()}
    }
    if(type==='pine'){
      ctx.fillStyle='#193126';for(const side of [-1,1])for(let i=0;i<3;i++){const ox=side*(45+i*13)*s,oy=branchY-(9+i*19)*s;ctx.beginPath();ctx.moveTo(n.x+side*12*s,branchY-2*s);ctx.lineTo(n.x+ox,oy);ctx.lineTo(n.x+side*(30+i*8)*s,branchY+17*s);ctx.closePath();ctx.fill()}
    }else if(type==='willow'){
      ctx.fillStyle='#334d38';for(const [ox,oy,r] of [[-58,-18,25],[58,-20,27],[-34,-43,23],[35,-45,24]]){ctx.beginPath();ctx.ellipse(n.x+ox*s,branchY+oy*s,r*s,r*.65*s,0,0,Math.PI*2);ctx.fill()}
      ctx.strokeStyle='#49674c';ctx.lineWidth=3*s;for(const ox of [-72,-48,45,70]){ctx.beginPath();ctx.moveTo(n.x+ox*s,branchY-20*s);ctx.quadraticCurveTo(n.x+ox*1.15*s,branchY+34*s,n.x+ox*s,branchY+62*s);ctx.stroke()}
    }else if(type!=='dead'){
      ctx.fillStyle=type==='oak'?'#36533a':'#425438';for(const [ox,oy,r] of [[-58,-22,27],[58,-24,28],[-35,-48,25],[36,-50,26]]){ctx.beginPath();ctx.arc(n.x+ox*s,branchY+oy*s,r*s,0,Math.PI*2);ctx.fill()}
    }else{
      ctx.strokeStyle=bark[1];ctx.lineWidth=8*s;ctx.beginPath();ctx.moveTo(n.x-35*s,branchY);ctx.lineTo(n.x-77*s,branchY-44*s);ctx.lineTo(n.x-67*s,branchY-67*s);ctx.moveTo(n.x+34*s,branchY);ctx.lineTo(n.x+76*s,branchY-50*s);ctx.lineTo(n.x+68*s,branchY-73*s);ctx.stroke();
    }
    ctx.restore();
  }

  function drawBackground(){
    const dawn=clamp(1-state.time/state.maxTime,0,1);
    const theme=currentPhase().theme;
    const sky=ctx.createLinearGradient(0,0,0,state.h);
    sky.addColorStop(0,`rgb(${Math.round(13+62*dawn)},${Math.round(23+43*dawn)},${Math.round(49+45*dawn)})`);
    sky.addColorStop(.55,`rgb(${Math.round(54+92*dawn)},${Math.round(43+52*dawn)},${Math.round(82+42*dawn)})`);
    sky.addColorStop(.72,'#29402f');sky.addColorStop(1,'#101d17');
    ctx.fillStyle=sky;ctx.fillRect(0,0,state.w,state.h);
    const washes={mist:'rgba(119,151,161,.13)',storm:'rgba(22,31,64,.2)',gold:'rgba(126,83,25,.1)',blood:'rgba(105,12,28,.2)'};
    if(washes[theme]){ctx.fillStyle=washes[theme];ctx.fillRect(0,0,state.w,state.h)}

    for(const s of state.stars){
      const tw=.55+.45*Math.sin(state.elapsed*1.8+s.p);
      ctx.globalAlpha=s.a*tw*(1-dawn*.86);ctx.fillStyle='#fff8d7';ctx.beginPath();ctx.arc(s.x*state.w,s.y*state.h,s.s,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;

    const mx=state.w*.82,my=state.h*.16,s=state.gameScale;
    const moonColors={gold:'#ffd469',blood:'#ff8175',storm:'#b8c9e5',mist:'#dce8e5'};
    ctx.shadowColor=theme==='blood'?'rgba(255,80,72,.6)':'rgba(255,236,174,.55)';ctx.shadowBlur=30*s;ctx.fillStyle=moonColors[theme]||'#ffedb6';ctx.beginPath();ctx.arc(mx,my,42*s,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle='rgba(31,39,62,.18)';ctx.beginPath();ctx.arc(mx+13*s,my-7*s,38*s,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(83,76,66,.16)';for(const [ox,oy,r] of [[-14,-13,7],[8,14,5],[-18,17,3]]){ctx.beginPath();ctx.arc(mx+ox*s,my+oy*s,r*s,0,Math.PI*2);ctx.fill()}

    for(const c of state.clouds){
      c.x=(c.x+c.v*.016)%1.2;
      ctx.globalAlpha=c.a;ctx.fillStyle='#d7e0ef';
      const x=(c.x-.1)*state.w,y=c.y*state.h,w=190*c.s*s,h=42*c.s*s;
      ctx.beginPath();ctx.ellipse(x,y,w*.55,h*.6,0,0,Math.PI*2);ctx.ellipse(x+w*.32,y-12*c.s,w*.35,h*.8,0,0,Math.PI*2);ctx.ellipse(x+w*.58,y,w*.42,h*.58,0,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;

    drawTerrainBackdrop(currentPhase().terrain);

    // Levelabhängige Baumlinie
    const treeTypes=currentPhase().treeTypes;
    for(let x=-20,i=0;x<state.w+60;x+=58,i++){
      drawDistantTree(treeTypes[i%treeTypes.length],x+28,state.groundY,64+(i%3)*15);
    }

    const ground=ctx.createLinearGradient(0,state.h*.68,0,state.h),groundColors={mist:['#344d47','#142522'],storm:['#263c38','#0d1918'],gold:['#4a4b2c','#1b2115'],blood:['#432d32','#1e1218']}[theme]||['#2b4933','#102016'];
    ground.addColorStop(0,groundColors[0]);ground.addColorStop(1,groundColors[1]);ctx.fillStyle=ground;ctx.fillRect(0,state.h*.70,state.w,state.h*.30);
    drawNestTree();

    ctx.strokeStyle='rgba(131,177,119,.35)';ctx.lineWidth=1.4;
    for(const g of state.grass){
      const x=g.x*state.w,y=state.groundY+4,wave=Math.sin(state.elapsed*2+g.b)*3;
      ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+wave,y-g.h*.55,x+wave*.5,y-g.h);ctx.stroke();
    }

    // leichter Bodennebel
    const fogStrength=theme==='mist' ? .24 : (theme==='storm' ? .12 : .08),fog=ctx.createLinearGradient(0,state.h*.48,0,state.groundY);
    fog.addColorStop(0,'rgba(201,220,224,0)');fog.addColorStop(.65,`rgba(201,220,224,${fogStrength})`);fog.addColorStop(1,'rgba(201,220,224,.02)');
    ctx.fillStyle=fog;ctx.fillRect(0,state.h*.52,state.w,state.h*.34);
    if(theme==='storm'){
      const flash=Math.pow(Math.max(0,Math.sin(state.elapsed*.83)),36)*.12;
      if(flash>.002){ctx.fillStyle=`rgba(196,220,255,${flash})`;ctx.fillRect(0,0,state.w,state.h)}
    }
  }

  function drawStoryGuests(){
    const chapter=chapterForLevel().id;if(chapter!=='epilogue'&&chapter!=='prologue')return;
    const n=nest(),s=state.gameScale,side=n.x<state.world.width*.5?1:-1,perchY=n.y+28*s;
    ctx.save();ctx.strokeStyle='#2a1b12';ctx.lineWidth=12*s;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(n.x+side*72*s,perchY);ctx.lineTo(n.x+side*230*s,perchY+5*s);ctx.stroke();ctx.strokeStyle='#795034';ctx.lineWidth=7*s;ctx.stroke();
    const guests=chapter==='prologue'?[{offset:112,size:.54,body:'#716454',face:'#d9c7a4'}]:[{offset:104,size:.46,body:'#d0b18c',face:'#ead8b8'},{offset:154,size:.58,body:'#745239',face:'#b8875c'},{offset:208,size:.42,body:'#83906b',face:'#bdc59b'}];
    for(const [index,guest] of guests.entries()){
      const x=n.x+side*guest.offset*s,y=perchY-18*s+Math.sin(state.elapsed*3+index)*1.5*s,scale=s*guest.size;ctx.save();ctx.translate(x,y);ctx.scale(side*scale,scale);ctx.strokeStyle='#191713';ctx.lineWidth=5;ctx.fillStyle=guest.body;ctx.beginPath();ctx.ellipse(0,7,21,28,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle=guest.face;ctx.beginPath();ctx.ellipse(0,-13,24,20,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#f8edcd';for(const ex of [-8,8]){ctx.beginPath();ctx.arc(ex,-14,7,0,Math.PI*2);ctx.fill();ctx.stroke()}ctx.fillStyle='#17202a';for(const ex of [-8,8]){ctx.beginPath();ctx.arc(ex,-14,2.5,0,Math.PI*2);ctx.fill()}ctx.fillStyle='#dfaa3b';ctx.beginPath();ctx.moveTo(0,-7);ctx.lineTo(-5,1);ctx.lineTo(6,1);ctx.closePath();ctx.fill();ctx.restore();
    }
    ctx.restore();
  }

  function drawNest(){
    const n=nest();
    if(state.running&&owlInNest()){
      const pulse=.7+Math.sin(state.elapsed*5)*.12,shield=ctx.createRadialGradient(n.x,n.y,n.r*.45,n.x,n.y,n.r*1.45);
      shield.addColorStop(0,'rgba(130,231,255,.03)');shield.addColorStop(.72,`rgba(130,231,255,${.13*pulse})`);shield.addColorStop(1,'rgba(130,231,255,0)');
      ctx.fillStyle=shield;ctx.beginPath();ctx.arc(n.x,n.y,n.r*1.5,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=`rgba(130,231,255,${.55*pulse})`;ctx.lineWidth=3*state.gameScale;ctx.beginPath();ctx.arc(n.x,n.y,n.r*1.18,0,Math.PI*2);ctx.stroke();
    }
    ctx.save();ctx.translate(n.x,n.y);ctx.scale(state.gameScale,state.gameScale);
    ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=15;ctx.shadowOffsetY=8;
    ctx.strokeStyle='#20150d';ctx.lineWidth=6;ctx.lineCap='round';
    for(let i=0;i<18;i++){
      const a=-Math.PI*.94+i/17*Math.PI*.88;
      const x=Math.cos(a)*52,y=Math.sin(a)*25+15;
      ctx.strokeStyle=i%2?'#6e4324':'#8c5930';ctx.beginPath();ctx.moveTo(-x*.75,12+y*.15);ctx.lineTo(x,18+y);ctx.stroke();
    }
    ctx.shadowBlur=0;ctx.fillStyle='#5b361f';ctx.beginPath();ctx.ellipse(0,22,58,26,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#20150d';ctx.lineWidth=5;ctx.stroke();

    const hunger=1-clamp(state.phaseDelivered/currentPhase().target,0,1);
    for(const [i,x] of [-20,0,20].entries()){
      const bob=Math.sin(state.elapsed*5+i*1.7)*2*hunger;
      ctx.save();ctx.translate(x,bob);
      ctx.fillStyle='#9b6a45';ctx.strokeStyle='#20150d';ctx.lineWidth=3;
      ctx.beginPath();ctx.ellipse(0,8,12,17,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(-11,-2);ctx.lineTo(-8,-18);ctx.lineTo(-1,-10);ctx.lineTo(8,-18);ctx.lineTo(11,-2);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#d9b37a';ctx.beginPath();ctx.ellipse(0,-3,10,9,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#fff4d2';for(const eyeX of [-4,4]){ctx.beginPath();ctx.arc(eyeX,-5,3,0,Math.PI*2);ctx.fill()}
      ctx.fillStyle='#17130f';for(const eyeX of [-4,4]){ctx.beginPath();ctx.arc(eyeX,-5,1.4,0,Math.PI*2);ctx.fill()}
      ctx.fillStyle='#f0c65c';ctx.beginPath();ctx.moveTo(-5,0);ctx.lineTo(0,7+5*hunger);ctx.lineTo(5,0);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#8b3f3f';ctx.beginPath();ctx.ellipse(0,5,2.8,4*hunger,0,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    const progress=clamp(state.phaseDelivered/currentPhase().target,0,1),ringR=n.r+9*state.gameScale;
    ctx.save();ctx.lineCap='round';ctx.lineWidth=5*state.gameScale;
    ctx.strokeStyle='rgba(255,255,255,.13)';ctx.beginPath();ctx.arc(n.x,n.y,ringR,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#ffd469';ctx.beginPath();ctx.arc(n.x,n.y,ringR,-Math.PI/2,-Math.PI/2+Math.PI*2*progress);ctx.stroke();
    ctx.fillStyle='#fff4cf';ctx.strokeStyle='rgba(7,10,16,.8)';ctx.lineWidth=4*state.gameScale;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`900 ${Math.max(10,14*state.gameScale)}px system-ui`;
    const progressText=`${state.phaseDelivered}/${currentPhase().target}`;ctx.strokeText(progressText,n.x,n.y+42*state.gameScale);ctx.fillText(progressText,n.x,n.y+42*state.gameScale);ctx.restore();

    if(owl.carrying){
      ctx.strokeStyle='rgba(255,212,105,.42)';ctx.lineWidth=3;ctx.setLineDash([8,9]);ctx.beginPath();ctx.moveTo(owl.x,owl.y);ctx.quadraticCurveTo((owl.x+n.x)/2,Math.min(owl.y,n.y)-75,n.x,n.y);ctx.stroke();ctx.setLineDash([]);
    }
  }

  function drawRockObstacle(obstacle){
    ctx.save();ctx.translate(obstacle.x+Math.cos(obstacle.angle)*obstacle.w*.5*obstacle.scale,obstacle.y+Math.sin(obstacle.angle)*obstacle.w*.5*obstacle.scale);ctx.rotate(obstacle.angle);ctx.scale(obstacle.scale,obstacle.scale);
    const r=obstacle.w*.23,gradient=ctx.createLinearGradient(-r,-r,r,r);gradient.addColorStop(0,'#718087');gradient.addColorStop(1,'#29343a');
    ctx.fillStyle=gradient;ctx.strokeStyle='#182126';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-r,-r*.2);ctx.lineTo(-r*.5,-r*.85);ctx.lineTo(r*.45,-r*.72);ctx.lineTo(r,r*.1);ctx.lineTo(r*.42,r*.78);ctx.lineTo(-r*.62,r*.66);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(200,218,218,.25)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-r*.45,-r*.35);ctx.lineTo(r*.2,-r*.48);ctx.stroke();
    ctx.fillStyle='rgba(113,150,105,.35)';for(const [x,y,size] of [[-r*.35,r*.12,7],[r*.18,-r*.2,5],[r*.45,r*.22,4]]){ctx.beginPath();ctx.arc(x,y,size,0,Math.PI*2);ctx.fill()}ctx.restore();
  }

  function drawStumpObstacle(obstacle){
    ctx.save();ctx.translate(obstacle.x+obstacle.w*.5*obstacle.scale,obstacle.y);ctx.rotate(obstacle.angle);ctx.scale(obstacle.scale,obstacle.scale);
    const w=obstacle.w*.48;ctx.fillStyle='#68412b';ctx.strokeStyle='#211611';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-w,-24);ctx.lineTo(w,-20);ctx.lineTo(w*.82,22);ctx.lineTo(w*.35,16);ctx.lineTo(0,30);ctx.lineTo(-w*.35,16);ctx.lineTo(-w,23);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#9a6740';ctx.beginPath();ctx.ellipse(0,-22,w,12,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle='#5b3826';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-22,w*.72,8,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(0,-22,w*.38,4,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle='rgba(97,137,76,.45)';ctx.beginPath();ctx.arc(-w*.55,-18,8,0,Math.PI*2);ctx.fill();ctx.restore();
  }

  function drawTrunkObstacle(obstacle){
    ctx.save();ctx.translate(obstacle.x,obstacle.y);ctx.rotate(obstacle.angle);ctx.scale(obstacle.scale,obstacle.scale);
    ctx.strokeStyle='#21150f';ctx.lineWidth=30;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(obstacle.w,0);ctx.stroke();ctx.strokeStyle='#70452d';ctx.lineWidth=21;ctx.stroke();
    ctx.fillStyle='#9b6946';ctx.strokeStyle='#21150f';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(obstacle.w,0,12,16,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle='#66422f';ctx.beginPath();ctx.arc(obstacle.w,0,7,0,Math.PI*2);ctx.stroke();ctx.restore();
  }

  function drawThornObstacle(obstacle){
    ctx.save();ctx.translate(obstacle.x,obstacle.y);ctx.rotate(obstacle.angle);ctx.scale(obstacle.scale,obstacle.scale);
    ctx.strokeStyle='#1b130f';ctx.lineWidth=20;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(obstacle.w,0);ctx.stroke();ctx.strokeStyle='#70402d';ctx.lineWidth=12;ctx.stroke();
    ctx.fillStyle='#d4b28d';ctx.strokeStyle='#33221a';ctx.lineWidth=2;
    for(let x=14;x<obstacle.w-8;x+=22){const up=(x/22)%2<1;ctx.beginPath();ctx.moveTo(x-5,0);ctx.lineTo(x,up?-18:18);ctx.lineTo(x+5,0);ctx.closePath();ctx.fill();ctx.stroke()}
    ctx.restore();
  }

  function drawBranch(br){
    if(br.type==='rock'){drawRockObstacle(br);return}
    if(br.type==='stump'){drawStumpObstacle(br);return}
    if(br.type==='trunk'){drawTrunkObstacle(br);return}
    if(br.type==='thorn'){drawThornObstacle(br);return}
    ctx.save();ctx.translate(br.x,br.y);ctx.rotate(br.angle+Math.sin(state.elapsed*1.2+br.sway)*.015);ctx.scale(br.scale,br.scale);
    ctx.lineCap='round';ctx.strokeStyle='#17100c';ctx.lineWidth=26;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(br.w,0);ctx.stroke();
    ctx.strokeStyle='#6e452d';ctx.lineWidth=18;ctx.stroke();
    ctx.strokeStyle='#17100c';ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(br.w*.55,0);ctx.lineTo(br.w*.72,-36);ctx.stroke();
    ctx.strokeStyle='#6e452d';ctx.lineWidth=7;ctx.stroke();
    ctx.fillStyle='#325b34';ctx.strokeStyle='#172818';ctx.lineWidth=3;
    for(const [x,y,r] of [[br.w*.72,-38,13],[br.w*.58,-24,10],[br.w*.84,-24,11]]){ctx.beginPath();ctx.ellipse(x,y,r*1.25,r,.4,0,Math.PI*2);ctx.fill();ctx.stroke()}
    ctx.restore();
  }

  function drawSafePerch(perch){
    const width=Math.min(perch.width,230*state.gameScale),active=owl.targetPerchId===perch.id||owl.perchId===perch.id;ctx.save();ctx.translate(perch.x,perch.y);ctx.lineCap='round';
    if(active){ctx.strokeStyle='rgba(169,215,176,.42)';ctx.lineWidth=10*state.gameScale;ctx.beginPath();ctx.ellipse(0,-owl.r*.72,width*.42,34*state.gameScale,0,0,Math.PI*2);ctx.stroke()}
    ctx.strokeStyle='#172018';ctx.lineWidth=18*state.gameScale;ctx.beginPath();ctx.moveTo(-width*.5,0);ctx.quadraticCurveTo(0,7*state.gameScale,width*.5,0);ctx.stroke();
    ctx.strokeStyle='#8d7950';ctx.lineWidth=11*state.gameScale;ctx.stroke();ctx.strokeStyle='#a9d7b0';ctx.lineWidth=3*state.gameScale;ctx.setLineDash([8*state.gameScale,10*state.gameScale]);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#dfff8d';for(const side of [-1,1]){ctx.beginPath();ctx.ellipse(side*width*.34,-8*state.gameScale,8*state.gameScale,4*state.gameScale,side*.35,0,Math.PI*2);ctx.fill()}ctx.restore();
  }

  function drawDirectionGuide(){
    const bounds=camera.bounds(0),target=owl.carrying?nest():state.world.goal;if(target.x>=bounds.left&&target.x<=bounds.right)return;
    const right=target.x>camera.centerX,x=right?state.w-20:20,y=state.h*.48;ctx.save();ctx.translate(x,y);ctx.scale(right?1:-1,1);ctx.fillStyle=owl.carrying?'rgba(169,215,176,.94)':'rgba(242,213,138,.9)';ctx.strokeStyle='#0a1020';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-8,-10);ctx.lineTo(-3,0);ctx.lineTo(-8,10);ctx.closePath();ctx.fill();ctx.stroke();if(owl.carrying){ctx.beginPath();ctx.arc(-4,0,5,0,Math.PI);ctx.stroke()}ctx.restore();
  }

  function drawBush(bush){
    const s=bush.size,wave=Math.sin(state.elapsed*1.8+bush.phase)*2*state.gameScale;
    ctx.save();ctx.translate(bush.x,bush.y);ctx.globalAlpha=.92;
    ctx.strokeStyle='#13251a';ctx.fillStyle='#294b31';ctx.lineWidth=3*state.gameScale;
    for(const [ox,oy,r] of [[-s*.48,-s*.3,.48],[0,-s*.5,.62],[s*.48,-s*.28,.46]]){ctx.beginPath();ctx.arc(ox+wave,oy,s*r,0,Math.PI*2);ctx.fill();ctx.stroke()}
    ctx.fillStyle='#3f6a43';for(const [ox,oy] of [[-s*.32,-s*.55],[s*.2,-s*.72],[s*.48,-s*.38]]){ctx.beginPath();ctx.arc(ox+wave,oy,s*.18,0,Math.PI*2);ctx.fill()}
    ctx.strokeStyle='rgba(112,159,101,.46)';ctx.lineWidth=1.4*state.gameScale;for(let i=0;i<7;i++){const a=-2.8+i*.75,rx=Math.cos(a)*s*.58+wave,ry=-s*.42+Math.sin(a)*s*.35;ctx.beginPath();ctx.moveTo(rx-s*.1,ry);ctx.quadraticCurveTo(rx,ry-s*.16,rx+s*.12,ry);ctx.stroke()}
    if(bush.berries){ctx.fillStyle='#d85f6b';for(const [ox,oy] of [[-s*.2,-s*.45],[s*.12,-s*.34],[s*.34,-s*.52]]){ctx.beginPath();ctx.arc(ox,oy,3*state.gameScale,0,Math.PI*2);ctx.fill()}}
    ctx.restore();
  }

  function drawGroundDetail(detail){
    ctx.save();ctx.translate(detail.x,detail.y);ctx.rotate(detail.angle);ctx.scale(detail.scale,detail.scale);ctx.globalAlpha=.72;
    ctx.fillStyle='rgba(4,10,8,.28)';ctx.beginPath();ctx.ellipse(0,4,18,5,0,0,Math.PI*2);ctx.fill();
    if(detail.type==='stone'){
      const colors=['#5f6861','#6f7168','#4e5b58'];ctx.fillStyle=colors[detail.variant];ctx.strokeStyle='#303a36';ctx.lineWidth=2.5;
      ctx.beginPath();ctx.moveTo(-15,3);ctx.quadraticCurveTo(-12,-10,-3,-12);ctx.quadraticCurveTo(10,-11,16,2);ctx.quadraticCurveTo(8,8,-13,6);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(210,220,198,.2)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-7,-6);ctx.quadraticCurveTo(0,-10,7,-6);ctx.stroke();
    }else if(detail.type==='twig'){
      ctx.strokeStyle=detail.variant===1?'#745039':'#5c402f';ctx.lineCap='round';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-22,5);ctx.quadraticCurveTo(-3,-4,23,1);ctx.moveTo(-3,-1);ctx.lineTo(5,-12);ctx.moveTo(9,0);ctx.lineTo(17,-8);ctx.stroke();
      ctx.strokeStyle='rgba(195,143,91,.38)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-19,3);ctx.quadraticCurveTo(-2,-4,19,0);ctx.stroke();
    }else if(detail.type==='leaf'){
      const colors=['#a4683c','#8e7338','#6d8443'];ctx.fillStyle=colors[detail.variant];ctx.strokeStyle='#3c492d';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(-16,0);ctx.quadraticCurveTo(-2,-13,15,-2);ctx.quadraticCurveTo(1,11,-16,0);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-12,0);ctx.lineTo(18,-3);ctx.stroke();
    }else if(detail.type==='mushroom'){
      ctx.fillStyle='#c9b98f';ctx.fillRect(-3,-7,6,12);ctx.fillStyle=detail.variant===2?'#9d5d57':'#9b7654';ctx.strokeStyle='#44382f';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.arc(0,-8,10,Math.PI,Math.PI*2);ctx.lineTo(-10,-8);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='rgba(245,224,181,.7)';for(const x of [-5,2,6]){ctx.beginPath();ctx.arc(x,-10-Math.abs(x%3),1.3,0,Math.PI*2);ctx.fill()}
    }else if(detail.type==='pinecone'){
      ctx.fillStyle='#76513a';ctx.strokeStyle='#37281f';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(0,-2,8,15,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.strokeStyle='#ad7950';for(let y=-11;y<=7;y+=6){ctx.beginPath();ctx.moveTo(-6,y);ctx.lineTo(0,y+4);ctx.lineTo(6,y);ctx.stroke()}
    }else{
      ctx.strokeStyle='#5c8055';ctx.lineWidth=2.5;ctx.lineCap='round';for(const x of [-7,0,7]){ctx.beginPath();ctx.moveTo(x,5);ctx.quadraticCurveTo(x+(x?4:-3),-7,x+(x?1:4),-19-detail.variant*3);ctx.stroke()}
      ctx.fillStyle='#6a5238';ctx.beginPath();ctx.ellipse(-5,-10,2,6,-.2,0,Math.PI*2);ctx.ellipse(6,-14,2,6,.2,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }

  function drawGroundShadow(x,y,width,alpha=.26){
    ctx.save();ctx.fillStyle=`rgba(2,7,6,${alpha})`;ctx.beginPath();ctx.ellipse(x,y+14*state.gameScale,width*state.gameScale,6*state.gameScale,0,0,Math.PI*2);ctx.fill();ctx.restore();
  }

  function drawMouse(m){
    const s=state.gameScale;
    ctx.save();ctx.translate(m.x,m.y+Math.sin(m.phase)*2*s);ctx.scale(-m.dir*s,s);
    if(m.type==='gold'){
      ctx.globalAlpha=.23+.12*Math.sin(m.glow);ctx.fillStyle=m.color;ctx.beginPath();ctx.arc(0,0,m.r/s*2.4,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    }
    ctx.strokeStyle='#17191d';ctx.lineWidth=4;ctx.lineJoin='round';
    ctx.fillStyle=m.color;ctx.beginPath();ctx.ellipse(0,0,24,15,-.04,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle=m.type==='swift'?'#e79b85':(m.type==='gold'?'#ffe89b':'#c8cbd2');ctx.beginPath();ctx.arc(-19,1,11,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle=m.type==='gold'?'#f4a868':'#dd9eaa';ctx.beginPath();ctx.arc(-18,-9,6,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-22,0,2.4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#f294a4';ctx.beginPath();ctx.arc(-30,4,2.5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(244,226,211,.7)';ctx.lineWidth=1.2;for(const y of [1,5]){ctx.beginPath();ctx.moveTo(-27,y);ctx.lineTo(-43,y-4);ctx.moveTo(-27,y+1);ctx.lineTo(-42,y+6);ctx.stroke()}
    ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.ellipse(-5,-6,11,4,-.15,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=m.type==='gold'?'#efbd55':'#d695a2';ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(22,1);ctx.quadraticCurveTo(50,-18,57,5);ctx.stroke();
    const leg=Math.sin(m.phase)*6;ctx.strokeStyle='#17191d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-3,12);ctx.lineTo(-10+leg,20);ctx.moveTo(14,11);ctx.lineTo(21-leg,19);ctx.stroke();
    if(m.type==='gold'){
      ctx.fillStyle='#fff0a9';for(let i=0;i<3;i++){const a=state.elapsed*2+i*2.1;ctx.beginPath();ctx.arc(Math.cos(a)*30,Math.sin(a)*18,2.5,0,Math.PI*2);ctx.fill()}
    }
    ctx.restore();
  }

  function drawRabbit(r){
    const s=state.gameScale,hop=Math.abs(Math.sin(r.phase*.5))*10*s;
    ctx.save();ctx.translate(r.x,r.y-hop);ctx.scale(-r.dir*s,s);
    ctx.fillStyle=r.color;ctx.strokeStyle='#201b18';ctx.lineWidth=4;ctx.lineJoin='round';
    ctx.beginPath();ctx.ellipse(2,2,27,17,-.08,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.arc(-22,-5,14,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.ellipse(-28,-25,6,19,-.18,0,Math.PI*2);ctx.ellipse(-17,-25,6,19,.15,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#fff4e2';ctx.beginPath();ctx.arc(28,0,8,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-27,-8,2.5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(240,179,180,.7)';ctx.beginPath();ctx.ellipse(-28,-25,2.3,12,-.18,0,Math.PI*2);ctx.ellipse(-17,-25,2.3,12,.15,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(245,231,213,.62)';ctx.lineWidth=1.2;for(const y of [-2,3]){ctx.beginPath();ctx.moveTo(-31,y);ctx.lineTo(-45,y-3);ctx.stroke()}
    ctx.strokeStyle='#8c6f56';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-5,14);ctx.lineTo(-14,22);ctx.moveTo(17,13);ctx.lineTo(28,20);ctx.stroke();ctx.restore();
  }

  function drawFrog(f){
    const s=state.gameScale,hop=Math.abs(Math.sin(f.phase*.42))*7*s;
    ctx.save();ctx.translate(f.x,f.y-hop);ctx.scale(-f.dir*s,s);
    ctx.fillStyle=f.color;ctx.strokeStyle='#17351d';ctx.lineWidth=4;
    ctx.beginPath();ctx.ellipse(0,4,23,14,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.arc(-11,-7,9,0,Math.PI*2);ctx.arc(11,-7,9,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#f5f0c9';ctx.beginPath();ctx.arc(-12,-9,4,0,Math.PI*2);ctx.arc(12,-9,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-14,-10,1.8,0,Math.PI*2);ctx.arc(10,-10,1.8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(30,83,42,.42)';for(const [x,y,r] of [[-8,5,3],[8,3,2.5],[1,9,2]]){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}ctx.strokeStyle='#194b28';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,1,9,.2,Math.PI-.2);ctx.stroke();
    ctx.strokeStyle='#3c8648';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-18,10);ctx.lineTo(-32,19);ctx.lineTo(-39,17);ctx.moveTo(18,10);ctx.lineTo(32,19);ctx.lineTo(39,17);ctx.stroke();ctx.restore();
  }

  function drawBeetle(b){
    const s=state.gameScale;
    ctx.save();ctx.translate(b.x,b.y);ctx.scale(-b.dir*s,s);
    ctx.strokeStyle='#102532';ctx.lineWidth=3;ctx.beginPath();
    for(const x of [-7,4,13]){ctx.moveTo(x,-7);ctx.lineTo(x-5,-18);ctx.moveTo(x,7);ctx.lineTo(x-5,18)}ctx.stroke();
    ctx.fillStyle=b.color;ctx.beginPath();ctx.ellipse(2,0,18,14,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(2,-13);ctx.lineTo(2,13);ctx.stroke();
    const shell=ctx.createLinearGradient(-8,-10,14,10);shell.addColorStop(0,'rgba(255,255,255,.28)');shell.addColorStop(.45,'rgba(255,255,255,0)');shell.addColorStop(1,'rgba(0,0,0,.22)');ctx.fillStyle=shell;ctx.beginPath();ctx.ellipse(4,0,14,10,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#203d4d';ctx.beginPath();ctx.arc(-15,0,8,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(-20,-5);ctx.lineTo(-29,-12);ctx.moveTo(-20,5);ctx.lineTo(-29,12);ctx.stroke();ctx.restore();
  }

  function drawGatherable(item){
    const s=state.gameScale,bob=Math.sin(item.phase*.35)*2*s;ctx.save();ctx.translate(item.x,item.y+bob);ctx.scale(s,s);
    if(item.type==='berry'){
      ctx.strokeStyle='#31512f';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-4);ctx.quadraticCurveTo(5,-18,16,-19);ctx.stroke();ctx.fillStyle='#5f8f4d';ctx.beginPath();ctx.ellipse(11,-18,8,4,-.35,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#d85f6b';ctx.strokeStyle='#572d3a';ctx.lineWidth=2;for(const [x,y] of [[-8,0],[2,-5],[10,2],[-1,7]]){ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fill();ctx.stroke()}
      ctx.fillStyle='rgba(255,213,218,.65)';ctx.beginPath();ctx.arc(-10,-2,1.7,0,Math.PI*2);ctx.arc(0,-7,1.7,0,Math.PI*2);ctx.fill();
    }else{
      ctx.strokeStyle='#3e7544';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,12);ctx.lineTo(0,-16);ctx.moveTo(0,-5);ctx.lineTo(-13,-13);ctx.moveTo(0,1);ctx.lineTo(14,-8);ctx.stroke();ctx.fillStyle='#8fcf83';for(const [x,y,a] of [[-14,-14,-.5],[15,-9,.45],[-7,-2,-.35],[8,-18,.4]]){ctx.beginPath();ctx.ellipse(x,y,9,4,a,0,Math.PI*2);ctx.fill()}ctx.fillStyle='#dfff8d';ctx.beginPath();ctx.arc(0,-18,3,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }

  function drawBundle(item){
    const s=state.gameScale,bob=Math.sin(item.phase*.35)*1.5*s;ctx.save();ctx.translate(item.x,item.y+bob);ctx.scale(s,s);ctx.fillStyle='rgba(3,8,7,.25)';ctx.beginPath();ctx.ellipse(0,12,22,6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=item.color;ctx.strokeStyle='#3f2b1d';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(-19,-13,38,27,7);ctx.fill();ctx.stroke();ctx.strokeStyle='#f0d49a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-13);ctx.lineTo(0,14);ctx.moveTo(-19,0);ctx.lineTo(19,0);ctx.stroke();ctx.fillStyle='#f0d49a';ctx.beginPath();ctx.moveTo(0,-1);ctx.quadraticCurveTo(-13,-17,-15,-5);ctx.quadraticCurveTo(-10,2,0,3);ctx.quadraticCurveTo(13,-17,15,-5);ctx.quadraticCurveTo(10,2,0,3);ctx.fill();ctx.strokeStyle='rgba(255,245,205,.45)';ctx.lineWidth=2;ctx.stroke();ctx.restore();
  }

  function drawPrey(prey){
    ctx.save();if(prey.hidden>0)ctx.globalAlpha=.22;drawGroundShadow(prey.x,prey.y,prey.type==='rabbit'?28:19,prey.hidden>0?.08:.22);
    if(prey.type==='rabbit')drawRabbit(prey);
    else if(prey.type==='frog')drawFrog(prey);
    else if(prey.type==='beetle')drawBeetle(prey);
    else if(prey.type==='berry'||prey.type==='herb')drawGatherable(prey);
    else if(prey.type==='bundle')drawBundle(prey);
    else drawMouse(prey);
    ctx.restore();
  }

  function drawBat(b){
    ctx.save();ctx.translate(b.x,b.y);ctx.scale(b.dir*state.gameScale,state.gameScale);
    const flap=Math.sin(b.phase)*12;
    ctx.fillStyle='#302943';ctx.strokeStyle='#111019';ctx.lineWidth=4;ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(0,4);ctx.quadraticCurveTo(-22,-26-flap,-48,-7);ctx.quadraticCurveTo(-30,-4,-20,14);ctx.lineTo(0,8);ctx.lineTo(20,14);ctx.quadraticCurveTo(30,-4,48,-7);ctx.quadraticCurveTo(22,-26-flap,0,4);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(146,124,168,.42)';ctx.lineWidth=2;for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side*4,4);ctx.lineTo(side*31,-11-flap*.45);ctx.lineTo(side*44,-5);ctx.moveTo(side*5,6);ctx.lineTo(side*28,8);ctx.stroke()}
    ctx.fillStyle='#574b68';ctx.beginPath();ctx.ellipse(0,6,11,15,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#574b68';ctx.beginPath();ctx.moveTo(-8,-5);ctx.lineTo(-5,-17);ctx.lineTo(0,-5);ctx.lineTo(5,-17);ctx.lineTo(8,-5);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#ef7671';ctx.beginPath();ctx.arc(-4,1,2,0,Math.PI*2);ctx.arc(4,1,2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#eee5dc';ctx.beginPath();ctx.moveTo(-4,7);ctx.lineTo(-1,13);ctx.lineTo(1,7);ctx.moveTo(1,7);ctx.lineTo(4,13);ctx.lineTo(6,7);ctx.fill();
    ctx.restore();
  }

  function drawRivalOwl(rival){
    const s=state.gameScale*(rival.elite?1.24:1),flap=Math.sin(rival.wing)*12;
    ctx.save();ctx.translate(rival.x,rival.y);ctx.scale(rival.dir*s,s);ctx.rotate(Math.atan2(rival.vy,Math.abs(rival.vx)||1)*.18);
    ctx.fillStyle=rival.elite?'#5b3f72':'#354253';ctx.strokeStyle='#10151d';ctx.lineWidth=5;ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(-12,0);ctx.quadraticCurveTo(-48,-35-flap,-72,-7);ctx.quadraticCurveTo(-45,-5,-30,25);ctx.lineTo(-7,18);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(12,0);ctx.quadraticCurveTo(48,-35-flap,72,-7);ctx.quadraticCurveTo(45,-5,30,25);ctx.lineTo(7,18);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle=rival.elite?'#76528f':'#4d5e70';ctx.beginPath();ctx.ellipse(0,7,28,35,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle=rival.elite?'#8d68a6':'#607286';ctx.beginPath();ctx.ellipse(0,-19,30,25,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#f0e8d6';for(const x of [-11,11]){ctx.beginPath();ctx.arc(x,-20,9,0,Math.PI*2);ctx.fill();ctx.stroke()}
    ctx.fillStyle='#ff6e68';for(const x of [-11,11]){ctx.beginPath();ctx.arc(x,-20,3.5,0,Math.PI*2);ctx.fill()}
    ctx.fillStyle='#d99835';ctx.beginPath();ctx.moveTo(0,-11);ctx.lineTo(-7,0);ctx.lineTo(8,0);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle=rival.elite?'rgba(231,197,255,.5)':'rgba(177,198,213,.34)';ctx.lineWidth=2.2;for(const side of [-1,1])for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(side*(10+i*6),8+i*7);ctx.quadraticCurveTo(side*(20+i*5),14+i*5,side*(24+i*5),25+i*4);ctx.stroke()}
    ctx.strokeStyle='#241b29';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-20,-31);ctx.lineTo(-5,-25);ctx.moveTo(20,-31);ctx.lineTo(5,-25);ctx.stroke();
    if(rival.elite){
      ctx.fillStyle='#ffd469';ctx.beginPath();ctx.moveTo(-20,-40);ctx.lineTo(-13,-55);ctx.lineTo(0,-43);ctx.lineTo(13,-55);ctx.lineTo(20,-40);ctx.closePath();ctx.fill();ctx.stroke();
      for(let i=0;i<2;i++){ctx.fillStyle=i<rival.hits?'#c99cff':'rgba(255,255,255,.16)';ctx.beginPath();ctx.arc(-6+i*12,34,4,0,Math.PI*2);ctx.fill()}
    }
    if(rival.carrying){ctx.fillStyle=rival.carrying.color;ctx.beginPath();ctx.ellipse(0,43,14,9,0,0,Math.PI*2);ctx.fill();ctx.stroke()}
    ctx.restore();
  }

  function drawFirefly(f){
    const pulse=.65+.35*Math.sin(f.phase*2);
    ctx.save();ctx.translate(f.x,f.y);ctx.scale(state.gameScale,state.gameScale);const glow=ctx.createRadialGradient(0,0,1,0,0,30);glow.addColorStop(0,`rgba(236,255,173,${.75*pulse})`);glow.addColorStop(.25,`rgba(190,255,122,${.25*pulse})`);glow.addColorStop(1,'rgba(170,255,120,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,0,30,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ecffad';ctx.beginPath();ctx.arc(0,0,4.5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(220,255,191,.55)';ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(-5,-1,6,3,-.5,0,Math.PI*2);ctx.ellipse(5,-1,6,3,.5,0,Math.PI*2);ctx.stroke();ctx.restore();
  }

  function drawOwl(){
    const owlStats=playerStats();
    const perched=owl.flightState==='perched',turning=owl.turnTime>0;
    ctx.save();ctx.translate(owl.x,owl.y);ctx.scale(state.gameScale*owlStats.size*(turning?.42:owl.facing),state.gameScale*owlStats.size);
    const palette=owlStats.colors,upgrade=progress.owlUpgrade;
    let drawAngle=clamp(owl.angle,-.65,.65);
    if(owl.dive)drawAngle=owl.angle;
    ctx.rotate(drawAngle*.45);
    if(owl.invuln>0&&Math.floor(owl.invuln*14)%2===0)ctx.globalAlpha=.33;
    if(upgrade>=5){
      const auraPulse=.45+Math.sin(state.elapsed*4)*.1;ctx.strokeStyle=`rgba(130,231,255,${auraPulse})`;ctx.lineWidth=3;ctx.setLineDash([5,9]);ctx.beginPath();ctx.arc(0,-2,72,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='rgba(255,212,105,.9)';for(let i=0;i<5;i++){const a=state.elapsed*.7+i*Math.PI*2/5;ctx.beginPath();ctx.arc(Math.cos(a)*69,Math.sin(a)*58-2,3,0,Math.PI*2);ctx.fill()}
    }

    const flap=perched?-8:Math.sin(owl.wing)*(owl.dive?7:19);
    const bodyGrad=ctx.createLinearGradient(0,-45,0,50);bodyGrad.addColorStop(0,palette.body);bodyGrad.addColorStop(1,palette.dark);
    ctx.strokeStyle='#151517';ctx.lineWidth=5.5;ctx.lineJoin='round';

    // Schweif
    ctx.fillStyle=palette.dark;ctx.beginPath();ctx.moveTo(-15,32);ctx.lineTo(-4,62);ctx.lineTo(4,37);ctx.lineTo(16,62);ctx.lineTo(17,28);ctx.closePath();ctx.fill();ctx.stroke();

    // Flügel mit Federsegmenten
    for(const side of [-1,1]){
      ctx.save();ctx.scale(side,1);
      ctx.fillStyle=palette.wing;ctx.beginPath();ctx.moveTo(14,-4);
      if(perched){ctx.quadraticCurveTo(37,-15,48,6);ctx.quadraticCurveTo(42,25,27,35)}else{ctx.quadraticCurveTo(62,-48-flap,101,-13);ctx.quadraticCurveTo(71,-7,48,30)}
      ctx.lineTo(15,24);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(240,198,143,.58)';ctx.lineWidth=3;
      if(!perched)for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(36+i*13,7-i*3);ctx.lineTo(61+i*10,-15-flap*.25);ctx.stroke()}
      if(upgrade>=1){ctx.strokeStyle='#82e7ff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(perched?24:47,17);ctx.quadraticCurveTo(perched?38:72,perched?8:-6-flap*.3,perched?45:94,perched?7:-11);ctx.stroke()}
      ctx.restore();
    }

    ctx.fillStyle=bodyGrad;ctx.beginPath();ctx.ellipse(0,10,37,47,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(255,222,177,.45)';ctx.lineWidth=3;
    for(let y=2;y<33;y+=10){ctx.beginPath();ctx.arc(0,y,18-y*.08,.2,Math.PI-.2);ctx.stroke()}
    ctx.fillStyle='rgba(255,235,203,.28)';for(const [x,y,r] of [[-20,5,3],[18,11,2.5],[-14,24,2],[13,31,2.5],[0,-1,2]]){ctx.beginPath();ctx.ellipse(x,y,r,r*.55,.4,0,Math.PI*2);ctx.fill()}
    if(upgrade>=2){
      ctx.shadowColor='#82e7ff';ctx.shadowBlur=10;ctx.fillStyle='#82e7ff';ctx.strokeStyle='#17384a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,3);ctx.lineTo(9,13);ctx.lineTo(0,27);ctx.lineTo(-9,13);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    }

    ctx.fillStyle=palette.face;ctx.beginPath();ctx.ellipse(0,-21,39,33,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(255,238,207,.5)';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(0,-48);ctx.bezierCurveTo(-9,-39,-12,-8,0,4);ctx.bezierCurveTo(12,-8,9,-39,0,-48);ctx.stroke();
    ctx.fillStyle=palette.dark;ctx.beginPath();ctx.moveTo(-35,-38);ctx.lineTo(-18,-61);ctx.lineTo(-7,-40);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(35,-38);ctx.lineTo(18,-61);ctx.lineTo(7,-40);ctx.closePath();ctx.fill();ctx.stroke();

    for(const ex of [-15,15]){
      if(upgrade>=3){ctx.shadowColor='#ffd469';ctx.shadowBlur=12}
      ctx.fillStyle='#f7edd6';ctx.beginPath();ctx.arc(ex,-22,13,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.fillStyle='#f4c54c';ctx.beginPath();ctx.arc(ex,-22,6,0,Math.PI*2);ctx.fill();
      const lookX=owl.dive?owl.diveDirX*2:clamp(owl.vx/180,-2,2),lookY=owl.dive?owl.diveDirY*2:clamp(owl.vy/180,-2,2);
      ctx.fillStyle='#111';ctx.beginPath();ctx.arc(ex+lookX,-22+lookY,3,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
    }
    ctx.fillStyle='#efa72d';ctx.beginPath();ctx.moveTo(0,-13);ctx.lineTo(-8,0);ctx.lineTo(8,0);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,239,170,.55)';ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(-2,-2);ctx.lineTo(4,-2);ctx.closePath();ctx.fill();

    const clawY=owl.dive?55:47;
    if(upgrade>=4){ctx.fillStyle='#ffd469';ctx.strokeStyle='#6b4b12';ctx.lineWidth=3;for(const x of [-13,13]){ctx.beginPath();ctx.roundRect(x-7,38,14,9,4);ctx.fill();ctx.stroke()}}
    ctx.strokeStyle='#d5aa45';ctx.lineWidth=4.5;ctx.lineCap='round';
    for(const x of [-13,13]){ctx.beginPath();ctx.moveTo(x,42);ctx.lineTo(x,clawY);ctx.moveTo(x,clawY);ctx.lineTo(x-8,clawY+8);ctx.moveTo(x,clawY);ctx.lineTo(x+8,clawY+8);ctx.stroke()}

    if(owl.carrying){
      const c=owl.carrying;ctx.save();ctx.translate(0,66);ctx.scale(.82,.82);ctx.fillStyle=c.color;ctx.strokeStyle='#151517';ctx.lineWidth=4;
      if(c.type==='bundle'){ctx.beginPath();ctx.roundRect(-18,-10,36,24,6);ctx.fill();ctx.stroke();ctx.strokeStyle='#f0d49a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(0,14);ctx.moveTo(-18,1);ctx.lineTo(18,1);ctx.stroke()}
      else if(c.type==='berry'){for(const [x,y] of [[-8,0],[2,-5],[10,2],[-1,7]]){ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fill();ctx.stroke()}}
      else if(c.type==='herb'){ctx.strokeStyle='#3e7544';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,12);ctx.lineTo(0,-16);ctx.moveTo(0,-5);ctx.lineTo(-13,-13);ctx.moveTo(0,1);ctx.lineTo(14,-8);ctx.stroke();ctx.fillStyle=c.color;for(const [x,y,a] of [[-14,-14,-.5],[15,-9,.45],[-7,-2,-.35]]){ctx.beginPath();ctx.ellipse(x,y,9,4,a,0,Math.PI*2);ctx.fill()}}
      else if(c.type==='rabbit'){ctx.beginPath();ctx.ellipse(0,0,23,13,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.ellipse(-13,-15,4,13,-.25,0,Math.PI*2);ctx.ellipse(-4,-16,4,13,.1,0,Math.PI*2);ctx.fill();ctx.stroke()}
      else if(c.type==='frog'){ctx.beginPath();ctx.ellipse(0,1,20,12,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(-9,-8,6,0,Math.PI*2);ctx.arc(9,-8,6,0,Math.PI*2);ctx.fill();ctx.stroke()}
      else if(c.type==='beetle'){ctx.beginPath();ctx.ellipse(0,0,17,13,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(0,12);ctx.stroke()}
      else{ctx.beginPath();ctx.ellipse(0,0,20,12,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle=c.type==='gold'?'#ffe89b':'#dca0a7';ctx.beginPath();ctx.arc(-17,1,8,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(18,1);ctx.quadraticCurveTo(34,-12,39,4);ctx.stroke()}
      ctx.restore();
    }
    ctx.restore();
  }

  function drawCompanion(companion){
    if(companion.id==='glow'){
      const s=state.gameScale,pulse=1+Math.sin(companion.phase)*.12;ctx.save();ctx.translate(companion.x,companion.y);ctx.globalAlpha=.92;const halo=ctx.createRadialGradient(0,0,2*s,0,0,30*s);halo.addColorStop(0,'rgba(239,255,159,.7)');halo.addColorStop(1,'rgba(223,255,141,0)');ctx.fillStyle=halo;ctx.beginPath();ctx.arc(0,0,30*s*pulse,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f5ffb4';ctx.beginPath();ctx.ellipse(0,0,5*s,7*s,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#88a968';ctx.lineWidth=2*s;for(const side of [-1,1]){ctx.beginPath();ctx.ellipse(side*7*s,-1*s,7*s,3.5*s,side*.35,0,Math.PI*2);ctx.stroke()}ctx.restore();return;
    }
    const isBruno=companion.id==='bruno',s=state.gameScale*(isBruno ? .76 : .58),dir=companion.vx<0?-1:1,flap=Math.sin(companion.phase)*10,body=isBruno?'#6d4934':'#80664d',face=isBruno?'#c59a70':'#b99469';
    ctx.save();ctx.translate(companion.x,companion.y);ctx.rotate(companion.balanceAmount||0);ctx.scale(dir*s,s);ctx.globalAlpha=companion.recovering ? .72 : .94;ctx.strokeStyle='#17202a';ctx.lineWidth=5;ctx.lineJoin='round';ctx.fillStyle=body;
    for(const side of [-1,1]){ctx.save();ctx.scale(side,1);ctx.beginPath();ctx.moveTo(9,0);ctx.quadraticCurveTo(33,-28-flap,52,-5);ctx.quadraticCurveTo(34,-4,20,20);ctx.lineTo(7,13);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
    ctx.beginPath();ctx.ellipse(0,8,isBruno?27:22,isBruno?34:29,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle=face;ctx.beginPath();ctx.ellipse(0,-15,isBruno?30:25,isBruno?25:21,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#edf4df';for(const ex of [-9,9]){ctx.beginPath();ctx.arc(ex,-16,isBruno?8:7,0,Math.PI*2);ctx.fill();ctx.stroke()}ctx.fillStyle='#223044';for(const ex of [-9,9]){ctx.beginPath();ctx.arc(ex,-16,2.6,0,Math.PI*2);ctx.fill()}
    if(isBruno){ctx.strokeStyle='#9fe7ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(-9,-16,10,0,Math.PI*2);ctx.arc(9,-16,10,0,Math.PI*2);ctx.moveTo(1,-16);ctx.lineTo(-1,-16);ctx.stroke()}
    ctx.fillStyle='#edb640';ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(-5,-1);ctx.lineTo(6,-1);ctx.closePath();ctx.fill();ctx.stroke();
    if(companion.id==='fynn'){ctx.strokeStyle='#9fe7ff';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,4,20,.15,Math.PI-.15);ctx.stroke()}
    ctx.restore();
  }

  function drawCompanions(){
    if(!state.running||!state.storyScene)return;state.storyScene.companions.filter(item=>camera.isVisible(item,120)).forEach(drawCompanion);
  }

  function drawHootContext(context){
    const s=state.gameScale,active=context.revealed||context.visibleUntil>state.elapsed;if(!active&&context.type!=='hiddenObject')return;
    ctx.save();ctx.translate(context.x,context.y);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=context.color;ctx.fillStyle=context.color;ctx.globalAlpha=active ? .88 : .34;ctx.lineWidth=3*s;
    if(context.type==='lightTrail'){
      for(let i=0;i<4;i++){const x=(i-1.5)*18*s,y=Math.sin(i*1.8+context.pulse)*8*s;ctx.globalAlpha=(active ? .35 : .12)+i*.12;ctx.beginPath();ctx.arc(x,y,3.5*s,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(x-7*s,y+5*s);ctx.quadraticCurveTo(x,y-8*s,x+8*s,y-2*s);ctx.stroke()}
    }else if(context.type==='hiddenObject'){
      if(!context.completed){for(let i=0;i<5;i++){ctx.save();ctx.rotate(-.8+i*.36);ctx.beginPath();ctx.ellipse(0,-i*2*s,18*s,5*s,0,0,Math.PI*2);ctx.fill();ctx.restore()}ctx.strokeStyle='#f7e9bd';ctx.beginPath();ctx.arc(0,-9*s,5*s,.2,Math.PI*1.8);ctx.stroke()}
    }else if(context.type==='fogMarker'){
      ctx.setLineDash([8*s,7*s]);for(let i=0;i<3;i++){ctx.globalAlpha=.7-i*.18;ctx.beginPath();ctx.ellipse(0,i*12*s,20*s+i*12*s,7*s+i*2*s,0,0,Math.PI*2);ctx.stroke()}ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(0,5*s);ctx.lineTo(0,-30*s);ctx.stroke();
    }else if(context.type==='calmFireflies'||context.type==='calmFynn'){
      for(let i=0;i<6;i++){const a=i*Math.PI/3+state.elapsed*.2,r=(16+i%2*8)*s;ctx.globalAlpha=.45+i*.07;ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r,2.5*s,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=.85;ctx.beginPath();ctx.moveTo(0,10*s);ctx.bezierCurveTo(-18*s,-3*s,-14*s,-17*s,0,-7*s);ctx.bezierCurveTo(14*s,-17*s,18*s,-3*s,0,10*s);ctx.fill();
    }else if(context.type==='finaleChain'){
      for(let i=0;i<5;i++){ctx.globalAlpha=.25+i*.11;ctx.beginPath();ctx.arc(0,0,(11+i*9)*s,-.25,Math.PI+.25);ctx.stroke()}
    }else{
      ctx.beginPath();ctx.moveTo(-18*s,5*s);ctx.quadraticCurveTo(0,-17*s,18*s,5*s);ctx.stroke();ctx.beginPath();ctx.moveTo(-12*s,13*s);ctx.quadraticCurveTo(0,0,12*s,13*s);ctx.stroke();
    }
    ctx.restore();
  }

  function drawLeafMotions(){
    for(const leaf of state.leafMotions){if(!camera.isVisible(leaf,35))continue;ctx.save();ctx.translate(leaf.x,leaf.y);ctx.rotate(leaf.rotation);ctx.globalAlpha=clamp(leaf.life/leaf.max,0,1);ctx.fillStyle=leaf.color;ctx.strokeStyle='rgba(45,54,34,.68)';ctx.lineWidth=1.4*state.gameScale;ctx.beginPath();ctx.moveTo(-7*state.gameScale,0);ctx.quadraticCurveTo(0,-6*state.gameScale,8*state.gameScale,0);ctx.quadraticCurveTo(0,5*state.gameScale,-7*state.gameScale,0);ctx.fill();ctx.stroke();ctx.restore()}
  }

  function drawHootWave(r,alpha){
    const points=52,seed=Number(r.seed)||0;ctx.strokeStyle=r.color;ctx.lineCap='round';
    for(let band=0;band<2;band++){
      ctx.globalAlpha=alpha*(band?.36:1);ctx.lineWidth=(band?2.1:4.4)*state.gameScale;ctx.beginPath();
      for(let i=0;i<=points;i++){const a=i/points*Math.PI*2,wobble=1+Math.sin(a*5+seed)*.026+Math.sin(a*9-seed*.3)*.014,rr=Math.max(2,r.r-band*13*state.gameScale)*wobble,x=r.x+Math.cos(a)*rr,y=r.y+Math.sin(a)*rr;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
    }
  }

  function drawEffects(){
    for(const r of state.rings){
      if(!camera.isVisible(r,80))continue;
      const alpha=clamp(r.life/r.max,0,1);if(r.hoot)drawHootWave(r,alpha);else{ctx.globalAlpha=alpha;ctx.strokeStyle=r.color;ctx.lineWidth=3;ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,Math.PI*2);ctx.stroke()}
    }
    ctx.globalAlpha=1;

    for(const p of state.particles){
      if(!camera.isVisible(p,40))continue;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.spin);ctx.globalAlpha=clamp(p.life/p.max,0,1);ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=p.size*1.8;ctx.beginPath();ctx.moveTo(0,-p.size*1.25);ctx.quadraticCurveTo(p.size*.8,0,0,p.size*1.25);ctx.quadraticCurveTo(-p.size*.8,0,0,-p.size*1.25);ctx.fill();ctx.restore();
    }
    ctx.globalAlpha=1;

    ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 20px system-ui';
    for(const f of state.floaters){
      if(!camera.isVisible(f,100))continue;
      ctx.globalAlpha=clamp(f.life,0,1);ctx.fillStyle=f.color;ctx.strokeStyle='rgba(0,0,0,.7)';ctx.lineWidth=5;ctx.font=`900 ${f.size}px system-ui`;ctx.strokeText(f.text,f.x,f.y);ctx.fillText(f.text,f.x,f.y);
    }
    ctx.globalAlpha=1;

  }

  function drawEdgeSignals(){
    const margin=32,zoom=camera.zoom||1;
    for(const signal of state.edgeSignals){
      const sx=(signal.x-camera.centerX)*zoom+state.w/2,sy=(signal.y-camera.centerY)*zoom+state.h/2;if(sx>margin&&sx<state.w-margin&&sy>margin&&sy<state.h-margin)continue;
      const x=clamp(sx,margin,state.w-margin),y=clamp(sy,margin,state.h-margin),angle=Math.atan2(sy-state.h/2,sx-state.w/2),alpha=clamp(signal.life/signal.max,0,1);
      ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=alpha;ctx.strokeStyle=signal.color||'#82e7ff';ctx.fillStyle='rgba(15,25,31,.72)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(-7,-10);ctx.lineTo(-3,0);ctx.lineTo(-7,10);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(-4,0,18,-.7,.7);ctx.stroke();ctx.globalAlpha=alpha*.5;ctx.beginPath();ctx.arc(-4,0,25,-.62,.62);ctx.stroke();ctx.restore();
    }
  }

  function drawStoryDebug(){
    if(!state.storyDebug||!state.storyScene)return;ctx.save();ctx.strokeStyle='rgba(255,117,210,.82)';ctx.fillStyle='rgba(255,117,210,.12)';ctx.lineWidth=2/(camera.zoom||1);ctx.setLineDash([8*state.gameScale,6*state.gameScale]);ctx.font=`700 ${12*state.gameScale}px system-ui`;ctx.textAlign='center';
    for(const event of state.storyScene.events.filter(item=>!item.completed)){
      const trigger=event.trigger;if(trigger.type==='position'){ctx.beginPath();ctx.moveTo(event.x,playTop());ctx.lineTo(event.x,state.groundY);ctx.stroke();ctx.fillText(event.id,event.x,playTop()+18)}
      else if(trigger.type==='landing'){const perch=perchById(trigger.perchId);if(perch){ctx.beginPath();ctx.arc(perch.x,perch.y,48*state.gameScale,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillText(event.id,perch.x,perch.y-54*state.gameScale)}}
      else if(trigger.type==='hoot'){const source=state.hootContexts.find(item=>item.id===trigger.contextId);if(source){ctx.beginPath();ctx.arc(source.x,source.y,Math.min(source.radius,playerStats().hootRadius)*state.gameScale,0,Math.PI*2);ctx.stroke();ctx.fillText(event.id,source.x,source.y-28*state.gameScale)}}
      else if(trigger.type==='companionDistance'){const companion=state.storyScene.companions.find(item=>item.id===trigger.companion);if(companion){ctx.beginPath();ctx.arc(companion.x,companion.y,trigger.distance*state.gameScale,0,Math.PI*2);ctx.stroke();ctx.fillText(event.id,companion.x,companion.y-30*state.gameScale)}}
    }
    ctx.restore();
  }

  function drawTouchTarget(){
    if(!state.pointer.active||!state.pointer.touch)return;ctx.save();ctx.strokeStyle='rgba(130,231,255,.62)';ctx.fillStyle='rgba(130,231,255,.16)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(state.pointer.screenX,state.pointer.screenY);ctx.lineTo(state.pointer.targetScreenX,state.pointer.targetScreenY);ctx.stroke();
    ctx.beginPath();ctx.arc(state.pointer.screenX,state.pointer.screenY,17,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(state.pointer.targetScreenX,state.pointer.targetScreenY,7,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
  }

  function draw(){
    ctx.save();
    if(state.shake>0)ctx.translate(rand(-9,9),rand(-7,7));
    parallax.drawBackground(ctx,{width:state.w,height:state.h,groundY:state.groundY},camera,state.world,{theme:currentPhase().theme,terrain:currentPhase().terrain,time:state.time});
    ctx.save();camera.apply(ctx);
    state.world.landmarks.filter(item=>camera.isVisible(item,180)).forEach(item=>parallax.drawLandmark(ctx,item,state.gameScale));
    state.groundDetails.filter(item=>camera.isVisible(item,40)).forEach(drawGroundDetail);
    state.hootContexts.filter(item=>camera.isVisible(item,80)).forEach(drawHootContext);
    drawStoryDebug();
    if(camera.isVisible(nest(),180)){drawStoryGuests();drawNest()}
    state.safePerches.filter(item=>camera.isVisible(item,160)).forEach(drawSafePerch);
    state.branches.filter(item=>camera.isVisible(item,220)).forEach(drawBranch);
    state.fireflies.filter(item=>camera.isVisible(item,50)).forEach(drawFirefly);
    state.mice.filter(item=>camera.isVisible(item,60)).forEach(drawPrey);
    state.bushes.filter(item=>camera.isVisible(item,80)).forEach(drawBush);
    state.bats.filter(item=>camera.isVisible(item,100)).forEach(drawBat);
    state.rivals.filter(item=>camera.isVisible(item,130)).forEach(drawRivalOwl);
    drawCompanions();
    drawOwl();
    drawLeafMotions();
    drawEffects();
    ctx.restore();
    parallax.drawForeground(ctx,{width:state.w,height:state.h},camera);
    drawTouchTarget();
    drawDirectionGuide();
    drawEdgeSignals();

    const vignette=ctx.createRadialGradient(state.w/2,state.h/2,state.h*.2,state.w/2,state.h/2,state.w*.72);
    vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(1,'rgba(0,0,0,.48)');ctx.fillStyle=vignette;ctx.fillRect(0,0,state.w,state.h);
    ctx.restore();
  }

  function loop(now){
    if(!state.running||state.paused||state.ended)return;
    const dt=Math.min(.033,(now-state.last)/1000||0);state.last=now;
    update(dt);draw();
    if(state.running&&!state.paused&&!state.ended)requestAnimationFrame(loop);
  }

  function keyDown(e){
    const blocked=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'];
    if(blocked.includes(e.code))e.preventDefault();
    if(e.repeat&&['Space','KeyE','KeyF','KeyP','KeyT'].includes(e.code))return;
    state.keys.add(e.code);
    if(e.code==='Space')activateDive();
    if(e.code==='KeyE')activateHoot();
    if(e.code==='KeyF'){const perch=perches.nearest(owl,state.safePerches,Math.max(230,300*state.gameScale));if(perch)requestLanding(perch);else showToast('KEIN AST IN DER NÄHE','#a9d7b0',520)}
    if(e.code==='KeyP')pauseGame();
    if(e.code==='KeyT'){state.storyDebug=!state.storyDebug;showToast(state.storyDebug?'STORY-TRIGGER AN':'STORY-TRIGGER AUS','#ff75d2',700)}
  }
  function keyUp(e){state.keys.delete(e.code)}
  addEventListener('keydown',keyDown,{passive:false});addEventListener('keyup',keyUp);

  function pointerPos(e){
    const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};
  }
  function setFingerTarget(e){
    const p=pointerPos(e),touch=e.pointerType==='touch',offset=touch?clamp(72*state.gameScale,48,86):0;
    if(owl.flightState==='perched'||owl.flightState==='approach')leavePerch();
    const target=camera.screenToWorld(p.x,p.y-offset);
    Object.assign(state.pointer,{active:true,x:target.x,y:target.y,screenX:p.x,screenY:p.y,targetScreenX:p.x,targetScreenY:p.y-offset,touch,id:e.pointerId,landingTap:false});
  }
  canvas.addEventListener('pointerdown',e=>{
    if(!state.running||state.paused)return;
    e.preventDefault();const screen=pointerPos(e),world=camera.screenToWorld(screen.x,screen.y),perch=perches.findTapped(world,state.safePerches,owl.r);canvas.setPointerCapture(e.pointerId);
    if(perch&&requestLanding(perch)){Object.assign(state.pointer,{active:false,id:e.pointerId,touch:e.pointerType==='touch',landingTap:true,startScreenX:screen.x,startScreenY:screen.y});haptic(10);return}
    setFingerTarget(e);if(e.pointerType==='touch')haptic(6);
  },{passive:false});
  canvas.addEventListener('pointermove',e=>{if(state.pointer.id!==e.pointerId)return;e.preventDefault();if(state.pointer.landingTap){const screen=pointerPos(e);if(Math.hypot(screen.x-state.pointer.startScreenX,screen.y-state.pointer.startScreenY)>12)setFingerTarget(e);return}if(state.pointer.active)setFingerTarget(e)},{passive:false});
  canvas.addEventListener('pointerup',e=>{if(state.pointer.id===e.pointerId){state.pointer.active=false;state.pointer.landingTap=false;state.pointer.id=null;owl.vx*=.72;owl.vy*=.72}try{canvas.releasePointerCapture(e.pointerId)}catch(_){}});
  canvas.addEventListener('pointercancel',e=>{if(state.pointer.id===e.pointerId){state.pointer.active=false;state.pointer.landingTap=false;state.pointer.id=null}});

  document.querySelectorAll('[data-key]').forEach(btn=>{
    const code=btn.dataset.key;
    const down=e=>{e.preventDefault();state.keys.add(code)};
    const up=e=>{e.preventDefault();state.keys.delete(code)};
    btn.addEventListener('pointerdown',down);btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',up);btn.addEventListener('pointerleave',up);
  });
  document.querySelector('[data-action="dive"]').addEventListener('pointerdown',e=>{e.preventDefault();activateDive()});
  document.querySelector('[data-action="hoot"]').addEventListener('pointerdown',e=>{e.preventDefault();activateHoot()});

  document.getElementById('startBtn').addEventListener('click',startGame);
  addEventListener('owl:select-level',event=>startGameAtScene(event.detail?.scene));
  ui.continueGame.addEventListener('click',resumeCheckpoint);
  ui.saveExit.addEventListener('click',saveAndExit);
  document.getElementById('restartBtn').addEventListener('click',openStartMenu);
  ui.storyNext.addEventListener('click',nextStoryLine);ui.storySkip.addEventListener('click',skipStoryChapter);ui.finalHoot.addEventListener('click',playFinalHoot);
  document.getElementById('resumeBtn').addEventListener('click',()=>pauseGame(false));
  document.getElementById('nextLevelBtn').addEventListener('click',continueToNextLevel);
  document.getElementById('pauseBtn').addEventListener('click',()=>pauseGame());
  ui.upgradeOwl.addEventListener('click',()=>buyUpgrade('owl'));
  ui.upgradeNest.addEventListener('click',()=>buyUpgrade('nest'));
  ui.replayIntros.addEventListener('change',()=>{progress.replayIntros=ui.replayIntros.checked;saveProgress()});
  ui.sound.addEventListener('click',()=>{
    state.muted=!state.muted;ui.sound.innerHTML=iconSvg(state.muted?'muted':'speaker');
    if(!state.muted)initAudio();
    setAudioFocus(!state.muted&&state.running&&!state.paused&&!state.ended);
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden&&state.running&&!state.ended&&!state.paused)saveCheckpoint();
    setAudioFocus(!document.hidden&&state.running&&!state.paused&&!state.ended);
  });

  // statische Startszene
  renderProgressHub();refreshContinueButton();reset();draw();
})();
