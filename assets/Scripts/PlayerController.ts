import { _decorator, Component, EventMouse, Input, input, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
  start() {
    input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
  }

  onMouseDown(event: EventMouse) {}

  protected onDestroy(): void {
    input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
  }
}
