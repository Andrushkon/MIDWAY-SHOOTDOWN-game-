//consts
const player=document.getElementById("player")
const stick=document.getElementById("stick")
const gun=document.getElementById("gun")
const ehealth=document.getElementById("health")
const healthbar=document.getElementById("healthbar")
const crosshair=document.getElementById("crosshair")
const eyeballs=document.getElementsByClassName("eyeball")
const UI=document.getElementById("UI")
const nofslots=3
creategunslotcontainer()
const gunslot=document.getElementsByClassName("gunslot")
const gunimg=document.getElementsByClassName("gunimg")
const bulletshow=document.getElementsByClassName("bullets")
const gunslotcontainer=document.getElementById("gunslotcontainer")
const min=3
const bodyx=1200
const bodyy=1200
const isx=60
const isy=175
const maxx=-50
const maxy=30
const ds=200
const raritysgradients=["radial-gradient(circle, rgba(175,175,175,1) 0%, rgba(113,113,113,1) 100%)","radial-gradient(circle, rgba(24,255,0,1) 0%, rgba(0,173,7,1) 100%)","radial-gradient(circle, rgba(0,174,255,1) 0%, rgba(0,91,134,1) 100%)","radial-gradient(circle, rgba(207,0,255,1) 0%, rgba(111,0,134,1) 100%)","radial-gradient(circle, rgba(255,199,0,1) 0%, rgba(176,149,0,1) 100%)"]
const raritysgradients2=["rgba(175,175,175,1)","rgba(24,255,0,1)","rgba(0,174,255,1)","rgba(207,0,255,1)","rgba(255,199,0,1)"]
const typesofgun=[["Riffle",36],["shotgun",6]]

//Arrays
let pickguns=[]
let shieldmap=[]
let bulletmap=[]
let guns=gunslotcreate()
let result=[]
let enemys=[]

//Player variables
let health=100
let PlayerX=bodyx/2
let PlayerY=bodyy/2
player.style.left=PlayerX-22.5
player.style.top=PlayerY-22.5
let currentslot=0
let MoveX=0
let MoveY=0
let angle=0
let movespeed=0.1
let dead=false
let shield=false

//Others
let gunidx=0
let bulletidx=0
let enemyidx=0
let moveidx=0
let shootidx=0
let reloadidx=0
let reloadidx2=0
let mousedown=false
let cooldown=true
let tactil=false
let fps=60
let sx=0
let sy=0
let mybullet
let mousex=0
let mousey=0
let playtime=0
let windowx = window.innerWidth;
let windowy = window.innerHeight;
let newAura
//Audios
let shotgunsound= new Audio('shotgun.mp3');
let Rifflesound= new Audio('Riffle.mp3');
Rifflesound.volume="0.2"
let shotgunreload= new Audio('reloadshotgun.mp3');
let Rifflereload= new Audio('reloadriffle.mp3');
Rifflereload.volume="0.2"
let shotgunreloadfinish= new Audio('shotgunreloadfinish.mp3');


Gamestart()
function Gamestart(){

uicreate()
Playermove()
Enemymove()
createShield("no",5)
bulletmove()
playtimeadd()
createRandomPickgun(6)
document.documentElement.style.cursor = 'none';
if (tactil==false){
document.getElementById("controls").style.visibility="hidden"
stick.style.visibility="hidden"
Playermove()
createTree(bodyx,bodyy)
}
}
function Demo(event)
{
    
    if (tactil==true){
        var br = document.body.getBoundingClientRect();
   
    mousex = Math.round(event.touches[0].clientX - br.left)-25
    mousey = Math.round(event.touches[0].clientY - br.top)-25
      moveidx++
         if (((mousex>maxx) && (maxx+ds>mousex))&&((mousey>maxy) && (maxy+ds>mousey))){
moveplayer()
             checkmove(moveidx)
       stick.style.left=mousex+"px"
    stick.style.top=mousey+"px"
         }else{
             Goback()
         }
    
  }}
  
    document.body.ontouchend=function(){
        Goback()
        
        
    }
