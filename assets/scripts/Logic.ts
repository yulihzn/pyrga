import { _decorator, AudioClip, Component, director, Node, SpriteFrame } from "cc"
const { ccclass, property } = _decorator

@ccclass("Logic")
export class Logic extends Component {
    //图片资源
    static spriteFrames: { [key: string]: SpriteFrame } = null
    //音频资源
    static audioClips: { [key: string]: AudioClip } = {}
    static bgmClips: { [key: string]: AudioClip } = {}
    protected onLoad(): void {
        director.addPersistRootNode(this.node)
    }
    static spriteFrameRes(spriteFrameName: string) {
        return Logic.spriteFrames[spriteFrameName] ? Logic.spriteFrames[spriteFrameName] : null
    }
}
