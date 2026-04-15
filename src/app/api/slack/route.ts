export async function POST(req: Request) {
  try {
    const body = await req.json();
    const webhook = process.env.SLACK_WEBHOOK_URL?.trim();
    if (!webhook) {
      return Response.json({ success: false, error: 'SLACK_WEBHOOK_URL missing' }, { status: 500 });
    }

    const slackRes = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!slackRes.ok) {
      const detail = await slackRes.text().catch(() => '');
      return Response.json({ success: false, status: slackRes.status, detail }, { status: 502 });
    }

    return Response.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[api/slack] error:', error);
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