function Goback(){
    mousex=0
        mousey=0
        stick.style.left=isx+"px"
    stick.style.top=isy+"px"
}

function moveplayer(){
    sx=mousex-isx
    sy=mousey-isy
    if (PlayerX+sx*0.1<bodyx && PlayerX+sx*0.1>min){
    PlayerX+=sx*0.1
    
    }
     if (PlayerY+sy*0.1<bodyy && PlayerY+sy*0.1>min){
    PlayerY+=sy*0.1
     }
     
    var tr=(Math.atan2((0-sy),sx)*180)/ Math.PI
    angle=(180-tr)+270
    player.style.left=PlayerX-22.5+"px"
    player.style.top=PlayerY-22.5+"px"
    gun.style.left=PlayerX-25-40*(angle<360||angle>540)+"px"
    gun.style.top=PlayerY-20+"px"
    if (angle<360||angle>540){
        gun.style.scale="-1 1"
        gun.style.transform=`rotateZ(${360-angle-90}deg)`
        }else{
            gun.style.scale="1 1"    
        gun.style.transform=`rotateZ(${angle-90}deg)`
        }

    
    if (cooldown==true){
        cooldown=false
        setTimeout(function(){
       cooldown=true
   },500)
        mybullet=document.createElement("img")
mybullet.className="bullet"
mybullet.src="Bullet.png"
    document.body.appendChild(mybullet)
    mybullet.style.left=PlayerX+7+"px"
    mybullet.style.top=PlayerY-10+"px"
    mybullet.style.transform=`rotateZ(${angle}deg)`
        var srcidx=0
        var bidx=0
        for (let index=0;index<bulletmap.length;index++)
        {
            if (bulletmap[index]==0){
                bidx=index
                break;
            }
            if (index==bulletmap.length-1){
                   bidx=bulletmap.length
                break;
             
                
            }
        }
        for (let index = 0; index < 2; index++) {
                      eyeballs[index].style.left=sx*0.1+"px"
    eyeballs[index].style.top=sy*0.1+"px"
            
        }

    bulletmove(mybullet,PlayerX+13,PlayerY-25,80*Math.cos((angle-90) * Math.PI / 180),80*Math.sin((angle-90) * Math.PI / 180),0,bidx)

}
}
document.addEventListener('touchstart',function(){
    mousedown=true
    Demo(event)
})
document.addEventListener('touchmove',function(){
    mousedown=true
    Demo(event)
})
document.addEventListener('touchend',function(){
    mousedown=false
})
function consolelog(something){
    const consola=document.getElementById("consola")
    consola.innerText=something
}
function checkmove(idx){
    setTimeout(function(){
        if (idx==moveidx && mousedown==true){
            moveplayer()
            moveidx++
            checkmove(moveidx)
        }
    },20)
}

