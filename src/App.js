import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import Portfolio from './Portfolio';

function App() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className="App"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <Portfolio />
    </div>
  );
}

export default App;
