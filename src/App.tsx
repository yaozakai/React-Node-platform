import React from 'react';
import Start from './ui/start/start';
import './App.css';
import './index.css';
import './css/font.css';

function App() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">

            <Start />

        {/* <LoginForm /> */}
      </div>
    </main>
  );
}

export default App;
