import { supabase } from '../../lib/supabase';
import { CategoryFormData } from '../../types';

export async function GET(request: Request) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return Response.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const categoryData: CategoryFormData = await request.json();

    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        user_id: session.user.id,
        name: categoryData.name,
        color: categoryData.color
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}