/*global chrome*/ 
import React, { useState, useEffect } from 'react';

function App() {
  const [redirects, setRedirects] = useState([]);

  // Cargar las redirecciones del almacenamiento al iniciar la aplicación
  useEffect(() => {
    chrome.storage.sync.get('redirects', (data) => {
      if (data.redirects) {
        setRedirects(data.redirects);
      }
    });
  }, []);

  // Función para añadir una nueva redirección
  const addRedirect = (source, destination) => {
    const newRedirects = [...redirects, { source, destination, enabled: true }];
    setRedirects(newRedirects);
    chrome.storage.sync.set({ redirects: newRedirects });
  };

  // Función para eliminar una redirección
  const deleteRedirect = (index) => {
    const newRedirects = [...redirects];
    newRedirects.splice(index, 1);
    setRedirects(newRedirects);
    chrome.storage.sync.set({ redirects: newRedirects });
  };

  // Función para editar una redirección
  const editRedirect = (index, source, destination) => {
    const newRedirects = [...redirects];
    newRedirects[index] = { source, destination };
    setRedirects(newRedirects);
    chrome.storage.sync.set({ redirects: newRedirects });
  };

  // Función para habilitar una redirección
  const enableRedirect = (index) => {
    const newRedirects = [...redirects];
    newRedirects[index].enabled = true;
    setRedirects(newRedirects);
    chrome.storage.sync.set({ redirects: newRedirects });
  };

  // Función para deshabilitar una redirección
  const disableRedirect = (index) => {
    const newRedirects = [...redirects];
    newRedirects[index].enabled = false;
    setRedirects(newRedirects);
    chrome.storage.sync.set({ redirects: newRedirects });
  };

  // Función para descargar la lista de redirecciones en formato JSON
  const downloadRedirects = () => {
    const data = JSON.stringify(redirects);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'redirects.json';
    link.href = url;
    link.click();
  };

  // Función para cargar un archivo JSON y popular la lista de redirecciones
  const uploadRedirects = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = JSON.parse(event.target.result);
      setRedirects(data);
      chrome.storage.sync.set({ redirects: data });
    };
    reader.readAsText(file);
  };

  return (
    <div>
      {/* Formulario para añadir redirecciones */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const source = e.target.source.value;
        const destination = e.target.destination.value;
        addRedirect(source, destination);
      }}>
        <input type="text" name="source" placeholder="URL de origen" />
        <input type="text" name="destination" placeholder="URL de destino" />
        <button type="submit">Añadir</button>
      </form>

      {/* Lista de redirecciones */}
      {redirects.map((redirect, index) => (
        <div key={index}>
          {redirect.source} -> {redirect.destination}
          {/* Botones para editar, eliminar, habilitar/deshabilitar */}
          <button onClick={() => deleteRedirect(index)}>Eliminar</button>
          <button onClick={() => editRedirect(index, redirect.source, redirect.destination)}>Editar</button>
          <button onClick={() => enableRedirect(index)}>Habilitar</button>
          <button onClick={() => disableRedirect(index)}>Deshabilitar</button>
        </div>
      ))}

      {/* Botones para descargar y cargar las redirecciones */}
      <button onClick={downloadRedirects}>Descargar JSON</button>
      <label><input type="file" onChange={uploadRedirects} /> Cargar JSON </label>
    </div>
  );
}

export default App;
