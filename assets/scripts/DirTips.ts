import { _decorator, Color, Component, EventTouch, Node, NodeEventType, Sprite, UITransform, Vec3 } from "cc"
const { ccclass, property } = _decorator

@ccclass("DirTips")
export class DirTips extends Component {
    dirTipsColor: Color
    @property(Node)
    tips: Node
    @property(Node)
    bg: Node
    private callback: (dir: number) => void
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
    //button
    chooseDir(event: EventTouch, dir: string) {
        if (this.callback) {
            this.callback(parseInt(dir))
        }
        this.node.active = false
    }
    show(wpos: Vec3, color: Color, callback: (dir: number) => void) {
        this.tips.position = this.node.getComponent(UITransform).convertToNodeSpaceAR(wpos)
        this.callback = callback
        this.node.active = true
        this.dirTipsColor = color
        let arr = this.tips.getComponentsInChildren(Sprite)
        for (let sprite of arr) {
            sprite.color = new Color(color.r, color.g, color.b, 255)
        }
    }
    hide() {
        this.node.active = false
    }
}
