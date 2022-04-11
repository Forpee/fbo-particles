import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import fragmentSimulation from './shaders/test/fragmentSimulation.glsl'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';

/**
 * Base
 */

const WIDTH = 32;
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.BufferGeometry()

let positions =  new Float32Array(WIDTH * WIDTH * 3)
let references = new Float32Array(WIDTH * WIDTH * 2)

for (let i = 0; i < WIDTH * WIDTH; i++) {
let x = Math.random() 
let y = Math.random()
let z = Math.random()
let xx = (i%WIDTH) / WIDTH
let yy = ~~(i/WIDTH) / WIDTH
positions.set([x,y,z], i*3)
references.set([xx,yy], i*2)
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geometry.setAttribute('reference', new THREE.BufferAttribute(references, 2))

// Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        positionTexture: { value: null },
    },
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide
})

// Mesh
const mesh = new THREE.Points(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//gpu compute
let gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer );
const dtPosition = gpuCompute.createTexture();

let arr = dtPosition.image.data;


for ( let i = 0; i < arr.length; i=i+4 ) {

    arr[ i ] = Math.random();
    arr[ i + 1 ] = Math.random();
    arr[ i + 2 ] = Math.random();
    arr[ i + 3 ] = 1;
}
console.log(arr);

let positionVariable = gpuCompute.addVariable( "texturePosition", fragmentSimulation, dtPosition );

positionVariable.material.uniforms.time = { value: 0.0 }
positionVariable.wrapS = THREE.RepeatWrapping;
positionVariable.wrapT = THREE.RepeatWrapping;

gpuCompute.init()

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()