import React, { useState, useEffect } from 'react';
import Portfolio from './Portfolio';

function App() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Small delay to ensure the component has mounted

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`App transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
      }`}
    >
      <Portfolio />
    </div>
  );
}

export default App;