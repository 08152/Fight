/* =========================
   CORE ENGINE
========================= */

window.scene = new THREE.Scene();
scene.background = new THREE.Color(0x87cfff);

window.camera = new THREE.PerspectiveCamera(
75, innerWidth/innerHeight, 0.1, 5000
);

window.renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

/* LIGHT */
scene.add(new THREE.AmbientLight(0xffffff,1.2));
const sun = new THREE.DirectionalLight(0xffffff,1.5);
sun.position.set(10,20,10);
scene.add(sun);

/* GROUND */
const tex = new THREE.TextureLoader().load(
"https://threejs.org/examples/textures/terrain/grasslight-big.jpg"
);

tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
tex.repeat.set(50,50);

window.ground = new THREE.Mesh(
new THREE.PlaneGeometry(5000,5000),
new THREE.MeshStandardMaterial({map:tex})
);

ground.rotation.x = -Math.PI/2;
scene.add(ground);

/* PLAYER */
window.player = new THREE.Object3D();
scene.add(player);
player.add(camera);
camera.position.set(0,2.2,0);

window.velY = 0;
window.onGround = true;
window.health = 100;

/* ANIMATE LOOP */
function animate(){
requestAnimationFrame(animate);

if(window.updateGame) window.updateGame();

camera.position.y += (2.2 + player.position.y - camera.position.y)*0.15;

renderer.render(scene,camera);
}
animate();

/* RESIZE */
window.addEventListener("resize",()=>{
camera.aspect = innerWidth/innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(innerWidth,innerHeight);
});
