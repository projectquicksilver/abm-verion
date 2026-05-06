import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Calendar, MapPin, Clock, 
  ExternalLink, Ship, Plane, Bus, 
  Coffee, Utensils, Music, Users,
  ChevronRight, Star, Compass, Sparkles, Crown
} from 'lucide-react';
import './BatchesScreen.css';

import venetianImg from '../assets/destinations/venetian.png';
import kowloonImg from '../assets/destinations/kowloon.png';
import oceanParkImg from '../assets/destinations/oceanpark.png';
import victoriaPeakImg from '../assets/destinations/victoria_peak.png';
import macauNeon from '../assets/destinations/macau_neon.png';
import np360Cool from '../assets/destinations/np360_cool.png';
import oceanParkFun from '../assets/destinations/ocean_park_fun.png';
import hotelNeon from '../assets/destinations/hotel_neon.png';
import landmarksCool from '../assets/destinations/landmarks_cool.png';

const BATCH_DATA = {
  1: {
    id: 1,
    title: "Batch 1",
    group: "GROUP 1",
    dates: "08–12 May 2026",
    stay: [
      { date: "08-10 May", hotel: "Harbour Grand Kowloon, Hong Kong", img: kowloonImg },
      { date: "10-12 May", hotel: "Venetian Macau", img: venetianImg }
    ],
    itinerary: [
      {
        day: 1,
        date: "8th May",
        title: "Arrival & Lantau Exploration",
        dayImage: "https://images.unsplash.com/photo-1543059123-289b4f97125f?q=80&w=1000&auto=format&fit=crop",
        activities: [
          { time: "Morning", text: "Arrival into Hong Kong Airport", icon: <Plane size={18} />, image: landmarksCool },
          { time: "Lunch", text: "Early lunch at Four Points by Sheraton", icon: <Utensils size={18} />, map: "https://www.google.com/maps/search/?api=1&query=Four+Points+by+Sheraton+Hong+Kong+Tung+Chung", image: hotelNeon },
          { time: "Afternoon", text: "NP 360 - Ngong Ping Cable Car Experience", icon: <Ship size={18} />, map: "https://www.google.com/maps/search/?api=1&query=Ngong+Ping+360", image: np360Cool },
          { time: "Check-in", text: "Harbour Grand Kowloon", icon: <MapPin size={18} />, map: "https://www.google.com/maps/search/?api=1&query=Harbour+Grand+Kowloon", image: kowloonImg },
          { time: "Dinner", text: "Dinner at Indian restaurant", icon: <Utensils size={18} />, image: macauNeon }
        ],
        footer: "OVERNIGHT STAY AT HARBOUR GRAND KOWLOON"
      },
      {
        day: 2,
        date: "9th May",
        title: "Ocean Park Adventure",
        dayImage: "https://images.unsplash.com/photo-1513297856462-24e5c6a3dfb7?q=80&w=1000&auto=format&fit=crop",
        activities: [
          { time: "Breakfast", text: "Breakfast at the hotel", icon: <Coffee size={18} />, image: hotelNeon },
          { time: "Full Day", text: "Trip to Ocean Park with Buffet Lunch", icon: <Star size={18} />, map: "https://www.google.com/maps/search/?api=1&query=Ocean+Park+Hong+Kong", image: oceanParkFun },
          { time: "Evening", text: "Spectacular Fireworks at Ocean Park", icon: <Music size={18} />, image: macauNeon },
          { time: "Dinner", text: "Dinner at Indian restaurant", icon: <Utensils size={18} />, image: landmarksCool }
        ],
        footer: "OVERNIGHT STAY AT HARBOUR GRAND KOWLOON"
      },
      {
        day: 3,
        date: "10th May",
        title: "HK City Tour & Macau Transfer",
        dayImage: "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?q=80&w=1000&auto=format&fit=crop",
        activities: [
          { time: "Morning", text: "Victoria Peak & Madame Tussauds", icon: <Compass size={18} />, map: "https://www.google.com/maps/search/?api=1&query=Victoria+Peak+Hong+Kong", image: victoriaPeakImg },
          { time: "Lunch", text: "Lunch at Indian Restaurant", icon: <Utensils size={18} />, image: landmarksCool },
          { time: "Transfer", text: "Hong Kong to Macau by High-Speed Ferry", icon: <Ship size={18} />, image: "/ferry_image_ref.jpg" },
          { time: "Macau", text: "Check-in at Hotel Venetian", icon: <MapPin size={18} />, map: "https://www.google.com/maps/search/?api=1&query=The+Venetian+Macao", image: venetianImg },
          { time: "Tour", text: "Diamond Show, Eiffel Tower & Fountain show", icon: <Sparkles size={18} />, image: macauNeon }
        ],
        footer: "OVERNIGHT STAY AT VENETIAN MACAU"
      },
      {
        day: 4,
        date: "11th May",
        title: "Strategic Meeting & Gala",
        dayImage: "https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?q=80&w=1000&auto=format&fit=crop",
        activities: [
          { time: "Morning", text: "Summit Meeting at Venetian Grand Ball room", icon: <Users size={18} />, image: hotelNeon },
          { time: "Lunch", text: "Lunch at Venetian Grand Ball room", icon: <Utensils size={18} />, image: landmarksCool },
          { time: "Evening", text: "Grand Gala Dinner & Award Function", icon: <Crown size={18} />, image: macauNeon }
        ],
        footer: "OVERNIGHT STAY AT VENETIAN MACAU"
      },
      {
        day: 5,
        date: "12th May",
        title: "Macau City Tour & Departure",
        dayImage: "https://images.unsplash.com/photo-1589110477621-f2403caaf824?q=80&w=1000&auto=format&fit=crop",
        activities: [
          { time: "Morning", text: "Macau City Tour & Heritage exploration", icon: <Compass size={18} />, image: landmarksCool },
          { time: "Lunch", text: "Lunch at the iconic Macau Tower", icon: <Utensils size={18} />, map: "https://www.google.com/maps/search/?api=1&query=Macau+Tower", image: np360Cool },
          { time: "Departure", text: "Shuttle to HKIA via HZMB Bridge", icon: <Bus size={18} />, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Hong_Kong-Zhuhai-Macau_Bridge_2018.jpg/800px-Hong_Kong-Zhuhai-Macau_Bridge_2018.jpg" },
          { time: "Final", text: "Fly back to India", icon: <Plane size={18} />, image: "https://picsum.photos/seed/airplane/600/600" }
        ],
        footer: "TOUR ENDS - BON VOYAGE"
      }
    ]
  },
  2: {
    id: 2,
    title: "Batch 2",
    group: "GROUP 2",
    dates: "10–14 May 2026",
    stay: [
      { date: "10-12 May", hotel: "Venetian Macau", img: venetianImg },
      { date: "12-14 May", hotel: "Harbour Grand Kowloon, Hong Kong", img: kowloonImg }
    ],
    itinerary: [
        {
          day: 1,
          date: "10th May",
          title: "Arrival & Macau Welcome",
          dayImage: "https://images.unsplash.com/photo-1596464716127-f2a829d4df30?q=80&w=1000&auto=format&fit=crop",
          activities: [
            { time: "Morning", text: "Arrival into Macau / HK Airport", icon: <Plane size={18} />, image: landmarksCool },
            { time: "Transfer", text: "Transfer to Hotel Venetian", icon: <MapPin size={18} />, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/West_section_of_Hong_Kong-Zhuhai-Macau_Bridge_%2820180902174105%29.jpg/960px-West_section_of_Hong_Kong-Zhuhai-Macau_Bridge_%2820180902174105%29.jpg" },
            { time: "Check-in", text: "Settle into your Luxury Suite", icon: <Coffee size={18} />, image: venetianImg },
            { time: "Evening", text: "Diamond Show & Venetian Exploration", icon: <Sparkles size={18} />, map: "https://www.google.com/maps/search/?api=1&query=The+Venetian+Macao", image: macauNeon },
            { time: "Dinner", text: "Welcome Dinner at Indian Restaurant", icon: <Utensils size={18} />, image: landmarksCool }
          ],
          footer: "OVERNIGHT STAY AT VENETIAN MACAU"
        },
        {
          day: 2,
          date: "11th May",
          title: "Strategic Meeting & Gala",
          dayImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop",
          activities: [
            { time: "Full Day", text: "Summit Meeting at Venetian Grand Ball room", icon: <Users size={18} />, image: hotelNeon },
            { time: "Lunch", text: "Buffet Lunch at the Venue", icon: <Utensils size={18} />, image: landmarksCool },
            { time: "Gala", text: "Grand Gala Dinner & Award Night", icon: <Crown size={18} />, image: macauNeon }
          ],
          footer: "OVERNIGHT STAY AT VENETIAN MACAU"
        },
        {
          day: 3,
          date: "12th May",
          title: "Macau Tour & HK Transfer",
          dayImage: "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?q=80&w=1000&auto=format&fit=crop",
          activities: [
            { time: "Morning", text: "Macau Tower & City Tour", icon: <Compass size={18} />, map: "https://www.google.com/maps/search/?api=1&query=Macau+Tower", image: macauNeon },
            { time: "Transfer", text: "Ferry to Hong Kong", icon: <Ship size={18} />, image: "/ferry_image_ref.jpg" },
            { time: "Check-in", text: "Harbour Grand Kowloon", icon: <MapPin size={18} />, image: kowloonImg },
            { time: "Evening", text: "Symphony of Lights View", icon: <Music size={18} />, image: landmarksCool }
          ],
          footer: "OVERNIGHT STAY AT HARBOUR GRAND KOWLOON"
        },
        {
          day: 4,
          date: "13th May",
          title: "Ocean Park Experience",
          dayImage: "https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?q=80&w=1000&auto=format&fit=crop",
          activities: [
            { time: "Morning", text: "Full day at Ocean Park", icon: <Star size={18} />, map: "https://www.google.com/maps/search/?api=1&query=Ocean+Park+Hong+Kong", image: oceanParkFun },
            { time: "Evening", text: "Free time for shopping in TST", icon: <MapPin size={18} />, image: kowloonImg },
            { time: "Dinner", text: "Farewell Dinner", icon: <Utensils size={18} />, image: hotelNeon }
          ],
          footer: "OVERNIGHT STAY AT HARBOUR GRAND KOWLOON"
        },
        {
          day: 5,
          date: "14th May",
          title: "Peak Visit & Departure",
          dayImage: "https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=1000&auto=format&fit=crop",
          activities: [
            { time: "Morning", text: "Victoria Peak & Madame Tussauds", icon: <Compass size={18} />, image: victoriaPeakImg },
            { time: "Transfer", text: "Transfer to Hong Kong Airport", icon: <Plane size={18} />, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Hong_Kong-Zhuhai-Macau_Bridge_2018.jpg/800px-Hong_Kong-Zhuhai-Macau_Bridge_2018.jpg" },
            { time: "Final", text: "Departure for India", icon: <ChevronRight size={18} />, image: "https://picsum.photos/seed/airplane/600/600" }
          ],
          footer: "TOUR ENDS"
        }
    ]
  }
};

const BatchesScreen = ({ initialBatch = null, initialDay = 1, highlight = null, onBack }) => {
  const [selectedBatch, setSelectedBatch] = useState(initialBatch);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="batches-screen" onMouseMove={handleMouseMove}>
      <div className="bg-nebula" />
      
      {/* Interactive Background Glow */}
      <motion.div 
        className="mouse-glow"
        animate={{
          x: mousePos.x - 250,
          y: mousePos.y - 250,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 50, mass: 0.5 }}
      />

      {/* Floating Adventure Elements (Parallax) */}
      <div className="parallax-bg-elements">
        <FloatingIcon icon={<Plane size={120} />} top="10%" left="5%" delay={0} />
        <FloatingIcon icon={<Compass size={180} />} top="60%" left="85%" delay={2} />
        <FloatingIcon icon={<MapPin size={100} />} top="20%" left="80%" delay={1} />
        <FloatingIcon icon={<Ship size={140} />} top="80%" left="15%" delay={3} />
      </div>

      <AnimatePresence mode="wait">
        {!selectedBatch ? (
          <motion.div 
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="selection-view"
          >
            <header className="batches-header">
              <button className="back-home-btn" onClick={onBack}>
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </button>
              <h1 className="modern-shimmer-title">SELECT YOUR <span className="shimmer-text">BATCH</span></h1>
              <p className="selection-subtitle">Experience the summit through a curated journey designed for excellence.</p>
            </header>

            <div className="batch-cards-container">
              {[1, 2].map((id, index) => (
                <BatchCard 
                  key={id} 
                  data={BATCH_DATA[id]} 
                  index={index}
                  onClick={() => setSelectedBatch(id)} 
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="detail-view"
          >
            <ItineraryShowcase 
              batch={BATCH_DATA[selectedBatch]} 
              initialDay={initialDay}
              highlight={highlight}
              onBack={() => {
                if (initialBatch) onBack(); // If we deep-linked, back should go to home
                else setSelectedBatch(null); // Otherwise back goes to batch selection
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BatchCard = ({ data, index, onClick }) => {
  return (
    <motion.div 
      className="batch-card-wrapper"
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={{ y: -15, transition: { duration: 0.4 } }}
      onClick={onClick}
    >
      <div className="batch-card-inner">
        {/* Full Bleed Background with Parallax effect via hover */}
        <div className="card-bg-container">
          <img src={data.id === 1 ? "/batch1_bg.png" : "/batch2_bg.png"} className="card-bg-img" alt="Adventure" />
          <div className="card-overlay" />
        </div>

        <div className="card-content-vibrant">
          <motion.div 
            className="floating-badge"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {data.group}
          </motion.div>
          
          <h2 className="vibrant-title">{data.title}</h2>
          
          <div className="card-stats-row">
            <div className="card-stat-item">
              <Calendar size={16} className="stat-icon" />
              <span>{data.dates}</span>
            </div>
            <div className="card-stat-item">
              <MapPin size={16} className="stat-icon" />
              <span>{data.id === 1 ? "HK → Macau" : "Macau → HK"}</span>
            </div>
          </div>

          <div className="itinerary-preview">
            <div className="preview-label">PREVIEW</div>
            <p className="preview-text">
              {data.id === 1 
                ? "Explore Lantau, Ocean Park, and the Grand Venetian Gala." 
                : "Experience Macau's heritage, Strategic Summit, and HK Skyline."}
            </p>
          </div>

          <motion.button 
            className="explore-btn-vibrant"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            START ADVENTURE <ChevronRight size={18} />
          </motion.button>
        </div>

        {/* Decorative Floating Elements */}
        <div className="decorative-glow" />
        <motion.div 
          className="floating-icon-deco"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Compass size={120} strokeWidth={0.5} opacity={0.1} />
        </motion.div>
      </div>
    </motion.div>
  );
};

const ItineraryShowcase = ({ batch, initialDay = 1, highlight = null, onBack }) => {
  const [activeDay, setActiveDay] = useState(initialDay);

  return (
    <div className="itinerary-container">
      <nav className="itinerary-nav">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Back to Batches</span>
        </button>
        <div className="batch-summary-mini">
            <span className="mini-group">{batch.group}</span>
            <span className="mini-dates">{batch.dates}</span>
        </div>
      </nav>

      <div className="itinerary-layout">
        {/* Day Selector Sidebar */}
        <aside className="day-sidebar">
          {batch.itinerary.map((day) => (
            <button 
              key={day.day}
              className={`day-btn ${activeDay === day.day ? 'active' : ''}`}
              onClick={() => setActiveDay(day.day)}
            >
              <span className="day-num">DAY 0{day.day}</span>
              <span className="day-date">{day.date}</span>
            </button>
          ))}
        </aside>

        {/* Unified Rhombus Timeline Content */}
        <main className="timeline-content">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeDay}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="itinerary-unified-panel"
            >
              <div className="day-header">
                <div className="day-title-wrap">
                  <span className="day-badge">Day 0{activeDay}</span>
                  <h2 className="day-title">{batch.itinerary[activeDay-1].title}</h2>
                </div>
                <div className="day-calendar">
                  <Calendar size={18} /> {batch.itinerary[activeDay-1].date}
                </div>
              </div>

              <div className="activities-timeline">
                {batch.itinerary[activeDay-1].activities.map((act, i) => {
                  const isHighlighted = highlight && act.text.includes(highlight);
                  return (
                    <motion.div 
                      key={i} 
                      className={`activity-item ${isHighlighted ? 'highlight-pulse' : ''}`}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                    <div className="rhombus-node-wrap">
                      <div className="rhombus-node">
                        <img 
                          src={act.image || batch.itinerary[activeDay-1].dayImage} 
                          alt="Activity" 
                          className="rhombus-img"
                        />
                      </div>
                      <div className="smart-icon-badge">
                        {React.cloneElement(act.icon, { size: 14 })}
                      </div>
                    </div>

                    <div className="activity-details">
                      <span className="time-label">{act.time}</span>
                      <h3 className="activity-text">{act.text}</h3>
                      {act.map && (
                        <a href={act.map} target="_blank" rel="noreferrer" className="map-link">
                          <MapPin size={14} /> EXPLORE ON MAP
                        </a>
                      )}
                    </div>
                  </motion.div>
                )})}
              </div>

              <div className="day-footer">
                <Clock size={20} />
                <span>{batch.itinerary[activeDay-1].footer}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const FloatingIcon = ({ icon, top, left, delay }) => (
  <motion.div 
    className="bg-floating-icon"
    style={{ top, left }}
    animate={{ 
      y: [0, -30, 0],
      rotate: [0, 10, 0],
      opacity: [0.1, 0.2, 0.1]
    }}
    transition={{ 
      duration: 6 + delay, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay 
    }}
  >
    {icon}
  </motion.div>
);

export default BatchesScreen;
