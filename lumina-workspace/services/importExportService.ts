
import { Page, Block, BlockType } from '../types';

export const exportToMarkdown = (page: Page): string => {
  let md = `# ${page.title}\n\n`;
  page.blocks.forEach(block => {
    switch (block.type) {
      case BlockType.HEADING1: md += `# ${block.content}\n\n`; break;
      case BlockType.HEADING2: md += `## ${block.content}\n\n`; break;
      case BlockType.HEADING3: md += `### ${block.content}\n\n`; break;
      case BlockType.BULLET: md += `- ${block.content}\n`; break;
      case BlockType.TODO: md += `- [${block.metadata?.checked ? 'x' : ' '}] ${block.content}\n`; break;
      case BlockType.CODE: md += `\`\`\`\n${block.content}\n\`\`\`\n\n`; break;
      case BlockType.DIVIDER: md += `--- \n\n`; break;
      case BlockType.CALLOUT: md += `> ${block.content}\n\n`; break;
      default: md += `${block.content}\n\n`;
    }
  });
  return md;
};

export const exportToHTML = (page: Page): string => {
  let html = `<!DOCTYPE html><html><head><title>${page.title}</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;line-height:1.6;color:#37352f;}h1{font-size:3em;}blockquote{background:#f9f9f9;padding:10px 20px;border-left:5px solid #ccc;}</style></head><body>`;
  html += `<h1>${page.title}</h1>`;
  page.blocks.forEach(block => {
    switch (block.type) {
      case BlockType.HEADING1: html += `<h1>${block.content}</h1>`; break;
      case BlockType.HEADING2: html += `<h2>${block.content}</h2>`; break;
      case BlockType.HEADING3: html += `<h3>${block.content}</h3>`; break;
      case BlockType.BULLET: html += `<li>${block.content}</li>`; break;
      case BlockType.TODO: html += `<div>[${block.metadata?.checked ? 'x' : ' '}] ${block.content}</div>`; break;
      case BlockType.CODE: html += `<pre><code>${block.content}</code></pre>`; break;
      case BlockType.DIVIDER: html += `<hr/>`; break;
      case BlockType.CALLOUT: html += `<blockquote>${block.content}</blockquote>`; break;
      default: html += `<p>${block.content}</p>`;
    }
  });
  html += `</body></html>`;
  return html;
};

export const importFromMarkdown = (text: string): Partial<Page> => {
  const lines = text.split('\n');
  const title = lines[0].startsWith('# ') ? lines[0].replace('# ', '') : 'Imported Document';
  const blocks: Block[] = [];

  lines.slice(1).forEach(line => {
    if (!line.trim()) return;
    
    let type = BlockType.TEXT;
    let content = line;
    let metadata = {};

    if (line.startsWith('# ')) { type = BlockType.HEADING1; content = line.replace('# ', ''); }
    else if (line.startsWith('## ')) { type = BlockType.HEADING2; content = line.replace('## ', ''); }
    else if (line.startsWith('- [ ] ')) { type = BlockType.TODO; content = line.replace('- [ ] ', ''); metadata = { checked: false }; }
    else if (line.startsWith('- [x] ')) { type = BlockType.TODO; content = line.replace('- [x] ', ''); metadata = { checked: true }; }
    else if (line.startsWith('- ')) { type = BlockType.BULLET; content = line.replace('- ', ''); }
    
    blocks.push({
      id: `b-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      metadata
    });
  });

  return { title, blocks };
};

export const downloadFile = (content: string, fileName: string, contentType: string) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
};
