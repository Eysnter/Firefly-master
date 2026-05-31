---
title: 🚀Anaconda3 终极安装与配置指南（保姆级教程）
published: 2026-05-31
image: 'https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780226217882_Anaconda.jpg'
tags: [Anaconda, 环境搭建, 速查手册]
description: 本教程带你从零开始完美搭建 Anaconda 环境，解决 Python 版本冲突与第三方库安装噩梦，附带 Jupyter 启动教程及常用命令速查手册。
category: 环境搭建
draft: false 
pinned: true
comment: true
lang: zh-CN
---

## 一. 为什么必须用 Anaconda？（三大核心理由）

如果你只用官方的 Python，在面对复杂项目（特别是数据科学和机器学习）时，很快就会遇到版本冲突、配置报错等噩梦。而 Anaconda 正是解决这些痛点的神器：

#### 1. 彻底隔离“环境冲突”

不同的项目往往依赖同一个工具包的不同版本（例如项目 A 需要 TensorFlow 1. x，项目 B 需要 TensorFlow 2. x）。在一台电脑上同时安装它们会导致互相覆盖、代码崩溃。

- **Anaconda 的解法：** 支持创建无数个互相隔离的“虚拟环境”。你可以为不同项目量身定制独立的“房间”，让它们各过各的，互不干扰。

#### 2. 免去复杂的第三方库安装噩梦

Python 许多科学计算库（如 NumPy、SciPy）底层由 C/C++ 甚至 Fortran 编写。在 Windows 上直接用 `pip` 安装时，常因缺少系统编译器或依赖项而弹出满屏红色报错。

- **Anaconda 的解法：** 内置强大的 **Conda 管理器**。它不仅下载 Python 包，还会**自动搞定系统底层的依赖项**，让你用一行命令就能实现无痛安装。

#### 3. 开箱即用，集成顶级工具链

搭建数据科学开发环境往往需要挨个配置各种工具，费时费力。

- **Anaconda 的解法：** 安装后直接自带 **Jupyter Notebook**（交互式笔记利器）、**Spyder** 等顶级 IDE，并默认内置了 NumPy、Pandas、Matplotlib 等数百个最常用的数据科学核心库，省去了大把的环境搭建时间。
  下载链接： https://www.anaconda.com/products/distribution

---

## 二. 下载 [Anaconda](https://www.anaconda.com/products/distribution) 安装程序

### 方式一：

