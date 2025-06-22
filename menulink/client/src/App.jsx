import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function Landing() {
  const navigate = useNavigate();
  async function createMenu() {
    const res = await fetch(`${API}/api/admin/create`, { method: 'POST' });
    const data = await res.json();
    navigate(data.adminUrl);
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">MENULINK</h1>
      <button className="bg-blue-500 text-white px-4 py-2" onClick={createMenu}>
        Créer un menu
      </button>
    </div>
  );
}

function EditMenu() {
  const { id } = useParams();
  const token = new URLSearchParams(window.location.search).get('token');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', allergens: '', image_url: '', available: true });

  useEffect(() => {
    fetch(`${API}/api/admin/menu/${id}?token=${token}`).then(r => r.json()).then(setItems);
  }, [id, token]);

  const save = async () => {
    await fetch(`${API}/api/admin/menu/${id}/item?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ name: '', price: '', allergens: '', image_url: '', available: true });
    const r = await fetch(`${API}/api/admin/menu/${id}?token=${token}`);
    setItems(await r.json());
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Édition du menu</h1>
      <div className="mb-4 space-y-2">
        <input className="border p-1 w-full" placeholder="Nom" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="border p-1 w-full" placeholder="Prix" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
        <input className="border p-1 w-full" placeholder="Allergènes" value={form.allergens} onChange={e=>setForm({...form,allergens:e.target.value})} />
        <input className="border p-1 w-full" placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} />
        <label className="block"><input type="checkbox" checked={form.available} onChange={e=>setForm({...form,available:e.target.checked})}/> Disponible</label>
        <button className="bg-green-500 text-white px-3 py-1" onClick={save}>Ajouter</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(it => (
          <div key={it.id} className="border p-2">
            {it.image_url && <img src={it.image_url} className="w-full h-32 object-cover"/>}
            <h3 className="font-bold">{it.name}</h3>
            <p>{it.price}€</p>
            <p className="text-sm">{it.allergens}</p>
            {!it.available && <p className="text-red-500">Indisponible</p>}
          </div>
        ))}
      </div>
      <Link to={`/menu/${id}`} className="text-blue-600 underline block mt-4">Voir le menu public</Link>
    </div>
  );
}

function PublicMenu() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/menu/${id}`).then(r => r.json()).then(setItems);
  }, [id]);
  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(it => (
          <div key={it.id} className="border p-2">
            {it.image_url && <img src={it.image_url} className="w-full h-32 object-cover"/>}
            <h3 className="font-bold">{it.name}</h3>
            <p>{it.price}€</p>
            <p className="text-sm">{it.allergens}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/edit/:id" element={<EditMenu />} />
        <Route path="/menu/:id" element={<PublicMenu />} />
      </Routes>
    </BrowserRouter>
  );
}
