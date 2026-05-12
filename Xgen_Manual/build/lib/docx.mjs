// DOCX 빌드 — 합성된 트리에서 사용자/관리자 매뉴얼을 각각 별도 파일로 생성
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

async function listMarkdown(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith('.md') && e.name !== '.pages')
    .map((e) => join(dir, e.name))
    .sort();
}

function runPandoc(args, cwd) {
  return new Promise((resolve, reject) => {
    const proc = spawn('pandoc', args, { cwd, stdio: 'inherit', shell: false });
    proc.on('error', reject);
    proc.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`pandoc exited with ${code}`))
    );
  });
}

export async function buildDocx({ composedRoot, docsDir, customerConfig, distRoot }) {
  const customerId = customerConfig.customer.id;
  const productVersion = customerConfig.product.version;

  const outDir = join(distRoot, 'docx', customerId);
  await mkdir(outDir, { recursive: true });

  const commonFiles = await listMarkdown(join(docsDir, 'common'));

  // reference.docx 결정 — 고객사 지정값이 없으면 shared 기본값 사용
  const refRel = customerConfig.outputs?.docx?.reference;
  const referenceDocx = refRel
    ? join(customerConfig.__paths.customerDir, refRel)
    : join(composedRoot, '..', '..', '..', 'shared', 'templates', 'reference.default.docx');

  const baseArgs = [
    '--from=markdown',
    '--to=docx',
    '--toc',
    '--toc-depth=3',
    '--standalone',
  ];
  if (existsSync(referenceDocx)) {
    baseArgs.push(`--reference-doc=${referenceDocx}`);
  }

  // user/, admin/ 폴더 존재 여부로 자동 판단 (별도 audiences 플래그 없이)
  const userDir = join(docsDir, 'user');
  const adminDir = join(docsDir, 'admin');
  const targets = [];
  if (existsSync(userDir)) {
    targets.push({
      label: '사용자',
      files: [...commonFiles, ...(await listMarkdown(userDir))],
    });
  }
  if (existsSync(adminDir)) {
    targets.push({
      label: '관리자',
      files: [...commonFiles, ...(await listMarkdown(adminDir))],
    });
  }

  for (const t of targets) {
    if (t.files.length === 0) {
      console.warn(`[docx:${customerId}] ${t.label} 매뉴얼에 포함될 파일 없음 — 스킵`);
      continue;
    }
    const outFile = join(
      outDir,
      `Xgen_Manual_${t.label}_v${productVersion}_${customerId}.docx`
    );
    const args = [...baseArgs, '-o', outFile, ...t.files];
    console.log(`[docx:${customerId}] ${t.label} → ${outFile}`);
    await runPandoc(args, composedRoot);
  }
}
