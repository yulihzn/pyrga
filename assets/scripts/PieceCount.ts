import { _decorator, Color, Component, Enum, Label, Node, NodeEventType, Sprite } from "cc"
import { Logic } from "./Logic"
const { ccclass, property } = _decorator

@ccclass("PieceCount")
export class PieceCount extends Component {
    static readonly TYPE = Enum({
        CIRCLE: 0,
        RECT: 1,
        ARROW: 2,
    })
    type: number = PieceCount.TYPE.RECT
    @property(Sprite)
    sprite: Sprite = null

    @property(Label)
    label: Label = null
    @property(Sprite)
    bg: Sprite = null
    count = 5
    isSelecting = false
    isRed = false
    init(type: number, isRed: boolean, count: number) {
        this.isRed = isRed
        this.type = type
        this.count = count
    }

    start() {
        switch (this.type) {
            case PieceCount.TYPE.RECT:
                this.sprite.spriteFrame = Logic.spriteFrameRes("piece_rect00")
                break
            case PieceCount.TYPE.CIRCLE:
                this.sprite.spriteFrame = Logic.spriteFrameRes("piece_circle00")
                break
            case PieceCount.TYPE.ARROW:
                this.sprite.spriteFrame = Logic.spriteFrameRes("piece_arrow00")
                break
        }
        this.label.string = `${this.count}`
        this.label.color = this.isRed ? Color.RED : Color.BLUE
        this.sprite.color = this.isRed ? Color.RED : Color.BLUE
        this.updateCount(this.count)
    }
    turnShow() {
        this.bg.color = Color.YELLOW
    }
    turnHide() {
        this.bg.color = Color.WHITE
    }

    updateCount(count: number) {
        this.count = count
        if (this.count <= 0) {
            this.count = 0
        }
        this.label.string = `${count}`
    }
}
