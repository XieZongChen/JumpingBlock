import { _decorator, Component, EventMouse, Input, input, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
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
    const curPos = this.node.position;
    this.node.setPosition(curPos.x + step * 40, curPos.y, curPos.z);
  }

  protected onDestroy(): void {
    input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
  }
}
