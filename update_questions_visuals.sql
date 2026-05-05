
-- Update questions with Creative Design metadata and Neutral Feedback styles

-- Question 15: Egg Tart (Slot Machine -> Image Card for "Creative Design" as requested)
UPDATE questions 
SET ui_style = 'image_card',
    option_metadata = '[
      {"img": "/opt_portuguese_tart.png", "bg": "linear-gradient(160deg, #2a1b0a 0%, #4a2d10 100%)", "accent": "#fbbf24", "label": "A"},
      {"img": "/opt_apple_tart.png", "bg": "linear-gradient(160deg, #1a2e0d 0%, #2a4a15 100%)", "accent": "#84cc16", "label": "B"},
      {"img": "/opt_lemon_tart.png", "bg": "linear-gradient(160deg, #2e2e0d 0%, #4a4a15 100%)", "accent": "#facc15", "label": "C"},
      {"img": "/opt_chocolate_tart.png", "bg": "linear-gradient(160deg, #1a0d0d 0%, #2a1515 100%)", "accent": "#7c2d12", "label": "D"}
    ]'::jsonb
WHERE id = 15;

-- Question 16: UNESCO Site (Bubble -> Image Card)
UPDATE questions 
SET ui_style = 'image_card',
    option_metadata = '[
      {"img": "/opt_eiffel_tower.png", "bg": "linear-gradient(160deg, #0f172a 0%, #1e293b 100%)", "accent": "#60a5fa", "label": "A"},
      {"img": "/opt_ruins_st_paul.png", "bg": "linear-gradient(160deg, #2a0f0f 0%, #4a1515 100%)", "accent": "#f87171", "label": "B"},
      {"img": "/opt_big_ben.png", "bg": "linear-gradient(160deg, #0f2a17 0%, #154a24 100%)", "accent": "#4ade80", "label": "C"},
      {"img": "/opt_mbs.png", "bg": "linear-gradient(160deg, #1a0f2a 0%, #2e154a 100%)", "accent": "#a78bfa", "label": "D"}
    ]'::jsonb
WHERE id = 16;

-- Question 19: Giant Buddha (Bubble -> Image Card)
UPDATE questions 
SET ui_style = 'image_card',
    option_metadata = '[
      {"img": "/opt_golden_buddha.png", "bg": "linear-gradient(160deg, #2a200a 0%, #4a3810 100%)", "accent": "#fbbf24", "label": "A"},
      {"img": "/opt_big_buddha.png", "bg": "linear-gradient(160deg, #0f2a2a 0%, #154a4a 100%)", "accent": "#2dd4bf", "label": "B"},
      {"img": "/opt_reclining_buddha.png", "bg": "linear-gradient(160deg, #2a0f2a 0%, #4a154a 100%)", "accent": "#e879f9", "label": "C"},
      {"img": "/opt_jade_buddha.png", "bg": "linear-gradient(160deg, #0f2a0f 0%, #154a15 100%)", "accent": "#4ade80", "label": "D"}
    ]'::jsonb
WHERE id = 19;

-- Question 24: Venetian Macao (Key Drag -> Image Card)
UPDATE questions 
SET ui_style = 'image_card',
    option_metadata = '[
      {"img": "/opt_mgm_macau.png", "bg": "linear-gradient(160deg, #2a1a0f 0%, #4a2e15 100%)", "accent": "#f59e0b", "label": "A"},
      {"img": "/opt_venetian_macau.png", "bg": "linear-gradient(160deg, #0f1a2a 0%, #152e4a 100%)", "accent": "#3b82f6", "label": "B"},
      {"img": "/opt_galaxy_macau.png", "bg": "linear-gradient(160deg, #2a0f1a 0%, #4a152e 100%)", "accent": "#ec4899", "label": "C"},
      {"img": "/opt_grand_lisboa.png", "bg": "linear-gradient(160deg, #1a0f2a 0%, #2e154a 100%)", "accent": "#8b5cf6", "label": "D"}
    ]'::jsonb
WHERE id = 24;

-- Ensure other questions use high-quality gamified styles
UPDATE questions SET ui_style = 'neon_flicker' WHERE id = 21;
UPDATE questions SET ui_style = 'cable_car' WHERE id = 23;
UPDATE questions SET ui_style = 'taxi_map' WHERE id = 18;
