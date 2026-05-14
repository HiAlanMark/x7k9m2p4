//go:build windows

package main

import (
	"log"
	"syscall"
	"time"
	"unsafe"
)

var (
	user32                   = syscall.NewLazyDLL("user32.dll")
	gdi32                    = syscall.NewLazyDLL("gdi32.dll")
	procFindWindow           = user32.NewProc("FindWindowW")
	procGetWindowLong        = user32.NewProc("GetWindowLongPtrW")
	procSetWindowLong        = user32.NewProc("SetWindowLongPtrW")
	procSetWindowPos         = user32.NewProc("SetWindowPos")
	procShowWindow           = user32.NewProc("ShowWindow")
	procGetForegroundWindow  = user32.NewProc("GetForegroundWindow")
	procIsZoomed             = user32.NewProc("IsZoomed")
	procReleaseCapture       = user32.NewProc("ReleaseCapture")
	procSendMessage          = user32.NewProc("SendMessageW")
	procSetClassLongPtr      = user32.NewProc("SetClassLongPtrW")
	procGetClassLongPtr      = user32.NewProc("GetClassLongPtrW")
	procCreateSolidBrush     = gdi32.NewProc("CreateSolidBrush")
	procEnumWindows          = user32.NewProc("EnumWindows")
	procGetWindowThreadProcessId = user32.NewProc("GetWindowThreadProcessId")
	procIsWindowVisible      = user32.NewProc("IsWindowVisible")
)

const (
	gwlStyle    uintptr = ^uintptr(15) // -16
	gclHbrBackground uintptr = ^uintptr(9) // -10

	wsCaption     = 0x00C00000
	wsSysMenu     = 0x00080000
	wsThickFrame  = 0x00040000
	wsMinimizeBox = 0x00020000
	wsMaximizeBox = 0x00010000

	swpFrameChanged  = 0x0020
	swpNoMove        = 0x0002
	swpNoSize        = 0x0001
	swpNoZOrder      = 0x0004
	swpNoOwnerZOrder = 0x0200

	swMinimize = 6
	swMaximize = 3
	swRestore  = 9
	swHide     = 0
	swShow     = 5

	wmSysCommand = 0x0112
	scMove       = 0xF010
)

var cachedHwnd uintptr

func findHiXNSWindow() uintptr {
	if cachedHwnd != 0 {
		return cachedHwnd
	}

	// 先按标题查找
	title, _ := syscall.UTF16PtrFromString("Hi!XNS")
	hwnd, _, _ := procFindWindow.Call(0, uintptr(unsafe.Pointer(title)))
	if hwnd != 0 {
		cachedHwnd = hwnd
		return hwnd
	}

	// 回退：枚举当前进程的所有窗口
	pid := syscall.Getpid()
	procEnumWindows.Call(
		syscall.NewCallback(func(hwnd uintptr, lParam uintptr) uintptr {
			var windowPid uint32
			procGetWindowThreadProcessId.Call(hwnd, uintptr(unsafe.Pointer(&windowPid)))
			if int(windowPid) == pid {
				visible, _, _ := procIsWindowVisible.Call(hwnd)
				if visible != 0 {
					cachedHwnd = hwnd
					return 0 // 停止枚举
				}
			}
			return 1 // 继续
		}),
		0,
	)

	return cachedHwnd
}

// setWindowBackgroundBlack 设置窗口背景为黑色（消除白屏闪烁）
func setWindowBackgroundBlack() {
	// 等待窗口创建
	for i := 0; i < 50; i++ {
		hwnd := findHiXNSWindow()
		if hwnd != 0 {
			// 创建黑色画刷
			blackBrush, _, _ := procCreateSolidBrush.Call(0x00000000) // RGB(0,0,0)
			if blackBrush != 0 {
				procSetClassLongPtr.Call(hwnd, gclHbrBackground, blackBrush)
			}
			log.Println("[Hi!XNS] 窗口背景已设为黑色")
			return
		}
		time.Sleep(50 * time.Millisecond)
	}
}

// removeWindowFrame 去掉系统标题栏
func removeWindowFrame() {
	hwnd := findHiXNSWindow()
	if hwnd == 0 {
		log.Println("[Hi!XNS] 未找到窗口句柄")
		return
	}

	style, _, _ := procGetWindowLong.Call(hwnd, gwlStyle)
	newStyle := style &^ wsCaption &^ wsSysMenu
	newStyle = newStyle | wsThickFrame | wsMinimizeBox | wsMaximizeBox

	procSetWindowLong.Call(hwnd, gwlStyle, newStyle)
	procSetWindowPos.Call(hwnd, 0, 0, 0, 0, 0,
		swpFrameChanged|swpNoMove|swpNoSize|swpNoZOrder|swpNoOwnerZOrder)

	log.Println("[Hi!XNS] 系统标题栏已移除")
}

func minimizeWindow() {
	hwnd := findHiXNSWindow()
	if hwnd != 0 {
		procShowWindow.Call(hwnd, swMinimize)
	}
}

func toggleMaximizeWindow() {
	hwnd := findHiXNSWindow()
	if hwnd == 0 {
		return
	}
	isMax, _, _ := procIsZoomed.Call(hwnd)
	if isMax != 0 {
		procShowWindow.Call(hwnd, swRestore)
	} else {
		procShowWindow.Call(hwnd, swMaximize)
	}
}

// startDragWindow 通过 WM_SYSCOMMAND + SC_MOVE 启动原生拖拽
func startDragWindow() {
	hwnd := findHiXNSWindow()
	if hwnd == 0 {
		return
	}
	procReleaseCapture.Call()
	// SC_MOVE + 2 = 从当前鼠标位置开始拖拽
	procSendMessage.Call(hwnd, wmSysCommand, scMove+2, 0)
}
