(() => {
  'use strict';
  const root=window.OWL;
  if(!root?.register)throw new Error('OWL-Namensraum muss vor perches.js geladen werden.');

  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const target=(perch,owlRadius)=>({x:perch.x,y:perch.y-owlRadius*.72});

  function findTapped(point,perches,owlRadius){
    return perches.find(perch=>{
      const half=Math.max(52,perch.width*.5)+owlRadius*.45;
      return Math.abs(point.x-perch.x)<=half&&Math.abs(point.y-perch.y)<=Math.max(58,owlRadius*1.8);
    })||null;
  }

  function nearest(actor,perches,maxDistance){
    let result=null,best=maxDistance;
    perches.forEach(perch=>{const d=distance(actor,target(perch,actor.r));if(d<best){best=d;result=perch}});
    return result;
  }

  function approach(actor,perch,dt,profile){
    const destination=target(perch,actor.r),dx=destination.x-actor.x,dy=destination.y-actor.y,d=Math.hypot(dx,dy);
    if(d<Math.max(7,actor.r*.22)&&Math.hypot(actor.vx,actor.vy)<profile.landSpeed*.72){
      actor.x=destination.x;actor.y=destination.y;actor.vx=0;actor.vy=0;return true;
    }
    const speed=Math.min(profile.landSpeed,Math.max(70,d*2.5)),blend=1-Math.exp(-dt*profile.approachResponse);
    actor.vx+=(dx/(d||1)*speed-actor.vx)*blend;actor.vy+=(dy/(d||1)*speed-actor.vy)*blend;
    return false;
  }

  function contains(actor,perch){
    const destination=target(perch,actor.r);
    return distance(actor,destination)<Math.max(14,actor.r*.45);
  }

  root.perches=root.register('perches',{findTapped,nearest,target,approach,contains});
})();

