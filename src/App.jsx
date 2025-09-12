import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import NeetFlashcardsGame from './NeetFlashcardsGame';

function App(){
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <NeetFlashcardsGame />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
export default App;
