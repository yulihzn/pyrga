import { _decorator, Color, Component, Graphics, instantiate, Node, Prefab } from "cc"
import { Piece } from "./Piece"
import { PieceCountManager } from "./PieceCountManager"
import { PieceCount } from "./PieceCount"
import { GameHud } from "./GameHud"
const { ccclass, property } = _decorator

@ccclass("GameBoard")
export class GameBoard extends Component {
    @property(Prefab)
    piecePrefab: Prefab = null
    @property(Node)
    board: Node = null
    @property(PieceCountManager)
    bluePCM: PieceCountManager = null
    @property(PieceCountManager)
    redPCM: PieceCountManager = null
    @property(GameHud)
    hud: GameHud
    pieceBoardList: Piece[][] = []
    pieceBasketTopList: Piece[][] = []
    pieceBasketDownList: Piece[][] = []
    isRedTurn = false
    turns = 0
    lastPiece: Piece
    protected onLoad(): void {
        this.bluePCM.gameBoard = this
        this.redPCM.gameBoard = this
    }
    start() {
        this.createNodes(this.board, 4, 4, this.pieceBoardList)
        this.nextTurn()
    }
    createNodes(parentNode: Node, column: number, row: number, list: Piece[][]) {
        const prefabOffset = Piece.SIZE // 预制体之间的间距
        for (let i = 0; i < row; i++) {
            list[i] = [] // 创建二维数组的行
            for (let j = 0; j < column; j++) {
                const instance = instantiate(this.piecePrefab)
                instance.setParent(parentNode)
                const x = i * prefabOffset - (prefabOffset * row) / 2 + prefabOffset / 2
                const y = j * prefabOffset - (prefabOffset * column) / 2 + prefabOffset / 2
                instance.setPosition(x, y)
                list[i][j] = instance.getComponent(Piece) // 将节点引用保存到二维数组
                list[i][j].gameBoard = this
                list[i][j].x = i
                list[i][j].y = j
            }
        }
    }

