import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ArrowLeft, Trophy, Star } from 'lucide-react';
import './AwardsScreen.css';

const AWARDS_DATA = [
  { id: 1,  category: "Best MO Territory - South -1 A",                          bu: "Fertilisers"  },
  { id: 2,  category: "Best MO Territory - South- 1 B",                          bu: "Fertilisers"  },
  { id: 3,  category: "Best MO Territory - South-2",                             bu: "Fertilisers"  },
  { id: 4,  category: "Best MO Territory - East",                                bu: "Fertilisers"  },
  { id: 5,  category: "Best MO Territory - West",                                bu: "Fertilisers"  },
  { id: 6,  category: "Best MO Territory - Central",                             bu: "Fertilisers"  },
  { id: 7,  category: "Best MO Territory - North",                               bu: "Fertilisers"  },
  { id: 8,  category: "Best Trade Marketing Manager",                            bu: "Fertilisers"  },
  { id: 9,  category: "Best Agronomist",                                         bu: "Fertilisers"  },
  { id: 10, category: "Best Agronomist",                                         bu: "Fertilisers"  },
  { id: 11, category: "Best Senior Agronomist",                                  bu: "Fertilisers"  },
  { id: 12, category: "Best Institutional Business Executive",                   bu: "Fertilisers"  },
  { id: 13, category: "Best Institutional Business Executive",                   bu: "Fertilisers"  },
  { id: 14, category: "Best Zone - SSP Focus Grades",                            bu: "Fertilisers"  },
  { id: 15, category: "Best Zone - SSP Focus Grades",                            bu: "Fertilisers"  },
  { id: 16, category: "Best Zone - SSP Focus Grades",                            bu: "Fertilisers"  },
  { id: 17, category: "Best Zone - Complex",                                     bu: "Fertilisers"  },
  { id: 18, category: "Best Zone - Complex",                                     bu: "Fertilisers"  },
  { id: 19, category: "Gromor Drive Initiatives",                                bu: "Gromor Drive" },
  { id: 20, category: "Best Regional Logistics Manager",                         bu: "Fertilisers"  },
  { id: 21, category: "Best Warehousing Officer",                                bu: "Fertilisers"  },
  { id: 22, category: "Best Division - Finance",                                 bu: "Corporate"    },
  { id: 23, category: "Best Division - Finance",                                 bu: "Corporate"    },
  { id: 24, category: "Best HR Operations & Excellence",                         bu: "Corporate"    },
  { id: 25, category: "Best Division - Overall Performance",                     bu: "Fertilisers"  },
  { id: 26, category: "Best Division - Fertilisers & SSP",                      bu: "Fertilisers"  },
  { id: 27, category: "Best Division - Fertilisers & SSP",                      bu: "Fertilisers"  },
  { id: 28, category: "Best Territory Manager - Speciality & New Products",     bu: "CPC"          },
  { id: 29, category: "Best TM - Prachand",                                      bu: "CPC"          },
  { id: 30, category: "Special Appreciation - Prachand",                         bu: "CPC"          },
  { id: 31, category: "Best TM - Benofit",                                       bu: "CPC"          },
  { id: 32, category: "Best Territory Manager",                                  bu: "CPC"          },
  { id: 33, category: "Best Territory Manager",                                  bu: "CPC"          },
  { id: 34, category: "Best Territory Manager",                                  bu: "CPC"          },
  { id: 35, category: "Best Demand Creation Manager",                            bu: "CPC"          },
  { id: 36, category: "Best Zone - Fantac Plus & Variants",                      bu: "CPC"          },
  { id: 37, category: "Best Zone - Speciality & New Products",                   bu: "CPC"          },
  { id: 38, category: "Fungicide Champion Zone - Winner",                        bu: "CPC"          },
  { id: 39, category: "Insecticide Champion Zone - Winner",                      bu: "CPC"          },
  { id: 40, category: "Financial Discipline Champions Zone - Winner",            bu: "CPC"          },
  { id: 41, category: "Financial Discipline Champions Zone - Winner",            bu: "CPC"          },
  { id: 42, category: "Best Zone",                                               bu: "CPC"          },
  { id: 43, category: "Best Zone",                                               bu: "CPC"          },
  { id: 44, category: "Best Zone",                                               bu: "CPC"          },
  { id: 45, category: "Best Region",                                             bu: "CPC"          },
  { id: 46, category: "Best Sales Manager - Exports",                            bu: "CPC"          },
  { id: 47, category: "Best Division",                                           bu: "CPC"          },
  { id: 48, category: "Best Division",                                           bu: "CPC"          },
  { id: 49, category: "Best Marketing Officer - Organic Fertiliser",             bu: "SND"          },
  { id: 50, category: "Best Marketing Officer - Exclusive Region",               bu: "SND"          },
  { id: 51, category: "Best Marketing Officer - Common Region",                  bu: "SND"          },
  { id: 52, category: "Best Marketing Officer - Super 6 Products (Exclusive)",   bu: "SND"          },
  { id: 53, category: "Best Marketing Officer - Super 6 Products (Common)",      bu: "SND"          },
  { id: 54, category: "Best Agronomist SND & Organic - Exclusive Region",        bu: "SND"          },
  { id: 55, category: "Best Agronomist SND & Organic - Common Region",           bu: "SND"          },
  { id: 56, category: "Best Sr. Agronomist - Exclusive Region",                  bu: "SND"          },
  { id: 57, category: "Best Sr. Agronomist - Common Region",                     bu: "SND"          },
  { id: 58, category: "Best Zone - Organic Fertiliser",                          bu: "SND"          },
  { id: 59, category: "Best Zone - Common Region",                               bu: "SND"          },
  { id: 60, category: "Best Zone - Exclusive Region",                            bu: "SND"          },
  { id: 61, category: "Best Marketing Officer",                                  bu: "Nano"         },
  { id: 62, category: "Best Marketing Officer",                                  bu: "Nano"         },
  { id: 63, category: "Best Agronomist",                                         bu: "Nano"         },
  { id: 64, category: "Best Agronomist",                                         bu: "Nano"         },
  { id: 65, category: "Best Zonal Manager",                                      bu: "Nano"         },
  { id: 66, category: "Best Divisional Agronomist",                              bu: "Nano"         },
  { id: 67, category: "Best Business Development Manager",                       bu: "Nano"         },
  { id: 68, category: "Best Division - SND & Organic Common Region",             bu: "SND"          },
  { id: 69, category: "Best Region - SND & Organic Exclusive Region",            bu: "SND"          },
  { id: 70, category: "Best Business Unit",                                      bu: "Corporate"    },
  { id: 71, category: "Best Business Unit",                                      bu: "Corporate"    },
  { id: 72, category: "Best Corporate Function",                                 bu: "Corporate"    },
  { id: 73, category: "Marketing Communication",                                 bu: "Corporate"    },
  { id: 74, category: "Industrial Relations",                                    bu: "Corporate"    },
  { id: 75, category: "Industrial Relations",                                    bu: "Corporate"    },
  { id: 76, category: "Fertiliser - Functional Excellence",                      bu: "Corporate"    },
  { id: 77, category: "Fertiliser - Functional Excellence",                      bu: "Corporate"    },
  { id: 78, category: "SSP - Functional Excellence",                             bu: "Corporate"    },
  { id: 79, category: "SND - Functional Excellence",                             bu: "Corporate"    },
  { id: 80, category: "Nano - Functional Excellence",                            bu: "Corporate"    },
  { id: 81, category: "CPC - Functional Excellence",                             bu: "Corporate"    },
  { id: 82, category: "Bio - Functional Excellence",                             bu: "Corporate"    },
  { id: 83, category: "Retail - Functional Excellence",                          bu: "Corporate"    },
];

