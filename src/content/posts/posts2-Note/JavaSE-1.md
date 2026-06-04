---
title: 1️⃣ JavaSE(类型.运算符.表达式)
published: 2026-05-27
pinned: true
image: 'https://img.eysnter.cn/file/posts/posts2-notes/JavaSE/1780499976120_JavaSE-1.jpg'
tags: [JavaSE,知识点]
category: 'JavaSE'
draft: false
description: 阐述 Java 基础语法，核心包含基本数据类型、变量转换及运算符表达式的计算规则。
lang: zh-CN
comment: true
---

# 一、JAVA 基础概念

##  一、注释 (Comments)
java 里的三种注释:
- 单行注释
```java
// 这是java的单行注释
```
- 多行注释
```java
/*
这是java的多行注释
这是java的多行注释
这是java的多行注释
*/
```
- 文档注释
```java
/**
这是 java 的多行注释
这是 java 的多行注释
这是 java 的多行注释
*/
```

## 二、关键字

被 Java 赋予了特定含义的英文单词。

| **abstract**   | **assert**       | **boolean**   | **break**      | **byte**   |
| -------------- | ---------------- | ------------- | -------------- | ---------- |
| **case**       | **catch**        | **char**      | **class**      | **const**  |
| **continue**   | **default**      | **do**        | **double**     | **else**   |
| **enum**       | **extends**      | **final**     | **finally**    | **float**  |
| **for**        | **goto**         | **if**        | **implements** | **import** |
| **instanceof** | **int**          | **interface** | **long**       | **native** |
| **new**        | **package**      | **private**   | **protected**  | **public** |
| **return**     | **strictfp**     | **short**     | **static**     | **super**  |
| **switch**     | **synchronized** | **this**      | **throw**      | **throws** |
| **transient**  | **try**          | **void**      | **volatile**   | **while**  |
### 1、 关键字 class

`class` 表示定义类
`HelloWorld` 类的类名
`{}` 类的范围

<u>类：Java 项目最基本的组成单元，一个完整的 Java 项目有可能会有成千上万个类来组成的。</u>

```java
class HelloWorld{

}
```

### 2、 字面量 (Literals)
**作用**：数据在程序中的书写格式。

| **字面量类型** | **说明**                    | **程序中的写法**          |
| --------- | ------------------------- | ------------------- |
| 整数        | 不带小数的数字                   | 666，-88             |
| 小数        | 带小数的数字                    | 13、14，-5.21         |
| 字符        | 必须使用单引号，有且仅能一个字符          | ‘A’，‘0’，   ‘我’      |
| 字符串       | 必须使用双引号，内容可有可无            | “HelloWorld”，“我爱中国” |
| 布尔值       | 布尔值，表示真假，只有两个值：true，false | true 、false         |
| 空值        | 一个特殊的值，空值                 | 值是：null             |
```java
public class Demo {
    public static void main(String[] args) {
        System.out.println(10);             // 输出一个整数
        System.out.println(5.5);            // 输出一个小数
        System.out.println('a');            // 输出一个字符
        System.out.println(true);           // 输出boolean值true
        System.out.println("HelloWorld");   // 输出字符串
    }
}
```

**控制台输出结果**：
```bash title="bash"
10
5.5
a
true
HelloWorld
```


## 三、变量
- **本质**：内存中用来临时存储单个数据的容器。
- **定义格式**：
$$\text{数据类型} \quad \text{变量名} = \text{数据值};$$

1、 **不能重名**：在同一个作用域（同一对 `{}`）内，变量名不允许重复定义。 
1. **必须初始化**：变量在使用（如打印、参与运算）之前，**必须先赋值**，否则编译报错。
2、 **类型约束**：变量只能存储符合其定义时指定的数据类型的数据。

- **核心规则代码演示**：
```java
public class VariableDemo {
    public static void main(String[] args) {
        // 1、 变量名不允许重复
        // int a = 10;
        // int a = 20; // 编译报错：变量 a 已被定义

        // 2、 一条语句可以定义多个变量（了解即可，实际开发不推荐，影响阅读）
        // int a = 10, b = 20, c = 20, d = 20;
        // System.out.println(a);
        // System.out.println(b);

        // 3、 变量在使用之前必须要赋值
        int a = 30;
        System.out.println(a); // 正常输出 30
    }
}
```

