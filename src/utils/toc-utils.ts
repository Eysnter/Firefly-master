/**
 * TOC (Table of Contents) 工具类
 * 用于 SidebarTOC 和 FloatingTOC 的共享逻辑
 */

import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";

export interface TOCConfig {
	contentId: string;
	indicatorId: string;
	maxLevel?: number;
	scrollOffset?: number;
}

interface TOCGroup {
	heading: HTMLElement;
	depth: number;
	id: string;
	children: TOCGroup[];
}

export class TOCManager {
	private tocItems: HTMLElement[] = [];
	private observer: IntersectionObserver | null = null;
	private minDepth = 10;
	private maxLevel: number;
	private scrollTimeout: number | null = null;
	private contentId: string;
	private indicatorId: string;
	private scrollOffset: number;
	private collapsedIds: Set<string> = new Set();

	constructor(config: TOCConfig) {
		this.contentId = config.contentId;
		this.indicatorId = config.indicatorId;
		this.maxLevel = config.maxLevel || 3;
		this.scrollOffset = config.scrollOffset || 80;
	}

	// ==================== 基础工具方法 ====================

	private getContentContainer(): Element | null {
		return (
			document.querySelector(".custom-md") ||
			document.querySelector(".prose") ||
			document.querySelector(".markdown-content")
		);
	}

	private getAllHeadings(): HTMLElement[] {
		const contentContainer = this.getContentContainer();
		if (!contentContainer) return [];
		return Array.from(
			contentContainer.querySelectorAll("h1, h2, h3, h4, h5, h6"),
		);
	}

	private calculateMinDepth(headings: HTMLElement[]): number {
		let minDepth = 10;
		headings.forEach((heading) => {
			const depth = Number.parseInt(heading.tagName.charAt(1), 10);
			minDepth = Math.min(minDepth, depth);
		});
		return minDepth;
	}

	private filterHeadings(headings: HTMLElement[]): HTMLElement[] {
		return Array.from(headings).filter((heading) => {
			const depth = Number.parseInt(heading.tagName.charAt(1), 10);
			return depth < this.minDepth + this.maxLevel;
		});
	}

	private getCleanTextContent(element: HTMLElement): string {
		const clone = element.cloneNode(true) as HTMLElement;
		for (const el of clone.querySelectorAll("script, style")) {
			el.remove();
		}
		return clone.textContent || "";
	}

