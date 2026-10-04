const FEEDS = {
  career: [{ url: 'https://www.bls.gov/feed/bls_latest.rss', source: 'U.S. Bureau of Labor Statistics' }],
  trading: [{ url: 'https://www.federalreserve.gov/feeds/press_monetary.xml', source: 'Federal Reserve: monetary policy' }],
  health: [{ url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=integrative+medicine+OR+nursing+OR+pathophysiology&retmax=8&sort=date&retmode=json', source: 'PubMed', pubmed: true }],
  finance: [{ url: 'https://www.federalreserve.gov/feeds/press_all.xml', source: 'Federal Reserve: press releases' }]
};

const decode = (text = '') => text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const tag = (xml, name) => decode(xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] || '');

async function readFeed(feed) {
  const response = await fetch(feed.url, { headers: { Accept: 'application/rss+xml, application/xml, text/xml' }, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`Feed HTTP ${response.status}`);
  if (feed.pubmed) {
    const search = await response.json();
    const ids = search.esearchresult?.idlist || [];
    if (!ids.length) return [];
    const summaryResponse = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`, { signal: AbortSignal.timeout(8000) });
    if (!summaryResponse.ok) throw new Error(`PubMed HTTP ${summaryResponse.status}`);
    const summary = await summaryResponse.json();
    return ids.map((id) => summary.result?.[id]).filter(Boolean).map((item) => ({ title: item.title, source: feed.source, insight: `Published ${item.pubdate || 'date unavailable'}. Read the abstract and assess its applicability and study limitations.`, relevance: 'MEDIUM', action: 'Review the abstract and study quality before applying findings.', link: `https://pubmed.ncbi.nlm.nih.gov/${item.uid || item.id}/`, published: item.pubdate || '' }));
  }
  const xml = await response.text();
  return [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].slice(0, 8).map((match) => {
    const item = match[1];
    const title = tag(item, 'title');
    const link = tag(item, 'link') || item.match(/<link[^>]+href=["']([^"']+)/i)?.[1] || '';
    const description = tag(item, 'description') || tag(item, 'summary');
    return { title, source: feed.source, insight: description.slice(0, 420), relevance: 'MEDIUM', action: 'Open the source and review the full release.', link, published: tag(item, 'pubDate') || tag(item, 'dc:date') };
  }).filter((item) => item.title && item.link);
}

export default async () => {
  const keys = Object.keys(FEEDS);
  const results = await Promise.all(keys.map(async (key) => {
    const group = await Promise.allSettled(FEEDS[key].map(readFeed));
    const items = group.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
    return [key, { category: key[0].toUpperCase() + key.slice(1), updates: items, nextCheck: '30 minutes' }];
  }));
  const feeds = Object.fromEntries(results);
  return new Response(JSON.stringify({ feeds, fetchedAt: new Date().toISOString() }), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
};