function bulletmove(){
    for (let index = 0; index < bulletmap.length; index++) {
        var idx=index

        if (!(bulletmap[idx]==0)){
            

                var myArray=bulletmap[idx]
                var b=myArray[0]
                var x=myArray[1]
                var y=myArray[2]
                var mx=myArray[3]
                var my=myArray[4]
                var c=myArray[5]
                var type=myArray[6]
                var r=myArray[7]
                x=Math.round(x+mx)
                y=Math.round(y+my)
                c++
                b.style.left=x-15+"px"
                b.style.top=y-15+"px"
                if(c<200&&(x<bodyx && x>min)&&(y<bodyy && y>min)){
                    var myArray2=[b,x,y,mx,my,c,type,r]
                    bulletmap[idx]=myArray2
            }else{
                bulletmap[idx]=0
                b.remove()
                
            }
    }

}
setTimeout(function(){bulletmove()},1000/fps)
}
createEnemy()
function createEnemy(){
    let newEnemy=document.createElement("div")
    newEnemy.className="enemy"
    newEnemy=document.body.appendChild(newEnemy)
    newEnemy.innerHTML=`<div style="top:5px;left:1px;" class="eye"><div class="eyeball"></div></div><div style="top:5px;left:26px;"class="eye"><div class="eyeball"></div></div>`
    var myArray=[]
    myArray[0]=newEnemy
    myArray[1]=Math.floor(Math.random()*bodyx)
    myArray[2]=Math.floor(Math.random()*bodyy)
    myArray[3]=100
    enemys[enemyidx]=myArray
    enemyidx++
    setTimeout(function(){createEnemy()},5000-(playtime*50))
}
function Enemymove(){
    for (let index = 0; index < enemys.length; index++) {
if (!(enemys[index]==0)){
    var myEnemyArray=enemys[index]
    var e=myEnemyArray[0]
    var x=myEnemyArray[1]
    var y=myEnemyArray[2]
    var l=myEnemyArray[3]
    

    var espeed=0.1*1000/fps
    var movex=0
    var movey=0
    if (x<PlayerX){
        movex=espeed
    }else{
        movex=-espeed
    }
       if (y<PlayerY){
        movey=espeed
    }else{
        movey=-espeed
    }


    for (let index=0;index< bulletmap.length;index++){
if (!(bulletmap[index]==0)){

        var myArray=bulletmap[index]
        var b=myArray[0]
        var bx=myArray[1]
        var by=myArray[2]
        var type=myArray[6]
        var r=myArray[7]
        if((x-35<bx&& x+35>bx) && (y-35 <by  && y+35>by)){
            bulletmap[index]=0
            var damage=0
            if (type=="Bullet"){
                damage=5
            }else if (type=="Bullet1"){
                damage=30
            }
            damage=damage+(r*5)
            l+=-damage
            b.remove()
            damageshow(bx,by,damage)
            if (l<0.1){

            break;
            }else{

                movex=0-movex*4
                movey=0-movey*4
                e.style.backgroundColor="rgb(240, 0, 0)"
                e.style.scale="1 1"
                  
                Hitanimation(e,0)

            }
           
        }
    
    }}
if (l<0.1){
    e.remove()
    enemys[index]=0
    continue;
}
    var epx=PlayerX-x
    var epy=PlayerY-y
    for (let index = 0; index < 2; index++) {

        e.getElementsByClassName("eyeball")[index].style.left=epx/120+"px"
        e.getElementsByClassName("eyeball")[index].style.top=epy/120+"px"
    }
    var pcolissions=35
if ((x<PlayerX+pcolissions && x>PlayerX-pcolissions) && (y<PlayerY+pcolissions && y>PlayerY-pcolissions))
    {   if (shield==false){
        health--
        ehealth.style.width=85/100*health+"px"
        if (health<0&&dead==false){
            Gameover()
        }
    }
    } 
x+=movex
y+=movey
e.style.left=x-22.5+"px"
e.style.top=y-22.5+"px"
myEnemyArray=[e,x,y,l]
enemys[index]=myEnemyArray
}
}
setTimeout(function(){Enemymove()},1000/fps) 
} 
function Gameover(){
    dead=true
    location.reload(true);
}

var up=false
var left=false
var down=false
var right=false
var collect=false

document.addEventListener("keydown",function(){
let key=event.key
if (key=="w"){
up=true
}
if (key=="s"){
down=true
}
if (key=="a"){
left=true
}
if (key=="d"){
right=true
}
if (key=="e"){
collect=true
}
if (key=="v"){
    if (!(guns[currentslot]==0)){
createPickgun(PlayerX,PlayerY,guns[currentslot][0],guns[currentslot][1],guns[currentslot][2],guns[currentslot][4])
guns[currentslot]=0
gun.src="empty.png"
gunimg[currentslot].src="empty.png"
gunslot[currentslot].style.background="none"
gunslot[currentslot].style.border="none"
bulletshow[currentslot].innerText=""
}
}
if (key=="r"){
reloadidx++
reload(currentslot,reloadidx)
}
var nkey=Number(key)
if (nkey>0&&nkey<nofslots+1){
if (!(nkey==currentslot+1))
changeslot(nkey-1)
}
if (key=="Escape"){
    deleteEverything()
}
})

