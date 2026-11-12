"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";


function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);

  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return shape;
}

function normalizeShapeUVs(geom: THREE.ShapeGeometry, width: number, height: number) {
  const pos = geom.attributes.position;
  const uv = geom.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + width / 2) / width, (pos.getY(i) + height / 2) / height);
  }
  uv.needsUpdate = true;
}

function createBackGlassTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 2240;
  const ctx = canvas.getContext("2d")!;

  // Porcelain-sage frosted matte back
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, "#f4f8f6");
  grad.addColorStop(0.55, "#e8efec");
  grad.addColorStop(1, "#dde7e2");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle centered G-inspired security ring emblem
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.53;
  ctx.save();
  ctx.strokeStyle = "rgba(15, 45, 34, 0.16)";
  ctx.lineWidth = 22;
  ctx.lineCap = "butt";
  ctx.beginPath();
  ctx.arc(cx, cy, 86, -0.35, Math.PI * 1.72);
  ctx.stroke();

  ctx.fillStyle = "rgba(15, 45, 34, 0.16)";
  ctx.fillRect(cx - 2, cy - 11, 96, 22);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}
export default function PixelPhoneCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(() => {
    if (typeof document === "undefined") return false;
    const probe = document.createElement("canvas");
    return !(probe.getContext("webgl2") || probe.getContext("webgl"));
  });

  useEffect(() => {
    if (webglFailed) return;
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      queueMicrotask(() => setWebglFailed(true));
      return;
    }
    const disposables: Array<{ dispose: () => void }> = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "pan-y";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const pmrem = track(new THREE.PMREMGenerator(renderer));
    const roomEnv = track(new RoomEnvironment());
    const envRT = track(pmrem.fromScene(roomEnv, 0.04));
    scene.environment = envRT.texture;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 10.5);

    // Studio Lighting + bottom security-green aura bounce
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4.5, 6.5, 6.0);
    scene.add(keyLight);

    const rimTop = new THREE.DirectionalLight(0xdffbc0, 1.45);
    rimTop.position.set(-4.5, 4.0, -5.0);
    scene.add(rimTop);

    const greenBounce = new THREE.PointLight(0xafec2c, 3.4, 12, 1.4);
    greenBounce.position.set(0.2, -3.5, 1.8);
    scene.add(greenBounce);
    // Pixel 10 Pro Group
    const phonePivot = new THREE.Group();
    const phoneModel = new THREE.Group();
    phonePivot.add(phoneModel);
    scene.add(phonePivot);

    // Hardware Dimensions (accurate Pixel 10 Pro ~152.8 x 72.0 x 8.5 mm ratio)
    const W = 1.94;
    const H = 4.18;
    const R = 0.29;

    // 1. Polished Titanium / Aluminum Unibody Frame
    const frameShape = createRoundedRectShape(W, H, R);
    const frameGeo = track(
      new THREE.ExtrudeGeometry(frameShape, {
        depth: 0.168,
        bevelEnabled: true,
        bevelThickness: 0.022,
        bevelSize: 0.022,
        bevelSegments: 6,
        curveSegments: 24,
      })
    );
    frameGeo.translate(0, 0, -0.084);

    const titaniumMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xd6e0dc,
        metalness: 0.92,
        roughness: 0.17,
        envMapIntensity: 1.35,
      })
    );
    const frameMesh = new THREE.Mesh(frameGeo, titaniumMat);
    phoneModel.add(frameMesh);

    // Right rail hardware buttons (Pixel signature: Power above Volume)
    const buttonGeoPower = track(new THREE.BoxGeometry(0.036, 0.25, 0.068));
    const powerBtn = new THREE.Mesh(buttonGeoPower, titaniumMat);
    powerBtn.position.set(W / 2 + 0.024, 0.62, 0);
    phoneModel.add(powerBtn);

    const buttonGeoVol = track(new THREE.BoxGeometry(0.036, 0.52, 0.068));
    const volBtn = new THREE.Mesh(buttonGeoVol, titaniumMat);
    volBtn.position.set(W / 2 + 0.024, 0.08, 0);
    phoneModel.add(volBtn);

    // Bottom rail USB-C port & speaker cutouts
    const darkPortMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x111917,
        metalness: 0.4,
        roughness: 0.6,
      })
    );
    const usbPort = new THREE.Mesh(track(new THREE.BoxGeometry(0.28, 0.018, 0.075)), darkPortMat);
    usbPort.position.set(0, -H / 2 - 0.018, 0);
    phoneModel.add(usbPort);

    const speakerLeft = new THREE.Mesh(track(new THREE.BoxGeometry(0.24, 0.015, 0.045)), darkPortMat);
    speakerLeft.position.set(-0.46, -H / 2 - 0.018, 0);
    phoneModel.add(speakerLeft);

    const speakerRight = new THREE.Mesh(track(new THREE.BoxGeometry(0.24, 0.015, 0.045)), darkPortMat);
    speakerRight.position.set(0.46, -H / 2 - 0.018, 0);
    phoneModel.add(speakerRight);

    // 2. Front Black Bezel + Glowing OLED Kupass Display (+Z)
    const bezelW = W - 0.05;
    const bezelH = H - 0.05;
    const bezelGeo = track(new THREE.ShapeGeometry(createRoundedRectShape(bezelW, bezelH, 0.26), 24));
    const bezelMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x060a09,
        roughness: 0.12,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
      })
    );
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.z = 0.1065;
    phoneModel.add(bezelMesh);

    const screenW = W - 0.155;
    const screenH = H - 0.165;
    const screenGeo = track(new THREE.ShapeGeometry(createRoundedRectShape(screenW, screenH, 0.215), 24));
    normalizeShapeUVs(screenGeo, screenW, screenH);

    const maxAniso = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    const loader = new THREE.TextureLoader();
    const screenTex = track(
      loader.load("/kupass-screen.png", (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = maxAniso;
        tex.needsUpdate = true;
      })
    );
    screenTex.colorSpace = THREE.SRGBColorSpace;
    screenTex.generateMipmaps = true;
    screenTex.minFilter = THREE.LinearMipmapLinearFilter;
    screenTex.magFilter = THREE.LinearFilter;
    screenTex.anisotropy = maxAniso;
    const screenMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        emissiveMap: screenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 1.0,
        roughness: 0.12,
        metalness: 0.0,
        clearcoat: 0.18,
        clearcoatRoughness: 0.08,
        envMapIntensity: 0.25,
        toneMapped: false,
      })
    );
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.108;
    phoneModel.add(screenMesh);

    const opticGlassMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x052e23,
        metalness: 0.25,
        roughness: 0.04,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        envMapIntensity: 2.2,
      })
    );
    // 3. Back Frosted Porcelain-Sage Glass (-Z)
    const backTex = track(createBackGlassTexture());
    const backGeo = track(new THREE.ShapeGeometry(createRoundedRectShape(bezelW, bezelH, 0.26), 24));
    normalizeShapeUVs(backGeo, bezelW, bezelH);
    const backMat = track(
      new THREE.MeshPhysicalMaterial({
        map: backTex,
        roughness: 0.36,
        metalness: 0.04,
        clearcoat: 0.48,
        clearcoatRoughness: 0.26,
      })
    );
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.rotation.y = Math.PI;
    backMesh.position.z = -0.1065;
    phoneModel.add(backMesh);

    // 4. Iconic Pixel 10 Pro Detached Floating Pill Camera Visor (-Z, upper third)
    const visorGroup = new THREE.Group();
    visorGroup.position.set(0, 1.18, 0);
    phoneModel.add(visorGroup);

    const visorW = 1.62;
    const visorH = 0.57;
    const visorShape = createRoundedRectShape(visorW, visorH, visorH / 2);
    const visorHousingGeo = track(
      new THREE.ExtrudeGeometry(visorShape, {
        depth: 0.085,
        bevelEnabled: true,
        bevelThickness: 0.022,
        bevelSize: 0.022,
        bevelSegments: 6,
        curveSegments: 28,
      })
    );
    // Extrudes from 0..0.085 (+bevel -0.022..0.107). Rotate 180deg Y so it protrudes toward -Z!
    visorHousingGeo.rotateY(Math.PI);
    const visorHousingMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xd0dcd7,
        metalness: 0.95,
        roughness: 0.12,
        envMapIntensity: 1.5,
      })
    );
    const visorHousing = new THREE.Mesh(visorHousingGeo, visorHousingMat);
    visorHousing.position.z = -0.102;
    visorGroup.add(visorHousing);

    // Glossy obsidian glass pill inset on the visor face (at z = -0.212)
    const visorGlassGeo = track(
      new THREE.ShapeGeometry(createRoundedRectShape(1.48, 0.43, 0.215), 28)
    );
    const visorGlassMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x070b0a,
        metalness: 0.12,
        roughness: 0.04,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        envMapIntensity: 1.8,
      })
    );
    const visorGlass = new THREE.Mesh(visorGlassGeo, visorGlassMat);
    visorGlass.rotation.y = Math.PI;
    visorGlass.position.z = -0.211;
    visorGroup.add(visorGlass);

    const lensBezelMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x26302d,
        metalness: 0.85,
        roughness: 0.22,
      })
    );
    const lensInnerBarrelMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x0b100e,
        metalness: 0.3,
        roughness: 0.55,
      })
    );

    // Helper for circular wide & ultrawide lenses on the back visor (facing -Z)
    const addCircularCamera = (x: number, outerR: number, glassR: number) => {
      const bezel = new THREE.Mesh(
        track(new THREE.RingGeometry(outerR * 0.82, outerR, 32)),
        lensBezelMat
      );
      bezel.rotation.y = Math.PI;
      bezel.position.set(x, 0, -0.2125);
      visorGroup.add(bezel);

      const barrel = new THREE.Mesh(track(new THREE.CircleGeometry(outerR * 0.82, 32)), lensInnerBarrelMat);
      barrel.rotation.y = Math.PI;
      barrel.position.set(x, 0, -0.2122);
      visorGroup.add(barrel);

      const glass = new THREE.Mesh(track(new THREE.CircleGeometry(glassR, 28)), opticGlassMat);
      glass.rotation.y = Math.PI;
      glass.position.set(x, 0, -0.213);
      visorGroup.add(glass);

      // Subtle aperture pinpoint
      const iris = new THREE.Mesh(
        track(new THREE.CircleGeometry(glassR * 0.38, 20)),
        track(new THREE.MeshBasicMaterial({ color: 0x020605 }))
      );
      iris.rotation.y = Math.PI;
      iris.position.set(x, 0, -0.2134);
      visorGroup.add(iris);
    };

    // Main 50MP Wide (left when viewing back = +x) & 48MP Ultrawide
    addCircularCamera(0.45, 0.142, 0.088);
    addCircularCamera(0.08, 0.132, 0.076);

    // Signature Pixel Pro 5x Periscope Telephoto (rounded square optic!)
    const periFrameGeo = track(new THREE.ShapeGeometry(createRoundedRectShape(0.245, 0.245, 0.06), 16));
    const periFrame = new THREE.Mesh(periFrameGeo, lensBezelMat);
    periFrame.rotation.y = Math.PI;
    periFrame.position.set(-0.29, 0, -0.2124);
    visorGroup.add(periFrame);

    const periWellGeo = track(new THREE.ShapeGeometry(createRoundedRectShape(0.20, 0.20, 0.045), 16));
    const periWell = new THREE.Mesh(periWellGeo, lensInnerBarrelMat);
    periWell.rotation.y = Math.PI;
    periWell.position.set(-0.29, 0, -0.2128);
    visorGroup.add(periWell);

    const periGlassGeo = track(new THREE.ShapeGeometry(createRoundedRectShape(0.145, 0.115, 0.025), 12));
    const periGlass = new THREE.Mesh(periGlassGeo, opticGlassMat);
    periGlass.rotation.y = Math.PI;
    periGlass.position.set(-0.29, 0, -0.2133);
    visorGroup.add(periGlass);

    // LED Flash + Temp / Laser AF sensor
    const flashMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xfef7e0,
        emissive: 0xfef3c7,
        emissiveIntensity: 0.18,
        roughness: 0.35,
      })
    );
    const flash = new THREE.Mesh(track(new THREE.CircleGeometry(0.048, 20)), flashMat);
    flash.rotation.y = Math.PI;
    flash.position.set(-0.56, 0.075, -0.2128);
    visorGroup.add(flash);

    const tempSensor = new THREE.Mesh(track(new THREE.CircleGeometry(0.032, 20)), opticGlassMat);
    tempSensor.rotation.y = Math.PI;
    tempSensor.position.set(-0.56, -0.078, -0.2128);
    visorGroup.add(tempSensor);

    // Hero angle: clean 3/4 front pose keeping screen text sharp + titanium rail visible
    const baseTiltZ = -0.28;
    const basePitchX = 0.08;
    const baseHeroYaw = -0.22;
    let currentYaw = baseHeroYaw;
    let currentPitch = basePitchX;
    let dragOffsetYaw = 0;
    let dragOffsetPitch = 0;
    let targetDragYaw = 0;
    let targetDragPitch = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let baseYOffset = 0;
    phonePivot.rotation.set(currentPitch, currentYaw, baseTiltZ);

    // Responsive sizing via ResizeObserver across full hero canvas (zero clipping)
    const updateSize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;

      renderer.setSize(w, h, false);
      camera.aspect = w / h;

      const phoneWorldH = 4.55;
      const phoneWorldW = 2.95;
      const targetHeightFraction = camera.aspect >= 1 ? 0.62 : 0.54;
      const targetWidthFraction = 0.80;
      const vFovRad = (camera.fov * Math.PI) / 180;
      const desiredWorldH = phoneWorldH / targetHeightFraction;
      const distH = (desiredWorldH / 2) / Math.tan(vFovRad / 2);

      const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * camera.aspect);
      const desiredWorldW = phoneWorldW / targetWidthFraction;
      const distW = (desiredWorldW / 2) / Math.tan(hFovRad / 2);

      camera.position.z = Math.max(distH, distW);
      camera.updateProjectionMatrix();

      const visibleWorldH = 2 * camera.position.z * Math.tan(vFovRad / 2);
      baseYOffset = visibleWorldH * (camera.aspect >= 1 ? 0.045 : 0.03);
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);
    updateSize();

    // Pointer drag orbit
    const canvasEl = renderer.domElement;
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvasEl.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      targetDragYaw += dx * 0.011;
      targetDragPitch = THREE.MathUtils.clamp(targetDragPitch + dy * 0.008, -0.65, 0.65);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      if (canvasEl.hasPointerCapture(e.pointerId)) {
        canvasEl.releasePointerCapture(e.pointerId);
      }
    };

    canvasEl.addEventListener("pointerdown", onPointerDown);
    canvasEl.addEventListener("pointermove", onPointerMove);
    canvasEl.addEventListener("pointerup", onPointerUp);
    canvasEl.addEventListener("pointercancel", onPointerUp);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const swayYaw = reducedMotion ? 0 : Math.sin(t * 0.7) * 0.06;
      const floatY = reducedMotion ? 0 : Math.sin(t * 1.35) * 0.075;
      dragOffsetYaw = THREE.MathUtils.lerp(dragOffsetYaw, targetDragYaw, 0.12);
      dragOffsetPitch = THREE.MathUtils.lerp(dragOffsetPitch, targetDragPitch, 0.12);

      currentYaw = THREE.MathUtils.lerp(currentYaw, baseHeroYaw + dragOffsetYaw + swayYaw, 0.085);
      currentPitch = THREE.MathUtils.lerp(currentPitch, basePitchX + dragOffsetPitch, 0.085);

      phonePivot.rotation.set(currentPitch, currentYaw, baseTiltZ);
      phonePivot.position.y = baseYOffset + floatY;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      canvasEl.removeEventListener("pointerdown", onPointerDown);
      canvasEl.removeEventListener("pointermove", onPointerMove);
      canvasEl.removeEventListener("pointerup", onPointerUp);
      canvasEl.removeEventListener("pointercancel", onPointerUp);

      for (const item of disposables) {
        item.dispose();
      }
      renderer.dispose();
      if (canvasEl.parentNode === container) {
        container.removeChild(canvasEl);
      }
    };
  }, [webglFailed]);

  if (webglFailed) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative h-72 w-36 -rotate-12 rounded-[2rem] border-4 border-zinc-300 bg-zinc-100 p-3 shadow-2xl sm:h-88 sm:w-44">
          <div className="mx-auto mt-6 flex h-10 w-28 items-center justify-around rounded-full bg-zinc-900 px-2.5 shadow-inner">
            <span className="h-4 w-4 rounded-full bg-emerald-950 ring-2 ring-zinc-700" />
            <span className="h-3.5 w-3.5 rounded-full bg-emerald-950 ring-2 ring-zinc-700" />
            <span className="h-4 w-4 rounded-md bg-emerald-950 ring-2 ring-zinc-700" />
          </div>
          <div className="mt-20 text-center text-xs font-semibold tracking-wider text-zinc-400">
            PIXEL 10 PRO
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Interactive 3D Google Pixel 10 Pro running Kupass password manager"
      className="h-full w-full cursor-grab select-none active:cursor-grabbing"
    />
  );
}
