//go:build windows

package main

import (
	"context"
	"os/exec"
	"syscall"
)

// hideWindowCmd creates an exec.Cmd with CREATE_NO_WINDOW on Windows
// to prevent python.exe / hermes.exe from spawning a visible console window.
func hideWindowCmd(name string, args ...string) *exec.Cmd {
	cmd := exec.Command(name, args...)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		CreationFlags: 0x08000000, // CREATE_NO_WINDOW
	}
	return cmd
}

// hideWindowCmdContext is like hideWindowCmd but accepts a context.
func hideWindowCmdContext(ctx context.Context, name string, args ...string) *exec.Cmd {
	cmd := exec.CommandContext(ctx, name, args...)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		CreationFlags: 0x08000000, // CREATE_NO_WINDOW
	}
	return cmd
}
