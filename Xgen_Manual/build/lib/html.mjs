// HTML 빌드 — 합성된 트리에 대해 mkdocs build 실행
import { spawn } from 'node:child_process';
import { join } from 'node:path';

export function buildHtml({ composedRoot, mkdocsConfig, serve = false }) {
  return new Promise((resolve, reject) => {
    const args = serve
      ? ['-m', 'mkdocs', 'serve', '--config-file', mkdocsConfig]
      : ['-m', 'mkdocs', 'build', '--config-file', mkdocsConfig, '--clean'];
    const proc = spawn('python', args, {
      cwd: composedRoot,
      stdio: 'inherit',
      shell: false,
    });
    proc.on('error', reject);
    proc.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`mkdocs exited with ${code}`))
    );
  });
}
