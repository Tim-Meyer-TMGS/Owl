(() => {
  'use strict';
  const root=window.OWL,data=window.OWL_MEADOW_DATA;
  if(!root?.register)throw new Error('OWL-Namensraum muss vor meadow.js geladen werden.');
  if(!data||data.formatVersion!==1||!Array.isArray(data.scenes))throw new Error('Ungültige Wiesenroutendaten.');
  const byLevel=new Map(data.scenes.map(scene=>[scene.levelOrder,scene]));

  function create(levelOrder,world,view,saved={}){
    const source=byLevel.get(levelOrder);if(!source)return null;
    const completedGates=new Set(saved.completedGateIds||[]),deliveredFinds=new Set(saved.deliveredFindIds||[]),pickedFinds=new Set(saved.pickedFindIds||[]);
    const gates=source.gates.map(gate=>({...gate,x:world.width*gate.xRatio,y:view.height*gate.yRatio,completed:completedGates.has(gate.id),skipped:false}));
    const highestStage=gates.reduce((value,gate)=>gate.completed?Math.max(value,gate.stage):value,0);
    gates.forEach(gate=>{gate.skipped=gate.stage<=highestStage&&!gate.completed});
    const finds=source.finds.map(find=>({...find,x:world.width*find.xRatio,y:Math.min(view.groundY-24,view.height*find.yRatio),picked:pickedFinds.has(find.id)||deliveredFinds.has(find.id),delivered:deliveredFinds.has(find.id),phase:Number(find.xRatio)*8}));
    const mouse=source.mouse?{...source.mouse,x:world.width*source.mouse.xRatio,y:Math.min(view.groundY-30,view.height*source.mouse.yRatio),encountered:Boolean(saved.mouseEncountered),phase:0}:null;
    return {source,gates,finds,mouse,stage:highestStage,combo:Math.max(0,Number(saved.combo)||highestStage),comboClock:Math.max(0,Number(saved.comboClock)||0),completedGateIds:completedGates,deliveredFindIds:deliveredFinds,pickedFindIds:pickedFinds};
  }
  function activeGates(scene){return scene?scene.gates.filter(gate=>!gate.completed&&!gate.skipped&&gate.stage===scene.stage+1):[]}
  function passGate(scene,owl,scale=1){
    const gate=activeGates(scene).find(item=>Math.hypot(item.x-owl.x,item.y-owl.y)<=item.radius*scale);if(!gate)return null;
    scene.stage=gate.stage;scene.combo++;scene.comboClock=scene.source.routeSeconds;scene.completedGateIds.add(gate.id);
    scene.gates.filter(item=>item.stage===gate.stage).forEach(item=>{item.completed=item.id===gate.id;item.skipped=item.id!==gate.id});return gate;
  }
  function tick(scene,dt){if(!scene)return;if(scene.comboClock>0){scene.comboClock=Math.max(0,scene.comboClock-dt);if(scene.comboClock===0)scene.combo=0}if(scene.mouse)scene.mouse.phase+=dt*2.2}
  function nearbyFind(scene,owl,scale=1){return scene?.finds.find(find=>!find.picked&&Math.hypot(find.x-owl.x,find.y-owl.y)<=(find.radius||42)*scale)||null}
  function pickFind(scene,id){const find=scene?.finds.find(item=>item.id===id&&!item.picked);if(!find)return null;find.picked=true;scene.pickedFindIds.add(id);return find}
  function deliverFind(scene,id){const find=scene?.finds.find(item=>item.id===id);if(!find)return null;find.picked=true;find.delivered=true;scene.pickedFindIds.add(id);scene.deliveredFindIds.add(id);return find}
  function encounterMouse(scene,owl,scale=1){const mouse=scene?.mouse;if(!mouse||mouse.encountered||Math.hypot(mouse.x-owl.x,mouse.y-owl.y)>mouse.radius*scale)return null;mouse.encountered=true;return mouse}
  function complete(scene){if(!scene)return true;const req=scene.source.requirements;return scene.stage>=req.routeStages&&scene.deliveredFindIds.size>=req.finds&&(!req.mouseEncounter||scene.mouse?.encountered)}
  function snapshot(scene){return scene?{completedGateIds:[...scene.completedGateIds],pickedFindIds:[...scene.pickedFindIds],deliveredFindIds:[...scene.deliveredFindIds],mouseEncountered:Boolean(scene.mouse?.encountered),combo:scene.combo,comboClock:scene.comboClock}:null}
  root.meadow=root.register('meadow',{create,activeGates,passGate,tick,nearbyFind,pickFind,deliverFind,encounterMouse,complete,snapshot,source:data});
})();
