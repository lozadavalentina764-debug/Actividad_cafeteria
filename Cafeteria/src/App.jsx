import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [pqrs, setPqrs] = useState([]);

  const [nuevoProducto, setNuevoProducto] = useState({ nombre_producto: '', stock_actual: '', precio: '' });
  const [nuevoPqr, setNuevoPqr] = useState({ tipo: 'Sugerencia', comentario: '' });

  const cargarDatos = () => {
    axios.get('http://23.100.73.203:3000/api/pos-local').then(res => setProductos(Array.isArray(res.data) ? res.data : [])).catch(() => setProductos([]));
    axios.get('http://23.100.73.203:3000/api/ventas-local').then(res => setVentas(Array.isArray(res.data) ? res.data : [])).catch(() => setVentas([]));
    axios.get('http://23.100.73.203:3000/api/clientes-azure').then(res => setClientes(Array.isArray(res.data) ? res.data : [])).catch(() => setClientes([]));
    axios.get('http://23.100.73.203:3000/api/empleados-azure').then(res => setEmpleados(Array.isArray(res.data) ? res.data : [])).catch(() => setEmpleados([]));
    axios.get('http://23.100.73.203:3000/api/alertas-supabase').then(res => setAlertas(Array.isArray(res.data) ? res.data : [])).catch(() => setAlertas([]));
    axios.get('http://23.100.73.203:3000/api/pqr-supabase').then(res => setPqrs(Array.isArray(res.data) ? res.data : [])).catch(() => setPqrs([]));
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleGuardarProducto = (e) => {
    e.preventDefault();
    axios.post('http://23.100.73.203:3000/api/pos-local', nuevoProducto).then(() => {
      alert('✨ ¡Producto registrado con éxito!');
      setNuevoProducto({ nombre_producto: '', stock_actual: '', precio: '' });
      cargarDatos();
    }).catch(err => console.error(err));
  };

  const handleGuardarPqr = (e) => {
    e.preventDefault();
    axios.post('http://23.100.73.203:3000/api/pqr-supabase', nuevoPqr).then(() => {
      alert(' ¡PQR enviada correctamente!');
      setNuevoPqr({ tipo: 'Sugerencia', comentario: '' });
      cargarDatos();
    }).catch(err => console.error(err));
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '30px 20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', color: '#1e293b' }}>
      
      {/* ENCABEZADO PRINCIPAL */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#0f172a', marginBottom: '10px' }}> Panel Administrativo Multi-Cloud SENA</h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}> Sistema de Gestión Integrado (XAMPP  | Azure  | Supabase )</p>
      </header>

      {/* SECCIÓN DE ACCIONES / FORMULARIOS (REORGANIZADA ARRIBA EN DOS BLOQUES MODERNOS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto 40px auto' }}>
        
        {/* Formulario XAMPP */}
        <div style={{ background: '#ffffff', borderTop: '4px solid #3b82f6', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: '#1d4ed8' }}> Registrar Producto (Local)</h3>
          <form onSubmit={handleGuardarProducto} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
            <input type="text" placeholder=" Nombre del producto" value={nuevoProducto.nombre_producto} onChange={e => setNuevoProducto({...nuevoProducto, nombre_producto: e.target.value})} required style={inputStyle} />
            <input type="number" placeholder=" Stock inicial" value={nuevoProducto.stock_actual} onChange={e => setNuevoProducto({...nuevoProducto, stock_actual: e.target.value})} required style={inputStyle} />
            <input type="number" step="0.01" placeholder=" Precio unitario" value={nuevoProducto.precio} onChange={e => setNuevoProducto({...nuevoProducto, precio: e.target.value})} required style={inputStyle} />
            <button type="submit" style={{ ...btnStyle, background: '#3b82f6' }}> Guardar en XAMPP</button>
          </form>
        </div>

        {/* Formulario Supabase */}
        <div style={{ background: '#ffffff', borderTop: '4px solid #10b981', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: '#047857' }}> Enviar PQR / Comentario (Supabase)</h3>
          <form onSubmit={handleGuardarPqr} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
            <select value={nuevoPqr.tipo} onChange={e => setNuevoPqr({...nuevoPqr, tipo: e.target.value})} style={inputStyle}>
              <option value="Sugerencia"> Sugerencia</option>
              <option value="Queja"> Queja</option>
              <option value="Reclamo"> Reclamo</option>
            </select>
            <textarea placeholder=" Escribe tu comentario aquí..." value={nuevoPqr.comentario} onChange={e => setNuevoPqr({...nuevoPqr, comentario: e.target.value})} required rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            <button type="submit" style={{ ...btnStyle, background: '#10b981' }}> Enviar PQR</button>
          </form>
        </div>

      </div>

      {/* DASHBOARD DE 6 TARJETAS (DISEÑO LIMPIO Y MODERNO) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px', maxWidth: '1300px', margin: '0 auto' }}>
        
        {/* Tarjeta 1 */}
        <div style={cardStyle}>
          <h3 style={{ color: '#2563eb' }}> 1. Inventario POS (XAMPP)</h3>
          <ul style={listStyle}>
            {productos.map(p => <li key={p.id_producto || p.id} style={itemStyle}> <b>{p.nombre_producto}</b> | Stock: {p.stock_actual} | ${p.precio}</li>)}
          </ul>
        </div>

        {/* Tarjeta 2 */}
        <div style={cardStyle}>
          <h3 style={{ color: '#2563eb' }}> 2. Ventas Diarias (XAMPP)</h3>
          <ul style={listStyle}>
            {ventas.map(v => <li key={v.id_venta || v.id} style={itemStyle}> Venta #{v.id_venta || v.id} ➔ Cantidad: {v.cantidad_vendida}</li>)}
          </ul>
        </div>

        {/* Tarjeta 3 */}
        <div style={cardStyle}>
          <h3 style={{ color: '#0284c7' }}> 3. Clientes SENA (Azure)</h3>
          <ul style={listStyle}>
            {clientes.map(c => <li key={c.id_aprendiz || c.id} style={itemStyle}> <b>{c.nombres}</b><br/><small style={{color: '#64748b'}}> {c.programa_formacion}</small></li>)}
          </ul>
        </div>

        {/* Tarjeta 4 */}
        <div style={cardStyle}>
          <h3 style={{ color: '#0284c7' }}> 4. Empleados (Azure)</h3>
          <ul style={listStyle}>
            {empleados.map(e => <li key={e.id_empleado || e.id} style={itemStyle}> <b>{e.nombre}</b><br/><small style={{color: '#64748b'}}> Turno: {e.turno} ({e.rol})</small></li>)}
          </ul>
        </div>

        {/* Tarjeta 5 */}
        <div style={cardStyle}>
          <h3 style={{ color: '#059669' }}> 5. Alertas de Inventario (Supabase)</h3>
          <ul style={listStyle}>
            {alertas.map(a => <li key={a.id_alerta || a.id} style={itemStyle}> {a.mensaje_alerta} <span style={{fontSize: '0.8rem', background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px'}}>{a.criticidad}</span></li>)}
          </ul>
        </div>

        {/* Tarjeta 6 */}
        <div style={cardStyle}>
          <h3 style={{ color: '#059669' }}> 6. Buzón PQRs (Supabase)</h3>
          <ul style={listStyle}>
            {pqrs.map(q => <li key={q.id_pqr || q.id} style={itemStyle}> <b>[{q.tipo}]</b>: {q.comentario}</li>)}
          </ul>
        </div>

      </div>
    </div>
  );
}

// Estilos reutilizables para que el código quede limpio y ordenado
const inputStyle = { padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' };
const btnStyle = { padding: '10px', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.2s' };
const cardStyle = { background: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const listStyle = { paddingLeft: '0', listStyle: 'none', margin: '15px 0 0 0', maxHeight: '220px', overflowY: 'auto' };
const itemStyle = { padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.92rem' };

export default App;