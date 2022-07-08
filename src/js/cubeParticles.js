import { BufferGeometry, Color, Float32BufferAttribute, Points, PointsMaterial } from 'three';

const createCubeParticles = () => {
  let points;

  const particles1 = 200000;

  const geometry = new BufferGeometry();

  const positions = [];
  const colors = [];

  const color = new Color();

  const n = 500,
    n2 = n / 2; // particles spread in the cube

  for (let i = 0; i < particles1; i++) {
    // positions

    const x = Math.random() * n - n2;
    const y = Math.random() * n - n2;
    const z = Math.random() * n - n2;

    positions.push(x, y, z);

    // colors

    const vx = x / n + 0.5;
    const vy = y / n + 0.5;
    const vz = z / n + 0.5;

    color.setRGB(vx, vy, vz);

    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

  geometry.computeBoundingSphere();

  const material = new PointsMaterial({ size: 4, vertexColors: true });

  points = new Points(geometry, material);

  return {
    cudeParticles: points,
  };
};

export { createCubeParticles };
