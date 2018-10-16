const { Tag } = require('./token');

const ACCEPT = 'ACCEPT';
const START_STATE = 1;

const stateMap = {
  1: {
    [Tag.BLOCK_OPEN]: 2,
    [Tag.SQUARE_OPEN]: 8,
    E: 7,
  },
  2: {
    [Tag.BLOCK_CLOSE]: 4,
  },
  7: {
    [Tag.$]: ACCEPT,
  },
  8: {
    [Tag.SQUARE_CLOSE]: 9,
    [Tag.SQUARE_OPEN]: 8,
    [Tag.BLOCK_OPEN]: 2,
    L: 10,
    T: 11,
    E: 12,
  },
  10: {
    [Tag.SQUARE_CLOSE]: 9,
  },
};
const finishStatesMap = {
  4: {
    popUtil: Tag.BLOCK_OPEN,
    reduceTo: 'E',
  },
  9: {
    popUtil: Tag.SQUARE_OPEN,
    reduceTo: 'E',
  },
  11: {
    popUtil: 'T',
    reduceTo: 'L',
  },
  12: {
    popUtil: 'E',
    reduceTo: 'T',
  },
};

const getNextState = (curState, tag) => {
  if (stateMap[curState] && stateMap[curState][tag]) {
    return stateMap[curState][tag];
  }

  return null;
};

class Parser {
  constructor(_lexer) {
    this.lexer = _lexer;
  }

  parsing() {
    const { lexer } = this;
    const stack = [[START_STATE]];
    let tag;

    do {
      ({ tag } = lexer.scan());

      const [curState] = stack[stack.length - 1];
      let nextState = getNextState(curState, tag);
      if (!nextState) {
        return { status: -1 };
      }
      if (nextState === ACCEPT) {
        return { status: 0 };
      }
      stack.push([nextState, tag]);

      while (finishStatesMap[nextState]) {
        const { popUtil, reduceTo } = finishStatesMap[nextState];
        let [, popTag] = stack.pop();
        while (popTag !== popUtil) {
          [, popTag] = stack.pop();
        }
        const [preState] = stack[stack.length - 1];
        nextState = getNextState(preState, reduceTo);
        stack.push([nextState, reduceTo]);
      }
    } while (tag !== Tag.$);

    return { status: -1 };
  }
}

module.exports = Parser;
