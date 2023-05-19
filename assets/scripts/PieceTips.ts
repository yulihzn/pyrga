import { _decorator, Color, Component, instantiate, Node, NodeEventType, Prefab, UITransform, Vec3 } from "cc"
import { PieceCount } from "./PieceCount"
import { Piece } from "./Piece"
import { PieceChoice } from "./PieceChoice"
const { ccclass, property } = _decorator

@ccclass("PieceTips")
export class PieceTips extends Component {
    @property(Prefab)
    choicePrefab: Prefab = null
    list: PieceCount[] = []
    @property(Node)
    tips: Node
    @property(Node)
    bg: Node
    private callback: (choice: PieceChoice) => void
    start() {}
    protected onLoad(): void {
        this.bg.on(
            NodeEventType.TOUCH_END,
            () => {
                this.hide()
            },
            this
        )
    }

    show(selectPiece: Piece, wpos: Vec3, callback: (choice: PieceChoice) => void) {
        this.tips.position = this.node.getComponent(UITransform).convertToNodeSpaceAR(wpos)
        this.callback = callback
        this.node.active = true
        this.list = []
        this.tips.removeAllChildren()
        let manager = selectPiece.gameBoard.getCurrentPieceManager()

        if (selectPiece.hasArrow == 0 && manager.arrowCount > 0) {
            this.addPieceChoice(PieceCount.TYPE.ARROW, manager.isRed, manager.arrowCount)
        }
        if (selectPiece.hasCirlce == 0 && manager.circleCount > 0) {
            this.addPieceChoice(PieceCount.TYPE.CIRCLE, manager.isRed, manager.circleCount)
        }
        if (selectPiece.hasRect == 0 && manager.rectCount > 0) {
            //先手第二步不能连续方框
            if (selectPiece.gameBoard.lastPiece && selectPiece.gameBoard.lastPiece.currentType == PieceCount.TYPE.RECT && selectPiece.gameBoard.turns == 3) {
                return
            }
            this.addPieceChoice(PieceCount.TYPE.RECT, manager.isRed, manager.rectCount)
        }
    }
    private addPieceChoice(type: number, isRed: boolean, count: number) {
        let node = instantiate(this.choicePrefab)
        node.setParent(this.tips)
        let choice = node.getComponent(PieceChoice)
        choice.init(type, isRed, count, () => {
            this.callback(choice)
            this.hide()
        })
    }
    hide() {
        this.node.active = false
    }
}
