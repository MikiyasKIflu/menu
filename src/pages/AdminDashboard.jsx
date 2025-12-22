import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import MenuForm from '../components/MenuForm';
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

const AdminDashboard = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMenuItems(data);
        } catch (error) {
            console.error('Error fetching menu:', error);
            alert('Error loading menu items');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (itemData) => {
        try {
            if (itemToEdit) {
                // Update
                const { error } = await supabase
                    .from('menu_items')
                    .update(itemData)
                    .eq('id', itemToEdit.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('menu_items')
                    .insert([itemData]);
                if (error) throw error;
            }

            setIsEditing(false);
            setItemToEdit(null);
            fetchMenuItems();
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Error saving item: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const { error } = await supabase
                .from('menu_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchMenuItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item');
        }
    };

    const toggleAvailability = async (id, currentStatus) => {
        try {
            const { error } = await supabase
                .from('menu_items')
                .update({ is_available: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            fetchMenuItems();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="container">
            <Navbar />

            <div style={{ marginBottom: '2rem' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '1rem' }}>
                    <ArrowLeft size={18} /> Back to Menu
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Menu Management</h1>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="btn" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={18} /> Add New Item
                        </button>
                    )}
                </div>
            </div>

            {isEditing && (
                <MenuForm
                    itemToEdit={itemToEdit}
                    onSave={handleSave}
                    onCancel={() => { setIsEditing(false); setItemToEdit(null); }}
                />
            )}

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Category</th>
                            <th style={{ padding: '1rem' }}>Price</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>{item.name_en}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.name_local}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>{item.category}</td>
                                <td style={{ padding: '1rem' }}>{item.price} ETB</td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => toggleAvailability(item.id, item.is_available)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: item.is_available ? 'var(--success)' : 'var(--text-muted)'
                                        }}
                                    >
                                        {item.is_available ? <Eye size={18} /> : <EyeOff size={18} />}
                                        {item.is_available ? 'Active' : 'Hidden'}
                                    </button>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => { setItemToEdit(item); setIsEditing(true); }}
                                            className="btn btn-secondary"
                                            style={{ padding: '0.5rem' }}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="btn btn-danger"
                                            style={{ padding: '0.5rem' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {menuItems.length === 0 && !loading && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No items found. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
