(() => {
  'use strict';
  const root=window.OWL;
  if(!root?.register)throw new Error('OWL-Namensraum muss vor parallax.js geladen werden.');

  const palettes={
    mist:['#101a31','#253c52','#31483f','#13251f'],storm:['#101426','#273149','#2d403c','#111d1b'],
    gold:['#222039','#454263','#4a4b2c','#182015'],blood:['#29162a','#4a2941','#432d32','#1e1218'],
    default:['#121c35','#263d5a','#2b4933','#102016']
  };
  const wrap=(value,size)=>((value%size)+size)%size;

  function drawBackground(ctx,view,camera,scene,visual){
    const colors=palettes[visual.theme]||palettes.default,w=view.width,h=view.height,groundY=view.groundY;
    const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,colors[0]);sky.addColorStop(1,colors[1]);ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);

    ctx.save();ctx.fillStyle='#fff4cf';
    for(let i=0;i<90;i++){
      const x=wrap(i*137.7-camera.centerX*.025,w+80)-40,y=24+((i*83)%Math.max(90,h*.57));
      ctx.globalAlpha=.2+((i*37)%60)/100;ctx.beginPath();ctx.arc(x,y,.55+(i%3)*.45,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;const moonX=wrap(w*.78-camera.centerX*.04,w*1.4)-w*.2;
    ctx.fillStyle='#f2d58a';ctx.beginPath();ctx.arc(moonX,h*.15,34,0,Math.PI*2);ctx.fill();ctx.fillStyle=colors[0];ctx.beginPath();ctx.arc(moonX+14,h*.135,31,0,Math.PI*2);ctx.fill();ctx.restore();

    ctx.save();ctx.translate(-wrap(camera.centerX*.12,260),0);ctx.fillStyle=colors[1];ctx.globalAlpha=.9;
    for(let x=-300,i=0;x<w+520;x+=220,i++){ctx.beginPath();ctx.moveTo(x,groundY);ctx.lineTo(x+105,groundY-h*(.27+(i%3)*.04));ctx.lineTo(x+240,groundY);ctx.closePath();ctx.fill()}
    ctx.restore();

    ctx.save();ctx.translate(-wrap(camera.centerX*.28,150),0);ctx.fillStyle=colors[2];ctx.globalAlpha=.88;
    for(let x=-180,i=0;x<w+300;x+=76,i++){
      const height=72+(i%4)*18;ctx.fillRect(x-3,groundY-height*.55,7,height*.55);ctx.beginPath();ctx.ellipse(x,groundY-height*.7,26+(i%2)*8,height*.32,0,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
    const ground=ctx.createLinearGradient(0,groundY-25,0,h);ground.addColorStop(0,colors[2]);ground.addColorStop(1,colors[3]);ctx.fillStyle=ground;ctx.fillRect(0,groundY-25,w,h-groundY+25);
    const fog=ctx.createLinearGradient(0,h*.46,0,groundY);fog.addColorStop(0,'rgba(194,219,218,0)');fog.addColorStop(.7,'rgba(194,219,218,.08)');fog.addColorStop(1,'rgba(194,219,218,0)');ctx.fillStyle=fog;ctx.fillRect(0,h*.42,w,groundY-h*.38);
  }

  function drawLandmark(ctx,landmark,scale=1){
    ctx.save();ctx.translate(landmark.x,landmark.y);ctx.scale(scale,scale);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#0a1020';ctx.lineWidth=7;
    const kind=landmark.kind;
    if(kind.includes('stone')||kind.includes('gate')||kind.includes('arch')){
      ctx.strokeStyle='#18242d';ctx.lineWidth=22;ctx.beginPath();ctx.arc(0,-32,48,Math.PI,Math.PI*2);ctx.stroke();ctx.strokeStyle='#738084';ctx.lineWidth=13;ctx.stroke();
      ctx.fillStyle='#93b3a3';for(const [x,y] of [[-42,-42],[38,-54],[-26,-70]]){ctx.beginPath();ctx.ellipse(x,y,10,5,-.4,0,Math.PI*2);ctx.fill()}
    }else if(kind.includes('waterfall')){
      ctx.fillStyle='#26343b';ctx.beginPath();ctx.moveTo(-60,0);ctx.lineTo(-35,-110);ctx.lineTo(44,-96);ctx.lineTo(68,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#74c8dc';ctx.fillRect(-17,-94,30,94);ctx.fillStyle='rgba(215,243,238,.5)';ctx.beginPath();ctx.ellipse(0,0,46,10,0,0,Math.PI*2);ctx.fill();
    }else if(kind.includes('lookout')||kind.includes('perch')||kind.includes('stage')){
      ctx.strokeStyle='#54331f';ctx.lineWidth=18;ctx.beginPath();ctx.moveTo(-55,-38);ctx.lineTo(58,-46);ctx.stroke();ctx.strokeStyle='#9b6946';ctx.lineWidth=10;ctx.stroke();ctx.fillStyle='#f2d58a';ctx.beginPath();ctx.moveTo(0,-82);ctx.lineTo(13,-58);ctx.lineTo(-13,-58);ctx.closePath();ctx.fill();
    }else{
      ctx.strokeStyle='#211711';ctx.lineWidth=24;ctx.beginPath();ctx.moveTo(0,2);ctx.lineTo(-4,-108);ctx.moveTo(-2,-72);ctx.lineTo(-46,-108);ctx.moveTo(0,-61);ctx.lineTo(51,-98);ctx.stroke();ctx.fillStyle=kind.includes('birch')?'#536d5c':'#385545';for(const [x,y,rx,ry] of [[-42,-112,43,28],[18,-119,50,32],[49,-94,38,25]]){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.stroke()}
    }
    ctx.restore();
  }

  function drawForeground(ctx,view,camera){
    const w=view.width,h=view.height,shift=wrap(camera.centerX*1.12,310);ctx.save();ctx.globalAlpha=.2;ctx.fillStyle='#07100d';
    for(let x=-shift-180;x<w+220;x+=310){ctx.beginPath();ctx.ellipse(x,h*.18,95,260,-.18,0,Math.PI*2);ctx.fill()}
    ctx.globalAlpha=1;ctx.restore();
  }

  root.parallax=root.register('parallax',{drawBackground,drawForeground,drawLandmark});
})();
