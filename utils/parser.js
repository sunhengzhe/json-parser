const { Tag } = require('./token');

const ACCEPT = 'ACCEPT';
const START_STATE = 1;

const stateMap = {
  1: {
    [Tag.BLOCK_OPEN]: 2,
    [Tag.SQUARE_OPEN]: 8,
    E: 7,
    [Tag.STRING]: 15,
    [Tag.BOOLEAN]: 21,
    [Tag.NUM]: 22,
    [Tag.NULL]: 23,
  },
  2: {
    O: 3,
    [Tag.BLOCK_CLOSE]: 4,
    P: 5,
    [Tag.STRING]: 6,
  },
  3: {
    [Tag.BLOCK_CLOSE]: 4,
  },
  5: {
    [Tag.COMMA]: 16,
  },
  6: {
    [Tag.COLON]: 19,
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
    [Tag.STRING]: 15,
    [Tag.BOOLEAN]: 21,
    [Tag.NUM]: 22,
    [Tag.NULL]: 23,
  },
  10: {
    [Tag.SQUARE_CLOSE]: 9,
  },
  11: {
    [Tag.COMMA]: 13,
  },
  13: {
    T: 14,
    E: 12,
    [Tag.BLOCK_OPEN]: 2,
    [Tag.SQUARE_OPEN]: 8,
  },
  14: {
    [Tag.COMMA]: 13,
  },
  16: {
    P: 17,
    [Tag.STRING]: 18,
  },
  17: {
    [Tag.COMMA]: 16,
  },
  18: {
    [Tag.COLON]: 19,
  },
  19: {
    E: 20,
    [Tag.BLOCK_OPEN]: 2,
    [Tag.SQUARE_OPEN]: 8,
    [Tag.STRING]: 15,
    [Tag.BOOLEAN]: 21,
    [Tag.NUM]: 22,
    [Tag.NULL]: 23,
  },
};

const finishStatesMap = {
  4: {
    popUtil: Tag.BLOCK_OPEN,
    reduceTo: 'E',
  },
  5: {
    popUtil: 'P',
    reduceTo: 'O',
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
  14: {
    popTimes: 3,
    reduceTo: 'T',
  },
  15: {
    popUtil: Tag.STRING,
    reduceTo: 'E',
  },
  17: {
    popTimes: 3,
    reduceTo: 'P',
  },
  20: {
    popUtil: Tag.STRING,
    reduceTo: 'P',
  },
  21: {
    popUtil: Tag.BOOLEAN,
    reduceTo: 'E',
  },
  22: {
    popUtil: Tag.NUM,
    reduceTo: 'E',
  },
  23: {
    popUtil: Tag.NULL,
    reduceTo: 'E',
  },
};

const followSetMap = {
  S: [Tag.$],
  E: [Tag.$, Tag.COMMA, Tag.SQUARE_CLOSE, Tag.BLOCK_CLOSE],
  T: [Tag.COMMA, Tag.SQUARE_CLOSE],
  L: [Tag.SQUARE_CLOSE],
  P: [Tag.COMMA, Tag.BLOCK_CLOSE],
  O: [Tag.BLOCK_CLOSE],
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
    let nextTag;

    do {
      tag = nextTag || lexer.scan().tag;
      ({ tag: nextTag } = lexer.scan());

      const [curState] = stack[stack.length - 1];
      let nextState = getNextState(curState, tag);
      if (!nextState) {
        return { status: -1 };
      }
      if (nextState === ACCEPT) {
        return { status: 0 };
      }
      stack.push([nextState, tag]);

      while (
        finishStatesMap[nextState] &&
        followSetMap[finishStatesMap[nextState].reduceTo].includes(nextTag)
      ) {
        const { popUtil, reduceTo, popTimes } = finishStatesMap[nextState];
        if (popTimes > 0) {
          for (let i = popTimes; i > 0; i -= 1) {
            stack.pop();
          }
        } else {
          let [, popTag] = stack.pop();
          while (popTag !== popUtil) {
            [, popTag] = stack.pop();
          }
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
