
import { StlSettings, Vector3 } from '../types';

const vectorToString = (v: Vector3) => `${v.x} ${v.y} ${v.z}`;

const writeFace = (v1: Vector3, v2: Vector3, v3: Vector3) => {
    // Calculate normal vector
    const ab: Vector3 = { x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z };
    const ac: Vector3 = { x: v3.x - v1.x, y: v3.y - v1.y, z: v3.z - v1.z };
    
    let normal: Vector3 = {
        x: ab.y * ac.z - ab.z * ac.y,
        y: ab.z * ac.x - ab.x * ac.z,
        z: ab.x * ac.y - ab.y * ac.x,
    };
    
    const len = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
    if (len > 0) {
        normal.x /= len;
        normal.y /= len;
        normal.z /= len;
    }

    return `facet normal ${vectorToString(normal)}
  outer loop
    vertex ${vectorToString(v1)}
    vertex ${vectorToString(v2)}
    vertex ${vectorToString(v3)}
  endloop
endfacet
`;
};

export const generateStl = (imageData: ImageData, settings: StlSettings): string => {
    const { width, height, data } = imageData;
    const { baseHeight, modelHeight, invert } = settings;
    let stl = 'solid model\n';

    const getHeight = (x: number, y: number): number => {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3 / 255;
        const normalizedHeight = invert ? 1 - brightness : brightness;
        return baseHeight + normalizedHeight * modelHeight;
    };

    const vertexMap: Vector3[][] = Array.from({ length: height }, (_, y) =>
        Array.from({ length: width }, (_, x) => ({
            x: x - width / 2,
            y: y - height / 2,
            z: getHeight(x, y),
        }))
    );

    // Top surface
    for (let y = 0; y < height - 1; y++) {
        for (let x = 0; x < width - 1; x++) {
            const v1 = vertexMap[y][x];
            const v2 = vertexMap[y][x + 1];
            const v3 = vertexMap[y + 1][x];
            const v4 = vertexMap[y + 1][x + 1];

            stl += writeFace(v1, v3, v2);
            stl += writeFace(v3, v4, v2);
        }
    }

    // Bottom surface
    const vBottom1 = { x: vertexMap[0][0].x, y: vertexMap[0][0].y, z: 0 };
    const vBottom2 = { x: vertexMap[0][width - 1].x, y: vertexMap[0][width - 1].y, z: 0 };
    const vBottom3 = { x: vertexMap[height - 1][0].x, y: vertexMap[height - 1][0].y, z: 0 };
    const vBottom4 = { x: vertexMap[height - 1][width - 1].x, y: vertexMap[height - 1][width - 1].y, z: 0 };
    
    stl += writeFace(vBottom1, vBottom2, vBottom3);
    stl += writeFace(vBottom3, vBottom2, vBottom4);


    // Side walls
    // Front and back
    for (let x = 0; x < width - 1; x++) {
        // Front (y=0)
        const topLeft = vertexMap[0][x];
        const topRight = vertexMap[0][x+1];
        const bottomLeft = { ...topLeft, z: 0 };
        const bottomRight = { ...topRight, z: 0 };
        stl += writeFace(bottomLeft, topRight, topLeft);
        stl += writeFace(bottomLeft, bottomRight, topRight);
        
        // Back (y=height-1)
        const back_topLeft = vertexMap[height - 1][x];
        const back_topRight = vertexMap[height - 1][x + 1];
        const back_bottomLeft = { ...back_topLeft, z: 0 };
        const back_bottomRight = { ...back_topRight, z: 0 };
        stl += writeFace(back_bottomLeft, back_topLeft, back_topRight);
        stl += writeFace(back_bottomLeft, back_topRight, back_bottomRight);
    }
    
    // Left and right
    for (let y = 0; y < height - 1; y++) {
        // Left (x=0)
        const topLeft = vertexMap[y][0];
        const topRight = vertexMap[y+1][0];
        const bottomLeft = { ...topLeft, z: 0 };
        const bottomRight = { ...topRight, z: 0 };
        // FIX: Removed lines that caused an error by referencing out-of-scope variables (e.g., `back_topLeft`). This was likely a copy-paste error.
        stl += writeFace(bottomLeft, topLeft, topRight);
        stl += writeFace(bottomLeft, topRight, bottomRight);
        
        // Right (x=width-1)
        const right_topLeft = vertexMap[y][width - 1];
        const right_topRight = vertexMap[y + 1][width - 1];
        const right_bottomLeft = { ...right_topLeft, z: 0 };
        const right_bottomRight = { ...right_topRight, z: 0 };
        stl += writeFace(right_bottomLeft, right_topRight, right_topLeft);
        stl += writeFace(right_bottomLeft, right_bottomRight, right_topRight);
    }

    stl += 'endsolid model\n';
    return stl;
};
