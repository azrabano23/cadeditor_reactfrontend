#!/usr/bin/env python3

import struct
import numpy as np

def write_stl(filename, vertices, faces):
    """Write vertices and faces to STL file"""
    with open(filename, 'wb') as f:
        # Write header
        f.write(b'\x00' * 80)
        
        # Write number of triangles
        f.write(struct.pack('<I', len(faces)))
        
        # Write triangles
        for face in faces:
            # Calculate normal (simplified - assumes counter-clockwise winding)
            v1, v2, v3 = [vertices[i] for i in face]
            normal = np.cross(v2 - v1, v3 - v1)
            normal = normal / np.linalg.norm(normal)
            
            # Write normal
            f.write(struct.pack('<fff', *normal))
            
            # Write vertices
            for vertex_idx in face:
                vertex = vertices[vertex_idx]
                f.write(struct.pack('<fff', *vertex))
            
            # Write attribute byte count
            f.write(struct.pack('<H', 0))

# Create a simple cube
vertices = np.array([
    [0, 0, 0],  # 0
    [1, 0, 0],  # 1
    [1, 1, 0],  # 2
    [0, 1, 0],  # 3
    [0, 0, 1],  # 4
    [1, 0, 1],  # 5
    [1, 1, 1],  # 6
    [0, 1, 1],  # 7
], dtype=np.float32)

# Define faces (triangles)
faces = [
    # Bottom face
    [0, 1, 2], [0, 2, 3],
    # Top face
    [4, 6, 5], [4, 7, 6],
    # Front face
    [0, 4, 5], [0, 5, 1],
    # Back face
    [2, 6, 7], [2, 7, 3],
    # Left face
    [0, 3, 7], [0, 7, 4],
    # Right face
    [1, 5, 6], [1, 6, 2],
]

# Write STL file
write_stl('/Users/azrabano/cad-editor-react-website/backend/test_cube.stl', vertices, faces)
print("✅ Test STL file created: test_cube.stl")
