import { _decorator, Component, director, Node } from "cc"
import LoadingManager from "./LoadingManager"
const { ccclass, property } = _decorator

@ccclass("Loading")
export class Loading extends Component {
    private loadingManager: LoadingManager = new LoadingManager()
    protected onLoad(): void {
        this.loadingManager.init()
        this.checkLoaded()
    }
    start() {
        LoadingManager.loadAllBundle(LoadingManager.ALL_BUNDLES, () => {
            this.loadingManager.loadAutoSpriteFrames()
            this.loadingManager.loadSound()
            this.loadingManager.loadBgm()
        })
    }
    checkLoaded() {
        if (this.loadingManager.isAllSpriteFramesLoaded() && this.loadingManager.isSoundLoaded && this.loadingManager.isBgmLoaded) {
            this.loadingManager.reset()
            director.loadScene("game")
            return true
        }
        return false
    }
    update(deltaTime: number) {
        this.checkLoaded()
    }
}
