/* =========================
   INPUT
========================= */

const keys = {};

window.addEventListener("keydown",e=>keys[e.key.toLowerCase()]=true);
window.addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);

document.body.addEventListener("click",()=>document.body.requestPointerLock());

let yaw = 0, pitch = 0;

document.addEventListener("mousemove",(e)=>{
if(document.pointerLockElement!==document.body)return;

yaw -= e.movementX*0.002;
pitch -= e.movementY*0.002;
pitch = Math.max(-1.2,Math.min(1.2,pitch));

player.rotation.y = yaw;
camera.rotation.x = pitch;
});

/* =========================
   MOVEMENT + GRAVITY
========================= */

function move(){
const speed = 0.15;

let dir = new THREE.Vector3();
if(keys["w"])dir.z -= 1;
if(keys["s"])dir.z += 1;
if(keys["a"])dir.x -= 1;
if(keys["d"])dir.x += 1;

dir.normalize();

const forward = new THREE.Vector3(0,0,-1).applyEuler(player.rotation);
forward.y=0;forward.normalize();

const right = new THREE.Vector3().crossVectors(forward,new THREE.Vector3(0,1,0)).negate();

player.position.addScaledVector(forward,dir.z*speed);
player.position.addScaledVector(right,dir.x*speed);
}

function gravity(){
velY -= 0.015;
player.position.y += velY;

if(player.position.y <= 0){
player.position.y = 0;
velY = 0;
onGround = true;
}
}

/* =========================
   BARRIERS + COLLISION
========================= */

const loader = new THREE.GLTFLoader();
window.barriers = [];

function addBarrier(x,y,z,scale=1,sink=0.35){

loader.load("barrier.glb",(gltf)=>{

const obj = gltf.scene.clone();
obj.scale.set(scale,scale,scale);

const ray = new THREE.Raycaster();
ray.set(new THREE.Vector3(x,100,z), new THREE.Vector3(0,-1,0));

const hit = ray.intersectObject(ground);
const baseY = hit.length ? hit[0].point.y : 0;

obj.position.set(x, baseY - sink - 0.15, z);

scene.add(obj);
barriers.push(obj);
});
}

/* DEFAULT BARRIERS */
addBarrier(-10,-50,-25,1);
addBarrier(14,-50,-41,1);
addBarrier(27,-50,-75,1);

/* EXTRA */
addBarrier(30.23,0,-61.29,1,0.55);
addBarrier(23.95,0,-42.78,1,0.55);
addBarrier(-21.92,0,-55.83,1,0.55);
addBarrier(-2.21,0,-75.71,1,0.55);

/* =========================
   ENEMIES
========================= */

window.enemies = [];

function addEnemy(x,y,z){
const e = new THREE.Mesh(
new THREE.BoxGeometry(1,2,1),
new THREE.MeshStandardMaterial({color:0xff0000})
);

e.position.set(x,y,z);
e.health = 100;

scene.add(e);
enemies.push(e);
}

addEnemy(5,1,-20);
addEnemy(-3,1,-15);

/* =========================
   SHOOT SYSTEM
========================= */

const raycaster = new THREE.Raycaster();
const shootSound = new Audio("shoot.mp3");

function hitmarker(){
document.getElementById("hitmarker").style.display="block";
setTimeout(()=>hitmarker.style.display="none",100);
}

function shoot(){

raycaster.setFromCamera(new THREE.Vector2(0,0),camera);

const hits = raycaster.intersectObjects(enemies);

if(hits.length){
const e = hits[0].object;
e.health -= 25;

hitmarker();

if(e.health <= 0){
scene.remove(e);
enemies = enemies.filter(x=>x!==e);
}
}

shootSound.currentTime=0;
shootSound.play();
}

window.addEventListener("mousedown",(e)=>{
if(e.button===0)shoot();
});

/* =========================
   MAIN UPDATE LOOP
========================= */

window.updateGame = function(){

move();
gravity();

/* coords UI */
const dir = new THREE.Vector3(0,0,-1).applyEuler(player.rotation);

document.getElementById("coords").innerHTML =
`X:${player.position.x.toFixed(2)}
Y:${player.position.y.toFixed(2)}
Z:${player.position.z.toFixed(2)}

DIR X:${dir.x.toFixed(2)}
DIR Z:${dir.z.toFixed(2)}`;

document.getElementById("healthFill").style.width = health + "%";
};
