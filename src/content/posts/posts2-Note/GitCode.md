---
title: Git 安装后必备配置与高频核心命令速查指南
published: 2026-05-31
description: 本文介绍 Git 安装后必备的配置和命令，帮助小白快速掌握 Git 的常用命令
image: 'https://img.eysnter.cn/file/posts/posts2-notes/Git/1780206480345_git.png'
tags: [Git, 速查手册]
category: ''
draft: false 
pinned: true
comment: true
lang: zh-CN
---

## 一. 安装 git 后基本配置
#### 绑定Git 的全局用户身份信息
```bash
# 配置全局用户名
git config --global user.name "YourName"
# 配置全局邮箱
git config --global user.email "your@email.com"

#生成多平台专用 SSH 密钥--------------------------------------------------
# 生成 GitHub 专用密钥
ssh-keygen -t ed25519 -C "your@email.com" -f ~/.ssh/id_ed25519_github

# 生成 Gitee 专用密钥
ssh-keygen -t ed25519 -C "your@email.com" -f ~/.ssh/id_ed25519_gitee

# 查看所有配置
git config –-list
```
![git2.png](https://img.eysnter.cn/file/posts/posts2-notes/Git/1780210753680_git2.png)

#### 配置 config 文件
**进阶提示**：生成多个 SSH 密钥后，建议在 `~/.ssh/` 目录下创建一个 `config` 文件来管理它们，否则系统默认只会读取 `id_rsa` 或 `id_ed25519`
```bash
# GitHub
Host github.com
    HostName github.com
    IdentityFile ~/.ssh/id_ed25519_github

# Gitee
Host gitee.com
    HostName gitee.com
    IdentityFile ~/.ssh/id_ed25519_gitee
```

##  二、常用 Git 命令
#### 1. 初始化与克隆
```bash
# 在当前目录初始化一个新的 Git 仓库。
git init

# 克隆一个远程仓库到本地 
git clone <远程仓库URL>
```

#### 2. 工作区与暂存区操作
```bash
# 查看当前工作区和暂存区的状态
git status

# 将指定文件添加到暂存区（. 代表添加所有修改和未追踪的文件） 
git add <文件名> 
git add .

# 将暂存区的内容提交到本地仓库 
git commit -m "提交日志说明"
```

#### 3. 分支管理
```bash
# 查看本地分支（-a 查看本地和远程的所有分支）
git branch
git branch -a

# 创建新分支
git branch <分支名>

# 切换到指定分支
git checkout <分支名>
# 或者使用新命令：
git switch <分支名>

# 创建并直接切换到新分支
git checkout -b <分支名>
# 或者使用新命令：
git switch -c <分支名>

# 将指定分支合并到当前分支
git merge <分支名>

# 删除本地分支
git branch -d <分支名>
```

#### 4. 远程同步
```bash
# 从远程仓库获取最新版本，但不自动合并
git fetch

# 从远程仓库获取最新版本并直接合并到本地当前分支
git pull

# 将本地分支的更新推送到远程仓库
git push <远程主机名> <本地分支名>
# 例如：git push origin main
```

#### 5. 撤销与日志查看 
```bash
# 查看提交历史记录
git log --oneline  # 一行显示，更清爽

# 查看命令历史（常用于找回误删的提交或分支）
git reflog

# 版本回退（强制重置工作区和暂存区到指定的 CommitID）
git reset --hard <CommitID>
```

### 三、状态与信息查看指令（确认状态再动手）

#### 1. 查看当前状态
```bash
# 查看工作区和暂存区最详细的状态（有哪些文件被修改了、哪些未追踪）
git status

# 查看简短的状态结果（更清爽，文件前面会显示 M、?? 等状态符号）
git status -s
```

#### 2. 查看分支与远程信息
```bash
# 查看所有本地分支（当前所在分支前面会有 * 号并高亮）
git branch

# 查看所有分支（包括本地分支和远程分支，远程分支通常显示为红色）
git branch -a

# 查看本地分支与远程分支的追踪/绑定关系
git branch -vv

# 查看配置的远程仓库别名和对应的 URL 地址（常用于确认有没有关联错 GitHub/Gitee）
git remote -v
```

#### 3. 查看提交历史与日志
```bash
# 查看详细的提交历史（包含作者、日期、完整的 CommitID 和提交日志）
git log

# 精简查看：每条提交记录只占一行（显示简短 CommitID 和日志，极力推荐！）
git log --oneline

# 查看最近的 N 条提交历史（例如查看最近 3 条：git log -3 --oneline）
git log -n <数量> --oneline

# 图形化查看分支合并历史拓扑图（非常直观地看到分支是在哪里分叉和合并的）
git log --oneline --graph --all
```

#### 4. 查看代码修改差异（Diff）
```Bash
# 查看工作区（当前修改）与暂存区（上一次 add）之间的具体代码差异
git diff

# 查看暂存区（add 之后）与上一次提交（HEAD）之间的代码差异
git diff --cached

# 查看两个不同分支之间的代码差异
git diff <分支名1> <分支名2>
```

#### 5. 查看配置信息
```Bash
# 查看当前所有的 Git 配置信息（包括用户名、邮箱、核心设置等）
git config --list

# 只查看全局（global）层面的配置
git config --global --list
```