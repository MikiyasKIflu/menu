import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import MenuItem from '../components/MenuItem';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import AOS from 'aos';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

const PublicMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { language, setLanguage } = useLanguage();

    const t = translations[language];

    useEffect(() => {
        // Initialize AOS
        AOS.init({
            duration: 800,
            once: true,
            offset: 50
        });

        if (!supabase) {
            setLoading(false);
            return;
        }
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        if (!supabase) return;
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .select('*')
                .order('category')
                .order('name_en');

            if (error) throw error;
            setMenuItems(data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'All', label: t.all },
        { id: 'Lunch & Dinner', label: t.lunch_dinner },
        { id: 'Breakfast', label: t.breakfast },
        { id: 'Pasta & Rice', label: t.pasta_rice },
        { id: 'Hot Drinks', label: t.hot_drinks },
        { id: 'Cold Drinks', label: t.cold_drinks }
    ];

    const filteredItems = categoryFilter === 'All'
        ? menuItems
        : menuItems.filter(item => item.category === categoryFilter);

    // Group items by category if "All" is selected for better UX
    const groupedItems = categoryFilter === 'All'
        ? categories.filter(c => c.id !== 'All').reduce((acc, cat) => {
            acc[cat.id] = {
                items: menuItems.filter(item => item.category === cat.id),
                label: cat.label
            };
            return acc;
        }, {})
        : { [categoryFilter]: { items: filteredItems, label: categories.find(c => c.id === categoryFilter)?.label } };

    return (
        <div className="container">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} language={language} />

            {/* Navbar with Menu Toggle */}
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

            <header id="website-section" style={{
                textAlign: 'center',
                padding: '5rem 1rem',
                marginBottom: '3rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)', // Increased visibility
                borderRadius: 'var(--border-radius)',
                border: '2px solid var(--primary)', // Stronger border
                backdropFilter: 'blur(15px)',
                boxShadow: 'var(--shadow)'
            }} data-aos="fade-down">
                <h1 className="breathing-text" style={{
                    fontSize: 'clamp(3rem, 10vw, 4.5rem)',
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(to right, var(--primary), var(--accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 800,
                    letterSpacing: '-1px'
                }}>
                    Ayu Shiro
                </h1>
                <p style={{
                    color: 'var(--text-main)',
                    fontSize: '1.4rem',
                    fontWeight: '500',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                }}>{t.slogan}</p>
            </header>

            {/* Language Selection (Main 4) */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '1rem',
                flexWrap: 'wrap'
            }} data-aos="fade-down">
                {[
                    { code: 'am', label: 'Amharic' },
                    { code: 'en', label: 'English' },
                    { code: 'so', label: 'Somali' },
                    { code: 'om', label: 'Afan Oromo' }
                ].map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        style={{
                            background: language === lang.code ? 'var(--primary)' : 'none',
                            border: '1px solid var(--primary)',
                            color: language === lang.code ? 'white' : 'var(--primary)',
                            padding: '0.4rem 1rem',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            transition: 'all 0.3s'
                        }}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>

            {/* Category Filter */}
            <div
                style={{
                    display: 'flex',
                    gap: '0.75rem',
                    overflowX: 'auto',
                    paddingBottom: '1rem',
                    marginBottom: '2rem',
                    scrollbarWidth: 'none',
                    justifyContent: 'flex-start', // Support scrolling
                    flexWrap: 'nowrap',
                    padding: '0.5rem'
                }}
                className="hide-scrollbar"
                data-aos="fade-right"
            >
                {categories.map((cat, index) => (
                    <button
                        key={cat.id}
                        onClick={() => setCategoryFilter(cat.id)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '50px',
                            border: '1px solid var(--primary)',
                            background: categoryFilter === cat.id ? 'var(--primary)' : 'var(--btn-bg)',
                            color: categoryFilter === cat.id ? 'white' : 'var(--primary)',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.3s',
                            boxShadow: categoryFilter === cat.id ? '0 4px 15px rgba(211, 84, 0, 0.3)' : 'var(--shadow)',
                            flexShrink: 0
                        }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {(!supabase) ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#e74c3c' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Configuration Error</h2>
                    <p>Supabase connection is missing.</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: 'var(--text-muted)' }}>
                        Please create a <code>.env</code> file with your <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_KEY</code>.
                    </p>
                </div>
            ) : loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>☕</div>
                    {t.loading}
                </div>
            ) : (
                <div id="menu-section" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4rem',
                    padding: '4rem 1.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)', // More distinct menu bg
                    borderRadius: 'var(--border-radius)',
                    marginTop: '3rem',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'inset 0 0 50px rgba(0,0,0,0.02)'
                }}>
                    {Object.entries(groupedItems).map(([id, data]) => (
                        data.items.length > 0 && (
                            <div key={id} data-aos="fade-up">
                                <h2 style={{
                                    marginBottom: '1.5rem',
                                    color: 'var(--secondary)',
                                    borderBottom: '2px solid rgba(255,255,255,0.1)',
                                    paddingBottom: '0.5rem',
                                    display: 'inline-block'
                                }}>
                                    {data.label}
                                </h2>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // auto-fit for balance
                                    gap: '2.5rem', // Generous spacing
                                    justifyContent: 'center'
                                }}>
                                    {data.items.map((item, i) => (
                                        <div key={item.id} data-aos="fade-up" data-aos-delay={i * 50}>
                                            <MenuItem item={item} language={language} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}

            {/* Feedback Section */}
            <div id="feedback-section" style={{
                marginTop: '4rem',
                backgroundColor: 'var(--primary)', // Bold background
                padding: '5rem 2rem',
                borderRadius: 'var(--border-radius)',
                textAlign: 'center',
                color: 'white',
                boxShadow: '0 20px 40px rgba(47, 133, 90, 0.2)'
            }} data-aos="fade-up">
                <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '2.5rem' }}>{t.feedback}</h2>
                <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2.5rem', fontSize: '1.2rem' }}>We value your opinion! Tell us how we're doing.</p>
                <button className="btn" style={{ background: 'white', color: 'var(--primary)', border: 'none', padding: '1rem 2.5rem' }} onClick={() => alert(t.feedback + ' ' + t.coming_soon)}>
                    Submit Feedback
                </button>
            </div>

            {/* Review Section */}
            <div id="review-section" style={{
                marginTop: '4rem',
                backgroundColor: 'var(--accent)', // Bold background
                padding: '5rem 2rem',
                borderRadius: 'var(--border-radius)',
                textAlign: 'center',
                color: 'white',
                boxShadow: '0 20px 40px rgba(212, 163, 115, 0.2)'
            }} data-aos="fade-up">
                <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '2.5rem' }}>{t.review}</h2>
                <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2.5rem', fontSize: '1.2rem' }}>Love our food? Leave us a review!</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem', fontSize: '2rem', color: '#f1c40f' }}>
                    ★★★★★
                </div>
                <button className="btn" style={{ background: 'white', color: 'var(--accent)', border: 'none', padding: '1rem 2.5rem' }} onClick={() => alert(t.review + ' ' + t.coming_soon)}>
                    Write a Review
                </button>
            </div>

            <div id="contact-section" style={{
                marginTop: '4rem',
                backgroundColor: '#1a1a1a', // Distinct dark footer
                padding: '4rem 2rem',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 -10px 30px rgba(0,0,0,0.1)'
            }}>
                <Footer language={language} />
            </div>
        </div>
    );
};

export default PublicMenu;
