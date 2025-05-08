import { supabase } from '../../lib/supabase';
import { TaskFormData, TaskPriority } from '../../types';

export async function GET(request: Request) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        *,
        categories (
          id,
          name,
          color
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return Response.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const taskData: TaskFormData = await request.json();

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        user_id: session.user.id,
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || TaskPriority.MEDIUM,
        category_id: taskData.categoryId,
        notes: taskData.notes || ''
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}