import * as THREE from 'three';

class PeoplePath {
    constructor(path, speed) {
        this.path = path;
        this.speed = speed;
        this.pathIndex = 1;
        this.currentPosition = this.path[0].clone();
        this.targetPosition = this.path[1];
    }

    updatePosition(delta) {
        let velocity = this.targetPosition.clone().sub(this.currentPosition);
        const arriveTraget = velocity.lengthSq() <= 0.1 * 0.1;
        if (!arriveTraget) {
            // 还未到达目标位置
            velocity.normalize();
            // 移动
            this.currentPosition.add(velocity.multiplyScalar(delta * this.speed));
        } else {
            // 已经到达目标位置
            this.pathIndex++;
            if (this.pathIndex >= this.path.length) {
                this.pathIndex = 1;
                this.currentPosition.copy(this.path[0]);
            }
            this.targetPosition = this.path[this.pathIndex];
        }
        return arriveTraget;
    }
}

class PeoplePathAligner {
    constructor() {
        this.raycaster = new THREE.Raycaster(); // 射线碰撞检测
        this.down = new THREE.Vector3(0, -1, 0);
    }
    alignPosition(position, mesh) {
        const Height = 100;
        let origin = new THREE.Vector3(position.x, Height, position.z);
        this.raycaster.set(origin, this.down);
        const intersects = this.raycaster.intersectObject(mesh);
        if (!intersects.length) return null;
        else return intersects[0].point;
    }
}

export { PeoplePath, PeoplePathAligner };