document.addEventListener("keyup",function(){
let key=event.key
if (key=="w"){
up=false
}
if (key=="s"){
down=false
}
if (key=="a"){
left=false
}
if (key=="d"){
right=false
}
if (key=="e"){
collect=false
}
})



function Playermove(){

if(up==true){
    MoveY+=-movespeed
}
if(left==true){
    MoveX+=-movespeed
}
if(down==true){
    MoveY+=movespeed
}
if(right==true){
    MoveX+=movespeed
}


if ((PlayerX+MoveX*1000/fps<bodyx-75) && (PlayerX+MoveX*1000/fps>75)){

    PlayerX+=MoveX*1000/fps
    MoveX=MoveX*0.9
}else{
    MoveX=0
}
if ((PlayerY+MoveY*1000/fps<bodyy-75) && (PlayerY+MoveY*1000/fps>0)){

    PlayerY+=MoveY*1000/fps
    MoveY=MoveY*0.9
}else{
    MoveY=0
}

for (let index=0;index< pickguns.length;index++){
if (!(pickguns[index]==0)){
    var myArray=pickguns[index]
    var gx=myArray[1]
    var gy=myArray[2]
    var r=myArray[6]
    var gunhitbox=100
    if(((gx-gunhitbox < PlayerX) && (gx+gunhitbox > PlayerX)) && ((gy-gunhitbox < PlayerY) && (gy+gunhitbox > PlayerY))){

  
        myArray[0].style.background='radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(255,255,255,0) 70%)'

        if (collect==true){

Pickgun(index)
collect=false

}
                }else{
myArray[0].style.background=`radial-gradient(circle, ${raritysgradients2[r]} 0%, rgba(255,255,255,0) 70%)`
                }


      
     }}
     for (let index=0;index< shieldmap.length;index++){
        if (!(shieldmap[index]==0)){
            var mySplit=(shieldmap[index].style.left).split("p")
            var gx=Number(mySplit[0])+50
        
            mySplit=(shieldmap[index].style.top).split("p")
            var gy=Number(mySplit[0])+50
            var gunhitbox=75
            if(((gx-gunhitbox < PlayerX) && (gx+gunhitbox > PlayerX)) && ((gy-gunhitbox < PlayerY) && (gy+gunhitbox > PlayerY))){
            createShield(index,10)
            
            
            }
        }
    }

    window.scroll(PlayerX-windowx/2,PlayerY- windowy/2)
    for (let index = 0; index < bulletshow.length; index++) {
        if (!(guns[index]==0))
{        bulletshow[index].innerText=guns[index][1]+"/"+guns[index][2]
}
    }

    UI.style.left=scrollX+"px"
    UI.style.top=scrollY+"px"
    player.style.left=PlayerX-22.5+"px"
    player.style.top=PlayerY-22.5+"px"
    gun.style.left=PlayerX-25-(30*(angle<-90||angle>90))+"px"
    gun.style.top=PlayerY-25+"px"
        healthbar.style.left=PlayerX-40+"px"
    healthbar.style.top=PlayerY-40+"px"
            ehealth.style.left=PlayerX-37.5+"px"
    ehealth.style.top=PlayerY-37.5+"px"

    setTimeout(function(){
Playermove()
    },1000/fps)
}
document.addEventListener("mousemove",function(){
if (tactil==false){
    var addx=(scrollX)
    var addy=(scrollY)
 
    mousex=addx+event.clientX
mousey=addy+event.clientY
sx=(mousex-PlayerX)
sy=(mousey-PlayerY)
angle=Math.atan2(sy,sx)*180/ Math.PI

crosshair.style.left=mousex-20+"px"
crosshair.style.top=mousey-20+"px"
if (angle<-90||angle>90){
gun.style.scale="-1 1"
gun.style.transform=`rotateZ(${180-angle}deg)`
}else{
    gun.style.scale="1 1"    
gun.style.transform=`rotateZ(${angle}deg)`
}
for (let index = 0; index < 2; index++) {
eyeballs[index].style.left=sx/120+"px"
    eyeballs[index].style.top=sy/120+"px"
}}
})
var mouse=false
document.addEventListener("mouseup",function(){
mouse=false


})
document.addEventListener("mousedown",function(){
    mouse=true
    if (tactil==false){
mouseclick()
    }
    
    })