- **经典实战演示（游戏角色属性变化模拟）**：
```java
public class GameTest {
    public static void main(String[] args) {
        // 初始状态：血量 100，金币 0
        int hp = 100;
        int gold = 0;

        // 第一阶段：击败小怪，获得 50 金币，扣除 20 生命值
        gold = gold + 50;
        hp = hp - 20;

        // 第二阶段：在商店花费 30 金币购买药水，恢复 40 生命值
        gold = gold - 30;
        hp = hp + 40;

        // 第三阶段：完成隐藏任务，获得 100 金币奖励
        gold = gold + 100;

        // 最终状态输出
        System.out.println("角色最终生命值 (HP)：" + hp);   // 120
        System.out.println("角色最终金币数量：" + gold);    // 120
    }
}
```

## 四、数据类型
Java 的数据类型分为两大家族：**基本数据类型** 与 **引用数据类型**（如 `String`、数组、自定义类等）。

### 1、 8种基本数据类型
- **整数默认类型为 `int`，浮点数默认类型为 `double`**。

| 分类      | 关键字       | 占用字节 (Byte) | 取值范围                                          | 默认后缀要求               |
| ------- | --------- | ----------- | --------------------------------------------- | -------------------- |
| **整数**  | `byte`    | 1           | $-128 \sim 127$                               | 无                    |
|         | `short`   | 2           | $-32768 \sim 32767$                           | 无                    |
|         | `int`     | 4           | 约 $\pm 21$ 亿                                  | 无                    |
|         | `long`    | 8           | $-2^{63} \sim 2^{63}-1$                       | 数值后必须加 **`L`** / `l` |
| **浮点数** | `float`   | 4           | $1、4 \times 10^{-45} \sim 3、4 \times 10^{38}$ | 数值后必须加 **`F`** / `f` |
|         | `double`  | 8           | 精度更高，取值更大                                     | 无                    |
| **字符**  | `char`    | 2           | $0 \sim 65535$ (字符的 Unicode 码)                | 无                    |
| **布尔**  | `boolean` | 1           | `true` 或 `false`                              | 无                    |
### 2、数据类型实战：
```java
public class VariableTest {
    public static void main(String[] args) {
        // --- 实战场景 1：记录教师个人基本信息 ---
        String teacherName = "小明";
        int teacherAge = 18;
        char teacherGender = '男';
        double teacherHeight = 180.1;
        boolean isMarried = true;

        // --- 实战场景 2：记录电影媒介数据 ---
        String movieName = "送初恋回家";
        String mainActor = "小刚";
        int releaseYear = 2020;
        double movieScore = 9.0;

        // --- 实战场景 3：记录手机商品属性 ---
        String phoneBrand = "华为";
        double phonePrice = 5299.0;

        // --- 控制台格式化输出部分演示 ---
        System.out.println("====== 教师基本信息 ======");
        System.out.println("姓名：" + teacherName + " | 年龄：" + teacherAge + " | 性别：" + teacherGender);
        
        System.out.println("\n====== 推荐电影信息 ======");
        System.out.println("电影名：《" + movieName + "》 | 主演：" + mainActor + " | 评分：" + movieScore);

        System.out.println("\n====== 热门商品推荐 ======");
        System.out.println("品牌：" + phoneBrand + " | 价格：" + phonePrice + " 元");
    }
}
```

- **控制台运行输出结果**：
```bash
====== 教师基本信息 ======
姓名：曹丹 | 年龄：18 | 性别：男

====== 推荐电影信息 ======
电影名：《送初恋回家》 | 主演：刘鑫 | 评分：9.0

====== 热门商品推荐 ======
品牌：华为 | 价格：5299.0 元
```

## 五. 标识符命名规范

### 1、硬性要求

1、 只能由 **数字、字母、下划线 `_`、美元符号 `$`** 组成。 
1. **绝对不能以数字开头**。
2、 **不能是 Java 关键字**（如：不能用 `class`、`public`、`void` 做变量名）。
2. **严格区分大小写**（如 `username` 和 `userName` 是两个不同的变量）。
### 2、软性规范

- **小驼峰命名法（用于：变量名、方法名）**：
    - 单个单词：全小写。例如：`name`，`age`。 
    - 多个单词：从第二个单词开始，首字母大写。例如：`firstName`，`maxAge`，`studentCount`。 
- **大驼峰命名法（用于：类名）**：
    - 每个单词的首字母都要大写。例如：`Demo`，`HelloWorld`，`ScannerDemo`。
### 3、阿里巴巴命名规范

- **不要使用拼音/英文混合命名**（除国际通用的地名等拼音外）：
    - ❌ 错误示例：`jiage` (价格)、`dazhe` (打折)、`myNameYuan`
    - 正确示例：`price`、`discount` 
