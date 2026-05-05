
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://nyyydrcchspuxguqwnzk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55eXlkcmNjaHNwdXhndXF3bnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzE0MzMsImV4cCI6MjA5MjEwNzQzM30.RVYmbwnlzEHd64t6MPMkUB_s1iGefrzQPEv6HmJfgGU');

async function fetchQuestions() {
  const { data, error } = await supabase.from('questions').select('*');
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

fetchQuestions();
