import {
  _decorator,
  Animation,
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
  private _curTotalStep = 0;

  @property(Animation)
  public bodyAnim: Animation = null;

  start() {}

  public setControlActive(active: boolean) {
    if (active) {
      input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    } else {
      input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }
  }

  public reset() {
    this.node.setPosition(0, 0, 0);
    this._curTotalStep = 0;
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
    const animName = step === 1 ? 'JumpOneStep' : 'JumpTwoStep';
    const animState = this.bodyAnim.getState(animName);
    // 让跳跃时间和动画时间一致
    this._jumpTime = animState.duration;
    const moveLength = step * 40;
    this._startJump = true;
    this._curJumpTime = 0;
    this._jumpSpeed = moveLength / this._jumpTime;
    this._curPos = this.node.position;
    Vec3.add(this._targetPos, this._curPos, new Vec3(moveLength, 0, 0));
    this.bodyAnim.play(animName);
    this._curTotalStep += step;
  }

  protected update(dt: number): void {
    if (this._startJump) {
      this._curJumpTime += dt;
      if (this._curJumpTime > this._jumpTime) {
        this._startJump = false;
        this.node.setPosition(this._targetPos);
        this.node.emit('JumpEnd', this._curTotalStep);
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