- **不要无故使用下划线 `_` 或美元符 `$` 命名**：
    - ❌ 错误示例：`_name`、`$money`、`gender_`  
    - 正确示例：`name`、`money`、`gender`  
- **起名必须“见名知意”**：避免定义 `int a`, `double b` 这种毫无实际意义的命名。


---
# 二、 运算符和表达式

## 一、键盘录入 (Scanner)
当需要从控制台接收用户输入的数据时，直接使用 Java 内置的 `Scanner` 工具类。

### 极简三步法模板：
```java
// 第一步：导包（必须写在类定义 class 的上面）
import java.util.Scanner; 

public class ScannerDemo {
    public static void main(String[] args) {
        // 第二步：创建键盘录入对象
        Scanner sc = new Scanner(System.in); 
        System.out.println("请输入一个数字：");
        
        // 第三步：调用 nextInt() 接收数据，并赋值给变量 i
        int i = sc.nextInt(); 
        
        System.out.println("您录入的数字是：" + i);
    }
}
```

## 二、隐式与强制类型转换

### 1、 隐式转换（自动类型提升）

- **规则**：小范围数据赋给大范围变量时，程序自动完成转换（小的给大的，直接给）。  
- **方向**：$\text{byte} \rightarrow \text{short}/\text{char} \rightarrow \text{int} \rightarrow \text{long} \rightarrow \text{float} \rightarrow \text{double}$
- **🔥 核心铁律（必考）**：**`byte`、`short`、`char` 只要参与运算，无条件先提升为 `int`**。
    
- **极简自测**：
    
    - `byte b1 = 10; byte b2 = 20; ??? result = b1 + b2;` $\rightarrow$ `result` 必须是 **`int`** 类型（`byte + byte` 提升为 `int`）。
    - `int i = 10; long n = 20L; ??? result = i + n;` $\rightarrow$ `result` 必须是 **`long`** 类型（`int` 自动提升为 `long`）。
        

### 2、 强制类型转换

- **规则**：大范围强转给小范围。格式为 `目标类型 变量 = (目标类型)数据;`。
    
- **副作用**：会导致**精度丢失**（浮点转整直接抹去小数部分）或**数据溢出**。
```java
double a = 12、3;
int b = (int) a; // b = 12 (小数部分直接丢失)
```

## 三、算术运算符与数值拆分

### 1、 算术运算符基础

- 符号：`+`、`-`、`*`、`/`、`%`。
    
- **`/` (除法) 陷阱**：
    1、 整数相除只能得到整除结果（截断舍弃小数）。如 `10 / 3` 的结果是 `3`。
    1. 如果想要得到小数结果，必须有浮点数（小数）参与运算。
    2、 浮点数直接运算可能得到不精确的结果（例如 `10.0 / 3` 在 Java 中输出 `3、3333333333333335`）。

- **`%` (取模/求余) 的本质**：做除法运算并获取余数。
    - 常用场景：判断奇偶数。`num % 2 == 0`（偶数），`num % 2 == 1`（奇数）。

### 2、 万能数值拆分公式

对于任意一个整数，可以通过整除 `/` 降位、取模 `%` 留尾的物理特性，精准拆分出各个数位上的数值。

```java
public class SplitNumberDemo {
    public static void main(String[] args) {
        // 以三位数 number = 123 为例
        int number = 123;

        // 1、 万能数位拆分公式计算
        int ones = number % 10;           // 个位：对 10 取模 (123 % 10 = 3)
        int tens = number / 10 % 10;      // 十位：先除以 10 舍去个位，再对 10 取模 (12 % 10 = 2)
        int hundreds = number / 100 % 10; // 百位：先除以 100 舍去十位和个位，再对 10 取模 (1 % 10 = 1)

        // 2、 格式化控制台输出
        System.out.println("数值 " + number + " 的拆分结果为：");
        System.out.println("百位 (hundreds) 是：" + hundreds);
        System.out.println("十位 (tens)     是：" + tens);
        System.out.println("个位 (ones)     是：" + ones);
    }
}
```
- **控制台运行输出结果**：
```bash
数值 123 的拆分结果为：
百位 (hundreds) 是：1
十位 (tens)     是：2
个位 (ones)     是：3
```
  
## 四、自增自减与字符/字符串拼接

### 1、 自增自减运算符 (`++`、`--`)

- **核心特征**：不管前自增（`++a`）还是后自增（`a++`），单独 write 在一行时，结果都是让变量自身 `+1`。

- **混合运算机制（笔试高频考点）**：

- **`a++` (后自增)**：**先用后加**。先拿变量原本的值参与当前运算/赋值，整个语句结束后变量自身再 `+1`。