function mouseclick(){
    if (guns[currentslot][3]==false && !(guns[currentslot]==0)){
    var currentbullets=guns[currentslot][1]

    if(currentbullets>0){

    if (cooldown==true){

        cooldown=false

var shotcooldown=0

guns[currentslot][1]--

        if (guns[currentslot][0]=="Riffle"){
     
            shotcooldown=150
            createBullet(angle,"Bullet")
        }else if (guns[currentslot][0]=="shotgun"){

            shotcooldown=1500
            createBullet(angle,"Bullet1")
            createBullet(angle+15,"Bullet1")
            createBullet(angle-15,"Bullet1")
        }
            for (let index = 0; index < 4; index++) {
    var spridx=0
    setTimeout(function(){
spridx++
if (spridx==4){
gun.src=`${guns[currentslot][0]}.png`
}else{
gun.src=`${guns[currentslot][0]}${spridx}.png`
}},250*index)
       
}


shootidx++
shotcooldownmake(shootidx,shotcooldown)
    }
}else{

    Rifflesound.pause()
    Rifflesound.load()
    reloadidx++
    reload(currentslot,reloadidx)
}
}}
function shotcooldownmake(myidx,shotcooldown){
    setTimeout(function(){
        if (myidx==shootidx)
     {    cooldown=true
        if (mouse==true){
            mouseclick()
        }else{
            if (guns[currentslot][0]=="Riffle"){
                Rifflesound.pause()
                Rifflesound.load()
            }
        }}
    
    },shotcooldown) 

}
function createBullet(a,type){


    mybullet=document.createElement("img")
    mybullet.className="bullet"
    mybullet.src=type+".png"
        document.body.appendChild(mybullet)
        mybullet.style.left=PlayerX+7+"px"
        mybullet.style.top=PlayerY-10+"px"
        mybullet.style.transform=`rotateZ(${a-270}deg)`
           bidx=null
        if (guns[currentslot][0]=="Riffle"){
        Rifflesound.play();
        }else if (guns[currentslot][0]=="shotgun"){
        shotgunsound.play();
        }
        var myArray=[]
        myArray[0]=mybullet
        myArray[1]=PlayerX
        myArray[2]=PlayerY
        myArray[3]=Math.cos((a) * Math.PI / 180)*((80/3)*(1000/fps))*0.1
        myArray[4]=Math.sin((a) * Math.PI / 180)*((80/3)*(1000/fps))*0.1
        myArray[5]=0
        myArray[6]=type
        myArray[7]=guns[currentslot][4]
        bulletmap[bulletidx]=myArray
        bulletidx++
        }
function Hitanimation(e,r){

    e.style.backgroundColor=`rgb(240, ${r*2}, ${r*2}`

    e.style.scale=((r/256)+0.75)+" "+((r/256)+0.75)
  
    if (r<64){
        setTimeout(function(){
            Hitanimation(e,r+2)
        },20)
    }
}
function createTree(x,y){
let newTree=document.createElement("img")
newTree.src="tree.png"
newTree.className="tree"
newTree=document.body.appendChild(newTree)
newTree.style.left=x+"px"
newTree.style.top=y+"px"
}

function Pickgun(idx)
{
    var oldArray=pickguns[idx]
    var g=oldArray[0]
    var x=oldArray[1]
    var y=oldArray[2]
    var type=oldArray[3]
    var b=oldArray[4]
    var mb=oldArray[5]
    var r=oldArray[6]
    var targetslot
    var myArray=0

    for (let index = 0; index < guns.length; index++) {
       if (guns[index]==0){
        g.remove()
        targetslot=index
        selectslot(currentslot,targetslot)
        break;
       }
        if (index==guns.length-1){
            targetslot=currentslot
            var currentArray=guns[currentslot]
            g.src=currentArray[0]+".png"
            myArray=[g,x,y,currentArray[0],currentArray[1],currentArray[2],currentArray[4]]
    
        }
    }
currentslot=targetslot
gun.src=type+".png"
gunimg[currentslot].src=type+".png"
gunslot[currentslot].style.background=raritysgradients[r]
guns[currentslot]=[]
guns[currentslot][0]=type
guns[currentslot][1]=b
guns[currentslot][2]=mb
guns[currentslot][3]=false
guns[currentslot][4]=r
pickguns[idx]=myArray

}

