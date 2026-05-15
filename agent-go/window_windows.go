//go:build windows

package main

import (
	"log"
	"syscall"
	"time"
	"unsafe"
)

var (
	user32                       = syscall.NewLazyDLL("user32.dll")
	gdi32                        = syscall.NewLazyDLL("gdi32.dll")
	procFindWindow               = user32.NewProc("FindWindowW")
	procGetWindowLong            = user32.NewProc("GetWindowLongPtrW")
	procSetWindowLong            = user32.NewProc("SetWindowLongPtrW")
	procSetWindowPos             = user32.NewProc("SetWindowPos")
	procShowWindow               = user32.NewProc("ShowWindow")
	procIsZoomed                 = user32.NewProc("IsZoomed")
	procSetClassLongPtr          = user32.NewProc("SetClassLongPtrW")
	procCreateSolidBrush         = gdi32.NewProc("CreateSolidBrush")
	procEnumWindows              = user32.NewProc("EnumWindows")
	procGetWindowThreadProcessId = user32.NewProc("GetWindowThreadProcessId")
	procCallWindowProc           = user32.NewProc("CallWindowProcW")
	procScreenToClient           = user32.NewProc("ScreenToClient")
	procGetClientRect            = user32.NewProc("GetClientRect")
)

const (
	gwlStyle         uintptr = ^uintptr(15) // GWL_STYLE = -16
	gwlWndProc       uintptr = ^uintptr(3)  // GWLP_WNDPROC = -4
	gclHbrBackground uintptr = ^uintptr(9)  // GCL_HBRBACKGROUND = -10

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

	wmNCHitTest   = 0x0084
	wmContextMenu = 0x007B

	htCaption     = 2
	htClient      = 1
	htLeft        = 10
	htRight       = 11
	htTop         = 12
	htTopLeft     = 13
	htTopRight    = 14
	htBottom      = 15
	htBottomLeft  = 16
	htBottomRight = 17
)

type point struct {
	X, Y int32
}

type rect struct {
	Left, Top, Right, Bottom int32
}

var (
	cachedHwnd  uintptr
	origWndProc uintptr
)

// dragRegionHeight 拖拽区域高度（顶部20px）
const dragRegionHeight = 20

// resizeBorderWidth 边框拖拽调整大小的区域宽度
const resizeBorderWidth = 6

// titleBarButtonsWidth 右侧按钮区域宽度（不可拖拽）
const titleBarButtonsWidth = 150

func findHiXNSWindow() uintptr {
	if cachedHwnd != 0 {
		return cachedHwnd
	}

	// 按标题查找
	title, _ := syscall.UTF16PtrFromString("Hi!XNS")
	hwnd, _, _ := procFindWindow.Call(0, uintptr(unsafe.Pointer(title)))
	if hwnd != 0 {
		cachedHwnd = hwnd
		return hwnd
	}

	// 枚举当前进程的所有窗口
	pid := syscall.Getpid()
	procEnumWindows.Call(
		syscall.NewCallback(func(hwnd uintptr, lParam uintptr) uintptr {
			var windowPid uint32
			procGetWindowThreadProcessId.Call(hwnd, uintptr(unsafe.Pointer(&windowPid)))
			if int(windowPid) == pid {
				cachedHwnd = hwnd
				return 0
			}
			return 1
		}),
		0,
	)

	return cachedHwnd
}