- **`++a` (前自增)**：**先加后用**。变量自身先自增 `+1`，然后再用新值参与运算/赋值。


```java
int a = 10;
int b = a++; // b = 10, a = 11
int c = ++a; // a = 12, c = 12
```
### 2、 字符串的 `+` 操作

- **核心规则**：

1、 当 `+` 操作中**出现字符串**时，该 `+` 变成**字符串连接符**，进行数据拼接并产生全新字符串。 
1. 连续进行 `+` 操作时，执行顺序自左向右。

- **经典面试演练**：
	- `1 + "abc" + 1` $\rightarrow$ 结果：`"1abc1"`
	- `1 + 2 + "abc" + 2 + 1` $\rightarrow$ 结果：`"3abc21"`（前两个整数正常加法运算，随后转为拼接）
### 3、 字符的 `+` 操作

- **核心规则**：当 `+` 操作中出现字符，会拿着字符去 ASCII 码表中查到对应的数字进行计算。
- **必须牢记的 ASCII 码值**： $$\text{'a'} \rightarrow 97 \quad | \quad \text{'A'} \rightarrow 65 \quad | \quad \text{'0'} \rightarrow 48$$
```java
char c = 'a';
System.out.println(c + 0); // 输出 97
```
## 五、赋值与关系运算符 

### 1、 扩展赋值运算符 (`+=`、`-=`、`*=`、`/=`、`%=`)

- **底层机制（大坑 ⚠️）**：扩展赋值运算符**隐式包含了一次强制类型转换**。
    
    ```java
    byte a = 10;
    byte b = 20;
    // a = a + b; // 编译报错！a+b结果是int，无法赋值给byte
    a += b;       // 编译通过！底层等价于 a = (byte)(a + b);
    ```

- 关系运算符最终的返回结果**必须是布尔类型**（`true` 或 `false`）。
- **避坑**：在做等于判断时，

## 六、逻辑与短路运算符

### 1、 基础逻辑运算符

- **`&` (逻辑与)**：且。两边全为真，结果才是真；只要有一个为假，结果即为假。
    
- **`|` (逻辑或)**：或。两边全为假，结果才是假；只要有一个为真，结果即为真。
    
- **`^` (逻辑异或)**：两边不同则为真，相同则为假（了解即可）。
    
- **`!` (逻辑非/取反)**：真变假，假变真。习惯上最多只用一个取反（`!flag`）。
    

### 2、 短路逻辑运算符 (`&&`、`||`)

- **底层机制（短路效果）**：当左边的表达式已经能够确定整个逻辑表达式的最终结果时，**右边的表达式将直接被跳过不执行**。
    
    - `&&` (短路与)：左边为 `false` 时发生短路，右边不执行（整体直接为 `false`）。
    - `||` (short-circuit or / 短路或)：左边为 `true` 时发生短路，右边不执行（整体直接为 `true`）。
        
- **实战价值**：
    
    1、 **提升运行性能**：免去后续无意义的运算。
    1. **防范空指针异常（关键防线）**：
```java
// 如果 str 为 null，不使用短路与，str.length() 将在运行时抛出空指针异常
if (str != null && str.length() > 0) {
	// 安全运行
}
```
## 七、三元运算符

- **格式**：$$\text{关系表达式} \ ? \ \text{表达式1} \ : \ \text{表达式2};$$
- **规则**：若关系表达式为真，执行表达式 1 并返回结果；若为假，执行表达式 2 并返回结果。
    
- **硬性要求**：三元运算符计算的最终结果**必须被使用**（要么赋值给变量，要么直接打印输出）。
### 经典案例演练

- **练习 1：判断两只老虎体重是否相同**

```java
// 假定两只老虎体重通过录入获取为 weight1, weight2
String result = weight1 == weight2 ? "相同" : "不相同";
System.out.println(result);
```


- **练习 2：求三个数的最大值**
 
```java
// 记录三个和尚的身高
int height1 = 150, height2 = 210, height3 = 165;
// 先求前两个身高中的较大值，存储在临时变量 temp 中
int temp = height1 > height2 ? height1 : height2;
// 拿 temp 与第三个身高进行比较，求出最终最高身高
int max = temp > height3 ? temp : height3; // max = 210
```

## 八、运算符优先级

**核心法则：**

1、 **小括号 `()` 的优先级最高，优先于一切。**
    
2、 实际开发中，任何无法直接笃定优先顺序的场景，**直接加小括号 `()`**，既保证运行安全，又极大提升了代码可读性。