    getCurrentPieceManager() {
        return this.isRedTurn ? this.redPCM : this.bluePCM
    }
    private showAllPieceCover(onlySpace: boolean) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this.pieceBoardList[i][j].showCover(onlySpace)
            }
        }
    }
    private showPieceCover() {
        if (!this.lastPiece) {
            this.showAllPieceCover(false)
            return
        }
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this.pieceBoardList[i][j].hideCover()
            }
        }
        let x = this.lastPiece.x
        let y = this.lastPiece.y
        switch (this.lastPiece.currentType) {
            case PieceCount.TYPE.ARROW:
                let valid_arrow = 0
                switch (this.lastPiece.curentDir) {
                    case 0:
                        valid_arrow += this.checkAndShowCover(x, y + 1) ? 1 : 0
                        valid_arrow += this.checkAndShowCover(x, y + 2) ? 1 : 0
                        valid_arrow += this.checkAndShowCover(x, y + 3) ? 1 : 0
                        break
                    case 1:
                        valid_arrow += this.checkAndShowCover(x, y - 1) ? 1 : 0
                        valid_arrow += this.checkAndShowCover(x, y - 2) ? 1 : 0
                        valid_arrow += this.checkAndShowCover(x, y - 3) ? 1 : 0
                        break
                    case 2:
                        valid_arrow += this.checkAndShowCover(x - 1, y) ? 1 : 0
                        valid_arrow += this.checkAndShowCover(x - 2, y) ? 1 : 0
                        valid_arrow += this.checkAndShowCover(x - 3, y) ? 1 : 0
                        break
                    case 3:
                        valid_arrow += this.checkAndShowCover(x + 1, y) ? 1 : 0
                        valid_arrow += this.checkAndShowCover(x + 2, y) ? 1 : 0
                        valid_arrow += this.checkAndShowCover(x + 3, y) ? 1 : 0
                        break
                }
                if (valid_arrow == 0) {
                    this.showAllPieceCover(true)
                }
                break
            case PieceCount.TYPE.CIRCLE:
                if (!this.lastPiece.showCover(false)) {
                    this.showAllPieceCover(true)
                }
                break
            case PieceCount.TYPE.RECT:
                let valid_rect = 0
                valid_rect += this.checkAndShowCover(x + 1, y) ? 1 : 0
                valid_rect += this.checkAndShowCover(x - 1, y) ? 1 : 0
                valid_rect += this.checkAndShowCover(x, y + 1) ? 1 : 0
                valid_rect += this.checkAndShowCover(x, y - 1) ? 1 : 0
                if (valid_rect == 0) {
                    this.showAllPieceCover(true)
                }
                break
        }
    }
    private checkAndShowCover(x: number, y: number) {
        if (x < 0 || y < 0 || x > 3 || y > 3) {
            return false
        }
        if (this.pieceBoardList[x][y]) {
            return this.pieceBoardList[x][y].showCover(false)
        } else {
            return false
        }
    }
    private checkGameOver() {
        let vaild = 0
        let rectCount = 0
        let circleCount = 0
        let arrowCount = 0
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let item = this.pieceBoardList[i][j]
                if (item.isCoverShow) {
                    vaild += 1
                    if (item.hasArrow == 0) {
                        arrowCount++
                    } else if (item.hasCirlce == 0) {
                        circleCount++
                    } else if (item.hasRect == 0) {
                        rectCount++
                    }
                }
            }
        }
        let isGameOver = false
        if (vaild == 0) {
            isGameOver = true
        } else {
            let manager = this.isRedTurn ? this.redPCM : this.bluePCM
            let point = 0
            if (rectCount > 0 && manager.rectCount > 0) {
                point++
            }
            if (circleCount > 0 && manager.circleCount > 0) {
                point++
            }
            if (arrowCount > 0 && manager.arrowCount > 0) {
                point++
            }
            if (point == 0) {
                isGameOver = true
            }
        }
        let redTower = 0
        let blueTower = 0
        let redSecond = 0
        let blueSecond = 0
        let redOne = 0
        let blueOne = 0
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let item = this.pieceBoardList[i][j]
                let colorCount = 0
                colorCount += item.hasArrow > 0 ? 1 : 0
                colorCount += item.hasCirlce > 0 ? 1 : 0
                colorCount += item.hasRect > 0 ? 1 : 0
                if (colorCount == 3) {
                    let redCount = this.getColorCount(1, item)
                    let blueCount = this.getColorCount(2, item)
                    redCount += item.hasRect == 1 ? 1 : 0
                    if (redCount > 1) {
                        redTower++
                    } else if (blueCount > 1) {
                        blueTower++
                    }
                } else if (colorCount == 2) {
                    let redCount = this.getColorCount(1, item)
                    let blueCount = this.getColorCount(2, item)
                    if (redCount > 1) {
                        redSecond++
                    } else if (blueCount > 1) {
                        blueSecond++
                    }
                } else if (colorCount == 1) {
                    let redCount = this.getColorCount(1, item)
                    let blueCount = this.getColorCount(2, item)
                    if (redCount == 1) {
                        redOne++
                    } else if (blueCount == 1) {
                        blueOne++
                    }
                }
            }
        }
        let msg = ""
        let turns = `共计${this.turns}步`
        let towers = `红方拥有${redTower}座塔,蓝方拥有${blueTower}座塔`
        let seconds = `红方拥有${redSecond}座双色块,蓝方拥有${blueSecond}座双色块`
        let ones = `红方拥有${redOne}座单色块,蓝方拥有${blueOne}单同色块`
        if (redTower > blueTower) {
            msg = `红方胜利！\n${turns}\n${towers}`
        } else if (redTower < blueTower) {
            msg = `蓝方胜利！\n${turns}\n${towers}`
        } else {
            if (redSecond > blueSecond) {
                msg = `红方胜利！\n${turns}\n${towers}\n${seconds}`
            } else if (redSecond < blueSecond) {
                msg = `蓝方胜利！\n${turns}\n${towers}\n${seconds}`
            } else {
                if (redOne > blueOne) {
                    msg = `红方胜利！\n${turns}\n${towers}\n${seconds}\n${ones}`
                } else if (redOne < blueOne) {
                    msg = `蓝方胜利！\n${turns}\n${towers}\n${seconds}\n${ones}}`
                } else {
                    msg = `和棋了!\n${turns}\n${towers}\n${seconds}\n${ones}}`
                }
            }
        }
        if (isGameOver) {
            this.hud.showGameOver(msg)
        }
        this.redPCM.updateScore(`拥有${redTower}座塔\n拥有${redSecond}座双色块\n拥有${redOne}座单色块`)
        this.bluePCM.updateScore(`拥有${blueTower}座塔\n拥有${blueSecond}座双色块\n拥有${blueOne}座单色块`)
    }
    private getColorCount(value: number, item: Piece) {
        let count = 0
        count += item.hasArrow == value ? 1 : 0
        count += item.hasCirlce == value ? 1 : 0
        count += item.hasRect == value ? 1 : 0
        return count
    }

    nextTurn() {
        this.isRedTurn = !this.isRedTurn
        this.turns++
        this.showPieceCover()
        if (this.isRedTurn) {
            this.redPCM.turnShow()
            this.bluePCM.turnHide()
        } else {
            this.redPCM.turnHide()
            this.bluePCM.turnShow()
        }
        this.checkGameOver()
    }
}
