import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');

    if (secret !== process.env.MY_REVALIDATE_SECRET) {
        return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }

    revalidatePath('/');

    return new Response(JSON.stringify({ revalidated: true, now: Date.now() }), { status: 200 });
}