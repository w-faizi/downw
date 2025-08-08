// api/download.js
export default async function handler(req, res) {
  const tweetUrl = req.query.url;
  if (!tweetUrl) {
    return res.status(400).json({ success: false, error: 'No URL provided' });
  }

  try {
    // Fetch tweet HTML server-side
    const r = await fetch(tweetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });
    const html = await r.text();

    // Find MP4 URL in HTML
    const mp4Regex = /https?:\/\/video\.twimg\.com\/[^"'<>\\s]+\.mp4/g;
    const matches = html.match(mp4Regex);

    if (!matches || matches.length === 0) {
      return res.status(404).json({ success: false, error: 'No video found' });
    }

    // Pick the highest quality (last match)
    const videoUrl = matches[matches.length - 1];

    res.status(200).json({ success: true, url: videoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}
