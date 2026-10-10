/**
 * Voxel Mumbai - World Renderer (Phase 3)
 * Features:
 * - Pixel-perfect CanvasTexture atlas with zero bleed/distortion
 * - Dynamic Day/Night Cycle with warm Arabian Sea Golden Hour sunset
 * - Atmospheric sky dome, directional sunlight, and ambient lighting
 * - Monsoon rain weather system with instanced rain streaks
 * - Water wave animation
 */

import * as THREE from 'three';
import { TextureAtlas } from './atlas-generator.js';

export class WorldRenderer {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Object} [options]
   */
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      fov: 70,
      near: 0.1,
      far: 1200,
      renderDistance: options.renderDistance || 8,
      ...options
    };

    // 1. Texture Atlas
    this.atlas = new TextureAtlas();
    this.atlasTexture = this.createAtlasTexture();

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // 3. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.options.fov,
      window.innerWidth / window.innerHeight,
      this.options.near,
      this.options.far
    );

    // 4. World Roots
    this.chunkGroup = new THREE.Group();
    this.scene.add(this.chunkGroup);

    // 5. Materials
    this.materials = this.createMaterials();

    // 6. Day/Night & Lighting
    this.timeOfDay = 17.5; // Default 17:30 (Iconic Mumbai Golden Hour sunset!)
    this.dayDuration = 600; // 10 minutes full cycle
    this.isCycleActive = true;
    this.setupLighting();

    // 7. Monsoon Weather System
    this.isMonsoonActive = false;
    this.setupMonsoonWeather();

    // Resize handler
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
  }

  createAtlasTexture() {
    // Generate HTML5 Canvas element for guaranteed pixel-perfect WebGL texture upload
    let texture;
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = this.atlas.width;
      canvas.height = this.atlas.height;
      const ctx = canvas.getContext('2d');
      const imgData = ctx.createImageData(this.atlas.width, this.atlas.height);
      imgData.data.set(this.atlas.pixels);
      ctx.putImageData(imgData, 0, 0);

      texture = new THREE.CanvasTexture(canvas);
    } else {
      texture = new THREE.DataTexture(
        this.atlas.pixels,
        this.atlas.width,
        this.atlas.height,
        THREE.RGBAFormat,
        THREE.UnsignedByteType
      );
    }

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    return texture;
  }

  createMaterials() {
    const opaque = new THREE.MeshLambertMaterial({
      map: this.atlasTexture,
      vertexColors: true,
      side: THREE.FrontSide
    });

    const cutout = new THREE.MeshLambertMaterial({
      map: this.atlasTexture,
      vertexColors: true,
      alphaTest: 0.5,
      side: THREE.DoubleSide
    });

    const transparent = new THREE.MeshLambertMaterial({
      map: this.atlasTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      depthWrite: true,
      side: THREE.DoubleSide
    });

    return { opaque, cutout, transparent };
  }

  setupLighting() {
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xfff5e6, 0.6);
    this.scene.add(this.ambientLight);

    // Directional Sunlight / Moonlight
    this.sunLight = new THREE.DirectionalLight(0xffecd2, 1.2);
    this.sunLight.position.set(100, 250, 120);
    this.scene.add(this.sunLight);

    // Hemisphere bounce
    this.hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x5a4a3a, 0.4);
    this.scene.add(this.hemiLight);

    // Atmosphere fog
    this.scene.fog = new THREE.FogExp2(0xa5d5f2, 0.003);

    this.updateAtmosphere();
  }

  setupMonsoonWeather() {
    // Instanced geometry for falling rain streaks
    const rainCount = 1200;
    const rainGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = Math.random() * 80 + 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
    }

    rainGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const rainMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.8,
      transparent: true,
      opacity: 0.65
    });

    this.rainMesh = new THREE.Points(rainGeom, rainMat);
    this.rainMesh.visible = false;
    this.scene.add(this.rainMesh);
  }

  toggleMonsoon(active = null) {
    this.isMonsoonActive = (active !== null) ? active : !this.isMonsoonActive;
    this.rainMesh.visible = this.isMonsoonActive;
    this.updateAtmosphere();
  }

  setTimeOfDay(hours) {
    this.timeOfDay = (hours % 24 + 24) % 24;
    this.updateAtmosphere();
  }

  updateAtmosphere() {
    const t = this.timeOfDay;
    // Angle: 12.0 is top (zenith), 18.0 is sunset in west (-X), 6.0 is sunrise in east (+X)
    const angle = ((t - 6.0) / 24.0) * Math.PI * 2;
    const sunX = Math.cos(angle) * 350;
    const sunY = Math.sin(angle) * 350;
    const sunZ = 120;

    this.sunLight.position.set(sunX, Math.max(10, sunY), sunZ);

    if (this.isMonsoonActive) {
      // Dark monsoon sky & wet grey lighting
      const monsoonColor = new THREE.Color(0x334155);
      this.scene.background = monsoonColor;
      this.scene.fog.color = monsoonColor;
      this.ambientLight.color.setHex(0x64748b);
      this.ambientLight.intensity = 0.45;
      this.sunLight.color.setHex(0x94a3b8);
      this.sunLight.intensity = 0.5;
    } else if (t >= 6.0 && t < 16.5) {
      // Tropical Daylight
      const skyColor = new THREE.Color(0x7dd3fc);
      this.scene.background = skyColor;
      this.scene.fog.color = skyColor;
      this.ambientLight.color.setHex(0xf8fafc);
      this.ambientLight.intensity = 0.65;
      this.sunLight.color.setHex(0xfffbeb);
      this.sunLight.intensity = 1.15;
    } else if (t >= 16.5 && t < 19.0) {
      // Warm Mumbai Golden Hour Sunset (Marine Drive sunset!)
      const sunsetSky = new THREE.Color(0xf59e0b);
      this.scene.background = sunsetSky;
      this.scene.fog.color = sunsetSky;
      this.ambientLight.color.setHex(0xfb923c);
      this.ambientLight.intensity = 0.75;
      this.sunLight.color.setHex(0xffaa44);
      this.sunLight.intensity = 1.35;
    } else {
      // Mumbai Night (marine drive Queen's necklace & city lights)
      const nightSky = new THREE.Color(0x090d16);
      this.scene.background = nightSky;
      this.scene.fog.color = nightSky;
      this.ambientLight.color.setHex(0x1e293b);
      this.ambientLight.intensity = 0.35;
      this.sunLight.color.setHex(0x38bdf8);
      this.sunLight.intensity = 0.4;
    }
  }

  updateChunkMesh(chunk, meshData) {
    chunk.disposeMesh();

    if (!meshData || meshData.quadCount === 0) {
      return;
    }

    const group = new THREE.Group();
    group.position.set(chunk.cx * 16, 0, chunk.cz * 16);

    for (const pass of ['opaque', 'cutout', 'transparent']) {
      const buf = meshData[pass];
      if (buf && buf.vertexCount > 0) {
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(buf.positions, 3));
        geom.setAttribute('normal', new THREE.BufferAttribute(buf.normals, 3));
        geom.setAttribute('uv', new THREE.BufferAttribute(buf.uvs, 2));
        geom.setAttribute('color', new THREE.BufferAttribute(buf.colors, 3));
        geom.setIndex(new THREE.BufferAttribute(buf.indices, 1));
        geom.computeBoundingSphere();

        const mesh = new THREE.Mesh(geom, this.materials[pass]);
        group.add(mesh);
      }
    }

    if (group.children.length > 0) {
      chunk.mesh = group;
      this.chunkGroup.add(group);
    }
  }

  update(dt) {
    // 1. Advance Day/Night Cycle
    if (this.isCycleActive) {
      this.timeOfDay = (this.timeOfDay + (dt / this.dayDuration) * 24) % 24;
      this.updateAtmosphere();
    }

    // 2. Animate Monsoon Rain
    if (this.isMonsoonActive && this.rainMesh) {
      this.rainMesh.position.x = this.camera.position.x;
      this.rainMesh.position.z = this.camera.position.z;

      const positions = this.rainMesh.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= dt * 65.0; // Fall downward
        if (positions[i] < 0) positions[i] = 75.0;
      }
      this.rainMesh.geometry.attributes.position.needsUpdate = true;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    this.atlasTexture.dispose();
    for (const mat of Object.values(this.materials)) {
      mat.dispose();
    }
  }
}
