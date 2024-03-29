import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

// import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import fragmentSimulation from './shaders/test/fragmentSimulation.glsl'


/**
 * Base
 */
//  const gltfLoader = new GLTFLoader()
//  gltfLoader.load(
//     '/models/scene.gltf',
//     (gltf) =>
//     {
//         console.log('success')
//         console.log(gltf.scene)
//         // scene.add(gltf.scene.children)

//         // scene.add(gltf.scene)
//     }
// )


const WIDTH = 128;
// Debug
const gui = new dat.GUI()
let settings = {
    uAmplitude: 1.0,
    uMaxDistance: 2.0,
    uF : 2.4,
    uPow: 5.0
}

gui.add(settings, 'uAmplitude').min(0).max(3).step(0.05).onChange(() => {
    material.uniforms.uAmplitude.value = settings.uAmplitude
})
gui.add(settings, 'uMaxDistance').min(0).max(4).step(0.05).onChange(() => {
    material.uniforms.uMaxDistance.value = settings.uMaxDistance
})
gui.add(settings, 'uF').min(0).max(10).step(0.1).onChange(() => {
    material.uniforms.uF.value = settings.uF
})
gui.add(settings, 'uPow').min(0).max(20).step(0.1).onChange(() => {
    material.uniforms.uPow.value = settings.uPow
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test mesh
 */
// Geometry
let geometry = new THREE.BufferGeometry()

// let positions = new Float32Array(WIDTH * WIDTH * 3)
// let references = new Float32Array(WIDTH * WIDTH * 2)

// for (let i = 0; i < WIDTH * WIDTH; i++) {
//     let x = Math.random()
//     let y = Math.random()
//     let z = Math.random()
//     let xx = (i % WIDTH) / WIDTH
//     let yy = ~~(i / WIDTH) / WIDTH
//     positions.set([x, y, z], i * 3)
//     references.set([xx, yy], i * 2)
// }
// // console.log(positions);
// geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
// geometry.setAttribute('reference', new THREE.BufferAttribute(references, 2))

// Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        positionTexture: { value: null },
        uAmplitude: { value: 1.0 },
        uMaxDistance: { value: 2.0 },
        uF: { value: 2.4 },
        uPow: { value: 5.0 }
    },
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide
})

// Mesh
geometry = new THREE.IcosahedronBufferGeometry(1, 128)
const mesh = new THREE.Points(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
camera.position.set(0.0, - 0.0, 2.4)
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
// let gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);
// const dtPosition = gpuCompute.createTexture();

// let arr = dtPosition.image.data;

// console.log('dt', dtPosition.image.data);
// for (let i = 0; i < arr.length; i = i + 4) {

//     arr[i] = Math.random();
//     arr[i + 1] = Math.random();
//     arr[i + 2] = Math.random();
//     arr[i + 3] = 1;
// }
// dtPosition.image.data = arr;
// dtPosition.needsUpdate = true;
// console.log('dt after', dtPosition.image.data);


// let positionVariable = gpuCompute.addVariable("texturePosition", fragmentSimulation, dtPosition);

// positionVariable.material.uniforms.time = { value: 0.0 }
// positionVariable.wrapS = THREE.RepeatWrapping;
// positionVariable.wrapT = THREE.RepeatWrapping;



// const error = gpuCompute.init()
// if (error !== null) {
//     console.error(error)
// }

/**
 * Animate
 */
// console.log( gpuCompute.getCurrentRenderTarget(positionVariable).texture);
let clock = new THREE.Clock();
const tick = () => {
    // Update controls

    controls.update()
    let elapsedTime = clock.getElapsedTime()
    // positionVariable.material.uniforms['time'].value = elapsedTime
    // gpuCompute.compute()
    // dtPosition.needsUpdate = true;
    material.uniforms.time.value = elapsedTime*3
    // material.uniforms.positionTexture.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
    // Render
    renderer.render(scene, camera)


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()