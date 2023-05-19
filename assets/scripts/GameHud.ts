import { _decorator, Component, director, Label, Node } from "cc"
import { EventHelper } from "./EventHelper"
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
    protected onLoad(): void {
        this.gameOverDialog.active = false
        this.dirTips.hide()
        this.pieceTips.hide()
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
