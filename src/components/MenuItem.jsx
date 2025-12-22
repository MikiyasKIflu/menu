import React from 'react';
import { getCategoryImage } from '../utils/imageMapper';

const MenuItem = ({ item, language = 'en' }) => {
    if (!item.is_available) return null;

    // Use external image URL if available, otherwise fallback to local source based on category
    const imageSrc = item.image_url || getCategoryImage(item.category, item.name_en || item.name_local);

    const displayName = language === 'en'
        ? item.name_en
        : language === 'om'
            ? (item.name_om || item.name_en)
            : language === 'so'
                ? (item.name_so || item.name_en)
                : (item.name_local || item.name_en);

    return (
        <div className="glass-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: '100%',
            border: '1px solid var(--glass-border)'
        }}>
            <div style={{ height: '220px', overflow: 'hidden' }}>
                <img
                    src={imageSrc}
                    alt={displayName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{displayName}</h3>
                    <span style={{
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                        {item.price} ETB
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MenuItem;
