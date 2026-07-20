(() => {
  'use strict';
  const root=window.OWL,data=window.OWL_HOOT_DATA;
  if(!root?.register)throw new Error('OWL-Namensraum muss vor hoot.js geladen werden.');
  if(!data||data.formatVersion!==1||!Array.isArray(data.scenes))throw new Error('Keine gültigen Huuu-Kontextdaten geladen.');

  const allowedTypes=new Set(['lightTrail','hiddenObject','calmFireflies','calmFynn','distantSpeaker','leafBurst','fogMarker','finaleChain']);
  const functions={
    reveal:{color:'#82e7ff',icon:'sun',label:'Spur'},discover:{color:'#ffe39a',icon:'feather',label:'Fund'},
    calm:{color:'#9fe7b0',icon:'heart',label:'Beruhigen'},speak:{color:'#f2d58a',icon:'hoot',label:'Antwort'},
    move:{color:'#e7c778',icon:'feather',label:'Wind'},orient:{color:'#91d4df',icon:'moon',label:'Echo'},
    finale:{color:'#ffe7a0',icon:'moon',label:'Gemeinsam'},repel:{color:'#c99cff',icon:'hoot',label:'Vertreiben'},
    none:{color:'#82e7ff',icon:'hoot',label:'Huuu'}
  };
  const typeFunction={lightTrail:'reveal',hiddenObject:'discover',calmFireflies:'calm',calmFynn:'calm',distantSpeaker:'speak',leafBurst:'move',fogMarker:'orient',finaleChain:'finale'};
  const priority={finaleChain:9,hiddenObject:8,lightTrail:7,fogMarker:6,calmFynn:5,calmFireflies:5,distantSpeaker:4,leafBurst:3};
  const ids=new Set(),orders=new Set();
  data.scenes.forEach(scene=>{
    if(!Number.isInteger(scene.levelOrder)||!scene.levelId||!scene.chapter||!Array.isArray(scene.contexts)||!scene.contexts.length)throw new Error('Huuu-Szene besitzt unvollständige Pflichtfelder.');
    if(orders.has(scene.levelOrder))throw new Error(`Doppelte Huuu-Levelnummer: ${scene.levelOrder}`);orders.add(scene.levelOrder);
    scene.contexts.forEach(context=>{
      if(ids.has(context.id))throw new Error(`Doppelte Huuu-Kontext-ID: ${context.id}`);ids.add(context.id);
      if(!allowedTypes.has(context.type))throw new Error(`Unbekannter Huuu-Kontexttyp: ${context.type}`);
      ['xRatio','yRatio','radius','icon','color','audioResponse'].forEach(field=>{if(context[field]===undefined)throw new Error(`${context.id}: ${field} fehlt.`)});
    });
  });
  const byOrder=new Map(data.scenes.map(scene=>[scene.levelOrder,scene]));
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

  function createScene(levelOrder,world,view,completedIds=[]){
    const source=byOrder.get(levelOrder);if(!source)throw new Error(`Keine Huuu-Kontexte für Level ${levelOrder}.`);const completed=new Set(completedIds);
    return source.contexts.map((context,index)=>({...context,x:world.width*context.xRatio,y:Math.max(view.playTop+30,Math.min(view.groundY-38,view.height*context.yRatio)),completed:completed.has(context.id),revealed:completed.has(context.id),visibleUntil:0,pulse:index*1.7}));
  }

  function isSequenceActive(context,contexts){
    if(context.type!=='lightTrail')return true;
    const pending=contexts.filter(item=>item.type==='lightTrail'&&!item.completed).sort((a,b)=>a.sequence-b.sequence);
    return pending[0]?.id===context.id;
  }

  function candidates(contexts,origin,radius){
    return contexts.filter(context=>{
      if(context.oneShot&&context.completed)return false;if(!isSequenceActive(context,contexts))return false;
      const maximum=context.type==='distantSpeaker'?radius*2.25:Math.min(radius,context.radius);
      return distance(origin,context)<=maximum;
    }).sort((a,b)=>(priority[b.type]||0)-(priority[a.type]||0)||distance(origin,a)-distance(origin,b));
  }
  function preview(contexts,origin,radius){return candidates(contexts,origin,radius)[0]||null}
  function functionFor(context){return typeFunction[context?.type]||'none'}
  function styleFor(kind){return functions[kind]||functions.none}
  function completedIds(contexts){return contexts.filter(context=>context.completed).map(context=>context.id)}

  root.hoot=root.register('hoot',{createScene,candidates,preview,functionFor,styleFor,completedIds,functions,sceneCount:data.scenes.length,source:data});
})();
