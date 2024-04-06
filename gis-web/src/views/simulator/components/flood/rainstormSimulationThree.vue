<template>
    <div id="three-canvas">
        <div id="gui-containter"></div>
    </div>
</template>

<script>
/* eslint-disable no-undef */
import ajax from "@/views/simulator/ajax2";
import serverInfo from "@/views/simulator/serverInfo";

import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';

import { PeoplePath } from './PeoplePath.js';

// 生成建筑物贴图
function generateTextureCanvas() {
    // build a small canvas 32x64 and paint it in white
    let w = 16; let h = 32;
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var context = canvas.getContext('2d');
    // plain it in white
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, w, h);
    // draw the window rows - with a small noise to simulate light variations in each room
    for (var y = 2; y < h; y += 2) {
        for (var x = 0; x < w; x += 2) {
            var value = Math.floor(Math.random() * 64);
            context.fillStyle = 'rgb(' + [value, value, value].join(',') + ')';
            context.fillRect(x, y, 2, 1);
        }
    }

    // build a bigger canvas and copy the small one in it
    // This is a trick to upscale the texture without filtering
    var canvas2 = document.createElement('canvas');
    canvas2.width = 512;
    canvas2.height = 1024;
    context = canvas2.getContext('2d');
    // disable smoothing
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    // then draw the image
    context.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
    // return the just built canvas2
    return canvas2;
}

// 处理积水信息
function processWaters(waters) {
    let matrixs = [];
    let depthValues = [];
    let temp = new THREE.Object3D();
    waters.forEach(item => {
        temp.position.copy(new THREE.Vector3().fromArray(item.pos));
        temp.scale.set(item.size[0], 1, item.size[1]);
        temp.updateMatrix();
        matrixs.push(temp.matrix.toArray());
        depthValues.push(item.depth);
    });
    return {
        matrixs: matrixs,
        depthValues: depthValues,
    };
}

// 设置人物动画动作
function setActionWeight(action, weight) {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
}

