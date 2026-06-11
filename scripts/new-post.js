/* This is a script to create a new post markdown file with front-matter */

import fs from "fs"
import path from "path"

function getDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const args = process.argv.slice(2)

if (args.length === 0) {
  console.error(`Error: No filename argument provided
Usage: npm run new-post -- <filename>`)
  process.exit(1) // Terminate the script and return error code 1
}

let fileName = args[0]

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i
if (!fileExtensionRegex.test(fileName)) {
  fileName += ".md"
}

const targetDir = "./src/content/posts/"
const fullPath = path.join(targetDir, fileName)

if (fs.existsSync(fullPath)) {
  console.error(`Error: File ${fullPath} already exists `)
  process.exit(1)
}

// recursive mode creates multi-level directories
const dirPath = path.dirname(fullPath)
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
}

const content = `---
title: ${args[0]}
published: ${getDate()}
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---
`

fs.writeFileSync(path.join(targetDir, fileName), content)

// 将新文章 ID 追加到 postOrder.json
const postOrderPath = "./src/config/postOrder.json"
const postId = fileName.replace(/\.(md|mdx)$/i, "")
try {
  const raw = JSON.parse(fs.readFileSync(postOrderPath, "utf-8"))
  const order = Array.isArray(raw) ? raw : Object.keys(raw).sort((a, b) => raw[a] - raw[b])
  if (!order.includes(postId)) {
    order.push(postId)
    fs.writeFileSync(postOrderPath, JSON.stringify(order, null, 2) + "\n")
    console.log(`Added "${postId}" to postOrder.json`)
  }
} catch (e) {
  console.warn(`Warning: Could not update postOrder.json: ${e.message}`)
}

console.log(`Post ${fullPath} created`)
