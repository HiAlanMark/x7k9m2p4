//go:build windows

package main

import (
	"log"
	"syscall"
	"unsafe"
)

var (
	user32                  = syscall.NewLazyDLL("user32.dll")
	procFindWindow          = user32.NewProc("FindWindowW")
	procGetWindowLong       = user32.NewProc("GetWindowLongPtrW")
	procSetWindowLong       = user32.NewProc("SetWindowLongPtrW")
	procSetWindowPos        = user32.NewProc("SetWindowPos")
	procShowWindow          = user32.NewProc("ShowWindow")
	procGetForegroundWindow = user32.NewProc("GetForegroundWindow")
	procIsZoomed            = user32.NewProc("IsZoomed")
)

const (
	GWL_STYLE = -16

	WS_CAPTION     = 0x00C00000
	WS_THICKFRAME  = 0x00040000
	WS_SYSMENU     = 0x00080000
	WS_MINIMIZEBOX = 0x00020000
	WS_MAXIMIZEBOX = 0x00010000

	SWP_FRAMECHANGED  = 0x0020
	SWP_NOMOVE        = 0x0002
	SWP_NOSIZE        = 0x0001
	SWP_NOZORDER      = 0x0004
	SWP_NOOWNERZORDER = 0x0200

	SW_MINIMIZE = 6
	SW_MAXIMIZE = 3
	SW_RESTORE  = 9
)

func findHiXNSWindow() uintptr {
	// 先尝试按标题查找
	title, _ := syscall.UTF16PtrFromString("Hi!XNS")
	hwnd, _, _ := procFindWindow.Call(0, uintptr(unsafe.Pointer(title)))
	if hwnd != 0 {
		return hwnd
	}
	// 回退: 使用前台窗口
	hwnd, _, _ = procGetForegroundWindow.Call()
	return hwnd
}

// removeWindowFrame 去掉系统标题栏，保留窗口阴影和圆角
func removeWindowFrame() {
	hwnd := findHiXNSWindow()
	if hwnd == 0 {
		log.Println("[Hi!XNS] 未找到窗口句柄，无法去除标题栏")
		return
	}

	// 获取当前样式
	style, _, _ := procGetWindowLong.Call(hwnd, uintptr(GWL_STYLE))

	// 去掉标题栏但保留边框（用于拖拽调整大小）
	newStyle := style &^ WS_CAPTION &^ WS_SYSMENU
	// 保留 THICKFRAME 用于窗口缩放
	newStyle = newStyle | WS_THICKFRAME | WS_MINIMIZEBOX | WS_MAXIMIZEBOX

	procSetWindowLong.Call(hwnd, uintptr(GWL_STYLE), newStyle)

	// 刷新窗口框架
	procSetWindowPos.Call(hwnd, 0, 0, 0, 0, 0,
		SWP_FRAMECHANGED|SWP_NOMOVE|SWP_NOSIZE|SWP_NOZORDER|SWP_NOOWNERZORDER)

	log.Println("[Hi!XNS] 系统标题栏已移除")
}

// minimizeWindow 最小化窗口
func minimizeWindow() {
	hwnd := findHiXNSWindow()
	if hwnd != 0 {
		procShowWindow.Call(hwnd, SW_MINIMIZE)
	}
}

// toggleMaximizeWindow 切换最大化/还原
func toggleMaximizeWindow() {
	hwnd := findHiXNSWindow()
	if hwnd == 0 {
		return
	}
	isMax, _, _ := procIsZoomed.Call(hwnd)
	if isMax != 0 {
		procShowWindow.Call(hwnd, SW_RESTORE)
	} else {
		procShowWindow.Call(hwnd, SW_MAXIMIZE)
	}
}
