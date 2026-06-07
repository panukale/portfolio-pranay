import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import * as THREE from 'three';

@Component({
  selector: 'app-hero-three',
  imports: [],
  templateUrl: './hero-three.html',
  styleUrl: './hero-three.css',
})
export class HeroThree implements AfterViewInit, OnDestroy {
  @ViewChild('threeCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationId = 0;

  private gearGroup = new THREE.Group();
  private serverGroup = new THREE.Group();
  private packets: THREE.Mesh[] = [];

  ngAfterViewInit(): void {
    this.initScene();
    this.createLights();
    this.createMechanicalGear();
    this.createServerCluster();
    this.createMessagePackets();
    this.createTelecomRings();
    this.animate();

    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onResize);

    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      55,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );

    this.camera.position.set(0, 1.2, 7);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const width = canvas.parentElement?.clientWidth || 700;
    const height = canvas.parentElement?.clientHeight || 650;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  private createLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 70, 12);
    blueLight.position.set(-3, 3, 4);
    this.scene.add(blueLight);

    const greenLight = new THREE.PointLight(0x22c55e, 60, 12);
    greenLight.position.set(4, -1, 3);
    this.scene.add(greenLight);
  }

  private createMechanicalGear(): void {
    const gearMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.75,
      roughness: 0.28,
      emissive: 0x082f49,
    });

    const center = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.18, 18, 80),
      gearMaterial
    );

    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.28, 48),
      gearMaterial
    );

    core.rotation.x = Math.PI / 2;

    this.gearGroup.add(center, core);

    for (let i = 0; i < 14; i++) {
      const tooth = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.45, 0.22),
        gearMaterial
      );

      const angle = (i / 14) * Math.PI * 2;
      tooth.position.set(Math.cos(angle) * 1.25, Math.sin(angle) * 1.25, 0);
      tooth.rotation.z = angle;

      this.gearGroup.add(tooth);
    }

    this.gearGroup.position.set(-1.35, 0.15, 0);
    this.gearGroup.rotation.x = 0.35;

    this.scene.add(this.gearGroup);
  }

  private createServerCluster(): void {
    const serverMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.55,
      roughness: 0.35,
      emissive: 0x020617,
    });

    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x14532d,
    });

    for (let i = 0; i < 4; i++) {
      const server = new THREE.Mesh(
        new THREE.BoxGeometry(1.35, 0.32, 0.75),
        serverMaterial
      );

      server.position.y = i * 0.42;

      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 16, 16),
        edgeMaterial
      );

      led.position.set(-0.52, i * 0.42 + 0.02, 0.42);

      this.serverGroup.add(server, led);
    }

    this.serverGroup.position.set(1.55, -0.75, 0);
    this.serverGroup.rotation.y = -0.45;
    this.serverGroup.rotation.x = 0.12;

    this.scene.add(this.serverGroup);
  }

  private createMessagePackets(): void {
    const packetMaterial = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x22c55e,
      emissiveIntensity: 1.2,
    });

    for (let i = 0; i < 12; i++) {
      const packet = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 16, 16),
        packetMaterial
      );

      packet.userData['offset'] = i * 0.55;
      this.packets.push(packet);
      this.scene.add(packet);
    }
  }

  private createTelecomRings(): void {
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.32,
    });

    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.2 + i * 0.45, 0.01, 12, 100),
        ringMaterial
      );

      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.25;
      ring.position.z = -0.35;
      this.scene.add(ring);
    }
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    const time = performance.now() * 0.001;

    this.gearGroup.rotation.z = time * 0.75;
    this.serverGroup.rotation.y = -0.45 + Math.sin(time * 0.8) * 0.12;

    this.packets.forEach((packet) => {
      const t = time + packet.userData['offset'];
      packet.position.x = Math.sin(t) * 2.55;
      packet.position.y = Math.cos(t * 1.4) * 0.85;
      packet.position.z = Math.sin(t * 0.75) * 0.9;
    });

    this.renderer.render(this.scene, this.camera);
  };

  private onResize = (): void => {
  const canvas = this.canvasRef.nativeElement;
  const width = canvas.parentElement?.clientWidth || 700;
  const height = canvas.parentElement?.clientHeight || 650;

  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();

  this.renderer.setSize(width, height);
};
}