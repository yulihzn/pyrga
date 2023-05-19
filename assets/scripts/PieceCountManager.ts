import { _decorator, Color, Component, instantiate, Label, Node, Prefab, tween, Vec3 } from "cc"
import { PieceCount } from "./PieceCount"
import { GameBoard } from "./GameBoard"
const { ccclass, property } = _decorator

@ccclass("PieceCountManager")
export class PieceCountManager extends Component {
    @property(Prefab)
    countPrefab: Prefab = null
    @property(Node)
    layout: Node
    list: PieceCount[] = []
    @property
    isRed = false
    @property(Label)
    score: Label
    gameBoard: GameBoard
    _rectCount = 5
    _circleCount = 5
    _arrowCount = 5
    _msg = ""
    get rectCount() {
        return this._rectCount
    }
    get circleCount() {
        return this._circleCount
    }
    get arrowCount() {
        return this._arrowCount
    }
    private arrowPieceCount: PieceCount
    private circlePieceCount: PieceCount
    private rectPieceCount: PieceCount
    protected onLoad(): void {
        this.node.removeAllChildren()
        this.rectPieceCount = this.addPieceCount(PieceCount.TYPE.RECT, this.rectCount)
        this.circlePieceCount = this.addPieceCount(PieceCount.TYPE.CIRCLE, this.circleCount)
        this.arrowPieceCount = this.addPieceCount(PieceCount.TYPE.ARROW, this.arrowCount)
        this.updateScore(this._msg)
    }
    addPieceCount(type: number, count: number) {
        let node = instantiate(this.countPrefab)
        node.setParent(this.layout)
        let pieceCount = node.getComponent(PieceCount)
        pieceCount.init(type, this.isRed, count)
        return pieceCount
    }
    turnShow() {
        tween(this.node)
            .to(0.2, { scale: new Vec3(0.75, 0.75, 1) })
            .to(0.2, { scale: new Vec3(0.5, 0.5, 1) })
            .start()
        this.rectPieceCount.turnShow()
        this.circlePieceCount.turnShow()
        this.arrowPieceCount.turnShow()
    }
    turnHide() {
        this.rectPieceCount.turnHide()
        this.circlePieceCount.turnHide()
        this.arrowPieceCount.turnHide()
    }
    updateScore(msg: string) {
        this._msg = msg
        if (this.score) {
            this.score.string = msg
            this.score.color = this.isRed ? Color.RED : Color.BLUE
        }
    }

    useOneCount(type: number) {
        switch (type) {
            case PieceCount.TYPE.RECT:
                this.rectPieceCount.updateCount(--this._rectCount)
                break
            case PieceCount.TYPE.CIRCLE:
                this.circlePieceCount.updateCount(--this._circleCount)
                break
            case PieceCount.TYPE.ARROW:
                this.arrowPieceCount.updateCount(--this._arrowCount)
                break
        }
        this.gameBoard.nextTurn()
    }
    start() {}

    update(deltaTime: number) {}
}
