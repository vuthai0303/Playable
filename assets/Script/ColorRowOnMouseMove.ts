import { _decorator, CCInteger, Component, EventTouch, find, Label, Node, Rect, UITransform, Vec2, Vec4 } from 'cc';
import SpawnCell from './SpawnCell';
import { GamePlay } from './GamePlay';
const { ccclass, property } = _decorator;

@ccclass('ColorRowOnMouseMove')
export class ColorRowOnMouseMove extends Component {

    idx:number = null;
    mouseDown:boolean = false;
    SpawnCellNode:Node;
    GamePlayNode:Node;

    start() {
        this.SpawnCellNode = find("SpawnBoxSelect");
        this.GamePlayNode = find("GamePlay");
    }

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchDown, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchUp, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchUp, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchDown, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchUp, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchUp, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchDown(event: EventTouch) {
        this.mouseDown = true;
        console.log("onTouch");

        let mGamePlay:GamePlay = this.GamePlayNode.getComponent(GamePlay);
        if(mGamePlay.currentPlayIdx != 2){
            if(this.idx == null) return;
            mGamePlay.lstArrow[this.idx].destroy();
        }else{
            this.node.getChildByName("hand").active = false;
        }

        let mRect = new Rect(this.node.getWorldPosition().x
                            , this.node.getWorldPosition().y
                            , this.node.getComponent(UITransform).width
                            , 84);
        if (this.mouseDown && this.checkBoundingBox(event.getUILocation(), mRect)) {
            this.paintCell(event.getUILocation());
        }
    }

    onTouchUp(event: EventTouch) {
        this.mouseDown = false;
        console.log("unTouch");
        let mSpawnCell = this.SpawnCellNode.getComponent(SpawnCell);
        if(this.GamePlayNode && mSpawnCell.lstNodeCell.length > 0){
            let mGamePlay:GamePlay = this.GamePlayNode.getComponent(GamePlay);
            let idx:number = (2 - mGamePlay.currentPlayIdx) * mSpawnCell.size;
            let countNodePaintColor:number = 0;
            let lstNodeNotColor:Array<number> = new Array();
            for(let i = idx; i < idx + 5; i++){
                let cellNode = mSpawnCell.lstNodeCell[i];
                if(!cellNode) return;
                if(cellNode.getChildByName("Color").active){
                    countNodePaintColor++;
                }else{
                    lstNodeNotColor.push(i);
                }
            }
            let mColNode:Node = mGamePlay.lstColNum[-mGamePlay.currentPlayIdx + 2];
            let lstChild:Array<Node> = mColNode.children;
            let totalCellPaint:number = lstChild.reduce((total:number, ele:Node) => {
                let num:number = parseInt(ele.getComponent(Label).string);
                return total + num;
            }, 0);
            if(totalCellPaint == countNodePaintColor){
                lstNodeNotColor.forEach(idx => {
                    let cellNode = mSpawnCell.lstNodeCell[idx];
                    if(cellNode){
                        cellNode.getChildByName("XIcon").active = true;
                    }
                });
                mGamePlay.changePlayIdx();
            }
        }
    }

    onTouchMove(event: EventTouch) {
        let mRect = new Rect(this.node.getWorldPosition().x
                            , this.node.getWorldPosition().y
                            , this.node.getComponent(UITransform).width
                            , 84);
        if (this.mouseDown && this.checkBoundingBox(event.getUILocation(), mRect)) {
            this.paintCell(event.getUILocation());
        }
    }

    paintCell(mousePos: Vec2){
        let mSpawnCell = this.SpawnCellNode.getComponent(SpawnCell);
        if(this.GamePlayNode && mSpawnCell.lstNodeCell.length > 0){
            let mGamePlay:GamePlay = this.GamePlayNode.getComponent(GamePlay);
            let idx = (2 - mGamePlay.currentPlayIdx) * mSpawnCell.size;
            for(let i = idx; i < idx + 5; i++){
                let cellNode = mSpawnCell.lstNodeCell[i];
                let cellRect = new Rect(cellNode.getWorldPosition().x
                            , cellNode.getWorldPosition().y
                            , cellNode.getComponent(UITransform).width
                            , cellNode.getComponent(UITransform).height);
                let isContain = this.checkBoundingBox(mousePos, cellRect);
                if(isContain && !cellNode.getChildByName("Color").active){
                    cellNode.getChildByName("Color").active = true;
                }
            }
        }
    }


    public checkBoundingBox(targetPosition:Vec2, box:Rect){
        if(targetPosition.x >= (box.x - box.width/2) && targetPosition.x <= (box.x + box.width/2)
            && targetPosition.y >= (box.y - box.height/2) && targetPosition.y <= (box.y + box.height/2)){
            return true;
        }
        return false;
    }
}


