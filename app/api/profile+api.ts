import { supabase } from '../../lib/supabase';

export async function GET(request: Request) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) throw error;
    if (!profile) return new Response('Profile not found', { status: 404 });

    return Response.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const profileData = await request.json();

    const { data: profile, error } = await supabase
      .from('users')
      .update({
        display_name: profileData.displayName,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!profile) return new Response('Profile not found', { status: 404 });

    return Response.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}