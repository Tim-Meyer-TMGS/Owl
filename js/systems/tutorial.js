(() => {
  'use strict';
  const root=window.OWL,data=window.OWL_TUTORIAL_DATA;
  if(!root?.register)throw new Error('OWL-Namensraum muss vor tutorial.js geladen werden.');
  const allowedTypes=new Set(['movement','landing','carrying','delivered','hoot']);
  if(!data||data.formatVersion!==1||!Number.isInteger(data.levelOrder)||!Array.isArray(data.packages)||data.packages.length!==3||!Array.isArray(data.steps)||!data.steps.length)throw new Error('Ungültige Tutorialdaten.');
  const ids=new Set();data.steps.forEach(step=>{if(!step.id||ids.has(step.id)||!allowedTypes.has(step.type)||!step.icon||!step.text)throw new Error(`Ungültiger Tutorialschritt: ${step.id||'ohne ID'}.`);ids.add(step.id)});

  function create(world,view,completedIds=[],deliveredPackageIds=[]){
    const completed=new Set(completedIds),delivered=new Set(deliveredPackageIds);
    const steps=data.steps.map(step=>({...step,completed:completed.has(step.id)}));
    return {
      levelOrder:data.levelOrder,steps,
      packages:data.packages.map(item=>({...item,x:world.width*item.xRatio,y:Math.min(view.groundY-20,view.height*item.yRatio),delivered:delivered.has(item.id)})),
      deliveredPackageIds:delivered,startX:null,startY:null,cinematic:{active:false,time:0,windReleased:false},complete:steps.every(step=>step.completed)
    };
  }
  const current=tutorial=>tutorial?.steps.find(step=>!step.completed)||null;
  function evaluate(tutorial,signal){
    const step=current(tutorial);if(!step){tutorial.complete=true;return null}
    if(tutorial.startX===null){tutorial.startX=signal.owl.x;tutorial.startY=signal.owl.y}
    let matched=false;
    if(step.type==='movement')matched=Math.hypot(signal.owl.x-tutorial.startX,signal.owl.y-tutorial.startY)>=step.distance*signal.scale;
    else if(step.type==='landing')matched=signal.owl.flightState==='perched'&&signal.owl.perchId===step.perchId;
    else if(step.type==='carrying')matched=signal.owl.carrying?.type===step.itemType;
    else if(step.type==='delivered')matched=signal.delivered>=step.target;
    else if(step.type==='hoot')matched=signal.hootContextIds.has(step.contextId);
    if(!matched)return null;step.completed=true;tutorial.startX=signal.owl.x;tutorial.startY=signal.owl.y;if(!current(tutorial))tutorial.complete=true;return step;
  }
  const completedIds=tutorial=>tutorial?.steps.filter(step=>step.completed).map(step=>step.id)||[];
  root.tutorial=root.register('tutorial',{create,current,evaluate,completedIds,source:data,stepCount:data.steps.length});
})();
