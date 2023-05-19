import { _decorator, Component, director, Node } from "cc"
const { ccclass, property } = _decorator

@ccclass("Start")
export class Start extends Component {
    start() {}

    update(deltaTime: number) {}
    startGame() {
        director.loadScene("loading")
    }
}
