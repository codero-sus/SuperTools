const fs = require('fs');
const path = require('path');

const toolsDataPath = path.join(__dirname, '../src/data/toolsData.ts');
const toolsDataRaw = fs.readFileSync(toolsDataPath, 'utf8');

// Extract tools array from JSON
const match = toolsDataRaw.match(/export const TOOLS_DATA: ToolItem\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not parse TOOLS_DATA from src/data/toolsData.ts');
  process.exit(1);
}

const tools = JSON.parse(match[1]);
const today = new Date().toISOString().split('T')[0];

const categories = [
  'media-studio',
  'text-crypto-forge',
  'code-web-lab',
  'files-documents',
  'math-engineering',
  'unit-converters',
  'finance-money',
  'date-time-world',
  'color-palette',
  'cheatsheets-guides'
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Core Home & Settings -->
  <url>
    <loc>https://the-supertools.web.app/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://the-supertools.web.app/settings.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;

// Categories
for (const cat of categories) {
  xml += `  <url>
    <loc>https://the-supertools.web.app/#/category/${cat}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
`;
}

// Individual Tools
for (const tool of tools) {
  const priority = tool.featured ? '0.95' : '0.80';
  xml += `  <url>
    <loc>https://the-supertools.web.app/#/${tool.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>
`;
}

xml += `</urlset>\n`;

const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`Generated sitemap.xml with ${2 + categories.length + tools.length} URLs at ${sitemapPath}`);
