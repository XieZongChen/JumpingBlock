import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum BlockType {
  BT_NONE,
  BT_WHITE,
}

enum GameState {
  GS_MENU,
  GS_PLAYING,
}

@ccclass('GameManager')
export class GameManager extends Component {
  @property(Prefab)
  public boxPrefab: Prefab = null;

  @property
  public roadLength = 50;

  @property(PlayerController)
  public playerController: PlayerController = null;

  @property(Node)
  public startMenu: Node = null;

  private _road: BlockType[] = [];

  start() {
    this.setCurrentState(GameState.GS_MENU);
  }

  public onStartBtnClick() {
    this.setCurrentState(GameState.GS_PLAYING);
  }

  setCurrentState(state: GameState) {
    switch (state) {
      case GameState.GS_MENU:
        this.generateRoad();
        this.playerController.setControlActive(false);
        this.startMenu.active = true;
        break;
      case GameState.GS_PLAYING:
        this.playerController.setControlActive(true);
        this.startMenu.active = false;
        break;
    }
  }

  generateRoad() {
    this.node.removeAllChildren();
    this._road = [];

    // 第一个格子必须是实体格子，用于玩家起始站立
    this._road.push(BlockType.BT_WHITE);

    for (let i = 1; i < this.roadLength; i++) {
      if (this._road[i - 1] === BlockType.BT_NONE) {
        // 由于我们的跳跃最多跳跃一个空格，所以这里不能出现连续空格
        this._road.push(BlockType.BT_WHITE);
      } else {
        const blockType =
          Math.random() < 0.5 ? BlockType.BT_WHITE : BlockType.BT_NONE;
        this._road.push(blockType);
      }
    }

    for (let i = 0; i < this.roadLength; i++) {
      if (this._road[i] === BlockType.BT_WHITE) {
        const box = instantiate(this.boxPrefab);
        box.setParent(this.node);
        box.setPosition(i * 40, 0, 0);
      }
    }
  }
}
