(() => {
  'use strict';
  const root=window.OWL,data=window.OWL_RACE_DATA;
  if(!root?.register)throw new Error('OWL-Namensraum muss vor race.js geladen werden.');
  if(!data||data.formatVersion!==1||!Array.isArray(data.scenes))throw new Error('Ungültige Renndaten.');
  const byLevel=new Map(data.scenes.map(scene=>[scene.levelOrder,scene]));
  function create(levelOrder,world,view,saved={}){
    const source=byLevel.get(levelOrder);if(!source)return null;
    const gates=source.gates.map(gate=>({...gate,x:world.width*gate.xRatio,y:view.height*gate.yRatio})),bruno={...source.bruno,x:world.width*source.bruno.xRatio,y:view.height*source.bruno.yRatio,vx:0,vy:0,stage:Number(saved.bruno?.stage)||0,wing:0,glasses:0,finished:Boolean(saved.bruno?.finished)};
    if(saved.bruno&&Number.isFinite(saved.bruno.x)){bruno.x=saved.bruno.x;bruno.y=saved.bruno.y;bruno.vx=Number(saved.bruno.vx)||0;bruno.vy=Number(saved.bruno.vy)||0}
    const moth={...source.moth,baseX:world.width*source.moth.xRatio,baseY:view.height*source.moth.yRatio,x:0,y:0,phase:Number(saved.mothPhase)||0};
    return {source,gates,playerStage:Number(saved.playerStage)||0,bruno,moth,introTime:Number.isFinite(saved.introTime)?saved.introTime:source.bruno.introSeconds,draftActive:false,draftTime:Number(saved.draftTime)||0,draftBest:Number(saved.draftBest)||0,mothCaught:Boolean(saved.mothCaught),complete:Boolean(saved.complete)};
  }
  function nextGate(scene,stage){return scene.gates.find(gate=>gate.stage===stage+1)||null}
  function update(scene,signal,dt){
    if(!scene)return null;const events={gate:null,draftStarted:false,draftEnded:false,mothCaught:false,brunoFinished:false};const scale=signal.scale||1,direction=scene.source.direction;scene.introTime=Math.max(0,scene.introTime-dt);scene.bruno.wing+=dt*6.8;scene.bruno.glasses=scene.introTime>0?Math.sin(scene.introTime*8)*Math.min(1,scene.introTime):0;
    const playerGate=nextGate(scene,scene.playerStage);if(playerGate&&Math.hypot(signal.owl.x-playerGate.x,signal.owl.y-playerGate.y)<=playerGate.radius*scale){scene.playerStage=playerGate.stage;events.gate=playerGate}
    const brunoGate=nextGate(scene,scene.bruno.stage),brunoTarget=brunoGate||{x:scene.moth.baseX-direction*80*scale,y:scene.moth.baseY};
    if(!scene.bruno.finished){const dx=brunoTarget.x-scene.bruno.x,dy=brunoTarget.y-scene.bruno.y,d=Math.hypot(dx,dy)||1,speed=scene.source.bruno.speed*scale,blend=Math.min(1,dt*2.4);scene.bruno.vx+=(dx/d*speed-scene.bruno.vx)*blend;scene.bruno.vy+=(dy/d*speed-scene.bruno.vy)*blend;scene.bruno.x+=scene.bruno.vx*dt;scene.bruno.y+=scene.bruno.vy*dt;if(brunoGate&&Math.hypot(scene.bruno.x-brunoGate.x,scene.bruno.y-brunoGate.y)<=brunoGate.radius*.55*scale)scene.bruno.stage=brunoGate.stage;if(!brunoGate&&Math.hypot(scene.bruno.x-brunoTarget.x,scene.bruno.y-brunoTarget.y)<30*scale){scene.bruno.finished=true;scene.bruno.vx=0;scene.bruno.vy=0;events.brunoFinished=true}}
    const behind=(scene.bruno.x-signal.owl.x)*direction,vertical=Math.abs(scene.bruno.y-signal.owl.y),wasDraft=scene.draftActive;scene.draftActive=!scene.bruno.finished&&behind>22*scale&&behind<scene.source.draft.distance*scale&&vertical<scene.source.draft.height*scale;
    if(scene.draftActive){scene.draftTime+=dt;scene.draftBest=Math.max(scene.draftBest,scene.draftTime)}else scene.draftTime=0;events.draftStarted=!wasDraft&&scene.draftActive;events.draftEnded=wasDraft&&!scene.draftActive;
    scene.moth.phase+=dt*scene.source.moth.frequency;scene.moth.x=scene.moth.baseX+Math.sin(scene.moth.phase*.83)*scene.source.moth.amplitudeX*scale;scene.moth.y=scene.moth.baseY+Math.sin(scene.moth.phase*1.37)*scene.source.moth.amplitudeY*scale;
    if(scene.playerStage===scene.gates.length&&!scene.mothCaught&&Math.hypot(signal.owl.x-scene.moth.x,signal.owl.y-scene.moth.y)<=scene.source.moth.radius*scale){scene.mothCaught=true;scene.complete=true;events.mothCaught=true}
    return events;
  }
  const snapshot=scene=>scene?{playerStage:scene.playerStage,bruno:{x:scene.bruno.x,y:scene.bruno.y,vx:scene.bruno.vx,vy:scene.bruno.vy,stage:scene.bruno.stage,finished:scene.bruno.finished},mothPhase:scene.moth.phase,introTime:scene.introTime,draftTime:scene.draftTime,draftBest:scene.draftBest,mothCaught:scene.mothCaught,complete:scene.complete}:null;
  const complete=scene=>Boolean(scene?.complete);
  root.race=root.register('race',{create,update,nextGate,snapshot,complete,source:data});
})();
