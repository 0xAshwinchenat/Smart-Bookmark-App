import * as cheerio from 'cheerio'

export async function getMetadata(url: string) {
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      signal: AbortSignal.timeout(8000), // 8 second timeout
    })

    if (!response.ok) {
      console.warn(`[Metadata] Failed to fetch ${url}: status ${response.status}`)
      throw new Error('Failed to fetch the URL')
    }

    const html = await response.text()
    console.log(`[Metadata] Successfully fetched ${url}`)
    const $ = cheerio.load(html)

    const title = 
      $('meta[property="og:title"]').attr('content') || 
      $('title').text() || 
      $('meta[name="twitter:title"]').attr('content') ||
      url

    const description = 
      $('meta[property="og:description"]').attr('content') || 
      $('meta[name="description"]').attr('content') || 
      $('meta[name="twitter:description"]').attr('content') ||
      null

    let favicon = 
      $('link[rel="apple-touch-icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="icon"]').attr('href')

    if (favicon && !favicon.startsWith('http')) {
      const urlObj = new URL(url)
      favicon = new URL(favicon, urlObj.origin).toString()
    }

    if (!favicon) {
      const urlObj = new URL(url)
      favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`
    }

    return {
      title: title.trim(),
      description: description ? description.trim() : null,
      favicon_url: favicon,
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error(`[Metadata] Error fetching ${url}:`, errorMsg)
    return {
      title: url,
      description: null,
      favicon_url: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`,
    }
  }
}
