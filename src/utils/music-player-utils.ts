/**
 * 音乐播放器纯工具函数
 * 供 TypeScript 消费者使用（类型安全、可测试）
 * 注意：这些函数的等价版本也内联在 GlobalAudio.astro 的 is:inline 脚本中
 */

export interface LyricLine {
	time: number
	text: string
	translation: string
	words: { time: number; text: string }[] | null
}

/**
 * 解析 LRC 格式歌词，支持逐字同步和翻译
 */
export function parseLyrics(lrcText: string): LyricLine[] {
	const lines = lrcText.split('\n')
	const result: LyricLine[] = []
	const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

	const tempLines: { time: number; text: string; words: { time: number; text: string }[] | null; original: string }[] = []

	for (const line of lines) {
		const cleanLine = line.trim()
		if (!cleanLine) continue

		const match = timeReg.exec(cleanLine)
		if (match) {
			const min = parseInt(match[1])
			const sec = parseInt(match[2])
			const ms = parseInt(match[3].padEnd(3, '0'))
			const time = min * 60 + sec + ms / 1000

			const textInfo = cleanLine.replace(timeReg, '').trim()

			// 逐字同步解析 <mm:ss.xx>word
			const wordLevelReg = /<(\d{2}):(\d{2})\.(\d{2,3})>([^<]*)/g
			const words: { time: number; text: string }[] = []
			let wordMatch
			let hasWordLevel = false

			while ((wordMatch = wordLevelReg.exec(textInfo)) !== null) {
				hasWordLevel = true
				const wMin = parseInt(wordMatch[1])
				const wSec = parseInt(wordMatch[2])
				const wMs = parseInt(wordMatch[3].padEnd(3, '0'))
				const wTime = wMin * 60 + wSec + wMs / 1000
				const wText = wordMatch[4]
				if (wText) {
					words.push({ time: wTime, text: wText })
				}
			}

			const cleanText = textInfo.replace(/<\d{2}:\d{2}\.\d{2,3}>/g, '')

			tempLines.push({
				time,
				text: cleanText,
				words: hasWordLevel ? words : null,
				original: cleanLine,
			})
		}
	}

	// 合并相同时间戳的行（原文 + 翻译）
	for (const current of tempLines) {
		if (result.length > 0 && Math.abs(result[result.length - 1].time - current.time) < 0.01) {
			result[result.length - 1].translation = current.text
		} else {
			result.push({
				time: current.time,
				text: current.text,
				translation: '',
				words: current.words,
			})
		}
	}

	return result
}

/**
 * 文本标准化（用于搜索）
 */
export function normalizeSearchText(value: string): string {
	return (value || '').toString().trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * 模糊匹配：query 中每个字符按顺序出现在 source 中即匹配
 */
export function fuzzyMatchText(source: string, query: string): boolean {
	const normalizedSource = normalizeSearchText(source)
	const normalizedQuery = normalizeSearchText(query)

	if (!normalizedQuery) return true
	if (normalizedSource.includes(normalizedQuery)) return true

	let sourceIndex = 0
	for (const character of normalizedQuery) {
		sourceIndex = normalizedSource.indexOf(character, sourceIndex)
		if (sourceIndex === -1) return false
		sourceIndex += 1
	}

	return true
}

/**
 * 格式化秒数为 m:ss
 */
export function formatTime(seconds: number): string {
	if (isNaN(seconds)) return '0:00'
	const min = Math.floor(seconds / 60)
	const sec = Math.floor(seconds % 60)
	return `${min}:${sec.toString().padStart(2, '0')}`
}