function createPickgun(x,y,type,b,mb,r){

var newGun=document.createElement("img")
newGun=document.body.appendChild(newGun)
newGun.className="gun"
newGun.style.left=x-25+"px"
newGun.style.top=y-25+"px"
newGun.src=type+".png"
newGun.style.background=`radial-gradient(circle, ${raritysgradients2[r]} 0%, rgba(255,255,255,0) 70%)`
newGun.style.zIndex=-5
var myArray=[]
myArray[0]=newGun
myArray[1]=x
myArray[2]=y
myArray[3]=type
myArray[4]=b
myArray[5]=mb
myArray[6]=r
pickguns[gunidx]=myArray
gunidx++

}


function createShield(idx,ws){
    if (shield==false){
        if (!(idx=="no")){
var s=shieldmap[idx]
s.remove()

shieldmap[idx]=0
        }
newAura=document.createElement("img")
newAura=document.body.appendChild(newAura)
newAura.src="shield.png"
newAura.className="shield"
shield=true
Followplayer(3,0,newAura)

setTimeout(function(){
newAura.remove()
shield=false
},ws*1000)
    }
}
function Followplayer(s,c,e){
e.style.left=PlayerX-190+"px"
e.style.top=PlayerY-200+"px"
if (c<s){
setTimeout(function(){Followplayer(s,c+0.001,e)}
,1000/fps)
}
}
function reload(slot,myidx){
    guns[slot][3]=true
    if (guns[slot][0]=="Riffle"){
        Rifflereload.load()
        Rifflereload.play()
    setTimeout(function(){
        if (myidx==reloadidx){
            guns[slot][1]=guns[slot][2]
            guns[slot][3]=false
    if (mouse==true){
    mouseclick()
    }
}
    },3500)
    }else if(guns[slot][0]=="shotgun"){
        reloadidx2++
        reloadonebullet(slot,reloadidx2)
    }
}
function reloadonebullet(slot,myidx){


if (myidx==reloadidx2){
    if (mouse==true&&guns[slot][1]>0){

        shotgunreloadfinish.play()
        shotgunreload.pause()
        shotgunreload.load()
        guns[slot][3]=false
        mouseclick()
    }else{


        
        if (guns[slot][1]<guns[slot][2]){
            shotgunreload.load()
            shotgunreload.play()
            guns[slot][1]++
            setTimeout(function(){reloadonebullet(slot,myidx)},600)
        }else{

            shotgunreloadfinish.load()
            shotgunreloadfinish.play()
            shotgunreload.pause()
            shotgunreload.load()
            guns[slot][3]=false
        }
 
            

  
}}}
function changeslot(slot){
Rifflesound.load()
var srcidx=slot+1
if (!(guns[slot]==0)){
selectslot(currentslot,slot)
currentslot=slot
gun.src=guns[currentslot][0]+".png"
}
}
createShieldElement(274,583)
function createShieldElement(x,y){
var newShield=document.createElement("img")
newShield=document.body.appendChild(newShield)
newShield.className="shielditem"
newShield.src="shielditem.png"
newShield.style.left=(x-50)+"px"
newShield.style.top=(y-50)+"px"
newShield.style.background='radial-gradient(circle, rgba(245,255,99,1) 0%, rgba(255,255,255,0) 70%)'
var gidx=0

    for (let index=0;index<shieldmap.length;index++)
        {
            if (shieldmap[index]==0){
                gidx=index
                break;
            }
            if (index==shieldmap.length-1){
                   gidx=shieldmap.length
                break;
             
                
            }
        
}


        shieldmap[gidx]=newShield
}
function playtimeadd(){
playtime++
    setTimeout(function(){playtimeadd()},1000)
}


