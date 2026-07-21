(() => {
  'use strict';
  const root=window.OWL,data=window.OWL_STORY_EVENT_DATA;
  if(!root?.register)throw new Error('OWL-Namensraum muss vor story.js geladen werden.');
  if(!data||data.formatVersion!==1||!Array.isArray(data.scenes))throw new Error('Keine gültigen Story-Ereignisdaten geladen.');

  const triggerTypes=new Set(['position','objective','landing','hoot','companionDistance']);
  const companionStates=new Set(['follow','wait','ahead','help','unsure','arrived']);
  const sceneOrders=new Set(),eventIds=new Set();
  data.scenes.forEach(scene=>{
    if(!Number.isInteger(scene.levelOrder)||!scene.levelId||!scene.chapter||!Array.isArray(scene.events)||!Array.isArray(scene.companions))throw new Error('Story-Szene besitzt unvollständige Pflichtfelder.');
    if(sceneOrders.has(scene.levelOrder))throw new Error(`Doppelte Story-Levelnummer: ${scene.levelOrder}`);sceneOrders.add(scene.levelOrder);
    const companionIds=new Set(scene.companions.map(companion=>companion.id));scene.companions.forEach(companion=>{if(!companion.id||!companionStates.has(companion.state))throw new Error(`Ungültiger Begleiter in Level ${scene.levelOrder}.`)});
    scene.events.forEach(event=>{
      if(!event.id||eventIds.has(event.id)||!event.speaker||!event.text||!triggerTypes.has(event.trigger?.type))throw new Error(`Ungültiges Story-Ereignis: ${event.id||'ohne ID'}.`);
      if(event.action?.companion&&!companionIds.has(event.action.companion))throw new Error(`${event.id}: unbekannter Aktionsbegleiter.`);
      if(event.action?.state&&!companionStates.has(event.action.state))throw new Error(`${event.id}: unbekannter Begleiterzustand.`);
      eventIds.add(event.id);
    });
  });
  const byOrder=new Map(data.scenes.map(scene=>[scene.levelOrder,scene]));

  function createScene(levelOrder,world,view,completedIds=[]){
    const source=byOrder.get(levelOrder);if(!source)throw new Error(`Keine Story-Ereignisse für Level ${levelOrder}.`);const completed=new Set(completedIds);
    const events=source.events.map((event,index)=>({...event,order:index,x:Number.isFinite(event.trigger.xRatio)?world.width*event.trigger.xRatio:null,y:Number.isFinite(event.trigger.yRatio)?view.height*event.trigger.yRatio:null,completed:completed.has(event.id),lastFired:-Infinity}));
    const companions=source.companions.map((entry,index)=>({
      ...entry,x:world.width*entry.xRatio,y:Math.max(view.playTop+25,Math.min(view.groundY-42,view.height*entry.yRatio)),anchorX:world.width*entry.xRatio,anchorY:Math.max(view.playTop+25,Math.min(view.groundY-42,view.height*entry.yRatio)),
      vx:0,vy:0,phase:index*1.9,courage:Number(entry.courage)||0,recovering:false
    }));
    return {levelOrder,chapter:source.chapter,events,companions};
  }

  function triggerMatches(event,signal,scene){
    if(event.once&&event.completed)return false;
    if(!event.once&&signal.elapsed-event.lastFired<Number(event.cooldown||5))return false;
    if(event.requires?.some(id=>!scene.events.some(item=>item.id===id&&item.completed)))return false;
    const trigger=event.trigger;
    if(trigger.type==='position')return signal.owl.x>=event.x;
    if(trigger.type==='objective')return signal.objectiveProgress>=Number(trigger.progress||0);
    if(trigger.type==='landing')return signal.landedPerches.has(trigger.perchId);
    if(trigger.type==='hoot')return signal.hootContextIds.has(trigger.contextId);
    if(trigger.type==='companionDistance'){
      const companion=scene.companions.find(item=>item.id===trigger.companion);if(!companion)return false;const distance=Math.hypot(companion.x-signal.owl.x,companion.y-signal.owl.y);
      const threshold=trigger.distance*(signal.scale||1);return trigger.comparison==='far'?distance>=threshold:distance<=threshold;
    }
    return false;
  }

  function nextEvents(scene,signal,limit=1){
    const matches=[];
    for(const event of scene.events){
      if(matches.length>=limit)break;if(!triggerMatches(event,signal,scene))continue;
      event.lastFired=signal.elapsed;if(event.once)event.completed=true;matches.push(event);
    }
    return matches;
  }

  function applyAction(scene,action){
    if(!action?.companion)return null;const companion=scene.companions.find(item=>item.id===action.companion);if(!companion)return null;
    if(action.state&&companionStates.has(action.state))companion.state=action.state;
    if(Number.isFinite(action.courage))companion.courage=Math.max(0,Math.min(100,companion.courage+action.courage));
    return companion;
  }

  function targetFor(companion,context){
    const direction=context.owl.facing||1;
    if(companion.state==='wait')return {x:companion.anchorX,y:companion.anchorY};
    if(companion.state==='ahead')return {x:context.owl.x+direction*155*context.scale,y:context.owl.y-22*context.scale};
    if(companion.state==='help')return {x:context.owl.x+direction*82*context.scale,y:context.owl.y-42*context.scale};
    if(companion.state==='unsure')return {x:context.owl.x-direction*125*context.scale,y:context.owl.y+38*context.scale};
    if(companion.state==='arrived')return context.goal;
    return {x:context.owl.x-direction*(companion.id==='bruno'?112:82)*context.scale,y:context.owl.y+(companion.id==='glow'?18:28)*context.scale};
  }

  function updateCompanions(scene,context,dt){
    for(const companion of scene.companions){
      companion.phase+=dt*(companion.id==='glow'?4.4:7.5);let target=targetFor(companion,context);const owlDistance=Math.hypot(companion.x-context.owl.x,companion.y-context.owl.y);
      companion.recovering=owlDistance>620*context.scale;
      if(companion.recovering&&context.lastSafe)target={x:context.lastSafe.x,y:context.lastSafe.y-35*context.scale};
      const dx=target.x-companion.x,dy=target.y-companion.y,distance=Math.hypot(dx,dy)||1,maxSpeed=(companion.recovering?430:(companion.state==='unsure'?145:230))*context.scale;
      const desiredX=dx/distance*Math.min(maxSpeed,distance*3.2),desiredY=dy/distance*Math.min(maxSpeed,distance*3.2),blend=Math.min(1,dt*(companion.recovering?4.6:3.4));
      companion.vx+=(desiredX-companion.vx)*blend;companion.vy+=(desiredY-companion.vy)*blend;companion.x+=companion.vx*dt;companion.y+=companion.vy*dt;
      companion.x=Math.max(24*context.scale,Math.min(context.worldWidth-24*context.scale,companion.x));companion.y=Math.max(context.playTop+18,Math.min(context.groundY-42*context.scale,companion.y));
      if(companion.id==='fynn'){
        const near=owlDistance<210*context.scale,resting=context.owl.flightState==='perched';
        companion.courage=Math.max(0,Math.min(100,companion.courage+dt*((near?1.3:owlDistance>440*context.scale?-.32:0)+(resting&&near?1.4:0))));
      }
    }
  }

  const completedIds=scene=>scene?.events.filter(event=>event.completed).map(event=>event.id)||[];
  root.story=root.register('story',{createScene,nextEvents,applyAction,updateCompanions,completedIds,states:[...companionStates],sceneCount:data.scenes.length,eventCount:eventIds.size,source:data});
})();
