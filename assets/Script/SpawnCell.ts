import { _decorator, Component, instantiate, math, Node, Prefab, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export class Cell{
    posIndex: Vec2

    constructor(pos:Vec2){
        this.posIndex = pos;
    }
}

@ccclass('SpawnCell')
export default class SpawnCell extends Component {
    
    @property(Prefab)
    cellPrefab: Prefab
    @property(Node)
    boxSelect: Node

    size:number = 5
    lstCell: Array<Cell>
    lstNodeCell: Array<Node>

    start() {
        this.lstCell = new Array(this.size * this.size);
        this.lstNodeCell = new Array(this.size * this.size);
        this.createListCell();
        this.spawnBoxSelect();
    }

    update(deltaTime: number) {
        
    }

    public createListCell(){
        for(let i = 0; i < this.size * this.size; i++){
            let mCell = new Cell(this.idxToVector(i));
            this.lstCell.push(mCell);
        }
    }

    public spawnBoxSelect(){
        this.lstCell.forEach(cell => {
            let mNode:Node = instantiate(this.cellPrefab);
            mNode.parent = this.boxSelect;
            this.movePostionCell(mNode, cell);
            this.lstNodeCell.push(mNode);
        });
    }

    public movePostionCell(node: Node, cell: Cell){
        let cellPosition:Vec2 = this.vecToPos(cell.posIndex);
        node.setPosition(new Vec3(cellPosition.x, cellPosition.y, 0));
    }

    public idxToVector(idx:number) : Vec2{
        let y = -Math.floor(idx/this.size) + 2;
        let x =idx % this.size - 2;
        return new Vec2(x,y);
    }

    public vecToPos(vec:Vec2) : Vec2{
        let pos_x = vec.x * 84;
        let pos_y = vec.y * 84;
        return new Vec2(pos_x, pos_y);
    }
}


