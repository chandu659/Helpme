// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Banner from './components/banner/banner';
import Tiles from './components/tiles/tiles';
import Form from './components/form/form';
// Import other components/pages you need for routing

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={
          <>
            <Banner />
            <Tiles />
          </>
        } />
        <Route path="/form" element={<Form />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
