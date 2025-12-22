import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Shield, Menu, Sun, Moon } from 'lucide-react';
import { getLogo } from '../utils/imageMapper';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = ({ onMenuClick }) => {
    const { user, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <nav className="glass-panel" style={{
            position: 'sticky',
            top: 10,
            zIndex: 100,
            padding: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={onMenuClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
                    <Menu size={28} />
                </button>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)' }}>
                        <img src={getLogo()} alt="Ayu Shiro Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontWeight: '800', fontSize: '1.4rem', letterSpacing: '-0.5px', fontFamily: '"Playfair Display", serif' }}> Ayu Shiro</span>
                </Link>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                    onClick={toggleTheme}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                    padding: '2px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--glass-border)'
                }}>
                    {[
                        { code: 'en', flag: 'gb' },
                        { code: 'am', flag: 'et' },
                        { code: 'om', flag: 'et' },
                        { code: 'so', flag: 'so' }
                    ].map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            style={{
                                background: language === lang.code ? 'var(--primary)' : 'none',
                                border: 'none',
                                borderRadius: '50%',
                                padding: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s',
                                position: 'relative'
                            }}
                            title={lang.code.toUpperCase()}
                        >
                            <img
                                src={`https://flagcdn.com/w40/${lang.flag}.png`}
                                alt={lang.code}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    filter: language === lang.code ? 'none' : 'grayscale(0.4) opacity(0.7)'
                                }}
                            />
                            {(lang.code === 'am' || lang.code === 'om') && (
                                <span style={{
                                    position: 'absolute',
                                    bottom: -2,
                                    right: -2,
                                    fontSize: '8px',
                                    fontWeight: 'bold',
                                    color: language === lang.code ? 'white' : 'var(--text-muted)',
                                    background: language === lang.code ? 'var(--primary)' : 'var(--bg-card)',
                                    borderRadius: '2px',
                                    padding: '0 2px'
                                }}>
                                    {lang.code.toUpperCase()}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                {user ? (
                    <>
                        <Link to="/admin" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', width: 'auto' }}>
                            Dashboard
                        </Link>
                        <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.5rem', width: 'auto', display: 'flex', alignItems: 'center' }}>
                            <LogOut size={18} />
                        </button>
                    </>
                ) : (
                    <Link to="/login" style={{ color: 'var(--text-muted)' }}>
                        <Shield size={20} />
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
