enum stateMachine {
  ready,
  start,
  over
};

class State {
  public static current = stateMachine.ready;

  public static setCurrent(newState: stateMachine) {
    this.current = newState;
  }
}

export { stateMachine, State };