1. 打开 [Anaconda 官方网站](https://www.anaconda.com/products/distribution)。
2. 在页面右上角选择 **开始使用 (Get Started )**，登录后即可点击 **Free Download** 按钮免费下载适合你操作系统的 Anaconda 安装包。
   ![](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780218208117_a1.png)

### 方式二（推荐）：

如果你在官网下载速度较慢，可以从**清华大学开源软件镜像站**下载 `Anaconda `

1. 点击 [**这里**](https://repo.anaconda.com/archive/) 进入清华镜像站。
2. 选择适合你的 Anaconda 版本和操作系统，下载对应的安装包。

\*\*例如: [Anaconda3-2025.12-2-Windows-x86_64.exe](https://repo.anaconda.com/archive/Anaconda3-2025.12-2-Windows-x86_64.exe)

- **Anaconda3**：Anaconda 3. x 版本，支持 Python 3. x。
- **2025. 12-2**：表示此版本发布于 2025 年 12 月
- **Windows-x86_64**：表示这是 Windows 系统的 64 位版本。

![](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780218743350_a2.png)

## 三. 安装 Anaconda 3

#### 1. 运行安装程序

1. 下载完成后，双击 `.exe` 安装文件，启动 Anaconda 安装向导。
2. 在第一个弹出的窗口中点击 **Next**。
   ![a3.png](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780220466953_a3.png)

#### 2. 接受许可协议

- 接下来，阅读并接受许可协议，选择 **I Agree**。
  ![a4.png](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780220463284_a4.png)

#### 3. 选择安装类型

1. 选择 **Just Me (Recommended)** 以在当前用户下安装。
2. 点击 `Next。
   ![a5.png](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780220468897_a5.png)

#### 4. 选择安装路径

1. **安装位置建议**：为了不占用系统盘的空间，推荐将 Anaconda 安装在 `D:\anaconda3` 或 `E:\anaconda3` 这样的非系统盘路径，确保系统盘有足够的剩余空间用于操作系统的正常运行。

2. **路径命名要求**：<font color="#ff0000">严禁安装在含中文的目录</font>,请确保安装路径中不含中文或特殊符号，例如空格、感叹号等，以防止安装过程中出现不必要的问题或软件使用时的兼容性错误。

3. **继续安装**：选择合适的路径后，点击 `Next`，进入下一步的安装配置。
   ![a6.png](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780220467492_a6.png)

#### 5. 安装过程与完成

###### 选择下方的选项

选择适合您需求的选项后，点击 **Install** 开始安装，继续完成 Anaconda 的安装过程。

· 1.**创建快捷方式 (Create shortcuts)** 
· 2.**将 Anaconda 注册为系统环境变量（Register Anaconda as the system Python）**
· 3.**完成安装后清除包缓存 (Clear the package cache upon completion)**

![a7.png](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780220463137_a7.png)

**安装过程比较缓慢，请耐心等待进度条完成**

1. **完成安装**：安装完成后，点击 **Next** 按钮，您可以选择是否查看 Anaconda 的 Release Notes（版本说明），如果不需要查看，可以直接跳过。最后，点击 **Finish**，安装过程就全部结束了。
   ![a8.png](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780220954967_a8.png)

## 四. 配置环境变量

#### 1. 打开系统属性

- 按下键盘上的 **win** 键或者点击 **开始菜单**，在搜索框中输入 **环境变量**。
- 在搜索结果中，点击 **编辑系统环境变量** 选项。

![a9.png](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780221777459_a9.png)

#### 2.进入环境变量：

- 在弹出的系统属性窗口中，点击 **高级** 标签下的 **环境变量** 按钮。

![a10.png](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780221909245_a10.png)

#### 3.编辑系统变量：

- 在环境变量窗口中，找到 **系统变量** 部分，点击 **Path** 变量，然后点击 **编辑**。

![a11.png](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780222208769_a11.png)

#### 4. 添加 Anaconda 路径（所有路径均与安装目录有关）

- 点击 **新建**，并依次添加以下 Anaconda 的安装路径：

```bash
# 记得换成自己的路径
D:\Anaconda3
D:\Anaconda3\pkgs
D:\Anaconda3\Scripts
D:\Anaconda3\Library\bin
D:\Anaconda3\Library\usr\bin
D:\Anaconda3\Library\mingw-w64\bin
```

![a12.png](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780222200515_a12.png)

- 确认路径无误后，点击确定，保存设置

**路径说明：**
`D:\anaconda3：Anaconda` 的主目录，包含 Python 和 Conda 的主文件。
`D:\anaconda3\Scripts`：包含 Conda 和其他实用工具的脚本文件。
`D:\anaconda3\Library\bin`：包含一些库文件，用于运行 Conda 和 Python 应用。
`D:\anaconda3\Library\mingw-w64\bin`（可选）：用于编译 C/C++ 的工具链，如果您不需要编译这类代码，可不添加。
`D:\anaconda3\Library\usr\bin`（可选）：提供类似 UNIX 系统的功能工具，可用于跨平台开发，如果不需要这种功能，可以不添加。

#### 5. 验证配置

- 打开 **命令提示符 (Command Prompt)** 或 **Anaconda Prompt**，输入以下命令以确认环境变量是否正确配置：

```bash
conda --version
```

![a13.png](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780223283987_a13.png)

![a14.png](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780223462948_a14.png)

- 如果显示 `Conda` 的版本号，则表示配置成功。

## 五. 启动 Jupyter Notebook

##### **1.Anaconda Prompt**输入以下命令:

```bash
jupyter notebook
```

![a15.png](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780224091676_a15.png)

##### 2. 复制端口链接到浏览器的地址栏

随后跳转 `Jupyter` 界面后点击右上角 `New` --> `Python3` 就可以愉快写代码了
![a16.png](https://img.eysnter.cn/file/posts/posts1-Template/Anaconda/1780224372227_a16.png)

## 六、 Anaconda 常用命令速查（建议收藏）

在日常开发中，我们不需要死记硬背所有命令，掌握以下最核心的几条，就能轻松玩转 Anaconda。

### 1. 环境管理（最核心）

- **创建新环境：**（以创建一个名为 `my_env`，且 Python 版本为 3.10 的环境为例）

  ```bash
  conda create --name my_env python=3.10
  ```

- **查看所有环境：**（带 `*` 号的代表当前激活的环境）

  ```bash
  conda env list
  ```

- **激活/切换环境：**

  ```bash
  conda activate my_env
  ```

- **退出当前环境：**

  ```bash
  conda deactivate
  ```

- **删除环境：**（连同环境内的所有包一起删除）

  ```bash
  conda remove --name my_env --all
  ```

### 2. 包管理（安装/卸载工具包）

> 💡 **博主提示：** 在操作包之前，请确保你已经用 `conda activate` 切换到了对应的项目环境中，否则会默认安装到基础的 `base` 环境中。

- **安装第三方包：**（例如安装 NumPy）

  ```bash
  conda install numpy
  ```

- **卸载第三方包：**

  ```bash
  conda remove numpy
  ```

- **更新第三方包：**

  ```bash
  conda update numpy
  ```

- **查看当前环境已安装的所有包：**

  ```bash
  conda list
  ```

### 3. 系统与清理

- **清理过期的缓存和未使用的包：**（长期使用后可以释放大量磁盘空间）

  ```bash
  conda clean --all
  ```
