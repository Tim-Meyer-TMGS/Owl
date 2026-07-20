(() => {
  'use strict';
  const root=window.OWL;
  const data=window.OWL_WORLD_DATA;
  if(!root?.register)throw new Error('OWL-Namensraum muss vor world-loader.js geladen werden.');
  if(!data||data.formatVersion!==1||!Array.isArray(data.scenes))throw new Error('Keine gültigen Weltdaten geladen.');

  const required=['id','levelId','levelOrder','chapter','sceneType','worldWidth','worldHeight','worldWidthScreens','start','goal','nest','cameraMode','safeBranches','landmarks','storyTriggers','objectives'];
  const ids=new Set(),orders=new Set();
  data.scenes.forEach((scene,index)=>{
    const missing=required.filter(key=>scene[key]===undefined);
    if(missing.length)throw new Error(`Weltszene ${index+1}: Pflichtfelder fehlen: ${missing.join(', ')}`);
    if(ids.has(scene.id))throw new Error(`Doppelte Welt-ID: ${scene.id}`);
    if(orders.has(scene.levelOrder))throw new Error(`Doppelte Welt-Levelnummer: ${scene.levelOrder}`);
    if(!Array.isArray(scene.landmarks)||scene.landmarks.length<2)throw new Error(`${scene.id}: mindestens zwei Landmarken erforderlich.`);
    ids.add(scene.id);orders.add(scene.levelOrder);
  });
  const byOrder=new Map(data.scenes.map(scene=>[scene.levelOrder,scene]));
  const scalePoint=(point,sx,sy)=>({...point,x:point.x*sx,y:point.y*sy});

  function load(levelOrder,viewport){
    const source=byOrder.get(levelOrder);
    if(!source)throw new Error(`Keine Welt für Level ${levelOrder} gefunden.`);
    const width=viewport.width*source.worldWidthScreens;
    const sx=width/source.worldWidth,sy=viewport.height/data.referenceViewport.height;
    const groundY=viewport.groundY;
    const clampY=value=>Math.max(viewport.playTop+34,Math.min(groundY-45,value));
    const mapPoint=point=>{const mapped=scalePoint(point,sx,sy);mapped.y=clampY(mapped.y);return mapped};
    return {
      ...source,width,height:viewport.height,widthScreens:width/viewport.width,
      start:mapPoint(source.start),goal:mapPoint(source.goal),nest:mapPoint(source.nest),
      safeBranches:source.safeBranches.map(item=>({...scalePoint(item,sx,sy),y:clampY(item.y*sy),width:item.width*sx})),
      landmarks:source.landmarks.map(item=>({...scalePoint(item,sx,sy),y:Math.min(groundY,item.y*sy)}))
    };
  }

  root.worlds=root.register('worlds',{load,count:data.scenes.length,source:data});
})();
