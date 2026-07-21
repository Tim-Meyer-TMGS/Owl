(() => {
  'use strict';
  const root=window.OWL,data=window.OWL_FIREFLY_QUEST_DATA;
  if(!root?.register)throw new Error('OWL-Namensraum muss vor firefly-quest.js geladen werden.');
  if(!data||data.formatVersion!==1||!Array.isArray(data.scenes))throw new Error('Ungültige Glühwürmchen-Questdaten.');
  const byLevel=new Map(data.scenes.map(scene=>[scene.levelOrder,scene]));

  function create(levelOrder,world,view,contexts=[],saved={}){
    const source=byLevel.get(levelOrder);if(!source)return null;const contextById=new Map(contexts.map(context=>[context.id,context]));
    const revealed=new Set(saved.revealedContextIds||source.trailContextIds.filter(id=>contextById.get(id)?.completed));
    const points=source.trailContextIds.map(id=>{const context=contextById.get(id);return {id,x:context?.x||0,y:context?.y||view.height*.4,revealed:revealed.has(id)}});
    const allRevealed=revealed.size>=source.trailContextIds.length,lost={...source.lost,x:world.width*source.lost.xRatio,y:Math.min(view.groundY-42,view.height*source.lost.yRatio),vx:0,vy:0,phase:0};
    if(saved.lost&&Number.isFinite(saved.lost.x)){lost.x=saved.lost.x;lost.y=saved.lost.y;lost.vx=Number(saved.lost.vx)||0;lost.vy=Number(saved.lost.vy)||0}
    return {source,points,revealedContextIds:revealed,lost,field:{...source.field,x:world.width*source.field.xRatio,y:Math.min(view.groundY-18,view.height*source.field.yRatio)},found:Boolean(saved.found||allRevealed),state:saved.state||((saved.found||allRevealed)?'waiting':'hidden'),separations:Number(saved.separations)||0,arrived:Boolean(saved.arrived),newlyFound:false};
  }

  function update(scene,signal,dt){
    if(!scene)return null;const events={revealed:[],found:false,started:false,stopped:false,resumed:false,arrived:false};scene.lost.phase+=dt*4;
    for(const point of scene.points){if(point.revealed||!signal.completedHootIds.has(point.id))continue;point.revealed=true;scene.revealedContextIds.add(point.id);events.revealed.push(point)}
    if(!scene.found&&scene.revealedContextIds.size===scene.points.length){scene.found=true;scene.state='waiting';events.found=true}
    if(!scene.found||scene.arrived)return events;
    const lost=scene.lost,escort=scene.source.escort,distance=Math.hypot(signal.owl.x-lost.x,signal.owl.y-lost.y);
    const approachDistance=(scene.separations?escort.resumeDistance:escort.startDistance)*signal.scale;
    if(scene.state==='waiting'&&distance<=approachDistance){scene.state='following';events[scene.separations?'resumed':'started']=true}
    if(scene.state==='following'&&distance>escort.stopDistance*signal.scale){scene.state='waiting';scene.separations++;lost.vx=0;lost.vy=0;events.stopped=true}
    if(scene.state==='following'){
      const target={x:signal.owl.x-signal.owl.facing*escort.followDistance*signal.scale,y:signal.owl.y+18*signal.scale},dx=target.x-lost.x,dy=target.y-lost.y,d=Math.hypot(dx,dy)||1,max=escort.speed*signal.scale,desired=Math.min(max,d*2.2),blend=Math.min(1,dt*3.2);
      lost.vx+=(dx/d*desired-lost.vx)*blend;lost.vy+=(dy/d*desired-lost.vy)*blend;lost.x+=lost.vx*dt;lost.y+=lost.vy*dt;
    }
    const atField=Math.hypot(lost.x-scene.field.x,lost.y-scene.field.y)<=scene.field.radius*1.2*signal.scale,owlAtField=Math.hypot(signal.owl.x-scene.field.x,signal.owl.y-scene.field.y)<=scene.field.radius*1.35*signal.scale;
    if(atField&&owlAtField){scene.arrived=true;scene.state='arrived';lost.x=scene.field.x;lost.y=scene.field.y-35*signal.scale;lost.vx=0;lost.vy=0;events.arrived=true}
    return events;
  }
  const complete=scene=>Boolean(scene?.arrived);
  const snapshot=scene=>scene?{revealedContextIds:[...scene.revealedContextIds],found:scene.found,state:scene.state,separations:scene.separations,arrived:scene.arrived,lost:{x:scene.lost.x,y:scene.lost.y,vx:scene.lost.vx,vy:scene.lost.vy}}:null;
  root.fireflyQuest=root.register('fireflyQuest',{create,update,complete,snapshot,source:data});
})();
