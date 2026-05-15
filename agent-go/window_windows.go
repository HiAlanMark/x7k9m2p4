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

type point struct{ X, Y int32 }
type rect struct{ Left, Top, Right, Bottom int32 }

var (
	cachedHwnd  uintptr
	origWndProc uintptr
)

const (
	dragRegionHeight    = 20
	resizeBorderWidth   = 6
	titleBarButtonsWidth = 150
)

func findHiXNSWindow() uintptr {
	if cachedHwnd != 0 {
		return cachedHwnd
	}
	title, _ := syscall.UTF16PtrFromString("Hi!XNS")
	hwnd, _, _ := procFindWindow.Call(0, uintptr(unsafe.Pointer(title)))
	if hwnd != 0 {
		cachedHwnd = hwnd
		return hwnd
	}
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

// customWndProc 窗口子类化
// WM_NCHITTEST: 顶部20px拖拽 + 边缘调整大小
// WM_CONTEXTMENU: 拦截 Win32 层右键菜单（兜底，主要靠 COM 禁用）
func customWndProc(hwnd, msg, wParam, lParam uintptr) uintptr {
	if msg == wmContextMenu {
		return 0
	}

	if msg == wmNCHitTest {
		result, _, _ := procCallWindowProc.Call(origWndProc, hwnd, msg, wParam, lParam)
		if result >= htLeft && result <= htBottomRight {
			return result
		}

		var pt point
		pt.X = int32(int16(lParam & 0xFFFF))
		pt.Y = int32(int16((lParam >> 16) & 0xFFFF))
		procScreenToClient.Call(hwnd, uintptr(unsafe.Pointer(&pt)))

		var rc rect
		procGetClientRect.Call(hwnd, uintptr(unsafe.Pointer(&rc)))
		cw := rc.Right - rc.Left
		ch := rc.Bottom - rc.Top

		b := int32(resizeBorderWidth)
		if pt.Y < b {
			if pt.X < b { return htTopLeft }
			if pt.X > cw-b { return htTopRight }
			return htTop
		}
		if pt.Y > ch-b {
			if pt.X < b { return htBottomLeft }
			if pt.X > cw-b { return htBottomRight }
			return htBottom
		}
		if pt.X < b { return htLeft }
		if pt.X > cw-b { return htRight }

		if pt.Y < int32(dragRegionHeight) && pt.X < cw-int32(titleBarButtonsWidth) {
			return htCaption
		}
		return htClient
	}

	ret, _, _ := procCallWindowProc.Call(origWndProc, hwnd, msg, wParam, lParam)
	return ret
}

// setupWindow 一次性窗口初始化（goroutine 中调用）
func setupWindow() {
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

	// 1. 隐藏窗口（防白屏）
	procShowWindow.Call(cachedHwnd, swHide)
	log.Println("[Hi!XNS] 窗口已隐藏")

	// 2. 黑色背景
	blackBrush, _, _ := procCreateSolidBrush.Call(0x00000000)
	if blackBrush != 0 {
		procSetClassLongPtr.Call(cachedHwnd, gclHbrBackground, blackBrush)
	}

	// 3. 去标题栏
	style, _, _ := procGetWindowLong.Call(cachedHwnd, gwlStyle)
	newStyle := style &^ wsCaption &^ wsSysMenu
	newStyle = newStyle | wsThickFrame | wsMinimizeBox | wsMaximizeBox
	procSetWindowLong.Call(cachedHwnd, gwlStyle, newStyle)
	procSetWindowPos.Call(cachedHwnd, 0, 0, 0, 0, 0,
		swpFrameChanged|swpNoMove|swpNoSize|swpNoZOrder|swpNoOwnerZOrder)

	// 4. 子类化（拖拽+右键拦截）
	origWndProc, _, _ = procGetWindowLong.Call(cachedHwnd, gwlWndProc)
	if origWndProc != 0 {
		newProc := syscall.NewCallback(customWndProc)
		procSetWindowLong.Call(cachedHwnd, gwlWndProc, newProc)
		log.Println("[Hi!XNS] 窗口子类化完成")
	}

	log.Println("[Hi!XNS] 窗口初始化完成")
}

// disableWebView2ContextMenu 通过 WebView2 COM 接口禁用原生右键菜单
// 调用链: webview_get_native_handle(w, 2) → ICoreWebView2Controller
//         → vtable[25] get_CoreWebView2 → ICoreWebView2
//         → vtable[3] get_Settings → ICoreWebView2Settings
//         → vtable[14] put_AreDefaultContextMenusEnabled(FALSE)
func disableWebView2ContextMenu(webviewHandle uintptr) {
	// 加载 webview.dll 的 webview_get_native_handle 符号
	webviewDLL := syscall.NewLazyDLL("webview.dll")
	procGetNativeHandle := webviewDLL.NewProc("webview_get_native_handle")

	// kind=2 → WEBVIEW_NATIVE_HANDLE_KIND_BROWSER_CONTROLLER → ICoreWebView2Controller*
	controllerPtr, _, _ := procGetNativeHandle.Call(webviewHandle, 2)
	if controllerPtr == 0 {
		log.Println("[Hi!XNS] webview_get_native_handle 返回 NULL")
		return
	}
	log.Printf("[Hi!XNS] ICoreWebView2Controller: %#x", controllerPtr)

	// 读取 ICoreWebView2Controller 的 vtable
	// controllerPtr 指向 COM 对象，对象的第一个 qword 是 vtable 指针
	controllerVtable := *(*uintptr)(unsafe.Pointer(controllerPtr))

	// vtable[25] = get_CoreWebView2(ICoreWebView2Controller* this, ICoreWebView2** result)
	getCoreWebView2Fn := *(*uintptr)(unsafe.Pointer(controllerVtable + 25*unsafe.Sizeof(uintptr(0))))

	var coreWebView2 uintptr
	hr, _, _ := syscall.SyscallN(getCoreWebView2Fn, controllerPtr, uintptr(unsafe.Pointer(&coreWebView2)))
	if hr != 0 || coreWebView2 == 0 {
		log.Printf("[Hi!XNS] get_CoreWebView2 失败: hr=%#x", hr)
		return
	}
	log.Printf("[Hi!XNS] ICoreWebView2: %#x", coreWebView2)

	// 读取 ICoreWebView2 的 vtable
	coreVtable := *(*uintptr)(unsafe.Pointer(coreWebView2))

	// vtable[3] = get_Settings(ICoreWebView2* this, ICoreWebView2Settings** result)
	getSettingsFn := *(*uintptr)(unsafe.Pointer(coreVtable + 3*unsafe.Sizeof(uintptr(0))))

	var settings uintptr
	hr, _, _ = syscall.SyscallN(getSettingsFn, coreWebView2, uintptr(unsafe.Pointer(&settings)))
	if hr != 0 || settings == 0 {
		log.Printf("[Hi!XNS] get_Settings 失败: hr=%#x", hr)
		return
	}
	log.Printf("[Hi!XNS] ICoreWebView2Settings: %#x", settings)

	// 读取 ICoreWebView2Settings 的 vtable
	settingsVtable := *(*uintptr)(unsafe.Pointer(settings))

	// vtable[14] = put_AreDefaultContextMenusEnabled(ICoreWebView2Settings* this, BOOL value)
	putContextMenuFn := *(*uintptr)(unsafe.Pointer(settingsVtable + 14*unsafe.Sizeof(uintptr(0))))

	// 调用: put_AreDefaultContextMenusEnabled(FALSE)
	hr, _, _ = syscall.SyscallN(putContextMenuFn, settings, 0) // 0 = FALSE
	if hr != 0 {
		log.Printf("[Hi!XNS] put_AreDefaultContextMenusEnabled 失败: hr=%#x", hr)
		return
	}
	log.Println("[Hi!XNS] ✓ WebView2 原生右键菜单已禁用")

	// 同时禁用 DevTools（debug=false 时应该已经禁用，但保险起见）
	// vtable[12] = put_AreDevToolsEnabled
	putDevToolsFn := *(*uintptr)(unsafe.Pointer(settingsVtable + 12*unsafe.Sizeof(uintptr(0))))
	syscall.SyscallN(putDevToolsFn, settings, 0)
	log.Println("[Hi!XNS] ✓ WebView2 DevTools 已禁用")
}

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

func startDragWindow()        {}
func removeWindowFrame()      {}
func setWindowBackgroundBlack() {}
func hideWindow()             {}
