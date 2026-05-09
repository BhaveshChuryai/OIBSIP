/**
 * Admin Inventory Page
 * Table of all ingredients with inline stock editing and threshold management.
 */
import { useState, useEffect } from 'react';
import { getInventory, updateInventory, updateThreshold } from '../api/adminApi';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import { FiSave, FiAlertTriangle } from 'react-icons/fi';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [editThreshold, setEditThreshold] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchInventory = async () => {
    try {
      const { data } = await getInventory();
      setInventory(data);
    } catch (err) {
      console.error('Fetch inventory error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditQty(item.quantity.toString());
    setEditThreshold(item.threshold.toString());
  };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      await updateInventory(id, parseInt(editQty));
      await updateThreshold(id, parseInt(editThreshold));
      setEditingId(null);
      await fetchInventory();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const categoryEmoji = { base: '🫓', sauce: '🥫', cheese: '🧀', veggie: '🥬' };

  if (loading) return <Loader text="Loading inventory..." />;

  return (
    <div className="admin-inventory" id="admin-inventory-page">
      <h1 className="page-title">📦 Inventory Management</h1>
      <div className="admin-table-wrapper">
        <table className="admin-table inventory-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Ingredient</th>
              <th>Stock</th>
              <th>Threshold</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, i) => {
              const isLow = item.quantity <= item.threshold;
              const isEditing = editingId === item._id;
              return (
                <motion.tr
                  key={item._id}
                  className={isLow ? 'row-low-stock' : ''}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <td><span className="category-badge">{categoryEmoji[item.category]} {item.category}</span></td>
                  <td className="item-name">{item.name}</td>
                  <td>
                    {isEditing ? (
                      <input type="number" className="inline-input" value={editQty} onChange={e => setEditQty(e.target.value)} min="0" />
                    ) : (
                      <span className={isLow ? 'text-danger' : ''}>{item.quantity}</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input type="number" className="inline-input" value={editThreshold} onChange={e => setEditThreshold(e.target.value)} min="0" />
                    ) : (
                      item.threshold
                    )}
                  </td>
                  <td>₹{item.price}</td>
                  <td>
                    {isLow ? (
                      <span className="status-badge status-low"><FiAlertTriangle /> Low</span>
                    ) : (
                      <span className="status-badge status-ok">OK</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <button className="btn btn-sm btn-primary" onClick={() => saveEdit(item._id)} disabled={saving}>
                        <FiSave /> {saving ? '...' : 'Save'}
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-outline" onClick={() => startEdit(item)}>Edit</button>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;