window.addEventListener('resize', function() {
    var newwidth = window.innerWidth;
    var newheight = window.innerHeight;
    if ((newwidth !== windowx)||(newheight !== windowy)) {
        windowx = newwidth;  
        windowy = newheight;
       uiupdate()
    
    
    }
});
function uicreate(){




for (let index = 0; index < gunslot.length; index++) {
   gunslot[index].style.left=index*110+"px"
}

uiupdate()

}
function uiupdate(){

        UI.style.width=windowx+"px"
        UI.style.height=windowy+"px"
    gunslotcontainer.style.top=windowy+"px"
}
function creategunslotcontainer(){
    var newgunslotcontainer=document.createElement("div")
    newgunslotcontainer=UI.appendChild(newgunslotcontainer)
    newgunslotcontainer.id="gunslotcontainer"
    var containerHTML=""
    for (let index = 0; index < nofslots; index++) {

        containerHTML=containerHTML+creategunslot(index)
        
    }
    newgunslotcontainer.innerHTML=containerHTML

}
function creategunslot(idx){
    var htmlstring
    if (idx==0){
htmlstring=`
<div class="gunslot" style="border:3px solid white;z-index:1;">
<img class="gunimg" src="Riffle.png"></img>
<div class="bullets">36/36</div>
</div>
`

}else{
    htmlstring=`
    <div style="background:transparent;" class="gunslot">
    <img class="gunimg""></img>
    <div class="bullets"></div>
    </div>
    `

}
return htmlstring
}
function gunslotcreate(){
var myArray=[]

for (let index = 0; index < nofslots; index++) {
    var myArray2=[]
    if (index==0){
        myArray2=["Riffle",36,36,false,0]
    }else
{    myArray2=0

}
myArray.push(myArray2)
}
return myArray
}
function selectslot(oldslot,newslot){
    gunslot[newslot].style.border="3px solid white"
    gunslot[oldslot].style.border="none"
    gunslot[newslot].style.zIndex="1"
    gunslot[oldslot].style.zIndex="0"
}
function damageshow(x,y,damage){
    var newDamageshow=document.createElement("div")
    newDamageshow=document.body.appendChild(newDamageshow)
    newDamageshow.className="Damageshow"
    newDamageshow.innerText=damage
    newDamageshow.style.left=x+"px"
    newDamageshow.style.top=y+"px"


    setTimeout(function(){
        newDamageshow.remove()
    },500)
}
function createRandomPickgun(times){
    for (let index = 0; index < times; index++){
        var x=randomnumber(75,bodyx-75)
        var y=randomnumber(75,bodyy-75)
        var randomgun=randomnumber(0,typesofgun.length-1)
        var type=typesofgun[randomgun][0]
        var mb=typesofgun[randomgun][1]
        var r=randomnumber(0,5)
        createPickgun(x,y,type,mb,mb,r)
    }
}
function randomnumber(min, max) {
    if (min==0&&max==1){
    return Math.round(Math.random())
    }else{
    return Math.floor(Math.random() * (max - min) ) + min;
    }}
function deleteEverything(){
player.remove()
for (let index = 0; index <    enemys.length; index++) {
    if(!(enemys[index]==0)){
    enemys[index][0].remove()
    }
}
for (let index = 0; index <    bulletmap.length; index++) {
    if(!(bulletmap3[index]==0)){
    bulletmap[index][0].remove()
    }
}
for (let index = 0; index <    pickguns.length; index++) {
    if(!(pickguns[index]==0)){
    pickguns[index][0].remove()
    }
}
for (let index = 0; index <    shieldmap.length; index++) {
    if(!(shieldmap[index]==0)){
    shieldmap[index].remove()
    }
}
UI.remove()
gun.remove()
newAura.remove()
ehealth.remove()
healthbar.remove()
crosshair.remove()
document.documentElement.style.cursor="default"
}