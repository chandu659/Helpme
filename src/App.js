
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Banner from './components/banner/banner';
import Tiles from './components/tiles/tiles';
import Form from './components/form/form';
import { Education } from './components/education/education';
import { CarPooling } from './components/carpooling/carpooling';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/home" element={
          <>
            <Banner />
            <Tiles />
          </>
        } />
        <Route path="/form" element={<Form />} />
        <Route path="/education" element ={<Education/>}/>
        <Route path="/carpooling" element ={<CarPooling/>}/>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
