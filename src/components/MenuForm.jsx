import React, { useState, useEffect } from 'react';

const MenuForm = ({ itemToEdit, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name_en: '',
        name_local: '',
        price: '',
        category: 'Lunch & Dinner',
        image_url: ''
    });

    useEffect(() => {
        if (itemToEdit) {
            setFormData({
                name_en: itemToEdit.name_en,
                name_local: itemToEdit.name_local,
                price: itemToEdit.price,
                category: itemToEdit.category,
                image_url: itemToEdit.image_url || ''
            });
        }
    }, [itemToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{itemToEdit ? 'Edit Item' : 'Add New Item'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Name (English)</label>
                        <input
                            name="name_en"
                            value={formData.name_en}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Name (Local)</label>
                        <input
                            name="name_local"
                            value={formData.name_local}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Price (ETB)</label>
                        <input
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="Lunch & Dinner">Lunch & Dinner</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Pasta & Rice">Pasta & Rice</option>
                            <option value="Hot Drinks">Hot Drinks</option>
                            <option value="Cold Drinks">Cold Drinks</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Image URL (Optional)</label>
                    <input
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="https://..."
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn">
                        {itemToEdit ? 'Update Item' : 'Add Item'}
                    </button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MenuForm;
