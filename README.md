# JSON parser

## Parsing

### CFG

```
S -> E
E -> [L] | {O} | str | bool | num | null
L -> T | ε
T -> T,T | E
O -> P | ε
P -> P,P | str:E
```

### follow set

| R | follow(R) |
| -- | -- |
| S | {`$`} |
| E | {`$`, `,`, `]`, `}`} |
| T | {`,`, `]`} |
| L | {`]`} |
| P | {`,`, `}`} |
| O | {`}`} |

### DFA

省略 `E -> bool` 等其他的与 str 类似的产生式

![DFA](http://on-img.com/chart_image/5b41cb57e4b00c2f18c2d0b8.png?)
