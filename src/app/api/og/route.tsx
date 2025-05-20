import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        // Parse query parameters
        const { searchParams } = new URL(req.url);
        const title = searchParams.get('title') || 'Leat Sophat';
        const subtitle = searchParams.get('subtitle') || 'Frontend Developer';
        const description = searchParams.get('description') || 'Portfolio & Personal Website';

        // For edge runtime, we need to fetch the image and convert it
        const imageUrl = new URL('/assets/logo/logo-transparent-dark-mode.png', 'https://pphat.top').href;
        const imageData = await fetch(imageUrl).then(res => res.arrayBuffer());
        const imageBase64 = `data:image/png;base64,${Buffer.from(imageData).toString('base64')}`;

        /* eslint-disable */
        return new ImageResponse(
            (<div
                style={{
                    fontSize: 72,
                    fontWeight: 500,
                    background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    padding: '40px',
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                <div style={{ width: '512px', display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ margin: '0', fontSize: '82px', lineHeight: 1.2, fontFamily: 'sans-serif', fontWeight: 700, whiteSpace: 'nowrap' }}>🤩 {title}</h1>
                    <p style={{ fontSize: '36px', marginTop: "0", opacity: 0.9, fontWeight: 500 }}>{subtitle}</p>
                    <p style={{ fontSize: '36px', margin: '20px 0 0', opacity: 0.9, fontWeight: 400 }}>{description}</p>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '20px',
                    }}
                >
                    <img
                        src={imageBase64}
                        width={250}
                        height={250}
                        alt="Leat Sophat"
                        style={{ marginRight: '20px', borderRadius: '32px', border: '4px solid white', padding: '20px' }}
                    />
                </div>

            </div>
            ),
            {
                width: 1200,
                height: 630,
                emoji: 'fluent'
            }
        );
    } catch (error) {
        console.error('Error generating OG image:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return new Response(`Failed to generate OG image: ${errorMessage}`, { status: 500 });
    }
}