const BU_CONFIG = {
  "Corporate":    { color: "#f59e0b", glow: "rgba(245,158,11,0.6)",  label: "Corporate"    },
  "CPC":          { color: "#06b6d4", glow: "rgba(6,182,212,0.6)",   label: "CPC"          },
  "Fertilisers":  { color: "#22c55e", glow: "rgba(34,197,94,0.6)",   label: "Fertilisers"  },
  "Gromor Drive": { color: "#f97316", glow: "rgba(249,115,22,0.6)",  label: "Gromor Drive" },
  "Nano":         { color: "#a855f7", glow: "rgba(168,85,247,0.6)",  label: "Nano"         },
  "SND":          { color: "#14b8a6", glow: "rgba(20,184,166,0.6)",  label: "SND & ORGANIC"},
};

const BU_FILTERS = ["Corporate", "CPC", "Fertilisers", "Gromor Drive", "Nano", "SND"];

export default function AwardsScreen({ onBack }) {
  const [selectedBU, setSelectedBU] = useState(null);

  const sortedAwards = selectedBU
    ? AWARDS_DATA.filter(a => a.bu === selectedBU)
    : AWARDS_DATA;

  const handleBUClick = (bu) => {
    setSelectedBU(prev => prev === bu ? null : bu);
  };

  return (
    <div className="aw-screen">
      {/* Ambient background */}
      <div className="aw-bg-stars" />
      <div className="aw-bg-orb aw-orb1" />
      <div className="aw-bg-orb aw-orb2" />
      <div className="aw-bg-orb aw-orb3" />

      {/* Header */}
      <header className="aw-header">
        <button className="aw-back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>RETURN</span>
        </button>
        <div className="aw-header-center">
          <Trophy size={32} className="aw-trophy-icon" />
          <h1 className="aw-title">AWARDS</h1>
          <Trophy size={32} className="aw-trophy-icon" />
        </div>
        <p className="aw-subtitle">ABM 2026 Summit · Recognition of Excellence</p>
      </header>

      {/* BU Filter Pills */}
      <div className="aw-filter-row">
        {BU_FILTERS.map(bu => {
          const cfg = BU_CONFIG[bu];
          const isActive = selectedBU === bu;
          return (
            <motion.button
              key={bu}
              className={`aw-filter-pill ${isActive ? 'active' : ''}`}
              style={{
                '--pill-color': cfg.color,
                '--pill-glow': cfg.glow,
                borderColor: isActive ? cfg.color : 'rgba(255,255,255,0.12)',
                color: isActive ? cfg.color : 'rgba(255,255,255,0.65)',
                background: isActive
                  ? `linear-gradient(135deg, ${cfg.glow} 0%, rgba(0,0,0,0) 100%)`
                  : 'rgba(255,255,255,0.04)',
                boxShadow: isActive ? `0 0 20px ${cfg.glow}, 0 0 40px ${cfg.glow}` : 'none',
              }}
              onClick={() => handleBUClick(bu)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {isActive && <Star size={12} fill="currentColor" />}
              {cfg.label}
            </motion.button>
          );
        })}
      </div>


      {/* Awards Grid */}
      <LayoutGroup>
        <div className="aw-grid">
          {sortedAwards.map((award) => {
            const isHighlighted = selectedBU && award.bu === selectedBU;
            const isDimmed = selectedBU && award.bu !== selectedBU;
            const cfg = BU_CONFIG[award.bu];

            return (
              <motion.div
                key={award.id}
                layout
                className={`aw-card ${isHighlighted ? 'highlighted' : ''} ${isDimmed ? 'dimmed' : ''}`}
                style={{
                  '--card-color': cfg.color,
                  '--card-glow': cfg.glow,
                  borderColor: isHighlighted ? cfg.color : 'rgba(255,255,255,0.07)',
                  boxShadow: isHighlighted
                    ? `0 0 20px ${cfg.glow}, 0 0 50px ${cfg.glow.replace('0.6', '0.25')}, inset 0 0 20px ${cfg.glow.replace('0.6', '0.08')}`
                    : 'none',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isDimmed ? 0.22 : 1,
                  y: 0,
                  scale: isHighlighted ? 1.02 : 1,
                }}
                transition={{ duration: 0.4, layout: { duration: 0.5, type: 'spring', stiffness: 200, damping: 28 } }}
              >
                {/* Glow sweep on highlighted */}
                {isHighlighted && <div className="aw-card-sweep" style={{ '--sweep-color': cfg.color }} />}

                <div className="aw-card-top">
                  <span
                    className="aw-card-bu-badge"
                    style={{ background: cfg.color + '22', color: cfg.color, borderColor: cfg.color + '55' }}
                  >
                    {cfg.label}
                  </span>
                  {isHighlighted && (
                    <motion.span
                      className="aw-card-star"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      ★
                    </motion.span>
                  )}
                </div>

                <h3
                  className="aw-card-category"
                  style={{ color: isHighlighted ? cfg.color : 'rgba(255,255,255,0.9)' }}
                >
                  {award.category}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
