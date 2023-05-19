import { _decorator, Component, director, Node } from "cc"
const { ccclass, property } = _decorator

@ccclass("Loading")
export class EventHelper extends Component {
    public static readonly GAMEOVER = "GAMEOVER"

    public static eventHandler: Node = new Node()

    /**
     * 自定义事件发送
     * @param key
     * @param customDetail
     */
    public static emit(key: string, customDetail?: any) {
        if (customDetail) {
            director.emit(key, { detail: customDetail })
        } else {
            director.emit(key)
        }
    }

    /**
     * 自定义事件接收
     * @param key
     * @param callback
     */
    public static on(key: string, callback: Function) {
        director.on(key, (event) => {
            callback(event ? event.detail : {})
        })
    }
    /**
     * 自定义事件取消
     * @param key
     * @param callback
     */
    public static off(key: string) {
        director.off(key)
    }
}
