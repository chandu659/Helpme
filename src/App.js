
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Banner from './components/banner/banner';
import Tiles from './components/tiles/tiles';
import Form from './components/form/form';
import { Education } from './components/education/education';
import { CarPooling } from './components/carpooling/carpooling';
import Chatbox from './components/chatbox/chatbox'; 


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
        <Route path="/chatbox" element={<Chatbox />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
