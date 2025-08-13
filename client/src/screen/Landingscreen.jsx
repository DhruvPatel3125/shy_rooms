import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

function Landingscreen() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 50,
      easing: 'ease-in-out',
    });
  }, []);
  return (
    <div>
        <div className="row landing justify-content-center" data-aos="fade-in">
            <div className="col-md-9 my-auto text-center text-white mt-5" style={{borderRight:'5px solid white'}} data-aos="zoom-in" data-aos-delay="150">
                <h2 style={{color:"white",fontSize:'120px'}} data-aos="fade-up" data-aos-delay="300">SHY ROOMS</h2>
                <h1 style={{color:"white"}} data-aos="fade-up" data-aos-delay="450">Enjoy your stay with us...</h1>
                <Link to="/home">
                  <button className='btn landingbtn' style={{color:'black',backgroundColor:'white'}} data-aos="fade-up" data-aos-delay="600">Get Started</button>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Landingscreen