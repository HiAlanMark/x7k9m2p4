package main

import (
	"context"

	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct — Wails Bind 到前端的方法集合
type App struct {
	ctx context.Context
}

// NewApp creates a new App
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// domReady is called after front-end DOM is ready
func (a *App) domReady(ctx context.Context) {
	// 前端 DOM 就绪后显示窗口（配合 StartHidden 消除白屏）
	wailsRuntime.WindowShow(ctx)
}

// beforeClose is called before the app closes
func (a *App) beforeClose(ctx context.Context) bool {
	return false // 允许关闭
}

// === 前端可调用的窗口控制方法 ===

// WindowMinimize 最小化窗口
func (a *App) WindowMinimize() {
	wailsRuntime.WindowMinimise(a.ctx)
}

// WindowMaximize 切换最大化
func (a *App) WindowMaximize() {
	wailsRuntime.WindowToggleMaximise(a.ctx)
}

// WindowClose 关闭窗口
func (a *App) WindowClose() {
	wailsRuntime.Quit(a.ctx)
}

// WindowIsMaximized 检查是否最大化
func (a *App) WindowIsMaximized() bool {
	return wailsRuntime.WindowIsMaximised(a.ctx)
}
