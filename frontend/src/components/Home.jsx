import React from 'react'
import './Home.css'
import {useState,useEffect} from 'react';
import imgs from "./images/ce.jpg"
import imgs2 from "./images/ce2.jpg"

const Home = () => {
  return (
    <>
<section className="hero">
  
  <div className="slide slide1"></div>
  <div className="slide slide2"></div>
  <div className="slide slide3"></div>
  <div className="slide slide4"></div>
 
  <div className="hero-contenthome">
    <span className="hero-tag">Event Management Platform</span>
    <h1>
      Plan Your Dream <br />
    Event With Ease
    </h1>

    <p>
      Yet bad any for travelling assistance indulgence unpleasing.
      Not enough all exercise blessing.indulgence way everything
      joy alteration boisterous the attachment.
    </p>

    <div className="email-box">
      <input type="email" placeholder="enter your email" />
      <button>Get Started</button>
    </div>

<div className='users-wrapper'>
    <div className="users-images">
      <img className='user-img' src={imgs} alt="hh"></img>
      <img className='user-img' src={imgs2} alt="hh"></img>
      <img className='user-img' src={imgs} alt="hh"></img>
      <img className='user-img' src={imgs2} alt="hh"></img>
      <img className='user-img' src={imgs} alt="hh"></img>
      <img className='user-img' src={imgs2} alt="hh"></img>
      <img className='user-img' src={imgs} alt="hh"></img>
      <img className='user-img' src={imgs2} alt="hh"></img>
      <img className='user-img' src={imgs} alt="hh"></img>
      <img className='user-img' src={imgs2} alt="hh"></img>
      </div>

      <div className='users-text'>
         <h4>1,600+</h4>
      <p>People requested access in the last 24 hours</p>
      </div>
   
    </div>
  </div>
</section>

<section>

  <div class="slider">
	<div class="slide-track">
		<div class="slides">
			<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/2.png" height="100" width="250" alt="" />
		</div>
		<div class="slides">
			<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/3.png" height="100" width="250" alt="" />
		</div>
		<div class="slides">
			<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/4.png" height="100" width="250" alt="" />
		</div>
		<div class="slides">
			<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/5.png" height="100" width="250" alt="" />
		</div>
		<div class="slides">
			<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png" height="100" width="250" alt="" />
		</div>
		<div class="slides">
			<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/7.png" height="100" width="250" alt="" />
		</div>
		<div class="slides">
			<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/1.png" height="100" width="250" alt="" />
		</div>
		<div class="slides">
			<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/2.png" height="100" width="250" alt="" />
		</div>
		<div class="slides">
			<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/3.png" height="100" width="250" alt="" />
		</div>
		<div class="slides">
			<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/4.png" height="100" width="250" alt="" />
		</div>
		<div class="slides">
			<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/5.png" height="100" width="250" alt="" />
		</div>
		<div class="slides">
			<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png" height="100" width="250" alt="" />
		</div>
		<div class="slides">
			<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/7.png" height="100" width="250" alt="" />
		</div>
	</div>
</div>
</section>
<div className="home-last">
  <div className="home-custom-container">

    {/* TOP ROW */}
    <div className="home-top-row">
      <div className="home-top-left">
        <h6>What is Harmoni Event?</h6>
      </div>

      <div className="home-top-right">
        <p>
          We so opinion me message as delight. Whole front do of Plate heard oh ought.
          His defective nor convinced residence own. Connection has put impossible own apartments.
        </p>
      </div>
    </div>

    {/* MIDDLE ROW */}
    <div className="home-middle-row">
      <h2>Your Event Will be Beyond your imagination</h2>
      <span>Explore the Library</span>
    </div>

    {/* BOTTOM ROW */}
    <div className="home-bottom-row">
      <div className=" home-box">
        <div className="home-line"></div>
        <h4>Chatbots</h4>
        <p>We so opinion friend me msg as delight. Whole front do of Plate heard oh ought.</p>
      </div>

      <div className="home-box">
        <div className="home-line"></div>
        <h4>Knowledgebase</h4>
        <p>At jointure ladyship an insisted so humanity. Friendly bachelor entrance.</p>
      </div>

      <div className="home-box">
        <div className="home-line"></div>
        <h4>Education</h4>
        <p>At jointure ladyship an insisted so humanity. Friendly bachelor entrance.</p>
      </div>
    </div>

  </div>
</div>



    </>
    
  )
}

export default Home;