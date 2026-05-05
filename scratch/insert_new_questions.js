
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://nyyydrcchspuxguqwnzk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55eXlkcmNjaHNwdXhndXF3bnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzE0MzMsImV4cCI6MjA5MjEwNzQzM30.RVYmbwnlzEHd64t6MPMkUB_s1iGefrzQPEv6HmJfgGU');

const newQuestions = [
  {
    question_text: "Macao is a Special Administrative Region of which country?",
    options: ["Japan", "China", "Thailand", "Malaysia"],
    correct_answer_index: 1,
    tag: "GEOGRAPHY",
    ui_style: "slide",
    question_set_id: "macao_2025",
    type: "multiple_choice",
    is_active: true
  },
  {
    question_text: "Which popular egg tart is famous in Macao?",
    options: ["Apple Tart", "Portuguese Egg Tart", "Lemon Tart", "Chocolate Tart"],
    correct_answer_index: 1,
    tag: "CUISINE",
    ui_style: "float",
    question_set_id: "macao_2025",
    type: "multiple_choice",
    is_active: true
  },
  {
    question_text: "Which famous landmark in Macao is a UNESCO World Heritage Site?",
    options: ["Eiffel Tower", "Ruins of St. Paul’s", "Big Ben", "Marina Bay Sands"],
    correct_answer_index: 1,
    tag: "LANDMARKS",
    ui_style: "bubble",
    question_set_id: "macao_2025",
    type: "multiple_choice",
    is_active: true
  },
  {
    question_text: "What is Hong Kong officially known as?",
    options: ["Independent Country", "Special Administrative Region", "State of China", "Island Nation"],
    correct_answer_index: 1,
    tag: "GOVERNANCE",
    ui_style: "slide",
    question_set_id: "macao_2025",
    type: "multiple_choice",
    is_active: true
  },
  {
    question_text: "What body of water separates Hong Kong Island from Kowloon?",
    options: ["Victoria Harbour", "South China Sea", "Pearl River", "Yellow Sea"],
    correct_answer_index: 0,
    tag: "GEOGRAPHY",
    ui_style: "taxi_map",
    question_set_id: "macao_2025",
    type: "multiple_choice",
    is_active: true
  },
  {
    question_text: "Which giant Buddha statue is a major tourist attraction in Hong Kong?",
    options: ["Golden Buddha", "Tian Tan Buddha", "Reclining Buddha", "Jade Buddha"],
    correct_answer_index: 1,
    tag: "LANDMARKS",
    ui_style: "bubble",
    question_set_id: "macao_2025",
    type: "multiple_choice",
    is_active: true
  },
  {
    question_text: "Which shopping street is famous for bargains and night shopping?",
    options: ["Nathan Road", "Orchard Road", "Wall Street", "Baker Street"],
    correct_answer_index: 0,
    tag: "SHOPPING",
    ui_style: "float",
    question_set_id: "macao_2025",
    type: "multiple_choice",
    is_active: true
  },
  {
    question_text: "What is Hong Kong’s famous nightly light show called?",
    options: ["City Lights", "Symphony of Lights", "Harbour Glow", "Sky Magic"],
    correct_answer_index: 1,
    tag: "ENTERTAINMENT",
    ui_style: "slide",
    question_set_id: "macao_2025",
    type: "multiple_choice",
    is_active: true
  },
  {
    question_text: "Which harbor in Hong Kong is famous for skyline views and cruises?",
    options: ["Victoria Harbour", "Sydney Harbour", "Pearl Harbour", "Marina Bay"],
    correct_answer_index: 0,
    tag: "LANDMARKS",
    ui_style: "float",
    question_set_id: "macao_2025",
    type: "multiple_choice",
    is_active: true
  },
  {
    question_text: "Which Hong Kong attraction combines cable car rides and mountain views?",
    options: ["Star Ferry", "Ngong Ping 360", "Peak Tram", "Sky100"],
    correct_answer_index: 1,
    tag: "ATTRACTIONS",
    ui_style: "cable_car",
    question_set_id: "macao_2025",
    type: "multiple_choice",
    is_active: true
  },
  {
    question_text: "Which Macau hotel is famous for indoor canals and gondola rides?",
    options: ["MGM Macau", "Venetian Macau", "Galaxy Macau", "Lisboa Hotel"],
    correct_answer_index: 1,
    tag: "LANDMARKS",
    ui_style: "key_drag",
    question_set_id: "macao_2025",
    type: "multiple_choice",
    is_active: true
  }
];

async function insertQuestions() {
  console.log('Inserting questions...');
  const { data, error } = await supabase.from('questions').insert(newQuestions);
  if (error) {
    console.error('Error inserting questions:', error.message);
  } else {
    console.log('Questions inserted successfully!');
  }
}

insertQuestions();
