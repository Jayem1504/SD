import { supabase } from '../../../lib/supabase';
import { TaskFormData } from '../../../types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        *,
        categories (
          id,
          name,
          color
        )
      `)
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();

    if (error) throw error;
    if (!task) return new Response('Task not found', { status: 404 });

    return Response.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const taskData: Partial<TaskFormData> = await request.json();

    const { data: task, error } = await supabase
      .from('tasks')
      .update({
        ...taskData,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!task) return new Response('Task not found', { status: 404 });

    return Response.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
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
      .from('tasks')
      .delete()
      .eq('id', params.id)
      .eq('user_id', session.user.id);

    if (error) throw error;

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}