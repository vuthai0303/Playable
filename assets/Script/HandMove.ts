import { _decorator, CCFloat, Component, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HandMove')
export class HandMove extends Component {

    @property(CCFloat)
    speed:number = 300;
    @property(CCFloat)
    offset:number = 50;

    parent:Node;
    range:number;
    posY:number = -25;
    direction:Vec3;

    start() {
        this.parent = this.node.getParent();
        this.range = Math.floor(this.parent.getComponent(UITransform).width / 2) - this.offset;
        console.log(this.range);
        this.node.setPosition(new Vec3(-this.range, this.posY, 0));
        this.direction = new Vec3(1,0,0);
        this.speed = 300;
    }

    update(deltaTime: number) {
        if(Math.abs(this.node.position.x) >= this.range){
            this.direction.x *= -1;
        }
        let newPosition: Vec3 = this.node.position;
        newPosition.x += this.direction.x * this.speed * deltaTime;
        this.node.setPosition(newPosition);
    }
}


