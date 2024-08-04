---
created: '2024-07-21T22:09:05+08:00'
wordCount: 805
---

# Markdown 排版样张 - mdx-rs 版

## 链接

```md
[GitHub](https://github.com)
<https://www.github.com/>
email <example@example.com>
```

[GitHub](https://github.com)
<https://www.github.com/>
email <example@example.com>

## 代码

    ```js
    function log(arg) {
      console.log(arg);
    }
    ```

```js
function log(arg) {
  console.log(arg);
}
```

## 强调

```md
*这些文字会生成`<em>`*
_这些文字会生成`<u>`_

**这些文字会生成`<strong>`**
__这些文字会生成`<strong>`__
```

*这些文字会生成`<em>`*
_这些文字会生成`<u>`_

**这些文字会生成`<strong>`**
__这些文字会生成`<strong>`__

## 列表

### 无序列表

```md
* 项目一 无序列表 `* + 空格键`
* 项目二
    * 项目二的子项目一 无序列表 `TAB + * + 空格键`
    * 项目二的子项目二
        * 子项目
            * 子项目
```

* 项目一 无序列表 `* + 空格键`
* 项目二
    * 项目二的子项目一 无序列表 `TAB + * + 空格键`
    * 项目二的子项目二
        * 子项目
            * 子项目

### 有序列表

```md
1. 项目一 有序列表 `数字 + . + 空格键`
1. 项目二
1. 项目三
    1. 项目三的子项目一 有序列表 `TAB + 数字 + . + 空格键`
    1. 项目三的子项目二
```

1. 项目一 有序列表 `数字 + . + 空格键`
2. 项目二
3. 项目三
    1. 项目三的子项目一 有序列表 `TAB + 数字 + . + 空格键`
    2. 项目三的子项目二

### 任务列表（Task lists）

```md
- [ ] 任务一 未做任务 `- + 空格 + [ ]`
- [x] 任务二 已做任务 `- + 空格 + [x]`
    - [ ] 任务三 未做任务 `- + 空格 + [ ]`
- [x] 任务四 已做任务 `- + 空格 + [x]`
```

- [ ] 任务一 未做任务 `- + 空格 + [ ]`
- [x] 任务二 已做任务 `- + 空格 + [x]`
    - [ ] 任务三 未做任务 `- + 空格 + [ ]`
- [x] 任务四 已做任务 `- + 空格 + [x]`

## 图片

```md
![The Lorem Ipsum for photos](https://picsum.photos/200/300)
```

![The Lorem Ipsum for photos](https://picsum.photos/200/300)

## 区块引用

```md
某某说:
> 第一行引用
> 第二行引用文字
```

某某说:
> 第一行引用
> 第二行引用文字

## 行内代码

```md
像这样即可：`<addr>` `code`
```

像这样即可：`<addr>` `code`

## 顺序图或流程图

    ```mermaid
    graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;
    ```

```mermaid
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
```
## 表格

```md
| 第一格表头             | 第二格表头       |
|-------------------|-------------|
| 内容单元格 第一列第一格      | 内容单元格第二列第一格 |
| 内容单元格 第一列第二格 多加文字 | 内容单元格第二列第二格 |
```

| 第一格表头             | 第二格表头       |
|-------------------|-------------|
| 内容单元格 第一列第一格      | 内容单元格第二列第一格 |
| 内容单元格 第一列第二格 多加文字 | 内容单元格第二列第二格 |

## 删除线

```md
加删除线像这样用： ~~删除这些~~
```

加删除线像这样用： ~~删除这些~~

## 分隔线

```
***

*****

- - -
```

***

*****

- - -

## 公式

```
块级公式：
$$ x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$

行内公式： $\Gamma(n) = (n-1)!\quad\forall n\in\mathbb N$
```

块级公式：
$$ x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$

行内公式： $\Gamma(n) = (n-1)!\quad\forall n\in\mathbb N$

## 脚注

```
这是一个脚注：[^sample_footnote]
这是另一个脚注：[^sample_footnote2]
```

这是一个脚注：[^sample_footnote]
这是另一个脚注：[^sample_footnote2]

[^sample_footnote]: 这里是脚注信息
[^sample_footnote2]: 这里是脚注信息