export default {
    name: "rainstormSimulationThree",
    data() {
        return {
            width: 600,
            height: 300,
            // Render
            renderer: null,
            camera: null,
            scene: null,
            camera_post: null,
            scene_post: null,
            target: null,
            target_depth: null,
            scene_post_fog: null,
            // Time
            clock: null,
            time: 0,
            // FPS
            singleFrameTime: 1 / 60,
            timeStamp: 0,
            // Resource
            baseURL: serverInfo.baseURL_three + "/static/three/",
            dataPath: "static/three/data/",
            modelPath: "models/",
            texturePath: "textures/",
            shaderPath: "static/three/shaders/",
            gltfLoader: null,
            // Water
            waterMaterial: null,
            postMaterial: null,
            fogMaterial: null,
            waterInstanced: null,
            // People
            PeopleCountRow: 7,
            PeopleCount: 7 * 7,
            peopleTransforms: null,
            animationMixers: null,
            peopleOffsets: null,
            peoplePath: null,
            MoveSpeed: 5,
            RotateSpeed: 10,
            rotationMatrix: new THREE.Matrix4(),
            targetQuaternion: new THREE.Quaternion(),
            matPoint: null,
            matLine: null,
        };
    },
    mounted() {
        this.init();
        this.addLights();
        this.loadScene();
        this.addPostRain();
        this.addPostFog();
    },
    beforeDestroy() {
        cancelAnimationFrame(this.animation);
    },
    methods: {
        // 初始化
        init() {
            const canvas = document.getElementById("three-canvas");
            // const board = document.getElementsByClassName("show-board")[0];
            // const panel = document.getElementsByClassName("panel")[0];
            // this.width = board.offsetWidth - panel.offsetWidth;
            // this.height = panel.offsetHeight;
            const resultCanvas = document.getElementById("resultCanvas");
            this.width = resultCanvas.offsetWidth;
            this.height = resultCanvas.offsetHeight;
            // this.width = 400;
            // this.height = 300;

            let renderer, scene, camera, clock;
            {
                renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setPixelRatio(this.width / this.height);
                renderer.setSize(this.width, this.height);
                renderer.toneMapping = THREE.ACESFilmicToneMapping;
                renderer.toneMappingExposure = 1.4;
                renderer.domElement.id = "renderer";
                canvas.append(renderer.domElement);
                camera = new THREE.PerspectiveCamera(
                    60,
                    this.width / this.height,
                    1,
                    1000
                );
                camera.position.set(0, 20, 150);

                scene = new THREE.Scene();
                const control = new OrbitControls(camera, renderer.domElement);

                window.onresize = () => {
                    this.winResizeListener();
                };
            }
            window.renderer = renderer;

            let backgroundColor = new THREE.Color(0x000000);
            scene.background = backgroundColor;

            clock = new THREE.Clock();

            this.renderer = renderer;
            this.scene = scene;
            this.camera = camera;
            this.clock = clock;
        },
        start() {
            this.animate();
            this.clock.start();
        },
        stop() {
            cancelAnimationFrame(this.animation);
            this.clock.stop();
        },
        // 添加灯光
        addLights() {
            // Lights
            const dirLight1 = new THREE.DirectionalLight(0xffffffff, 1);
            dirLight1.position.set(100, 100, 100);
            this.scene.add(dirLight1);

            const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
            dirLight2.position.set(-200, 100, 0);
            this.scene.add(dirLight2);

            const dirLight3 = new THREE.DirectionalLight(0xffffff, 1);
            dirLight3.position.set(50, 100, -100);
            this.scene.add(dirLight3);
        },
        // 添加屏幕后续：雨纹、雨滴
        async addPostRain() {
            const vert = await ajax(this.shaderPath + "rain/vert.glsl");
            const frag = await ajax(this.shaderPath + "rain/frag.glsl");

            this.camera_post = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

            this.scene_post = new THREE.Scene();

            this.postMaterial = new THREE.ShaderMaterial({
                vertexShader: vert,
                fragmentShader: frag,
                uniforms: {
                    aspect: { value: this.camera.aspect },
                    tDiffuse: { value: null },
                    time: { value: 0.0 },
                    rainSpeed: { value: 0.2 },
                    rainAngle: { value: 0.1 },
                    rainDensity: { value: 2.0 },
                    blendAlpha: { value: 0.8 },
                    // blendAlpha: { value: 1.0 },
                    dropsAmount: { value: 0.5 },
                    // dropsAmount: { value: 0.0 },
                    dropsSpeed: { value: 2.0 },
                    dropsZoom: { value: 0.5 },
                },
            });

            const postPlane = new THREE.PlaneGeometry(2, 2);
            const postQuad = new THREE.Mesh(postPlane, this.postMaterial);
            this.scene_post.add(postQuad);
            this.target = new THREE.WebGLRenderTarget(this.width, this.height);
            this.target.texture.minFilter = THREE.LinearFilter;
            this.target.texture.magFilter = THREE.LinearFilter;

            // addRainConfig();
        },
        // 添加雾
        async addPostFog() {
            const vert = await ajax(this.shaderPath + "fog/vert.glsl");
            const frag = await ajax(this.shaderPath + "fog/frag.glsl");

            this.scene_post_fog = new THREE.Scene();

            this.fogMaterial = new THREE.ShaderMaterial({
                vertexShader: vert,
                fragmentShader: frag,
                uniforms: {
                    tDiffuse: { value: null },
                    tDepth: { value: null },
                    cameraNear: { value: this.camera.near },
                    cameraFar: { value: this.camera.far },
                    dist: { value: 100 },
                    atmos_light: { value: new THREE.Color(0xeeeeee) },
                    weatherType: { value: 1.0 },
                    density: { value: 1.0 },
                },
            });

            const postPlane = new THREE.PlaneGeometry(2, 2);
            const postQuad = new THREE.Mesh(postPlane, this.fogMaterial);
            this.scene_post_fog.add(postQuad);

            this.target_depth = new THREE.WebGLRenderTarget(this.width, this.height);
            this.target_depth.texture.minFilter = THREE.LinearFilter;
            this.target_depth.texture.magFilter = THREE.LinearFilter;
            this.target_depth.stencilBuffer = false;
            this.target_depth.depthTexture = new THREE.DepthTexture();
            this.target_depth.depthTexture.format = THREE.DepthFormat;
            this.target_depth.depthTexture.type = THREE.UnsignedIntType;

            //   addFogConfig();
        },
        // 加载场景
        loadScene() {
            this.gltfLoader = new GLTFLoader().setPath(this.baseURL + this.modelPath);

            this.loadTerrain();
            this.loadRoads();
            this.loadTrafficLights();
            this.loadBuildings();
            this.loadWaters();
            this.loadPeople();

            this.scene.scale.set(2.0, 2.0, 2.0);
        },
        // 加载地形
        loadTerrain() {
            // 加载地形模型
            this.gltfLoader.load(`CityNew/Terrain_tile.glb`, (glb) => {
                this.scene.add(glb.scene);
            });
        },
        // 加载道路
        loadRoads() {
            // 加载道路模型
            this.gltfLoader.load(`CityNew/Roads.glb`, (glb) => {
                this.scene.add(glb.scene);
            });
        },
        // 加载交通灯
        loadTrafficLights() {
            // 加载交通灯模型
            this.gltfLoader.load(`CityNew/TrafficLights.glb`, (glb) => {
                this.scene.add(glb.scene);
            });
        },
        // 加载建筑物
        async loadBuildings() {
            let buildings = new THREE.Group();

            let buildingsInfo;
            {
                buildingsInfo = await ajax(this.dataPath + "buildings_new.json");

                for (let x = 0; x < 6; x++) {
                    for (let y = 0; y < 6; y++) {
                        let scaleY = 20 + (Math.random() - 0.5) * 20;
                        let posX = -75 + x * 15 + (Math.random() - 0.5) * 4;
                        let posZ = -75 + y * 15 + (Math.random() - 0.5) * 4;
                        buildingsInfo.push([8, scaleY, 8, posX, 0, posZ])
                    }
                }
            }

            // 加载建筑物模型
            this.gltfLoader.load(`Cube.glb`, (glb) => {
                let geometry = glb.scene.children[0].geometry;
                var texture = new THREE.Texture(generateTextureCanvas());
                texture.anisotropy = this.renderer.getMaxAnisotropy();
                texture.needsUpdate = true;
                let material = new THREE.MeshBasicMaterial({
                    map: texture,
                });

                const buildingsCount = buildingsInfo.length;

                let buildingMesh = new THREE.InstancedMesh(geometry, material, buildingsCount);

                const objTemp = new THREE.Object3D();
                for (let i = 0; i < buildingsCount; i++) {
                    // 设置建筑物缩放、位置和颜色
                    objTemp.scale.set(buildingsInfo[i][0], buildingsInfo[i][1], buildingsInfo[i][2]);
                    objTemp.position.set(buildingsInfo[i][3], buildingsInfo[i][4], buildingsInfo[i][5]);
                    objTemp.updateMatrix();
                    buildingMesh.setMatrixAt(i, objTemp.matrix);
                }
                buildingMesh.position.y = -1;
                buildings.add(buildingMesh);
            });

            this.scene.add(buildings);
        },
        // 加载积水
        async loadWaters() {
            const vert_water = await ajax(this.shaderPath + "water/vert_water.glsl");
            const frag_water = await ajax(this.shaderPath + "water/frag_water.glsl");

            let waters = await ajax(this.dataPath + "waters_new.json");

            let textureLoader = new THREE.TextureLoader();
            textureLoader.setPath(this.baseURL + this.texturePath);
            this.gltfLoader.load("Water_Quad.glb", (glb) => {
                let model = glb.scene.children[0];
                let geometry = model.geometry;
                let map = textureLoader.load(
                    "Water_base.jpg",
                    function (tex) {
                        tex.wrapS = THREE.RepeatWrapping;
                        tex.wrapT = THREE.RepeatWrapping;
                        tex.encoding = THREE.sRGBEnocding;
                    });
                let noiseTex = textureLoader.load(
                    "NoiseTex.jpg",
                    function (tex) {
                        tex.wrapS = THREE.RepeatWrapping;
                        tex.wrapT = THREE.RepeatWrapping;
                    });
                let waterMaterial = new THREE.MeshPhysicalMaterial({
                    // let waterMaterial = new THREE.ShaderMaterial({
                    vertexShader: vert_water,
                    fragmentShader: frag_water,
                    uniforms: {
                        noiseTex: { value: noiseTex },
                        twistSpeed: { value: 0.04 },
                        twistIntensity: { value: 0.25 },
                        time: { value: 0 },

                        waveSpeed: { value: 0.4 },
                        waveStrenth: { value: 0.1 },
                        waveScale: { value: 0.1 },

                        safeColor: { value: new THREE.Color(0xffff00) },
                        dangerColor: { value: new THREE.Color(0xff0000) },
                        showDepth: { value: 0.0 },
                    },
                    map: map,
                    transparent: true,
                    opacity: 0.6,
                    roughness: 0.6,
                    color: new THREE.Color(0x777777),
                });
                let waterInstanced = new THREE.InstancedMesh(
                    geometry,
                    waterMaterial,
                    waters.length,
                );

                let waterInfos = processWaters(waters);
                let matrixs = waterInfos.matrixs;
                let depthValues = waterInfos.depthValues;
                for (let i = 0; i < waters.length; ++i) {
                    let mat = new THREE.Matrix4().fromArray(matrixs[i]);
                    waterInstanced.setMatrixAt(i, mat);
                }
                geometry.setAttribute(
                    "depthValue",
                    new THREE.InstancedBufferAttribute(new Float32Array(depthValues), 1)
                );

                waterInstanced.position.set(0, 0, 0);
                this.scene.add(waterInstanced);

                this.waterMaterial = waterMaterial;
                this.waterInstanced = waterInstanced;
            });
        },
        // 加载人物
        async loadPeople() {
            this.gltfLoader.load(`People/ManRunning.glb`, (glbMan) => {
                this.gltfLoader.load(`People/WomanRunning.glb`, (glbWoman) => {
                    this.peopleTransforms = [];
                    this.animationMixers = [];

                    for (let i = 0; i < this.PeopleCount; i++) {
                        // 随机设置人物性别
                        let type = Math.random() > 0.5;
                        let glb = type ? glbMan : glbWoman;
                        let animations = glb.animations;

                        let model = SkeletonUtils.clone(glb.scene);
                        const scale = 1.0;
                        model.scale.set(scale, scale, scale);

                        // 将人物模型作为一个Object3D的子物体，方便控制旋转和位移
                        let transform = new THREE.Object3D();
                        transform.add(model);
                        transform.position.set(0, -1, 20);
                        this.peopleTransforms.push(transform);

                        // 人物动画设置
                        let mixer = new THREE.AnimationMixer(model);
                        this.animationMixers.push(mixer);
                        let runningAction = mixer.clipAction(animations[0]);
                        setActionWeight(runningAction, 1);
                        runningAction.play();

                        this.scene.add(transform);
                    }
                });
            });
            this.loadPeoplePath();
        },
        // 加载人物移动路径
        async loadPeoplePath() {
            // 路径数据处理
            let pathData = await ajax(this.dataPath + "peoplePath.json");
            let path = [];
            pathData.forEach((item) => {
                path.push(new THREE.Vector3().fromArray(item));
            });

            // 路径点显示
            {
                const geometry = new THREE.SphereGeometry(1, 8, 8);
                const material = new THREE.MeshBasicMaterial({ color: 0xffa502 });
                this.matPoint = material;
                const sphere = new THREE.Mesh(geometry, material);
                path.forEach((item) => {
                    let point = sphere.clone();
                    point.position.copy(item);
                    this.scene.add(point);
                });
            }

            // 路径线段显示
            {
                const vertices = [];
                path.forEach((item) => {
                    vertices.push(item.x, item.y, item.z);
                });

                const geometry = new LineGeometry();
                geometry.setPositions(vertices);
                const material = new LineMaterial({
                    color: 0xff4757,
                    linewidth: 4,
                });
                this.matLine = material;
                material.resolution.set(window.innerWidth, window.innerHeight);
                const line = new Line2(geometry, material);
                this.scene.add(line);
            }

            // PeoplePath用于更新人物位置，沿路径移动
            {
                this.peoplePath = new PeoplePath(path, this.MoveSpeed);

                this.rotationMatrix.lookAt(this.peoplePath.targetPosition, this.peoplePath.currentPosition, this.scene.up);
                this.targetQuaternion.setFromRotationMatrix(this.rotationMatrix);
            }

            // 人群围绕路径点的偏移量
            {
                this.peopleOffsets = [];
                const peoplePadding = 1.5;
                for (let i = 0; i < this.PeopleCountRow; i++) {
                    for (let j = 0; j < this.PeopleCountRow; j++) {
                        let baseX = (i - this.PeopleCountRow / 2) * peoplePadding;
                        let baseZ = (j - this.PeopleCountRow / 2) * peoplePadding;
                        let offsetX = (Math.random() - 0.5) * 1;
                        let offsetZ = (Math.random() - 0.5) * 1;

                        this.peopleOffsets.push(new THREE.Vector3(baseX + offsetX, 0, baseZ + offsetZ));
                    }
                }
            }
        },
        winResizeListener() {
            const canvas = document.getElementById("three-canvas");
            this.width = canvas.offsetWidth;
            this.height = canvas.offsetHeight;

            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.width, this.height);
        },
        animate() {
            this.animation = requestAnimationFrame(this.animate);

            const delta = this.clock.getDelta();

            // 更新人物动画
            if (this.animationMixers) {
 this.animationMixers.forEach((mixer) => {
                    mixer.update(delta);
                });
}

            // 更新人物位置
            if (this.peoplePath && this.peopleTransforms) {
                let arriveTraget = this.peoplePath.updatePosition(delta);
                if (arriveTraget) {
                    this.rotationMatrix.lookAt(this.peoplePath.targetPosition, this.peoplePath.currentPosition, this.scene.up);
                    this.targetQuaternion.setFromRotationMatrix(this.rotationMatrix);
                }
                let currentPosition = this.peoplePath.currentPosition;

                for (let i = 0; i < this.peopleTransforms.length; i++) {
                    let peopleTransform = this.peopleTransforms[i];
                    let peopleOffset = this.peopleOffsets[i];
                    peopleTransform.position.copy(currentPosition);
                    peopleTransform.position.add(peopleOffset);
                    if (!peopleTransform.quaternion.equals(this.targetQuaternion)) {
                        const step = this.RotateSpeed * delta;
                        peopleTransform.quaternion.rotateTowards(this.targetQuaternion, step);
                    }
                }
            }

            // 更新累积时间
            this.time += 5 * delta;
            if (this.time > 500.0) this.time = 0.0;

            this.timeStamp += delta;
            if (this.timeStamp > this.singleFrameTime) {
                this.render();
                this.timeStamp = (this.timeStamp % this.singleFrameTime);
            }
        },
        render() {
            // if (this.waterMaterial) {
            //     this.waterMaterial.uniforms.time.value = this.time;
            // }
            if (this.postMaterial) {
                this.postMaterial.uniforms.time.value = this.time;
            }

            if (this.fogMaterial && this.postMaterial) {
                // 渲染场景
                this.renderer.setRenderTarget(this.target_depth);
                this.renderer.render(this.scene, this.camera);

                // 渲染雾
                this.fogMaterial.uniforms.tDiffuse.value = this.target_depth.texture;
                this.fogMaterial.uniforms.tDepth.value = this.target_depth.depthTexture;
                this.renderer.setRenderTarget(this.target);
                this.renderer.render(this.scene_post_fog, this.camera_post);

                // 渲染雨
                this.postMaterial.uniforms.tDiffuse.value = this.target.texture;
                this.renderer.setRenderTarget(null);
                this.renderer.render(this.scene_post, this.camera_post);
            } else {
                // 渲染场景
                this.renderer.setRenderTarget(null);
                this.renderer.render(this.scene, this.camera);
            }
        }
    },
};
</script>

<style lang="scss" scoped>
#three-canvas {
    width: 100%;
    height: 80vh;
    overflow: hidden;
    border-radius: 10px;
    transition: 0.3s;
    background-color: #fff;
  }


</style>
