import { _decorator, Component, director, Label, Node } from "cc"
import { DirTips } from "./DirTips"
import { PieceTips } from "./PieceTips"
const { ccclass, property } = _decorator

@ccclass("GameHud")
export class GameHud extends Component {
    @property(Node)
    gameOverDialog: Node
    @property(Label)
    gameOverLabel: Label
    @property(DirTips)
    dirTips: DirTips
    @property(PieceTips)
    pieceTips: PieceTips
    @property(Node)
    infoDialog: Node
    @property(Label)
    infoLabel: Label
    protected onLoad(): void {
        this.gameOverDialog.active = false
        this.dirTips.hide()
        this.pieceTips.hide()
        this.infoDialog.active = false
    }
    showInfo() {
        this.infoDialog.active = !this.infoDialog.active
    }
    showGameOver(msg: string) {
        this.gameOverDialog.active = true
        this.gameOverLabel.string = msg
    }

    backToStart() {
        director.loadScene("start")
    }
    reStartGame() {
        director.loadScene("loading")
    }
}
