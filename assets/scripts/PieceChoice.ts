import { _decorator, Color, Component, Enum, Label, Node, NodeEventType, Sprite } from "cc"
import { Logic } from "./Logic"
const { ccclass, property } = _decorator

@ccclass("PieceChoice")
export class PieceChoice extends Component {
    static readonly TYPE = Enum({
        CIRCLE: 0,
        RECT: 1,
        ARROW: 2,
    })
    type: number = PieceChoice.TYPE.RECT
    @property(Sprite)
    sprite: Sprite = null
    @property(Sprite)
    bg: Sprite = null
    count = 5
    isRed = false
    private callback: () => void
    init(type: number, isRed: boolean, count: number, callback: () => void) {
        this.callback = callback
        this.isRed = isRed
        this.type = type
        this.count = count
    }

    start() {
        switch (this.type) {
            case PieceChoice.TYPE.RECT:
                this.sprite.spriteFrame = Logic.spriteFrameRes("piece_rect00")
                break
            case PieceChoice.TYPE.CIRCLE:
                this.sprite.spriteFrame = Logic.spriteFrameRes("piece_circle00")
                break
            case PieceChoice.TYPE.ARROW:
                this.sprite.spriteFrame = Logic.spriteFrameRes("piece_arrow00")
                break
        }
        this.sprite.color = this.isRed ? Color.RED : Color.BLUE
        this.node.on(
            NodeEventType.TOUCH_END,
            () => {
                this.tap()
            },
            this
        )
    }

    tap() {
        this.callback()
    }
}
