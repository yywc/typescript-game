## 前言

在开始所有的步骤之前，在这里先对**项目中所用到的 typescript 知识点**做一个简单的介绍，方便从零开始的同学，更多完整的，高级的用法请查阅 [typescript 官网](https://www.tslang.cn/docs/home.html)。

## 1. 基础类型

+ 布尔值 boolean：`const flag: boolean = true;`
+ 数字 number：`const count: number = 1;`
+ 字符串 string：`const str: string = 'hello';`
+ 数组、元组 []：`const arr: number[] = [1, 2];`、` const arr2: [string, number] = ['hello', 1];`
+ any：`const noType: any = 'test';` 、 `const noTypeArr: any[] = [1, '2', true];`
+ void：` const fn = (): void => { console.log('return nothing') };`
+ 类型断言：`const str: any = 'hello world';`、` const strLen = (str as string).length;`

还有一些 `never`、`null`、`undefined`、`enum`、`Object`由于没有使用到，想了解更多的同学可以去[typescript中文网](https://www.tslang.cn/docs/handbook/basic-types.html)了解更多。

像简单数据类型可以不必写出类型，因为 ts 会帮助我们自动推断出它的类型。例如 `const count: number = 1;` 就可以直接像 JS 中一样写：`const count = 1;`但是我们要清楚的是省略了这一步，而不是没有这个。

## 2. 修饰符

与 ES6 不同的是，typescript 还提供了很多修饰符。

+ public：修饰类中的变量、方法，被修饰者可以在任意类中使用；
+ protect：修饰类中的变量、方法，被修饰者可以在本类或子类中使用；
+ private：修饰类中的变量、方法，被修饰者只能在本类中使用；
+ readonly：修饰属性为只读，被修饰者只能初始化一次，之后不可更改；

关于 readonly 和  const 的区别：const 一般用来定义变量不可修改，而 readonly 定义属性不可修改。

## 3. 函数

与 ES6 函数类似，唯一多出的一些功能时参数类型的限制以及返回值的类型声明，下面定义一个加法函数：

```ts
const add = (x: number, y: number): number => {
  return x + y;
}
console.log(add(1, 2)); // ✅ 3
console.log(add(1, '2')); // ❌
```

函数也可以解构与设置默认值，还可以设定某个参数为可选（但是必选参数不能位于可选参数后，但是可以通过解构赋值放到可选参数后面）。

```ts
// 问号表示可选
const add = (x: number, y?: number, z: number = 1): number => {
  return y ? x + y + z : x + z;
};
console.log(add(1, 2, 3)); // ✅ 6
// 不想传的可选参数要传入 null/undefined
console.log(add(1, null, 3)); // ✅ 4
```

## 4. 泛型

允许组件支持当前数据类型，同时也支持未来的数据类型，而非使用 any 抹掉了数据类型。

```ts
// 泛型 Map
const map: Map<number, string> = new Map();
map.set(1, 2); // ❌ Argument of type '2' is not assignable to parameter of type 'string'.ts(2345)
map.set(1, 'hello'); // ✅
// 泛型函数
const getLength = <T>(key: T[]): number => {
  return key.length;
}
console.log(getLength([1, 2, 3])); // 3
console.log(getLength(['1', '2', '3'])); // 3
```

还有泛型类、泛型接口等，由于不涉及使用就不过多说明。

## 5. 枚举

枚举虽然没有使用到，但介绍一下还是很有用的。使用枚举我们可以定义一些带名字的常量，大家可能会有疑问（我之前也有），枚举和常量有什么不一样呢？

假定我们定义三种颜色红黄蓝，利用常量如下：

```js
const RED = 1;
const YELLOW = 2;
const BLUE = 3;
```

而使用枚举可以这样来定义

```ts
enum Color {
  Red,
  Yellow,
  Blue,
}
console.log(Color.Yellow); // 1

// 枚举值默认从0开始自增长，我们也可以通过设置第一个枚举值达到从某个数字开始自增长的目的，同时也可以设置字符串
enum Color {
  Red = 1,
  Yellow = 'Yellow',
  // Blue, // Enum member must have initializer.ts(1061)
  Blue = 3,
}
console.log(Color.Yellow); // Yellow
console.log(Color.Blue); // 3
console.log(Color[Color.Blue]); // 键值反射 Blue
```

这样定义的好处有：

+ 可读性强
+ 可扩展性强
+ 方便操作（枚举对象可以使用对象的若干个方法，同时还具备反射功能）

当然，简单的还是用常量会更好一点，有兴趣的同学可以看看 enum 编译成 js 的代码，在平时的开发中，键值反射功能还是挺好用的。

## 6. 高级类型

 + 联合类型

   关键字：T | U

   当我们想要一个变量既可以是某种类型，又可以是其他类型时使用。

+ 交叉类型

  关键字：T & U

  交叉类型是将多个类型合并为一个类型。

+ 类型别名

  关键字：type

  类型别名会给类型一个新名字：type LengthValue = string & any[];

下面通过一个例子介绍一下两种类型的使用。

```ts
// 定义一个键为字符串，值为任何类型的 map 对象
const map: Map<string, any> = new Map();

// 给 map 对象设置值，类型为 string 或者 number 的数组
function set(key: string, value: string | number[]): void {
  map.set(key, value);
}

// 从 map 中取值，取出来的值是 string 和 number 数组的交叉类型
function get(key: string): string & number[] {
  return map.get(key);
}

// 设置
set('string', 'hello world');
set('array', [1, 2, 3]);

// 当我们从 map 中取值时，可以看到结果是 string 和 array 的交叉类型，同时通过代码联想可以查看到具备数组和字符串的方法
console.log(get('string'));
console.log(get('array'));
```



## 7. 类

类与 ES6 中类大部分一样，不同的是加入了 `public`、`protected`、`private`、`readonly`关键字进行修饰，同时还可以实现接口，接口的内容在下面再解释，这里主要是介绍一下 TS 的类与 ES6 的类有什么不同。

### 7.1 变量声明

```js
// javascript
class People {
  age = 18;
  constructor(name) {
    this.name = name;
  }
}
// typescript
class People {
  age = 18;
  constructor(name) {
    this.name = name; ❌ // name 未定义
  }
}
// typescript 实际上编译出来的 class 就相当于以下
class People {
  constructor(name) {
    this.age = 18;
    this.name = name;
  }
}
```

typescript 在初始化变量时必须要在类里进行过定义，这样的好处是可以避免初始化了一些我们意料之外的变量，同时在使用时 IDE 也能给出正确的语义提示，达到一个强类型效果。

### 7.2 作用域限定

ES6 的类是没有作用域限定的，也就是说定义的方法和变量可以在任意地方使用。

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  logName() {
    this.getName();
  }
  getName() {
    console.log(this.name);
  }
}

class Cat extends Animal {}

const animal = new Animal('tom');
const cat = new Animal('jerry');
animal.logName(); // tom
cat.logName(); // jerry
animal.getName(); // tom
cat.getName(); // jerry
```

当使用 typescript 来实现的时候，就是另外的光景了。

```ts
class Animal {
  name: string;
  constructor(name) {
    this.name = name;
  }
  // 公共方法，可以在任意地方调用
  public logName() {
    this.getName();
  }
  // 私有方法，只能在本类中使用
  private getName() {
    console.log(this.name);
  }
}

class Cat extends Animal {}

const animal = new Animal('tom');
const cat = new Animal('jerry');
animal.logName(); // tom
cat.logName(); // jerry
animal.getName(); ❌ // Property 'getName' is private and only accessible within class 'Animal'
cat.getName(); ❌ // Property 'getName' is private and only accessible within class 'Animal'
```

类中成员变量和成员方法默认的修饰符是 public 也就是在所有任意位置都可以通过实例来访问。

而构造方法如果加上 public 外的修饰符则不可以通过 new 关键字在类或子类以外的地方实例化。

## 8. 接口

接口的作用是给代码定义一种契约，按照某种格式来约束代码，达到一种强类型检查。

```ts
// 约束对象的行为
interface Direction {
  Up: number;
  Right: number;
  readonly Bottom: number; // readonly 表示只读属性，在初始化时定义后不可修改
  Left?: number; // 问号表示可选
}

// 限定为 Direction 类型的 direction 会被检查是否实现 4 个属性
// 不能多属性，也不可少属性
const direction: Direction = {
  Up: 1,
  Right: 2,
  Bottom: 3,
  [Left: 4,]
};
direction.Up = 2; // ✅
direction.Bottom = 2; // ❌ Cannot assign to 'Bottom' because it is a read-only property.ts(2540)
```

### 8.1 可索引的类型

在以上的基础上，要想再增加新的属性，就只能通过增加索引来实现了。

```ts
interface Bool {
  Yes: boolean;
  No: boolean;
  [key: string]: boolean; // 可索引类型
}

const flag: Bool = {
  Yes: true,
  No: true,
}
flag.UnKnown = true; // 有可索引类型，✅；否则 ❌
```

### 8.2 类实现接口

与 java 类似，TypeScript 也能够用它来明确的强制一个类去符合某种契约，同时接口也可以继承。

```ts
// 定义 Dog 接口，需要实现 name 属性，以及 eat 方法
interface Dog {
  readonly name: string;
  eat(food: string): void;
}

// 创建哈士奇对象实现 Dog 接口
class Husky implements Dog {
  readonly name = 'haha';
  eat(food: string): void {
    console.log(`${this.name} eat ${food}`);
  }
}

// 创建哈士奇对象，并调用 eat 方法
new Husky().eat('meat');
```

通过事先定义好接口，然后再在具体类中实现接口。达到定义（约束）与实现分离。

### 8.3 接口与类型别名、抽象类的区别

偶尔发现很多时候接口和类型别名、抽象类间的使用还挺类似的，于是有了这一段的一个分析。

+ 接口：创建了一个新的名字，可以在其他任何地方使用，错误信息会使用到，另一个就是接口可以扩展；

+ 类型别名：没有创建新名字，当错误信息显示时，会出现对象字面量类型，且类型不可 extends 和 implements；
+ 抽象类：对一些具有类似状态的类的抽象，描述属性和方法，抽象类可以包含成员的实现细节，但抽象方法必须在派生类中实现。

接口是个集合，对对象的行为进行一个约束，可以定义方法，但不涉及具体实现，是设计结果；

而抽象类是一个类，要被子类继承，是重构结果。

更多具体描述可以参考[接口和抽象类有什么区别？](https://www.zhihu.com/question/20149818)

Man、Woman、Child 可以抽象出 People 这个抽象类；

Man、Woman、Child 可以实现 Sleep 这个接口；

可以通过工厂函数接收参数 type People = (new () => Man | Woman | Child) 的联合类型，返回创建的实例对象。

## 9. 总结

项目中用到的一些 ts 知识就这么多，本人水平也有限，文中如有错误恳请大家斧正，共同进步。