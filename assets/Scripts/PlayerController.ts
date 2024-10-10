import {
  _decorator,
  Component,
  EventMouse,
  Input,
  input,
  Node,
  Vec3,
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
  private _startJump = false;
  private _jumpTime = 0.2;
  private _curJumpTime = 0;
  private _jumpSpeed = 0;
  private _targetPos = new Vec3();
  private _curPos = new Vec3();

  start() {
    input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
  }

  onMouseDown(event: EventMouse) {
    if (event.getButton() === 0) {
      this.jumpByStep(1);
    } else if (event.getButton() === 2) {
      this.jumpByStep(2);
    }
  }

  jumpByStep(step: number) {
    if (this._startJump) return;
    const moveLength = step * 40;
    this._startJump = true;
    this._curJumpTime = 0;
    this._jumpSpeed = moveLength / this._jumpTime;
    this._curPos = this.node.position;
    Vec3.add(this._targetPos, this._curPos, new Vec3(moveLength, 0, 0));
  }

  protected update(dt: number): void {
    if (this._startJump) {
      this._curJumpTime += dt;
      if (this._curJumpTime > this._jumpTime) {
        this._startJump = false;
        this.node.setPosition(this._targetPos);
      } else {
        const curPos = this.node.position;
        this.node.setPosition(
          curPos.x + this._jumpSpeed * dt,
          curPos.y,
          curPos.z
        );
      }
    }
  }

  protected onDestroy(): void {
    input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
  }
}
