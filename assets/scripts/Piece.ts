import { _decorator, Color, Component, EventTouch, Graphics, Node, NodeEventType, Sprite, SpriteFrame, tween, UIOpacity, UIRenderer, UITransform, Vec3 } from "cc"
import { Logic } from "./Logic"
import { GameBoard } from "./GameBoard"
import { PieceCount } from "./PieceCount"
import { PieceChoice } from "./PieceChoice"
const { ccclass, property } = _decorator

@ccclass("Piece")
export class Piece extends Component {
    static readonly SIZE = 100
    static readonly OFFSET = 20
    static readonly LINE_WIDTH = 5
    transForm: UITransform
    @property(Node)
    arrow: Node = null
    @property(Node)
    circle: Node = null
    @property(Node)
    rect: Node = null
    @property(Node)
    bg: Node = null
    @property(Node)
    cover: Node = null
    gameBoard: GameBoard
    hasCirlce = 0
    hasRect = 0
    hasArrow = 0
    isCoverShow = false
    x: number
    y: number
    currentType: number = -1
    curentDir = -1
    protected onLoad(): void {
        this.transForm = this.getComponent(UITransform)
        this.transForm.width = Piece.SIZE
        this.transForm.height = Piece.SIZE
        this.node.on(
            NodeEventType.TOUCH_END,
            () => {
                this.tap()
            },
            this
        )
        this.hideCover()
    }

    tap() {
        if (this.isCoverShow) {
            this.showPieceTips()
        }
    }
    get drawWidth() {
        return Piece.SIZE - Piece.OFFSET
    }
    drawBg(color: Color) {
        this.bg.getComponent(Sprite).color = new Color(color.r, color.g, color.b, 255)
    }
    private drawPiece(sprite: Sprite, arr: string[], color: Color, anim: boolean, callback?: () => void) {
        sprite.color = new Color(color.r, color.g, color.b, 255)
        if (!anim) {
            sprite.spriteFrame = Logic.spriteFrameRes(arr[3])
            if (callback) {
                callback()
            }
            return
        }
        let t = tween(sprite)
        for (let name of arr) {
            t.then(
                tween()
                    .call(() => {
                        sprite.spriteFrame = Logic.spriteFrameRes(name)
                    })
                    .delay(0.1)
            )
        }
        t.then(
            tween().call(() => {
                if (callback) {
                    callback()
                }
            })
        ).start()
    }
    drawCircle(color: Color, anim?: boolean) {
        this.currentType = PieceCount.TYPE.CIRCLE
        this.gameBoard.lastPiece = this
        let arr = ["piece_circle03", "piece_circle02", "piece_circle01", "piece_circle00"]
        let sprite = this.circle.getComponent(Sprite)
        this.drawPiece(sprite, arr, color, anim, () => {})
    }
    drawRect(color: Color, anim?: boolean) {
        this.currentType = PieceCount.TYPE.RECT
        this.gameBoard.lastPiece = this
        let arr = ["piece_rect03", "piece_rect02", "piece_rect01", "piece_rect00"]
        let sprite = this.rect.getComponent(Sprite)
        this.drawPiece(sprite, arr, color, anim, () => {})
    }
    drawArrow(color: Color, dir: number, anim?: boolean) {
        this.currentType = PieceCount.TYPE.ARROW
        this.gameBoard.lastPiece = this
        this.curentDir = dir
        let arr = ["piece_arrow03", "piece_arrow02", "piece_arrow01", "piece_arrow00"]
        let sprite = this.arrow.getComponent(Sprite)
        switch (dir) {
            case 0:
                this.arrow.angle = 90
                break
            case 1:
                this.arrow.angle = -90
                break
            case 2:
                this.arrow.angle = 180
                break
            case 3:
                this.arrow.angle = 0
                break
        }
        this.drawPiece(sprite, arr, color, anim, () => {})
    }
    showCover(onlySpace: boolean) {
        if (this.hasArrow > 0 && this.hasCirlce > 0 && this.hasRect > 0) {
            return false
        }
        if (onlySpace && (this.hasArrow > 0 || this.hasCirlce > 0 || this.hasRect > 0)) {
            return false
        }
        this.cover.getComponent(Sprite).color = new Color(0, 255, 0, 80)
        this.isCoverShow = true
        return true
    }
    hideCover() {
        this.isCoverShow = false
        this.cover.getComponent(Sprite).color = new Color(0, 0, 0, 0)
    }
    showPieceTips() {
        this.gameBoard.hud.pieceTips.show(this, this.node.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(0, 100, 0)), (choice: PieceChoice) => {
            switch (choice.type) {
                case PieceCount.TYPE.ARROW:
                    if (this.hasArrow > 0) {
                        return
                    }
                    this.showDirTips(choice, choice.isRed ? Color.RED : Color.BLUE)
                    break
                case PieceCount.TYPE.RECT:
                    if (this.hasRect > 0) {
                        return
                    }
                    this.hasRect = choice.isRed ? 1 : 2
                    this.drawRect(choice.isRed ? Color.RED : Color.BLUE, true)
                    this.gameBoard.getCurrentPieceManager().useOneCount(PieceCount.TYPE.RECT)
                    break
                case PieceCount.TYPE.CIRCLE:
                    if (this.hasCirlce > 0) {
                        return
                    }
                    this.hasCirlce = choice.isRed ? 1 : 2
                    this.drawCircle(choice.isRed ? Color.RED : Color.BLUE, true)
                    this.gameBoard.getCurrentPieceManager().useOneCount(PieceCount.TYPE.CIRCLE)
                    break
            }
        })
    }
    showDirTips(choice: PieceChoice, color: Color) {
        this.gameBoard.hud.dirTips.show(this.node.getComponent(UITransform).convertToWorldSpaceAR(Vec3.ZERO), color, (dir: number) => {
            this.hasArrow = choice.isRed ? 1 : 2
            this.drawArrow(color, dir)
            this.gameBoard.getCurrentPieceManager().useOneCount(PieceCount.TYPE.ARROW)
        })
    }
    hideDirTips() {
        this.gameBoard.hud.dirTips.hide()
    }
    clear() {
        this.circle.getComponent(Sprite).color = new Color(0, 0, 0, 0)
        this.rect.getComponent(Sprite).color = new Color(0, 0, 0, 0)
        this.arrow.getComponent(Sprite).color = new Color(0, 0, 0, 0)
    }
    start() {
        this.clear()
        this.drawBg(Color.WHITE)
    }
}
