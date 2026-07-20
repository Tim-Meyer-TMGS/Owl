(() => {
  'use strict';
  const root = window.OWL;
  if (!root?.register) throw new Error('OWL-Namensraum muss vor camera.js geladen werden.');

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const modes = {
    follow:{response:5.2,lookAhead:.34,deadZone:[.34,.66]},
    race:{response:7.2,lookAhead:.48,deadZone:[.29,.61]},
    dialogue:{response:2.2,lookAhead:.08,deadZone:[.39,.61]},
    escort:{response:4.3,lookAhead:.24,deadZone:[.31,.69]},
    cinematic:{response:1.5,lookAhead:.12,deadZone:[.42,.58]}
  };

  function create() {
    const camera = {
      centerX:0,centerY:0,zoom:1,targetZoom:1,mode:'follow',pulseAmount:0,
      view:{width:1,height:1},world:{width:1,height:1}
    };

    camera.resize = (view, world) => {
      camera.view={width:Math.max(1,view.width),height:Math.max(1,view.height)};
      camera.world={width:Math.max(view.width,world.width),height:Math.max(view.height,world.height)};
      camera.centerX=clamp(camera.centerX||view.width*.5,view.width*.5,camera.world.width-view.width*.5);
      camera.centerY=view.height*.5;
    };
    camera.setMode = mode => { camera.mode=modes[mode]?mode:'follow'; };
    camera.snap = target => {
      const half=camera.view.width/(2*camera.zoom);
      camera.centerX=clamp(target.x,half,Math.max(half,camera.world.width-half));
      camera.centerY=camera.view.height*.5;
    };
    camera.pulse = (amount=.12) => { camera.pulseAmount=Math.max(camera.pulseAmount,amount); };
    camera.update = (target, dt, context={}) => {
      const settings=modes[camera.mode]||modes.follow;
      camera.pulseAmount=Math.max(0,camera.pulseAmount-dt*.8);
      camera.targetZoom=context.dive?.92:(camera.pulseAmount>0?.88:(camera.mode==='cinematic'?.96:1));
      camera.zoom+=(camera.targetZoom-camera.zoom)*(1-Math.exp(-dt*7));
      const focus=context.companion?{x:(target.x+context.companion.x)*.5,y:(target.y+context.companion.y)*.5}:target;
      const screenX=(focus.x-camera.centerX)*camera.zoom+camera.view.width*.5;
      const left=camera.view.width*settings.deadZone[0],right=camera.view.width*settings.deadZone[1];
      let desired=camera.centerX;
      if(screenX<left)desired=focus.x-(left-camera.view.width*.5)/camera.zoom;
      else if(screenX>right)desired=focus.x-(right-camera.view.width*.5)/camera.zoom;
      desired+=clamp((target.vx||0)*settings.lookAhead,-camera.view.width*.19,camera.view.width*.19);
      const half=camera.view.width/(2*camera.zoom);
      desired=clamp(desired,half,Math.max(half,camera.world.width-half));
      camera.centerX+=(desired-camera.centerX)*(1-Math.exp(-dt*settings.response));
      camera.centerY=camera.view.height*.5+clamp((focus.y-camera.view.height*.48)*.08,-18,18);
    };
    camera.apply = ctx => {
      ctx.translate(camera.view.width*.5,camera.view.height*.5);
      ctx.scale(camera.zoom,camera.zoom);
      ctx.translate(-camera.centerX,-camera.centerY);
    };
    camera.screenToWorld = (x,y) => ({
      x:camera.centerX+(x-camera.view.width*.5)/camera.zoom,
      y:camera.centerY+(y-camera.view.height*.5)/camera.zoom
    });
    camera.bounds = (padding=0) => ({
      left:camera.centerX-camera.view.width/(2*camera.zoom)-padding,
      right:camera.centerX+camera.view.width/(2*camera.zoom)+padding,
      top:camera.centerY-camera.view.height/(2*camera.zoom)-padding,
      bottom:camera.centerY+camera.view.height/(2*camera.zoom)+padding
    });
    camera.isVisible = (item,padding=100) => {
      const bounds=camera.bounds(padding),radius=item.r||item.size||0;
      return item.x+radius>=bounds.left&&item.x-radius<=bounds.right&&item.y+radius>=bounds.top&&item.y-radius<=bounds.bottom;
    };
    return camera;
  }

  root.camera=root.register('camera',{create,modes:Object.keys(modes)});
})();

