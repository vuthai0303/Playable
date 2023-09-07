import { _decorator, Component, director, instantiate, Label, math, Node, Prefab, size, SpriteFrame, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GamePlay')
export class GamePlay extends Component {

    @property(Prefab)
    arrow_near:Prefab;
    @property(Prefab)
    arrow_mid:Prefab;
    @property(Prefab)
    arrow_far:Prefab;
    @property(Prefab)
    yellow_rect_small:Prefab;
    @property(Prefab)
    yellow_rect_large:Prefab;
    @property(Node)
    lstColNum:Array<Node> = [];
    @property(Node)
    lstRowNum:Array<Node> = [];
    @property(Node)
    BoxSelectNode:Node;
    @property(Node)
    mCanvas:Node;

    currentPlayIdx;
    lstYellowRect:Array<Node>
    lstArrow:Array<Node>

    start() {
        this.currentPlayIdx = -2;
        this.calLstYellowRect();
    }

    public calLstYellowRect(){
        let mColNode:Node = this.lstColNum[-this.currentPlayIdx + 2];
        let lstChild:Array<Node> = mColNode.children;
        this.lstYellowRect = new Array(lstChild.length);
        this.lstArrow = new Array(lstChild.length);
        let isFirst:boolean = false;
        lstChild = lstChild.reverse();
        lstChild.forEach(element => {
            let num:number = parseInt(element.getComponent(Label).string);
            let yellowRectNode:Node = instantiate(num >= 3 ? this.yellow_rect_large : this.yellow_rect_small);
            yellowRectNode.parent = this.BoxSelectNode;
            yellowRectNode.getComponent(UITransform).setContentSize(math.size(num * 84, 84));
            if (isFirst){
                yellowRectNode.setPosition(new Vec3(42 * (5 - num), 84 * this.currentPlayIdx, 0));
            }else{
                yellowRectNode.setPosition(new Vec3(42 * (num - 5), 84 * this.currentPlayIdx, 0));
                isFirst = true;
            }
            if(this.currentPlayIdx != 2){
                yellowRectNode.getChildByName("hand").active = false;
                let dis = Math.abs(yellowRectNode.worldPosition.x - element.worldPosition.x);
                let prefab:Prefab;
                if(dis > 210){
                    prefab = this.arrow_far;
                }else if(dis > 126){
                    prefab = this.arrow_mid;
                }else{
                    prefab = this.arrow_near;
                }
                let arrow:Node = instantiate(prefab);
                arrow.parent = this.mCanvas;
                arrow.getComponent(UITransform).setContentSize(math.size(dis, 84));
                // arrow.setPosition(new Vec3(mColNode.position.x + dis/2,mColNode.position.y - 42,0));
                arrow.setWorldPosition(new Vec3(element.worldPosition.x + dis/2,element.worldPosition.y - 42,0));
            }
            
            this.lstYellowRect.push(yellowRectNode);
        });
    }

    update(deltaTime: number) {

    }

    public changePlayIdx(){
        this.currentPlayIdx++;
        this.lstYellowRect.forEach(element => {
            element.destroy();
        });
        this.lstYellowRect = [];
        this.calLstYellowRect();
    }
}


