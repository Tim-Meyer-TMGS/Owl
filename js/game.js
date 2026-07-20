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
    target:document.getElementById('target'),
    energy:document.getElementById('energyFill'),
    time:document.getElementById('timeFill'),
    timeText:document.getElementById('timeText'),
    mission:document.getElementById('missionBanner'),
    toast:document.getElementById('toast'),
    start:document.getElementById('startOverlay'),
    pause:document.getElementById('pauseOverlay'),
    end:document.getElementById('endOverlay'),
    endEyebrow:document.getElementById('endEyebrow'),
    endTitle:document.getElementById('endTitle'),
    endText:document.getElementById('endText'),
    resultScore:document.getElementById('resultScore'),
    resultPrey:document.getElementById('resultPrey'),
    resultBest:document.getElementById('resultBest'),
    sound:document.getElementById('soundBtn')
  };

  const levelData=window.OWL_LEVEL_DATA;
  if(!levelData||levelData.formatVersion!==1||!Array.isArray(levelData.levels)||!levelData.levels.length){
    throw new Error('Keine gültigen Leveldaten geladen. Bitte tools/build-levels.ps1 ausführen.');
  }
  const campaign=levelData.campaign;
  const expandPreyWeights=weights=>Object.entries(weights).flatMap(([type,weight])=>Array(Math.max(0,Math.round(weight))).fill(type));
  const phases=[...levelData.levels].sort((a,b)=>a.order-b.order).map(level=>({
    id:level.id,name:level.name,target:level.objective.target,requiredType:level.objective.requiredPrey,
    timeBonus:level.timeBonusSeconds,theme:level.presentation.theme,intro:level.presentation.intro,
    introShort:level.name,mission:level.presentation.mission,missionShort:level.presentation.shortMission,
    preyTypes:expandPreyWeights(level.population.prey),startMice:level.population.startingPrey,
    mouseCap:level.population.maximumPrey,mouseDelay:[level.population.spawnDelaySeconds.min,level.population.spawnDelaySeconds.max],
    waveSize:level.waves.size,waveBreak:level.waves.breakSeconds,branchCount:level.hazards.branches,
    batCap:level.hazards.maximumBats,batDelay:[level.hazards.batSpawnDelaySeconds.min,level.hazards.batSpawnDelaySeconds.max],
    fireflyCap:level.pickups.maximumFireflies,fireflyDelay:[level.pickups.fireflySpawnDelaySeconds.min,level.pickups.fireflySpawnDelaySeconds.max],
    speedMultiplier:level.difficulty.speedMultiplier,timeDrainMultiplier:level.difficulty.timeDrainMultiplier,
    hitPenaltySeconds:level.difficulty.hitPenaltySeconds,audioChord:level.audio.chordHz
  }));

  const state = {
    w:0,h:0,dpr:1,groundY:0,gameScale:1,touchMode:false,tabletMode:false,
    running:false,paused:false,ended:false,
    score:0,hearts:campaign.startingHearts,maxHearts:campaign.maximumHearts,energy:100,time:campaign.startingTimeSeconds,maxTime:campaign.startingTimeSeconds,
    phaseIndex:0,phaseDelivered:0,totalDelivered:0,
    combo:0,bestCombo:0,comboClock:0,
    mouseClock:0,batClock:0,fireflyClock:0,wave:1,waveRemaining:0,waveBreak:0,
    keys:new Set(),pointer:{active:false,x:0,y:0},joystick:{active:false,x:0,y:0},
    mice:[],bats:[],branches:[],fireflies:[],particles:[],floaters:[],rings:[],stars:[],clouds:[],grass:[],
    echo:0,shake:0,transition:0,transitionQueued:false,
    last:0,muted:false,elapsed:0,restProgress:0,restCooldown:0,musicClock:.4,wildlifeClock:2
  };

  const owl = {
    x:260,y:230,vx:0,vy:0,r:35,angle:0,
    dive:false,diveTime:0,diveDirX:0,diveDirY:1,
    invuln:0,wing:0,carrying:null
  };

  let audioCtx = null,masterGain=null,ambienceGain=null;

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
    return `${gold}${iconSvg('mouse')} ×${phase.target} → ${iconSvg('nest')}${danger}`;
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
  }

  function playWildlife(){
    if(state.phaseIndex===0&&Math.random()<.55){
      tone(310,.045,'square',.006,35);tone(355,.04,'square',.005,20,.09);tone(325,.04,'square',.004,-15,.18);
    }else if(Math.random()<.5){
      tone(190,.42,'sine',.016,-45);tone(165,.48,'sine',.013,-30,.5);
    }else{
      tone(720,.055,'triangle',.006,-160);tone(610,.05,'triangle',.005,-120,.07);
    }
  }

  function updateAudio(dt){
    if(state.muted||!audioCtx)return;
    state.musicClock-=dt;state.wildlifeClock-=dt;
    if(state.musicClock<=0){playMusicPhrase();state.musicClock=rand(6.5,9.5)}
    if(state.wildlifeClock<=0){playWildlife();state.wildlifeClock=rand(4,8)}
  }

  function sfx(name){
    if(name==='dive'){tone(280,.16,'sawtooth',.025,-130);tone(520,.09,'triangle',.02,-180,.03)}
    if(name==='catch'){tone(520,.12,'triangle',.04,180);tone(760,.14,'sine',.03,120,.07)}
    if(name==='deliver'){tone(440,.12,'sine',.04,80);tone(660,.14,'sine',.035,100,.10);tone(880,.18,'sine',.03,120,.20)}
    if(name==='hit'){tone(150,.22,'sawtooth',.05,-60);tone(90,.28,'square',.025,-30,.03)}
    if(name==='echo'){tone(230,.45,'sine',.028,620);tone(340,.4,'triangle',.018,500,.08)}
    if(name==='power'){tone(640,.11,'sine',.03,180);tone(920,.12,'sine',.025,100,.08)}
    if(name==='phase'){[392,494,587,784].forEach((f,i)=>tone(f,.22,'triangle',.025,30,i*.09))}
    if(name==='wave'){tone(220,.12,'triangle',.018,80);tone(330,.16,'triangle',.015,100,.12)}
    if(name==='frog'){tone(165,.09,'square',.012,75);tone(215,.11,'square',.01,85,.1)}
    if(name==='rabbit'){tone(510,.055,'triangle',.012,120);tone(690,.06,'triangle',.009,80,.07)}
    if(name==='beetle'){tone(115,.035,'square',.009,20);tone(135,.03,'square',.007,-15,.055)}
    if(name==='bat'){tone(920,.07,'sawtooth',.008,-330);tone(670,.08,'triangle',.006,-240,.06)}
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
    state.gameScale = clamp(Math.min(state.w/760,state.h/620),.46,1);
    state.groundY = state.h-(state.tabletMode?118:(state.touchMode?78:48));

    const radiusRatio=state.gameScale/previousScale;
    [...state.mice,...state.bats,...state.fireflies].forEach(item=>{item.r*=radiusRatio;if(item.speed)item.speed*=radiusRatio});
    state.branches.forEach(branch=>branch.scale=state.gameScale);
    state.rings.forEach(ring=>ring.r*=radiusRatio);
    state.particles.forEach(particle=>particle.size*=radiusRatio);
    state.floaters.forEach(floater=>floater.size*=radiusRatio);
    owl.vx*=radiusRatio;owl.vy*=radiusRatio;
    owl.r=35*state.gameScale;

    if(!state.stars.length){
      for(let i=0;i<120;i++) state.stars.push({x:Math.random(),y:Math.random()*.65,s:.4+Math.random()*1.8,a:.2+Math.random()*.8,p:Math.random()*6});
      for(let i=0;i<7;i++) state.clouds.push({x:Math.random(),y:.08+Math.random()*.42,s:.6+Math.random()*1.2,v:.002+Math.random()*.004,a:.025+Math.random()*.06});
      for(let i=0;i<140;i++) state.grass.push({x:Math.random(),h:7+Math.random()*24,b:Math.random()*6});
    }

    const edge=38*state.gameScale;
    const top=state.h<600?74:(state.touchMode?105:88);
    owl.x = Math.min(Math.max(edge,owl.x || state.w*.22),state.w-edge);
    owl.y = Math.min(Math.max(top,owl.y || state.h*.32),state.groundY-20*state.gameScale);
  }
  addEventListener('resize',resize);
  addEventListener('orientationchange',resize);
  if(window.visualViewport) window.visualViewport.addEventListener('resize',resize);
  resize();

  function rand(min,max){return min+Math.random()*(max-min)}
  function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
  function dist2(a,b){const dx=a.x-b.x,dy=a.y-b.y;return dx*dx+dy*dy}
  function collide(a,b,pad=0){const rr=(a.r+b.r+pad*state.gameScale);return dist2(a,b)<rr*rr}
  function currentPhase(){return phases[state.phaseIndex]}

  function nest(){
    const s=state.gameScale;
    if(state.touchMode&&state.h>state.w)return{x:state.w*.5,y:state.tabletMode?165:118,r:58*s};
    const top=state.h<600?88:(state.touchMode?120:142);
    return {x:Math.max(62*s,state.w*.09),y:Math.max(top,state.h*.2),r:58*s};
  }

  function reset(){
    state.score=0;state.hearts=campaign.startingHearts;state.maxHearts=campaign.maximumHearts;state.energy=100;state.restProgress=0;state.restCooldown=0;state.time=campaign.startingTimeSeconds;state.maxTime=campaign.startingTimeSeconds;
    state.phaseIndex=0;state.phaseDelivered=0;state.totalDelivered=0;
    state.combo=0;state.bestCombo=0;state.comboClock=0;
    state.mouseClock=.35;state.batClock=1.8;state.fireflyClock=.45;state.wave=1;state.waveRemaining=currentPhase().waveSize;state.waveBreak=0;
    state.mice=[];state.bats=[];state.branches=[];state.fireflies=[];state.particles=[];state.floaters=[];state.rings=[];
    state.echo=0;state.shake=0;state.transition=0;state.transitionQueued=false;state.elapsed=0;state.musicClock=.35;state.wildlifeClock=2;
    const portrait=state.touchMode&&state.h>state.w;
    owl.x=portrait?state.w*.5:state.w*.25;owl.y=portrait?Math.max(210,state.h*.29):state.h*.30;owl.vx=0;owl.vy=0;owl.angle=0;owl.dive=false;owl.diveTime=0;owl.invuln=0;owl.carrying=null;
    setupBranches();
    for(let i=0;i<currentPhase().startMice;i++) spawnMouse(i<2?'normal':undefined);
    for(let i=0;i<3;i++) spawnFirefly();
    updateHud();
  }

  function setupBranches(){
    state.branches=[];
    const count=currentPhase().branchCount;
    for(let i=0;i<count;i++){
      state.branches.push({
        x:state.w*(.34+i/(Math.max(1,count-1))*.58)+rand(-35,35),
        y:state.h*rand(.30,.66),
        w:rand(95,175),scale:state.gameScale,
        angle:rand(-.18,.14),
        sway:rand(0,6),
        r:28
      });
    }
  }

  function startGame(){
    initAudio();
    setAudioFocus(true);
    reset();
    state.running=true;state.paused=false;state.ended=false;
    ui.start.classList.add('hidden');ui.end.classList.add('hidden');ui.pause.classList.add('hidden');
    showToast('Die Jagd beginnt', '#ffd469', 900);
    state.last=performance.now();
    requestAnimationFrame(loop);
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
    ui.end.classList.remove('hidden');
    ui.endEyebrow.textContent=win?'Nest versorgt':'Morgengrauen';
    ui.endTitle.textContent=win?'Nest versorgt':'Die Nacht ist vorbei';
    ui.endText.textContent=win
      ? 'Du hast genug Beute zurückgebracht. Das Nest ist für diese Nacht versorgt.'
      : 'Es ist hell geworden, bevor genug Beute im Nest war.';
    ui.resultScore.textContent=state.score;
    ui.resultPrey.textContent=state.totalDelivered;
    ui.resultBest.textContent=state.bestCombo+'×';
    sfx(win?'win':'lose');
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
    ui.energy.style.width=clamp(state.energy,0,100)+'%';
    ui.energy.style.background=state.energy<25?'linear-gradient(90deg,#ff6d68,#ff9a74)':'linear-gradient(90deg,#54c97b,#9ff0af)';
    ui.time.style.width=clamp(state.time/state.maxTime*100,0,100)+'%';
    ui.timeText.textContent=Math.max(0,Math.ceil(state.time));
    const n=nest();
    const resting=!owl.carrying&&state.hearts<state.maxHearts&&dist2(owl,n)<(n.r+owl.r-5*state.gameScale)**2;
    if(owl.carrying) setMobileMission(`${iconSvg('mouse')} → ${iconSvg('nest')}`,'Beute im Fang. Bring sie zum Nest.');
    else if(resting) setMobileMission(`${iconSvg('heart')} ${Math.min(2.5,state.restProgress).toFixed(1)} / 2,5`,`Im Nest ruhen: ${Math.min(2.5,state.restProgress).toFixed(1)} / 2,5 s`);
    else if(state.hearts<state.maxHearts) setMobileMission(phaseMissionIcons(phase),`${phase.mission} Im Nest kannst du ein Herz regenerieren.`);
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
    }
    if(phase.requiredType==='gold'&&!owl.carrying&&!state.mice.some(m=>m.type==='gold')&&state.phaseDelivered<phase.target)type='gold';

    let fromRight=owl.x<state.w*.5;
    if(Math.random()<.18)fromRight=!fromRight;
    const s=state.gameScale;
    let spawnX=fromRight?state.w+35*s:-35*s;
    if(Math.abs(spawnX-owl.x)<150*s){fromRight=!fromRight;spawnX=fromRight?state.w+35*s:-35*s}
    const config={
      normal:{speed:rand(70,105),r:16,value:120,color:'#aeb4c0'},
      swift:{speed:rand(125,165),r:15,value:220,color:'#d07c69'},
      gold:{speed:rand(105,145),r:17,value:850,color:'#ffd469'},
      rabbit:{speed:rand(105,145),r:18,value:260,color:'#d7c2a1'},
      frog:{speed:rand(72,108),r:16,value:210,color:'#71c879'},
      beetle:{speed:rand(48,72),r:12,value:160,color:'#70a6c7'}
    }[type];
    state.mice.push({
      type,x:spawnX,y:state.groundY-rand(17,25)*s,
      dir:fromRight?-1:1,speed:config.speed*s*phase.speedMultiplier,r:config.r*s,value:config.value,color:config.color,
      phase:rand(0,6),turn:rand(1.8,4.5),dash:0,glow:rand(0,6)
    });
  }

  function spawnBat(){
    let fromRight=owl.x<state.w*.5;
    if(Math.random()<.2)fromRight=!fromRight;
    const s=state.gameScale;
    let y=state.h*rand(.23,.65);
    for(let i=0;i<5&&Math.hypot((fromRight?state.w:0)-owl.x,y-owl.y)<180*s;i++)y=state.h*rand(.23,.65);
    state.bats.push({
      x:fromRight?state.w+50*s:-50*s,y,dir:fromRight?-1:1,
      speed:rand(105,175)*s*currentPhase().speedMultiplier,r:23*s,phase:rand(0,6),turn:rand(1,3)
    });
    if(state.running&&Math.random()<.3)sfx('bat');
  }

  function spawnFirefly(){
    const margin=70*state.gameScale;
    let x=rand(margin,state.w-margin),y=rand(state.h*.30,state.groundY-margin);
    for(let i=0;i<5&&Math.hypot(x-owl.x,y-owl.y)<90*state.gameScale;i++){x=rand(margin,state.w-margin);y=rand(state.h*.30,state.groundY-margin)}
    state.fireflies.push({x,y,r:11*state.gameScale,phase:rand(0,6),life:rand(8,14)});
  }

  function activateDive(){
    if(!state.running||state.paused||owl.dive||owl.carrying||state.energy<22) return;
    let dx=0,dy=0;
    if(state.keys.has('ArrowRight')||state.keys.has('KeyD')) dx+=1;
    if(state.keys.has('ArrowLeft')||state.keys.has('KeyA')) dx-=1;
    if(state.keys.has('ArrowDown')||state.keys.has('KeyS')) dy+=1;
    if(state.keys.has('ArrowUp')||state.keys.has('KeyW')) dy-=1;
    if(state.pointer.active){dx=state.pointer.x-owl.x;dy=state.pointer.y-owl.y}
    if(state.joystick.active){dx=state.joystick.x;dy=state.joystick.y}
    if(Math.hypot(dx,dy)<.1){dx=Math.cos(owl.angle);dy=Math.sin(owl.angle);if(Math.abs(dy)<.25)dy=.55}
    const len=Math.hypot(dx,dy)||1;
    owl.diveDirX=dx/len;owl.diveDirY=dy/len;
    owl.dive=true;owl.diveTime=.58;state.energy-=22;
    owl.vx+=owl.diveDirX*720*state.gameScale;owl.vy+=owl.diveDirY*720*state.gameScale;
    state.rings.push({x:owl.x,y:owl.y,r:12*state.gameScale,life:.35,max:.35,color:'rgba(255,212,105,.8)'});
    haptic(18);
    sfx('dive');
  }

  function activateEcho(){
    if(!state.running||state.paused||state.energy<34||state.echo>0) return;
    state.energy-=34;state.echo=2.8;
    state.rings.push({x:owl.x,y:owl.y,r:20*state.gameScale,life:1.15,max:1.15,color:'rgba(130,231,255,.85)',sonar:true});
    haptic([12,35,12]);
    showToast('ECHO-ORTUNG','#82e7ff',850);sfx('echo');
  }

  function dropPrey(){
    if(!owl.carrying) return;
    const p=owl.carrying;
    state.mice.push({
      type:p.type,x:owl.x,y:state.groundY-22*state.gameScale,dir:Math.random()>.5?1:-1,
      speed:(p.baseSpeed||95)*state.gameScale,r:(p.baseR||16)*state.gameScale,value:p.value,
      color:p.color,phase:0,turn:2,dash:.45,glow:0
    });
    owl.carrying=null;
    showToast('BEUTE VERLOREN','#ff7772',750);
  }

  function catchMouse(index){
    const m=state.mice[index];
    state.mice.splice(index,1);
    owl.carrying={type:m.type,value:m.value,color:m.color,baseSpeed:m.speed/state.gameScale,baseR:m.r/state.gameScale};
    state.score+=Math.round(m.value*.35);
    state.combo++;state.bestCombo=Math.max(state.bestCombo,state.combo);state.comboClock=7;
    burst(m.x,m.y,m.color,26,230);state.shake=.13;
    floater(m.x,m.y-25,'GEFANGEN!',m.color,22);
    const preyName={gold:'Goldene Maus',rabbit:'Kaninchen',frog:'Frosch',beetle:'Käfer'}[m.type]||'Beute';
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
    state.score+=gain;state.totalDelivered++;
    if(valid) state.phaseDelivered++;
    state.energy=Math.min(100,state.energy+28);
    state.time=Math.min(state.maxTime,state.time+4);
    const n=nest();burst(n.x,n.y,p.color,35,260);state.shake=.18;
    floater(n.x+15,n.y-50,'+'+gain,p.color,25);
    owl.carrying=null;
    showToast(valid?'Im Nest abgeliefert':'Zusätzliche Beute',valid?'#7ee09b':'#ffd469',750);
    haptic([22,35,22,35,35]);
    sfx('deliver');

    if(state.phaseDelivered>=currentPhase().target){
      if(state.phaseIndex===phases.length-1){finish(true);return}
      state.transition=2.4;state.transitionQueued=true;
      showToast('Abschnitt geschafft','#ffd469',1100);sfx('phase');
    }
  }

  function advancePhase(){
    state.phaseIndex++;
    state.phaseDelivered=0;
    state.time=Math.min(state.maxTime+phases[state.phaseIndex].timeBonus,state.time+phases[state.phaseIndex].timeBonus);
    state.maxTime=Math.max(state.maxTime,state.time);
    state.mice=[];state.bats=[];state.fireflies=[];owl.carrying=null;
    setupBranches();
    for(let i=0;i<currentPhase().startMice;i++) spawnMouse();
    for(let i=0;i<Math.min(2+state.phaseIndex,4);i++) spawnBat();
    for(let i=0;i<Math.min(4+state.phaseIndex,6);i++) spawnFirefly();
    state.mouseClock=.25;state.batClock=1.1;state.fireflyClock=.5;state.wave=1;state.waveRemaining=currentPhase().waveSize;state.waveBreak=0;
    state.transitionQueued=false;
    showToast(phases[state.phaseIndex].name,'#82e7ff',1000);
    setMobileMission(phaseMissionIcons(phases[state.phaseIndex]),phases[state.phaseIndex].intro);
  }

  function damage(){
    if(owl.invuln>0) return;
    owl.invuln=1.25;state.hearts--;state.energy=Math.max(0,state.energy-30);state.time=Math.max(0,state.time-currentPhase().hitPenaltySeconds);state.score=Math.max(0,state.score-120);
    state.combo=0;state.comboClock=0;state.shake=.3;
    dropPrey();burst(owl.x,owl.y,'#ff7772',26,240);floater(owl.x,owl.y-40,'Treffer','#ff7772',20);sfx('hit');
    haptic([55,35,70]);
    if(state.hearts<=0) finish(false);
  }

  function update(dt){
    const phase=currentPhase();
    state.elapsed+=dt;updateAudio(dt);
    state.time-=dt*phase.timeDrainMultiplier;
    state.energy=Math.min(100,state.energy+(owl.dive?3.5:9.5)*dt);
    state.echo=Math.max(0,state.echo-dt);
    state.shake=Math.max(0,state.shake-dt);
    owl.invuln=Math.max(0,owl.invuln-dt);
    owl.wing+=dt*(owl.dive?19:10);

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
      const dx=state.pointer.x-owl.x,dy=state.pointer.y-owl.y,d=Math.hypot(dx,dy);
      if(d>18){ax+=dx/d;ay+=dy/d}
    }
    if(state.joystick.active){ax+=state.joystick.x;ay+=state.joystick.y}

    const acc=(owl.carrying?560:720)*state.gameScale;
    owl.vx+=ax*acc*dt;owl.vy+=ay*acc*dt;
    const damping=Math.pow(owl.dive?.22:.12,dt);
    owl.vx*=damping;owl.vy*=damping;

    if(owl.dive){
      owl.diveTime-=dt;
      owl.vx+=owl.diveDirX*500*state.gameScale*dt;owl.vy+=owl.diveDirY*500*state.gameScale*dt;
      if(owl.diveTime<=0)owl.dive=false;
      if(Math.random()<.65) state.particles.push({x:owl.x-rand(-8,8),y:owl.y+rand(-5,5),vx:-owl.diveDirX*rand(80,170),vy:-owl.diveDirY*rand(80,170),life:.25,max:.25,color:'rgba(255,232,168,.75)',size:rand(2,5),spin:0});
    }

    const speedLimit=(owl.carrying?330:(owl.dive?700:430))*state.gameScale;
    const sp=Math.hypot(owl.vx,owl.vy);
    if(sp>speedLimit){owl.vx=owl.vx/sp*speedLimit;owl.vy=owl.vy/sp*speedLimit}
    if(sp>8)owl.angle=Math.atan2(owl.vy,owl.vx);

    owl.x+=owl.vx*dt;owl.y+=owl.vy*dt;
    // Der alte Fehler lag hier: Die Eule war bei 70 % der Höhe abgeschnitten.
    // Jetzt ist der komplette Bereich bis knapp über den Boden erreichbar.
    const owlEdge=38*state.gameScale;
    const playTop=state.h<600?74:(state.touchMode?105:88);
    owl.x=clamp(owl.x,owlEdge,state.w-owlEdge);
    owl.y=clamp(owl.y,playTop,state.groundY-20*state.gameScale);

    const slow=state.echo>0?.42:1;
    if(state.waveRemaining<=0){
      state.waveBreak-=dt;
      if(state.waveBreak<=0){
        state.wave++;state.waveRemaining=phase.waveSize+Math.min(3,state.wave-1);
        showToast(`Welle ${state.wave}`,'#82e7ff',520);
        sfx('wave');
      }
    }
    state.mouseClock-=dt;
    if(state.mouseClock<=0&&state.waveRemaining>0&&state.mice.length<phase.mouseCap){
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

    for(const m of state.mice){
      m.phase+=dt*(8+m.speed/45);m.glow+=dt*4;m.turn-=dt;
      if(m.turn<=0){
        m.turn=rand(1.4,4.2);
        if(Math.random()<.28)m.dir*=-1;
        const dashChance={swift:.65,rabbit:.78,frog:.58}[m.type]||0;
        if(Math.random()<dashChance)m.dash=m.type==='frog'?.38:.55;
      }
      m.dash=Math.max(0,m.dash-dt);
      const ms=m.speed*(m.dash>0?1.75:1)*slow;
      m.x+=m.dir*ms*dt;
      const mouseEdge=22*state.gameScale;
      if(m.x<mouseEdge){m.x=mouseEdge;m.dir=1}if(m.x>state.w-mouseEdge){m.x=state.w-mouseEdge;m.dir=-1}
    }

    for(const b of state.bats){
      b.phase+=dt*10;b.turn-=dt;
      if(b.turn<=0){b.turn=rand(1,2.7);if(Math.random()<.35)b.dir*=-1}
      b.x+=b.dir*b.speed*slow*dt;b.y+=Math.sin(b.phase)*22*dt*slow;
      if(b.x<-65*state.gameScale)b.x=state.w+60*state.gameScale;if(b.x>state.w+65*state.gameScale)b.x=-60*state.gameScale;
      b.y=clamp(b.y,state.h*.2,state.groundY-95*state.gameScale);
    }

    for(const f of state.fireflies){f.phase+=dt*4;f.life-=dt;f.x+=Math.sin(f.phase*.7)*6*dt;f.y+=Math.cos(f.phase)*5*dt}
    state.fireflies=state.fireflies.filter(f=>f.life>0);

    for(let i=state.mice.length-1;i>=0;i--){
      if(!owl.carrying&&owl.dive&&collide(owl,state.mice[i],8)){catchMouse(i);break}
    }

    const n=nest();
    const atNest=dist2(owl,n)<(n.r+owl.r-8*state.gameScale)**2;
    if(owl.carrying&&atNest)deliverPrey();

    state.restCooldown=Math.max(0,state.restCooldown-dt);
    if(!owl.carrying&&atNest&&state.hearts<state.maxHearts&&state.restCooldown<=0&&state.energy>=35){
      state.restProgress+=dt;
      owl.vx*=Math.pow(.01,dt);owl.vy*=Math.pow(.01,dt);
      if(state.restProgress>=2.5){
        state.hearts++;
        state.energy=Math.max(0,state.energy-35);
        state.time=Math.max(1,state.time-8);
        state.restProgress=0;
        state.restCooldown=5;
        burst(n.x,n.y,'#a9d7b0',24,160);
        floater(n.x,n.y-48,'+1 Herz','#a9d7b0',20);
        showToast('Ausgeruht','#a9d7b0',700);
        sfx('power');
      }
    }else{
      state.restProgress=Math.max(0,state.restProgress-dt*2.5);
    }

    if(owl.invuln<=0){
      for(const b of state.bats){if(collide(owl,b,-8)){damage();break}}
      if(owl.invuln<=0){
        for(const br of state.branches){
          const hazard={x:br.x+Math.cos(br.angle)*br.w*.5*br.scale,y:br.y+Math.sin(br.angle)*br.w*.5*br.scale,r:Math.min(34,br.w*.25)*br.scale};
          if(collide(owl,hazard,-7)){damage();break}
        }
      }
    }

    for(let i=state.fireflies.length-1;i>=0;i--){
      if(collide(owl,state.fireflies[i],-9)){
        const f=state.fireflies[i];state.fireflies.splice(i,1);state.energy=Math.min(100,state.energy+30);state.time=Math.min(state.maxTime,state.time+2.5);
        burst(f.x,f.y,'#bffb8c',18,150);floater(f.x,f.y-20,'+KRAFT','#bffb8c',18);sfx('power');
      }
    }

    for(let i=state.particles.length-1;i>=0;i--){
      const p=state.particles[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=110*dt;p.vx*=Math.pow(.2,dt);
      if(p.life<=0)state.particles.splice(i,1);
    }
    for(let i=state.floaters.length-1;i>=0;i--){
      const f=state.floaters[i];f.life-=dt;f.y-=38*dt;if(f.life<=0)state.floaters.splice(i,1);
    }
    for(let i=state.rings.length-1;i>=0;i--){
      const r=state.rings[i];r.life-=dt;r.r+=dt*(r.sonar?520:260)*state.gameScale;if(r.life<=0)state.rings.splice(i,1);
    }

    if(state.time<=0&&!state.ended)finish(false);
    updateHud();
  }

  function roundRectPath(x,y,w,h,r){
    const rr=Math.min(r,w/2,h/2);
    ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
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

    for(const c of state.clouds){
      c.x=(c.x+c.v*.016)%1.2;
      ctx.globalAlpha=c.a;ctx.fillStyle='#d7e0ef';
      const x=(c.x-.1)*state.w,y=c.y*state.h,w=190*c.s*s,h=42*c.s*s;
      ctx.beginPath();ctx.ellipse(x,y,w*.55,h*.6,0,0,Math.PI*2);ctx.ellipse(x+w*.32,y-12*c.s,w*.35,h*.8,0,0,Math.PI*2);ctx.ellipse(x+w*.58,y,w*.42,h*.58,0,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;

    ctx.fillStyle='#24382d';
    for(let i=0;i<8;i++){
      const x=i*state.w/7-90,peak=state.h*(.55+(i%3)*.025),base=state.h*.76;
      ctx.beginPath();ctx.moveTo(x,base);ctx.quadraticCurveTo(x+100,peak,x+220,base);ctx.closePath();ctx.fill();
    }

    // Fernwald
    ctx.fillStyle='#17291f';
    for(let x=-20;x<state.w+40;x+=48){
      const h=65+((x/48)%3)*18;
      ctx.beginPath();ctx.moveTo(x,state.groundY);ctx.lineTo(x+24,state.groundY-h);ctx.lineTo(x+48,state.groundY);ctx.closePath();ctx.fill();
    }

    const ground=ctx.createLinearGradient(0,state.h*.68,0,state.h),groundColors={mist:['#344d47','#142522'],storm:['#263c38','#0d1918'],gold:['#4a4b2c','#1b2115'],blood:['#432d32','#1e1218']}[theme]||['#2b4933','#102016'];
    ground.addColorStop(0,groundColors[0]);ground.addColorStop(1,groundColors[1]);ctx.fillStyle=ground;ctx.fillRect(0,state.h*.70,state.w,state.h*.30);

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

  function drawNest(){
    const n=nest();
    ctx.save();ctx.translate(n.x,n.y);ctx.scale(state.gameScale,state.gameScale);
    ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=15;ctx.shadowOffsetY=8;
    ctx.strokeStyle='#20150d';ctx.lineWidth=6;ctx.lineCap='round';
    for(let i=0;i<18;i++){
      const a=-Math.PI*.94+i/17*Math.PI*.88;
      const x=Math.cos(a)*52,y=Math.sin(a)*25+15;
      ctx.strokeStyle=i%2?'#6e4324':'#8c5930';ctx.beginPath();ctx.moveTo(-x*.75,12+y*.15);ctx.lineTo(x,18+y);ctx.stroke();
    }
    ctx.shadowBlur=0;ctx.fillStyle='#5b361f';ctx.beginPath();ctx.ellipse(0,22,58,26,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#20150d';ctx.lineWidth=5;ctx.stroke();

    for(const x of [-19,0,19]){
      ctx.fillStyle='#c68c52';ctx.beginPath();ctx.ellipse(x,4,13,18,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.fillStyle='#f0c65c';ctx.beginPath();ctx.moveTo(x-5,2);ctx.lineTo(x+9,6);ctx.lineTo(x-5,10);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#111';ctx.beginPath();ctx.arc(x-2,-2,2,0,Math.PI*2);ctx.fill();
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

  function drawBranch(br){
    ctx.save();ctx.translate(br.x,br.y);ctx.rotate(br.angle+Math.sin(state.elapsed*1.2+br.sway)*.015);ctx.scale(br.scale,br.scale);
    ctx.lineCap='round';ctx.strokeStyle='#17100c';ctx.lineWidth=26;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(br.w,0);ctx.stroke();
    ctx.strokeStyle='#6e452d';ctx.lineWidth=18;ctx.stroke();
    ctx.strokeStyle='#17100c';ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(br.w*.55,0);ctx.lineTo(br.w*.72,-36);ctx.stroke();
    ctx.strokeStyle='#6e452d';ctx.lineWidth=7;ctx.stroke();
    ctx.fillStyle='#325b34';ctx.strokeStyle='#172818';ctx.lineWidth=3;
    for(const [x,y,r] of [[br.w*.72,-38,13],[br.w*.58,-24,10],[br.w*.84,-24,11]]){ctx.beginPath();ctx.ellipse(x,y,r*1.25,r,.4,0,Math.PI*2);ctx.fill();ctx.stroke()}
    ctx.restore();
  }

  function drawMouse(m){
    const s=state.gameScale;
    ctx.save();ctx.translate(m.x,m.y+Math.sin(m.phase)*2*s);ctx.scale(m.dir*s,s);
    if(state.echo>0||m.type==='gold'){
      ctx.globalAlpha=.23+.12*Math.sin(m.glow);ctx.fillStyle=m.color;ctx.beginPath();ctx.arc(0,0,m.r/s*2.4,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    }
    ctx.strokeStyle='#17191d';ctx.lineWidth=4;ctx.lineJoin='round';
    ctx.fillStyle=m.color;ctx.beginPath();ctx.ellipse(0,0,24,15,-.04,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle=m.type==='swift'?'#e79b85':(m.type==='gold'?'#ffe89b':'#c8cbd2');ctx.beginPath();ctx.arc(-19,1,11,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle=m.type==='gold'?'#f4a868':'#dd9eaa';ctx.beginPath();ctx.arc(-18,-9,6,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-22,0,2.4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#f294a4';ctx.beginPath();ctx.arc(-30,4,2.5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=m.type==='gold'?'#efbd55':'#d695a2';ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(22,1);ctx.quadraticCurveTo(50,-18,57,5);ctx.stroke();
    const leg=Math.sin(m.phase)*6;ctx.strokeStyle='#17191d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-3,12);ctx.lineTo(-10+leg,20);ctx.moveTo(14,11);ctx.lineTo(21-leg,19);ctx.stroke();
    if(m.type==='gold'){
      ctx.fillStyle='#fff0a9';for(let i=0;i<3;i++){const a=state.elapsed*2+i*2.1;ctx.beginPath();ctx.arc(Math.cos(a)*30,Math.sin(a)*18,2.5,0,Math.PI*2);ctx.fill()}
    }
    ctx.restore();
  }

  function drawRabbit(r){
    const s=state.gameScale,hop=Math.abs(Math.sin(r.phase*.5))*10*s;
    ctx.save();ctx.translate(r.x,r.y-hop);ctx.scale(r.dir*s,s);
    if(state.echo>0){ctx.globalAlpha=.2;ctx.fillStyle='#82e7ff';ctx.beginPath();ctx.arc(0,0,46,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
    ctx.fillStyle=r.color;ctx.strokeStyle='#201b18';ctx.lineWidth=4;ctx.lineJoin='round';
    ctx.beginPath();ctx.ellipse(2,2,27,17,-.08,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.arc(-22,-5,14,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.ellipse(-28,-25,6,19,-.18,0,Math.PI*2);ctx.ellipse(-17,-25,6,19,.15,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#fff4e2';ctx.beginPath();ctx.arc(28,0,8,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-27,-8,2.5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#8c6f56';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-5,14);ctx.lineTo(-14,22);ctx.moveTo(17,13);ctx.lineTo(28,20);ctx.stroke();ctx.restore();
  }

  function drawFrog(f){
    const s=state.gameScale,hop=Math.abs(Math.sin(f.phase*.42))*7*s;
    ctx.save();ctx.translate(f.x,f.y-hop);ctx.scale(f.dir*s,s);
    if(state.echo>0){ctx.globalAlpha=.2;ctx.fillStyle='#82e7ff';ctx.beginPath();ctx.arc(0,0,38,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
    ctx.fillStyle=f.color;ctx.strokeStyle='#17351d';ctx.lineWidth=4;
    ctx.beginPath();ctx.ellipse(0,4,23,14,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.arc(-11,-7,9,0,Math.PI*2);ctx.arc(11,-7,9,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#f5f0c9';ctx.beginPath();ctx.arc(-12,-9,4,0,Math.PI*2);ctx.arc(12,-9,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-13,-10,1.8,0,Math.PI*2);ctx.arc(13,-10,1.8,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#3c8648';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-18,10);ctx.lineTo(-32,19);ctx.lineTo(-39,17);ctx.moveTo(18,10);ctx.lineTo(32,19);ctx.lineTo(39,17);ctx.stroke();ctx.restore();
  }

  function drawBeetle(b){
    const s=state.gameScale;
    ctx.save();ctx.translate(b.x,b.y);ctx.scale(b.dir*s,s);
    if(state.echo>0){ctx.globalAlpha=.2;ctx.fillStyle='#82e7ff';ctx.beginPath();ctx.arc(0,0,30,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
    ctx.strokeStyle='#102532';ctx.lineWidth=3;ctx.beginPath();
    for(const y of [-8,0,8]){ctx.moveTo(-8,y);ctx.lineTo(-22,y-6);ctx.moveTo(8,y);ctx.lineTo(22,y-6)}ctx.stroke();
    ctx.fillStyle=b.color;ctx.beginPath();ctx.ellipse(0,0,14,18,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,-17);ctx.lineTo(0,17);ctx.stroke();
    ctx.fillStyle='#203d4d';ctx.beginPath();ctx.arc(0,-15,8,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
  }

  function drawPrey(prey){
    if(prey.type==='rabbit')drawRabbit(prey);
    else if(prey.type==='frog')drawFrog(prey);
    else if(prey.type==='beetle')drawBeetle(prey);
    else drawMouse(prey);
  }

  function drawBat(b){
    ctx.save();ctx.translate(b.x,b.y);ctx.scale(b.dir*state.gameScale,state.gameScale);
    if(state.echo>0){ctx.globalAlpha=.15;ctx.fillStyle='#82e7ff';ctx.beginPath();ctx.arc(0,0,42,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
    const flap=Math.sin(b.phase)*12;
    ctx.fillStyle='#302943';ctx.strokeStyle='#111019';ctx.lineWidth=4;ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(0,4);ctx.quadraticCurveTo(-22,-26-flap,-48,-7);ctx.quadraticCurveTo(-30,-4,-20,14);ctx.lineTo(0,8);ctx.lineTo(20,14);ctx.quadraticCurveTo(30,-4,48,-7);ctx.quadraticCurveTo(22,-26-flap,0,4);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#574b68';ctx.beginPath();ctx.ellipse(0,6,11,15,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#ef7671';ctx.beginPath();ctx.arc(-4,1,2,0,Math.PI*2);ctx.arc(4,1,2,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  function drawFirefly(f){
    const pulse=.65+.35*Math.sin(f.phase*2);
    ctx.save();ctx.translate(f.x,f.y);ctx.scale(state.gameScale,state.gameScale);ctx.globalAlpha=.18*pulse;ctx.fillStyle='#c8ff84';ctx.beginPath();ctx.arc(0,0,25,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    ctx.fillStyle='#ecffad';ctx.beginPath();ctx.arc(0,0,4.5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(220,255,191,.55)';ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(-5,-1,6,3,-.5,0,Math.PI*2);ctx.ellipse(5,-1,6,3,.5,0,Math.PI*2);ctx.stroke();ctx.restore();
  }

  function drawOwl(){
    ctx.save();ctx.translate(owl.x,owl.y);ctx.scale(state.gameScale,state.gameScale);
    let drawAngle=clamp(owl.angle,-.65,.65);
    if(owl.dive)drawAngle=owl.angle;
    ctx.rotate(drawAngle*.45);
    if(owl.invuln>0&&Math.floor(owl.invuln*14)%2===0)ctx.globalAlpha=.33;

    const flap=Math.sin(owl.wing)*(owl.dive?7:19);
    const bodyGrad=ctx.createLinearGradient(0,-45,0,50);bodyGrad.addColorStop(0,'#c1844e');bodyGrad.addColorStop(1,'#72432c');
    ctx.strokeStyle='#151517';ctx.lineWidth=5.5;ctx.lineJoin='round';

    // Schweif
    ctx.fillStyle='#68402d';ctx.beginPath();ctx.moveTo(-15,32);ctx.lineTo(-4,62);ctx.lineTo(4,37);ctx.lineTo(16,62);ctx.lineTo(17,28);ctx.closePath();ctx.fill();ctx.stroke();

    // Flügel mit Federsegmenten
    for(const side of [-1,1]){
      ctx.save();ctx.scale(side,1);
      ctx.fillStyle='#7b4b32';ctx.beginPath();ctx.moveTo(14,-4);ctx.quadraticCurveTo(62,-48-flap,101,-13);ctx.quadraticCurveTo(71,-7,48,30);ctx.lineTo(15,24);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(240,198,143,.58)';ctx.lineWidth=3;
      for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(36+i*13,7-i*3);ctx.lineTo(61+i*10,-15-flap*.25);ctx.stroke()}
      ctx.restore();
    }

    ctx.fillStyle=bodyGrad;ctx.beginPath();ctx.ellipse(0,10,37,47,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(255,222,177,.45)';ctx.lineWidth=3;
    for(let y=2;y<33;y+=10){ctx.beginPath();ctx.arc(0,y,18-y*.08,.2,Math.PI-.2);ctx.stroke()}

    ctx.fillStyle='#bf8050';ctx.beginPath();ctx.ellipse(0,-21,39,33,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#70432d';ctx.beginPath();ctx.moveTo(-35,-38);ctx.lineTo(-18,-61);ctx.lineTo(-7,-40);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(35,-38);ctx.lineTo(18,-61);ctx.lineTo(7,-40);ctx.closePath();ctx.fill();ctx.stroke();

    for(const ex of [-15,15]){
      ctx.fillStyle='#f7edd6';ctx.beginPath();ctx.arc(ex,-22,13,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.fillStyle='#f4c54c';ctx.beginPath();ctx.arc(ex,-22,6,0,Math.PI*2);ctx.fill();
      const lookX=owl.dive?owl.diveDirX*2:clamp(owl.vx/180,-2,2),lookY=owl.dive?owl.diveDirY*2:clamp(owl.vy/180,-2,2);
      ctx.fillStyle='#111';ctx.beginPath();ctx.arc(ex+lookX,-22+lookY,3,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle='#efa72d';ctx.beginPath();ctx.moveTo(0,-13);ctx.lineTo(-8,0);ctx.lineTo(8,0);ctx.closePath();ctx.fill();ctx.stroke();

    const clawY=owl.dive?55:47;
    ctx.strokeStyle='#d5aa45';ctx.lineWidth=4.5;ctx.lineCap='round';
    for(const x of [-13,13]){ctx.beginPath();ctx.moveTo(x,42);ctx.lineTo(x,clawY);ctx.moveTo(x,clawY);ctx.lineTo(x-8,clawY+8);ctx.moveTo(x,clawY);ctx.lineTo(x+8,clawY+8);ctx.stroke()}

    if(owl.carrying){
      const c=owl.carrying;ctx.save();ctx.translate(0,66);ctx.scale(.82,.82);ctx.fillStyle=c.color;ctx.strokeStyle='#151517';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,0,20,12,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#dca0a7';ctx.beginPath();ctx.arc(-17,1,8,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    }
    ctx.restore();
  }

  function drawEffects(){
    for(const r of state.rings){
      ctx.globalAlpha=clamp(r.life/r.max,0,1);ctx.strokeStyle=r.color;ctx.lineWidth=r.sonar?4:3;ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,Math.PI*2);ctx.stroke();
    }
    ctx.globalAlpha=1;

    for(const p of state.particles){
      ctx.globalAlpha=clamp(p.life/p.max,0,1);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;

    ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 20px system-ui';
    for(const f of state.floaters){
      ctx.globalAlpha=clamp(f.life,0,1);ctx.fillStyle=f.color;ctx.strokeStyle='rgba(0,0,0,.7)';ctx.lineWidth=5;ctx.font=`900 ${f.size}px system-ui`;ctx.strokeText(f.text,f.x,f.y);ctx.fillText(f.text,f.x,f.y);
    }
    ctx.globalAlpha=1;

    if(state.echo>0){
      ctx.fillStyle='rgba(86,205,255,.055)';ctx.fillRect(0,0,state.w,state.h);
    }
  }

  function draw(){
    ctx.save();
    if(state.shake>0)ctx.translate(rand(-9,9),rand(-7,7));
    drawBackground();
    drawNest();
    if(state.restProgress>0){
      const n=nest();
      ctx.save();ctx.strokeStyle='#a9d7b0';ctx.lineWidth=6;ctx.lineCap='round';ctx.beginPath();
      ctx.arc(n.x,n.y,n.r+17*state.gameScale,-Math.PI/2,-Math.PI/2+Math.PI*2*clamp(state.restProgress/2.5,0,1));ctx.stroke();ctx.restore();
    }
    state.branches.forEach(drawBranch);
    state.fireflies.forEach(drawFirefly);
    state.mice.forEach(drawPrey);
    state.bats.forEach(drawBat);
    drawOwl();
    drawEffects();

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
    if(e.repeat&&['Space','KeyE','KeyP'].includes(e.code))return;
    state.keys.add(e.code);
    if(e.code==='Space')activateDive();
    if(e.code==='KeyE')activateEcho();
    if(e.code==='KeyP')pauseGame();
  }
  function keyUp(e){state.keys.delete(e.code)}
  addEventListener('keydown',keyDown,{passive:false});addEventListener('keyup',keyUp);

  function pointerPos(e){
    const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};
  }
  let lastTap=0;
  canvas.addEventListener('pointerdown',e=>{
    if(!state.running||state.paused)return;
    e.preventDefault();
    if(e.pointerType==='touch')return;
    const p=pointerPos(e);state.pointer={active:true,x:p.x,y:p.y};canvas.setPointerCapture(e.pointerId);
    const now=performance.now();
    if(e.pointerType==='touch'&&now-lastTap<300)activateDive();
    lastTap=now;
  },{passive:false});
  canvas.addEventListener('pointermove',e=>{if(state.pointer.active){e.preventDefault();const p=pointerPos(e);state.pointer.x=p.x;state.pointer.y=p.y}},{passive:false});
  canvas.addEventListener('pointerup',e=>{state.pointer.active=false;try{canvas.releasePointerCapture(e.pointerId)}catch(_){}});
  canvas.addEventListener('pointercancel',()=>state.pointer.active=false);

  const joystick=document.getElementById('joystick');
  const joystickKnob=joystick.querySelector('.joystickKnob');
  function moveJoystick(e){
    const r=joystick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    let dx=e.clientX-cx,dy=e.clientY-cy;
    const limit=r.width*.34,d=Math.hypot(dx,dy);
    if(d>limit){dx=dx/d*limit;dy=dy/d*limit}
    state.joystick.x=dx/limit;state.joystick.y=dy/limit;
    joystickKnob.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
  }
  function releaseJoystick(e){
    if(e&&joystick.hasPointerCapture(e.pointerId))joystick.releasePointerCapture(e.pointerId);
    state.joystick={active:false,x:0,y:0};
    joystickKnob.style.transform='translate(-50%,-50%)';
  }
  joystick.addEventListener('pointerdown',e=>{e.preventDefault();state.joystick.active=true;joystick.setPointerCapture(e.pointerId);moveJoystick(e);haptic(8)},{passive:false});
  joystick.addEventListener('pointermove',e=>{if(state.joystick.active){e.preventDefault();moveJoystick(e)}},{passive:false});
  joystick.addEventListener('pointerup',releaseJoystick);
  joystick.addEventListener('pointercancel',releaseJoystick);

  document.querySelectorAll('[data-key]').forEach(btn=>{
    const code=btn.dataset.key;
    const down=e=>{e.preventDefault();state.keys.add(code)};
    const up=e=>{e.preventDefault();state.keys.delete(code)};
    btn.addEventListener('pointerdown',down);btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',up);btn.addEventListener('pointerleave',up);
  });
  document.querySelector('[data-action="dive"]').addEventListener('pointerdown',e=>{e.preventDefault();activateDive()});
  document.querySelector('[data-action="echo"]').addEventListener('pointerdown',e=>{e.preventDefault();activateEcho()});

  document.getElementById('startBtn').addEventListener('click',startGame);
  document.getElementById('restartBtn').addEventListener('click',startGame);
  document.getElementById('resumeBtn').addEventListener('click',()=>pauseGame(false));
  ui.sound.addEventListener('click',()=>{
    state.muted=!state.muted;ui.sound.innerHTML=iconSvg(state.muted?'muted':'speaker');
    if(!state.muted)initAudio();
    setAudioFocus(!state.muted&&state.running&&!state.paused&&!state.ended);
  });
  document.addEventListener('visibilitychange',()=>setAudioFocus(!document.hidden&&state.running&&!state.paused&&!state.ended));

  // statische Startszene
  reset();draw();
})();