// customWndProc 窗口子类化核心
// 1. WM_CONTEXTMENU → 返回0，阻止 WebView2 原生右键菜单
// 2. WM_NCHITTEST → 顶部20px拖拽 + 边缘调整大小
func customWndProc(hwnd, msg, wParam, lParam uintptr) uintptr {
	// 拦截 WM_CONTEXTMENU — 彻底阻止 WebView2 原生右键菜单
	if msg == wmContextMenu {
		return 0
	}

	if msg == wmNCHitTest {
		// 先调用原始窗口过程
		result, _, _ := procCallWindowProc.Call(origWndProc, hwnd, msg, wParam, lParam)

		// 保留原始边框调整大小结果
		if result == htLeft || result == htRight || result == htTop || result == htBottom ||
			result == htTopLeft || result == htTopRight || result == htBottomLeft || result == htBottomRight {
			return result
		}

		// 鼠标屏幕坐标 → 客户区坐标
		var pt point
		pt.X = int32(int16(lParam & 0xFFFF))
		pt.Y = int32(int16((lParam >> 16) & 0xFFFF))
		procScreenToClient.Call(hwnd, uintptr(unsafe.Pointer(&pt)))

		var rc rect
		procGetClientRect.Call(hwnd, uintptr(unsafe.Pointer(&rc)))
		clientW := rc.Right - rc.Left
		clientH := rc.Bottom - rc.Top

		// 边缘 → 调整大小
		if pt.Y < int32(resizeBorderWidth) {
			if pt.X < int32(resizeBorderWidth) {
				return htTopLeft
			}
			if pt.X > clientW-int32(resizeBorderWidth) {
				return htTopRight
			}
			return htTop
		}
		if pt.Y > clientH-int32(resizeBorderWidth) {
			if pt.X < int32(resizeBorderWidth) {
				return htBottomLeft
			}
			if pt.X > clientW-int32(resizeBorderWidth) {
				return htBottomRight
			}
			return htBottom
		}
		if pt.X < int32(resizeBorderWidth) {
			return htLeft
		}
		if pt.X > clientW-int32(resizeBorderWidth) {
			return htRight
		}

		// 顶部 20px（排除右侧按钮区）→ 标题栏拖拽
		if pt.Y < int32(dragRegionHeight) && pt.X < clientW-int32(titleBarButtonsWidth) {
			return htCaption
		}

		return htClient
	}

	ret, _, _ := procCallWindowProc.Call(origWndProc, hwnd, msg, wParam, lParam)
	return ret
}

// setupWindow 一次性完成所有窗口初始化（goroutine 中调用）
// 顺序：等待窗口 → 隐藏 → 黑色背景 → 去标题栏 → 子类化
func setupWindow() {
	// 等待窗口出现
	for i := 0; i < 150; i++ {
		if findHiXNSWindow() != 0 {
			break
		}
		time.Sleep(30 * time.Millisecond)
	}
	if cachedHwnd == 0 {
		log.Println("[Hi!XNS] setupWindow: 超时未找到窗口")
		return
	}

	// 1. 立即隐藏（防止白屏闪烁）
	procShowWindow.Call(cachedHwnd, swHide)
	log.Println("[Hi!XNS] 窗口已隐藏")

	// 2. 黑色背景
	blackBrush, _, _ := procCreateSolidBrush.Call(0x00000000)
	if blackBrush != 0 {
		procSetClassLongPtr.Call(cachedHwnd, gclHbrBackground, blackBrush)
	}

	// 3. 去掉系统标题栏
	style, _, _ := procGetWindowLong.Call(cachedHwnd, gwlStyle)
	newStyle := style &^ wsCaption &^ wsSysMenu
	newStyle = newStyle | wsThickFrame | wsMinimizeBox | wsMaximizeBox
	procSetWindowLong.Call(cachedHwnd, gwlStyle, newStyle)
	procSetWindowPos.Call(cachedHwnd, 0, 0, 0, 0, 0,
		swpFrameChanged|swpNoMove|swpNoSize|swpNoZOrder|swpNoOwnerZOrder)

	// 4. 子类化（WM_NCHITTEST 拖拽 + WM_CONTEXTMENU 拦截）
	origWndProc, _, _ = procGetWindowLong.Call(cachedHwnd, gwlWndProc)
	if origWndProc != 0 {
		newProc := syscall.NewCallback(customWndProc)
		procSetWindowLong.Call(cachedHwnd, gwlWndProc, newProc)
		log.Println("[Hi!XNS] 窗口子类化完成（拖拽+右键拦截）")
	}

	log.Println("[Hi!XNS] 窗口初始化完成，等待前端信号显示")
}

// showWindowWhenReady 前端启动画面就绪后显示窗口
func showWindowWhenReady() {
	hwnd := findHiXNSWindow()
	if hwnd != 0 {
		procShowWindow.Call(hwnd, swShow)
		log.Println("[Hi!XNS] 窗口已显示")
	}
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

// startDragWindow 兼容旧 JS 调用（WM_NCHITTEST 已接管）
func startDragWindow() {}

// removeWindowFrame 兼容旧调用
func removeWindowFrame() {}

// setWindowBackgroundBlack 兼容旧调用
func setWindowBackgroundBlack() {}

// hideWindow 兼容旧调用
func hideWindow() {}
