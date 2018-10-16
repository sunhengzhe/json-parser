const { Tag } = require('./token');

const ACCEPT = 'ACCEPT';

const stateMap = {
  1: {
    [Tag.BLOCK_OPEN]: 2,
    E: 7,
  },
  2: {
    [Tag.BLOCK_CLOSE]: 4,
  },
  7: {
    [Tag.$]: ACCEPT,
  },
};
const finishStates = [4];
const popUtilMap = {
  4: Tag.BLOCK_OPEN,
};
const reduceTagMap = {
  4: 'E',
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
    const stack = [[1]];
    let tag;

    do {
      ({ tag } = lexer.scan());

      const [curState] = stack[stack.length - 1];
      let nextState = getNextState(curState, tag);
      if (nextState === ACCEPT) {
        return { status: 0 };
      }
      stack.push([nextState, tag]);

      while (finishStates.includes(nextState)) {
        let [, popTag] = stack.pop();
        while (popTag !== popUtilMap[nextState]) {
          [, popTag] = stack.pop();
        }
        const [preState] = stack[stack.length - 1];
        nextState = getNextState(preState, reduceTagMap[nextState]);
        stack.push([nextState, reduceTagMap[nextState]]);
      }
    } while (tag !== Tag.$);

    return { status: -1 };
  }
}

module.exports = Parser;
