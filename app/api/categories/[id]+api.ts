import { supabase } from '../../../lib/supabase';
import { CategoryFormData } from '../../../types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();

    if (error) throw error;
    if (!category) return new Response('Category not found', { status: 404 });

    return Response.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const categoryData: Partial<CategoryFormData> = await request.json();

    const { data: category, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!category) return new Response('Category not found', { status: 404 });

    return Response.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', params.id)
      .eq('user_id', session.user.id);

    if (error) throw error;

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}