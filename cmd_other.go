//go:build !windows

package main

import (
	"context"
	"os/exec"
)

// hideWindowCmd is a no-op on non-Windows platforms (no console window issue).
func hideWindowCmd(name string, args ...string) *exec.Cmd {
	return exec.Command(name, args...)
}

// hideWindowCmdContext is like hideWindowCmd but accepts a context.
func hideWindowCmdContext(ctx context.Context, name string, args ...string) *exec.Cmd {
	return exec.CommandContext(ctx, name, args...)
}
