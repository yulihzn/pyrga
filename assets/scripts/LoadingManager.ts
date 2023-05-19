import { _decorator, AssetManager, assetManager, AudioClip, Component, director, log, Node, resources, SpriteAtlas, SpriteFrame } from "cc"
import { Logic } from "./Logic"
const { ccclass, property } = _decorator

@ccclass("LoadingManager")
export default class LoadingManager {
    public static readonly KEY_AUTO = "auto"
    public static readonly LOAD_CACHE = 0
    public static readonly LOAD_SUCCESS = 1
    public static readonly LOAD_FAIL = 2
    public static readonly AB_BGM = "ab_bgm"
    public static readonly AB_SOUND = "ab_sound"
    public static readonly ALL_BUNDLES = [LoadingManager.AB_BGM, LoadingManager.AB_SOUND]
    private static resourceLoadMap = new Map<string, Array<Function>>()
    private spriteFrameNames: { [key: number]: boolean } = null
    public isSoundLoaded = false
    public isBgmLoaded = false
    // LIFE-CYCLE CALLBACKS:
    init() {
        this.setAllSpriteFramesUnload()
        if (!Logic.spriteFrames) {
            Logic.spriteFrames = {}
        }
        this.isSoundLoaded = false
        this.isBgmLoaded = false
    }
    reset() {
        this.setAllSpriteFramesUnload()
        this.isSoundLoaded = false
        this.isBgmLoaded = false
    }

    isSpriteFramesLoaded(loadedName: string) {
        if (!this.spriteFrameNames[loadedName]) {
            return false
        }
        return true
    }
    isAllSpriteFramesLoaded() {
        for (let loadedName in this.spriteFrameNames) {
            if (!this.spriteFrameNames[loadedName]) {
                return false
            }
        }
        return true
    }
    setAllSpriteFramesUnload() {
        this.spriteFrameNames = {}
        this.spriteFrameNames[LoadingManager.KEY_AUTO] = false
    }

    loadSound() {
        if (Logic.audioClips && Logic.audioClips["silence"]) {
            this.isSoundLoaded = true
            return
        }
        assetManager.getBundle(LoadingManager.AB_SOUND).loadDir("", AudioClip, (err: Error, assert: AudioClip[]) => {
            for (let clip of assert) {
                Logic.audioClips[clip.name] = clip
            }
            this.isSoundLoaded = true
            log("加载音效完成")
        })
    }
    loadBgm() {
        if (Logic.bgmClips && Logic.bgmClips["bgm001"]) {
            this.isBgmLoaded = true
            return
        }
        assetManager.getBundle(LoadingManager.AB_BGM).loadDir("", AudioClip, (err: Error, assert: AudioClip[]) => {
            for (let clip of assert) {
                Logic.bgmClips[clip.name] = clip
            }
            this.isBgmLoaded = true
            log("加载背景音乐完成")
        })
    }

    loadAutoSpriteFrames() {
        if (Logic.spriteFrames && Logic.spriteFrameRes("auto")) {
            this.spriteFrameNames[LoadingManager.KEY_AUTO] = true
            return
        }
        log("加载自动图集")
        resources.loadDir("textures/auto", SpriteFrame, (err: Error, assert: SpriteFrame[]) => {
            for (let frame of assert) {
                Logic.spriteFrames[frame.name] = frame
            }
            this.spriteFrameNames[LoadingManager.KEY_AUTO] = true
            log("加载自动图集完成")
        })
    }

    static loadAllBundle(names: string[], callback: Function) {
        let count = 0
        for (let name of names) {
            let b = assetManager.getBundle(name)
            if (b) {
                count++
                if (count >= names.length) {
                    callback()
                }
            } else {
                LoadingManager.loadBundle(name, (bundle: AssetManager.Bundle) => {
                    if (bundle) {
                        count++
                    }
                    if (count >= names.length) {
                        callback()
                    }
                })
            }
        }
    }
    static loadBundle(name: string, callback: Function) {
        let bundle = assetManager.getBundle(name)
        if (bundle) {
            callback(bundle)
        } else {
            assetManager.loadBundle(name, (err: Error, bundle: AssetManager.Bundle) => {
                callback(bundle, bundle)
                log(`加载bundle:${name}${bundle ? "完成" : "失败"}`)
            })
        }
    }
    static loadNpcSpriteAtlas(name: string, callback?: Function) {
        if (Logic.spriteFrames && Logic.spriteFrames[name + "anim000"]) {
            if (callback) {
                callback(0)
            }
            return
        }
        //判断是否有相同的资源正在加载，如果有等待加载完毕再执行
        if (LoadingManager.resourceLoadMap.has(name)) {
            LoadingManager.resourceLoadMap.get(name).push(callback)
        } else {
            LoadingManager.resourceLoadMap.set(name, new Array())
            log(`加载${name}图集`)
            resources.load(`npc/${name}`, SpriteAtlas, (err: Error, atlas: SpriteAtlas) => {
                if (atlas) {
                    for (let frame of atlas.getSpriteFrames()) {
                        Logic.spriteFrames[frame.name] = frame
                    }
                }
                log(`加载${name}图集${atlas ? "完成" : "失败"}`)
                if (callback) {
                    callback(atlas ? 1 : 2)
                }
                if (LoadingManager.resourceLoadMap.has(name)) {
                    for (let call of LoadingManager.resourceLoadMap.get(name)) {
                        if (call) {
                            call(atlas ? 1 : 2)
                        }
                    }
                    LoadingManager.resourceLoadMap.delete(name)
                }
            })
        }
    }

    public static allResourceDone() {
        return LoadingManager.resourceLoadMap.size < 1
    }
}