	private escapeHtmlAttr(value: string): string {
		return value
			.replace(/&/g, "&amp;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	}

	private generateBadgeContent(depth: number, heading1Count: number): string {
		const rel = depth - this.minDepth;
		if (rel === 0) {
			return `<span class="toc-badge w-5 h-5 rounded-full bg-[var(--toc-badge-bg,#fde8eb)] text-[var(--primary)] text-[10px] font-bold">${heading1Count}</span>`;
		}
		if (rel === 1) {
			return '<span class="w-1.5 h-1.5 rounded-full bg-[var(--primary)] flex-shrink-0"></span>';
		}
		if (rel === 2) {
			return '<span class="w-2.5 h-2.5 rounded-full border border-[var(--primary)] bg-white flex-shrink-0"></span>';
		}
		if (rel === 3) {
			return '<span class="text-gray-400 text-[10px] flex-shrink-0">-</span>';
		}
		if (rel === 4) {
			return '<span class="text-gray-400 text-[10px] flex-shrink-0">•</span>';
		}
		return '<span class="text-[var(--primary)] text-[9px] flex-shrink-0">*</span>';
	}

	private getEmptyStateHTML(): string {
		return `<div class="text-center py-8 text-gray-500 dark:text-gray-400"><p>${i18n(I18nKey.tocEmpty)}</p></div>`;
	}

	private getHeadingText(heading: HTMLElement): string {
		let text = this.getCleanTextContent(heading)
			.replace(/#+\s*$/, "")
			.trim();

		if (!text) {
			const dataSubtitles = heading.getAttribute("data-subtitles");
			if (dataSubtitles) {
				try {
					const subtitles = JSON.parse(dataSubtitles);
					text = Array.isArray(subtitles) ? subtitles[0] : subtitles;
				} catch {
					// ignore
				}
			}
		}

		if (!text) {
			text =
				heading.id === "banner-subtitle"
					? "Banner Subtitle"
					: heading.id || "Heading";
		}

		return text;
	}

	// ==================== 树形分组 ====================

	private buildTOCGroups(headings: HTMLElement[]): TOCGroup[] {
		const groups: TOCGroup[] = [];
		let currentGroup: TOCGroup | null = null;

		headings.forEach((heading) => {
			const depth = Number.parseInt(heading.tagName.charAt(1), 10);
			if (!heading.id) return;

			const group: TOCGroup = {
				heading,
				depth,
				id: heading.id,
				children: [],
			};

			if (depth === this.minDepth) {
				groups.push(group);
				currentGroup = group;
			} else if (currentGroup) {
				let parent = currentGroup;
				while (parent.children.length > 0) {
					const lastChild = parent.children[parent.children.length - 1];
					if (lastChild.depth < depth) {
						parent = lastChild;
					} else {
						break;
					}
				}
				parent.children.push(group);
			}
		});

		return groups;
	}

	// ==================== HTML 渲染 ====================

	/**
	 * 渲染单个 TOC 项（无子级）
	 */
	private renderItem(heading: HTMLElement, depth: number, heading1Count: number): string {
		const depthLevel = depth - this.minDepth;
		const badgeContent = this.generateBadgeContent(depth, heading1Count);
		const text = this.getHeadingText(heading);
		const escaped = this.escapeHtmlAttr(text);
		const textSize = depthLevel >= 4 ? "text-[11px]" : depthLevel >= 2 ? "text-xs" : "text-sm";
		const textColor = depthLevel >= 3 ? "text-gray-400" : depthLevel >= 1 ? "text-gray-500" : "text-gray-700";
		const italic = depthLevel >= 5 ? " italic" : "";
		const fontWeight = depthLevel <= 1 ? " font-medium" : "";
		const padding = depthLevel >= 4 ? "p-1" : depthLevel >= 2 ? "p-1.5" : "p-2";

		return `
        <li class="toc-item" data-heading-id="${heading.id}">
          <div class="toc-link-wrapper ${padding} rounded-lg" data-target="${heading.id}">
            <a href="#${heading.id}" class="toc-link flex items-center gap-${depthLevel >= 3 ? "1.5" : "2"} flex-1 min-w-0 pr-2" aria-label="${escaped}" title="${escaped}">
              ${badgeContent}
              <span class="toc-link-text ${textSize} ${textColor}${italic}${fontWeight} truncate">${text}</span>
            </a>
          </div>
        </li>`;
	}

	/**
	 * 渲染可折叠的分组（有子级）
	 */
	private renderGroup(group: TOCGroup, heading1Count: number): string {
		const hasChildren = group.children.length > 0;

		if (!hasChildren) {
			return this.renderItem(group.heading, group.depth, heading1Count);
		}

		const depthLevel = group.depth - this.minDepth;
		const badgeContent = this.generateBadgeContent(group.depth, heading1Count);
		const text = this.getHeadingText(group.heading);
		const escaped = this.escapeHtmlAttr(text);
		const isCollapsed = this.collapsedIds.has(group.id);
		const isExpanded = !isCollapsed;
		const textSize = depthLevel >= 4 ? "text-[11px]" : depthLevel >= 2 ? "text-xs" : "text-sm";
		const textColor = depthLevel >= 3 ? "text-gray-400" : depthLevel >= 1 ? "text-gray-500" : "text-gray-700";
		const fontWeight = depthLevel <= 1 ? " font-medium" : "";
		const padding = depthLevel >= 4 ? "p-1" : depthLevel >= 2 ? "p-1.5" : "p-2";
		const arrowSize = depthLevel >= 3 ? "w-2.5 h-2.5" : "w-3.5 h-3.5";
		const btnPadding = depthLevel >= 3 ? "p-0.5" : "p-1";

		// 子项 HTML
		const childrenHtml = group.children
			.map((child) => this.renderGroup(child, 0))
			.join("");

		return `
        <li class="toc-item has-sub${isExpanded ? " expanded" : ""}" data-heading-id="${group.id}">
          <div class="toc-link-wrapper ${padding} rounded-lg" data-target="${group.heading.id}">
            <a href="#${group.heading.id}" class="toc-link flex items-center gap-${depthLevel >= 3 ? "1.5" : "2"} flex-1 min-w-0 pr-2" aria-label="${escaped}" title="${escaped}">
              ${badgeContent}
              <span class="toc-link-text ${textSize} ${textColor}${fontWeight} truncate">${text}</span>
            </a>
            <button class="arrow-btn ${btnPadding} rounded-md" data-collapse-id="${group.id}" aria-label="Toggle">
              <svg class="arrow-icon ${arrowSize} stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          <div class="toc-sub-wrapper">
            <div class="toc-sub-content">
              <ul class="space-y-1">${childrenHtml}</ul>
            </div>
          </div>
        </li>`;
	}

	public generateTOCHTML(): string {
		const headings = this.getAllHeadings();

		if (headings.length === 0) {
			return this.getEmptyStateHTML();
		}

		this.minDepth = this.calculateMinDepth(headings);
		const filteredHeadings = this.filterHeadings(headings);

		if (filteredHeadings.length === 0) {
			return this.getEmptyStateHTML();
		}

		const groups = this.buildTOCGroups(filteredHeadings);

		let tocHTML = "";
		let heading1Count = 1;

		groups.forEach((group) => {
			tocHTML += this.renderGroup(group, heading1Count);
			heading1Count++;
		});

		tocHTML += `<div id="${this.indicatorId}" style="opacity: 0;" class="toc-active-indicator"></div>`;

		return tocHTML;
	}

	// ==================== 折叠/展开 ====================

	private notifyScrollResize(): void {
		const tocContent = document.getElementById(this.contentId);
		if (!tocContent) return;

		const scrollContainer = tocContent.closest(".toc-scroll-container") as HTMLElement | null;
		if (!scrollContainer) return;

		scrollContainer.offsetHeight;
		window.dispatchEvent(new Event("resize"));
	}

	private toggleCollapse(id: string): void {
		const tocContent = document.getElementById(this.contentId);
		if (!tocContent) return;

		const itemEl = tocContent.querySelector(
			`.toc-item[data-heading-id="${id}"]`,
		) as HTMLElement | null;
		if (!itemEl) return;

		const isExpanded = itemEl.classList.contains("expanded");

		if (isExpanded) {
			// ── 折叠 ──
			this.collapsedIds.add(id);
			itemEl.classList.remove("expanded");
		} else {
			// ── 展开 ──
			this.collapsedIds.delete(id);
			itemEl.classList.add("expanded");

			// 恢复子项之前的折叠状态
			const childItems = itemEl.querySelectorAll(
				":scope > .toc-sub-wrapper > .toc-sub-content .toc-item.has-sub",
			);
			childItems.forEach((child) => {
				const childId = child.getAttribute("data-heading-id");
				if (childId && this.collapsedIds.has(childId)) {
					child.classList.remove("expanded");
				}
			});
		}

		this.saveCollapsedState(tocContent);
		setTimeout(() => this.notifyScrollResize(), 310);
	}

	/**
	 * 展开所有分组
	 */
	public expandAll(): void {
		const tocContent = document.getElementById(this.contentId);
		if (!tocContent) return;

		this.collapsedIds.clear();
		tocContent.querySelectorAll(".toc-item.has-sub").forEach((item) => {
			item.classList.add("expanded");
		});
		this.saveCollapsedState(tocContent);
		this.notifyScrollResize();
	}

	/**
	 * 折叠所有分组
	 */
	public collapseAll(): void {
		const tocContent = document.getElementById(this.contentId);
		if (!tocContent) return;

		tocContent.querySelectorAll(".toc-item.has-sub").forEach((item) => {
			const id = item.getAttribute("data-heading-id");
			if (id) {
				this.collapsedIds.add(id);
				item.classList.remove("expanded");
			}
		});
		this.saveCollapsedState(tocContent);
		this.notifyScrollResize();
	}

	private saveCollapsedState(container: HTMLElement | null): void {
		if (!container) return;
		container.setAttribute(
			"data-collapsed",
			JSON.stringify(Array.from(this.collapsedIds)),
		);
	}

	private restoreCollapsedState(container: HTMLElement): void {
		const saved = container.getAttribute("data-collapsed");
		if (saved) {
			try {
				const ids = JSON.parse(saved) as string[];
				this.collapsedIds = new Set(ids);
			} catch {
				this.collapsedIds = new Set();
			}
		}
	}

	// ==================== 事件绑定 ====================

	private setupEventDelegation(): void {
		if (window._tocDelegationBound) return;
		window._tocDelegationBound = true;

		document.body.addEventListener("click", (e) => {
			const clickTarget = e.target as HTMLElement;

			const tocContent = clickTarget.closest(`#${this.contentId}`);
			if (!tocContent) return;

			// ── 路径 A：点击了折叠箭头 ──
			const arrow = clickTarget.closest(".arrow-btn") as HTMLElement | null;
			if (arrow) {
				e.preventDefault();
				e.stopPropagation();
				const collapseId = arrow.getAttribute("data-collapse-id");
				if (collapseId) {
					window.tocInternalNavigation = true;
					this.toggleCollapse(collapseId);
				}
				return;
			}

			// ── 路径 B：点击了链接行 ──
			const wrapper = clickTarget.closest(".toc-link-wrapper") as HTMLElement | null;
			if (wrapper) {
				e.preventDefault();
				const anchor = wrapper.querySelector("a.toc-link") as HTMLAnchorElement | null;
				if (anchor) {
					window.tocInternalNavigation = true;
					this.navigateToHeading(anchor);
				}
			}
		});
	}

	private navigateToHeading(anchor: HTMLAnchorElement): void {
		const href = anchor.getAttribute("href");
		if (!href) return;

		const id = decodeURIComponent(href.substring(1));
		const targetElement = document.getElementById(id);

		if (targetElement) {
			const targetTop =
				targetElement.getBoundingClientRect().top +
				window.pageYOffset -
				this.scrollOffset;

			window.scrollTo({
				top: targetTop,
				behavior: "smooth",
			});
		}
	}

	// ==================== 活动状态跟踪 ====================

	public updateTOCContent(): void {
		const tocContent = document.getElementById(this.contentId);
		if (!tocContent) return;

		this.restoreCollapsedState(tocContent);
		tocContent.innerHTML = this.generateTOCHTML();

		// 渲染后，根据 collapsedIds 恢复展开/折叠状态
		this.collapsedIds.forEach((id) => {
			const item = tocContent.querySelector(`.toc-item[data-heading-id="${id}"]`);
			item?.classList.remove("expanded");
		});

		this.tocItems = Array.from(
			tocContent.querySelectorAll(".toc-link-wrapper[data-target]"),
		);

		if (this.collapsedIds.size > 0) {
			requestAnimationFrame(() => this.notifyScrollResize());
		}
	}

	private getVisibleHeadingIds(): string[] {
		const headings = this.getAllHeadings();
		const visibleHeadingIds: string[] = [];

		headings.forEach((heading) => {
			if (heading.id) {
				const rect = heading.getBoundingClientRect();
				const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
				if (isVisible) {
					visibleHeadingIds.push(heading.id);
				}
			}
		});

		if (visibleHeadingIds.length === 0 && headings.length > 0) {
			let closestHeading: string | null = null;
			let minDistance = Number.POSITIVE_INFINITY;

			headings.forEach((heading) => {
				if (heading.id) {
					const rect = heading.getBoundingClientRect();
					const distance = Math.abs(rect.top);
					if (distance < minDistance) {
						minDistance = distance;
						closestHeading = heading.id;
					}
				}
			});

			if (closestHeading) {
				visibleHeadingIds.push(closestHeading);
			}
		}

		return visibleHeadingIds;
	}

	public updateActiveState(): void {
		if (!this.tocItems || this.tocItems.length === 0) return;

		this.tocItems.forEach((item) => {
			item.classList.remove("active");
		});

		const visibleHeadingIds = this.getVisibleHeadingIds();

		const activeItems = this.tocItems.filter((item) => {
			const targetId = item.dataset.target;
			return targetId && visibleHeadingIds.includes(targetId);
		});

		activeItems.forEach((item) => {
			item.classList.add("active");

			// 智能递归展开：确保所有父级菜单展开，使当前高亮项可见
			let parent = item.closest(".toc-item");
			while (parent) {
				const parentGroup = parent.parentElement?.closest(".toc-item.has-sub");
				if (parentGroup) {
					if (!parentGroup.classList.contains("expanded")) {
						const parentId = parentGroup.getAttribute("data-heading-id");
						if (parentId) {
							this.collapsedIds.delete(parentId);
							parentGroup.classList.add("expanded");
						}
					}
					parent = parentGroup;
				} else {
					break;
				}
			}
		});

		// 合并高亮条 + 滚动到可见
		this.updateActiveIndicator(activeItems);
	}

	private updateActiveIndicator(activeItems: HTMLElement[]): void {
		const indicator = document.getElementById(this.indicatorId);
		if (!indicator) return;

		if (activeItems.length === 0) {
			indicator.style.opacity = "0";
			return;
		}

		const tocContent = document.getElementById(this.contentId);
		if (!tocContent) return;

		const scrollContainer = tocContent.closest(".toc-scroll-container") as HTMLElement | null;
		const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

		const firstActive = activeItems[0];
		const lastActive = activeItems[activeItems.length - 1];

		const top = (firstActive as HTMLElement).offsetTop - scrollTop;
		const height = (lastActive as HTMLElement).offsetTop + (lastActive as HTMLElement).offsetHeight - (firstActive as HTMLElement).offsetTop;

		indicator.style.top = `${top}px`;
		indicator.style.height = `${height}px`;
		indicator.style.opacity = "1";

		this.scrollToActiveItem(firstActive);
	}

	private scrollToActiveItem(activeItem: HTMLElement): void {
		if (!activeItem) return;

		const tocContainer = document
			.querySelector(`#${this.contentId}`)
			?.closest(".toc-scroll-container");
		if (!tocContainer) return;

		if (this.scrollTimeout) {
			clearTimeout(this.scrollTimeout);
		}

		this.scrollTimeout = window.setTimeout(() => {
			const containerRect = tocContainer.getBoundingClientRect();
			const itemRect = activeItem.getBoundingClientRect();

			const isVisible =
				itemRect.top >= containerRect.top &&
				itemRect.bottom <= containerRect.bottom;

			if (!isVisible) {
				const itemOffsetTop = (activeItem as HTMLElement).offsetTop;
				const containerHeight = tocContainer.clientHeight;
				const itemHeight = activeItem.clientHeight;

				const targetScroll =
					itemOffsetTop - containerHeight / 2 + itemHeight / 2;

				tocContainer.scrollTo({
					top: targetScroll,
					behavior: "smooth",
				});
			}
		}, 100);
	}

	public setupObserver(): void {
		const headings = this.getAllHeadings();

		if (this.observer) {
			this.observer.disconnect();
		}

		this.observer = new IntersectionObserver(
			() => {
				this.updateActiveState();
			},
			{
				rootMargin: "0px 0px 0px 0px",
				threshold: 0,
			},
		);

		headings.forEach((heading) => {
			if (heading.id) {
				this.observer?.observe(heading);
			}
		});

		// TOC 容器滚动时重算指示器位置
		const tocContent = document.getElementById(this.contentId);
		const scrollContainer = tocContent?.closest(".toc-scroll-container") as HTMLElement | null;
		if (scrollContainer) {
			scrollContainer.addEventListener("scroll", () => this.updateActiveState(), { passive: true });
		}
	}

	public cleanup(): void {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
		if (this.scrollTimeout) {
			clearTimeout(this.scrollTimeout);
			this.scrollTimeout = null;
		}
	}

	public init(): void {
		this.updateTOCContent();
		this.setupEventDelegation();
		this.setupObserver();
		this.updateActiveState();
	}
}

export function isPostPage(): boolean {
	return window.location.pathname.includes("/posts/");
}
