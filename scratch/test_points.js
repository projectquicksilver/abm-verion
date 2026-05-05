
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://nyyydrcchspuxguqwnzk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55eXlkcmNjaHNwdXhndXF3bnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzE0MzMsImV4cCI6MjA5MjEwNzQzM30.RVYmbwnlzEHd64t6MPMkUB_s1iGefrzQPEv6HmJfgGU');

async function addPointsColumn() {
  // Supabase JS doesn't support ALTER TABLE directly. 
  // Usually done via RPC if a function exists, or via SQL editor.
  // I'll try to insert a question with a 'points' field to see if it's already there or if it fails.
  const { data, error } = await supabase.from('questions').insert([
    { 
      question_text: 'Test points', 
      points: 1, 
      question_set_id: 'test', 
      type: 'multiple_choice',
      options: ['A', 'B'],
      correct_answer_index: 0
    }
  ]);
  
  if (error) {
    console.error('Error (might be missing column):', error.message);
  } else {
    console.log('Points column exists or was added successfully!');
  }
}

addPointsColumn();
