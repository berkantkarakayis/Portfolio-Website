import React, { useState } from 'react'
import { FaRegAddressBook, FaRegEnvelope, FaRegUser,FaRegMap } from 'react-icons/fa'
import './contact.css'
import axios from 'axios';
import shapeOne from '../../assets/shape-1.png';

const Contact = () => {
    const[form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setForm({...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
        .post('https://sheet.best/api/sheets/165f2129-e949-4e84-8e9a-3cbf2f1cbd98', 
        form
        )
        .then((response) => {
            console.log(response);
            // clearing from fields
            setForm({name: '',email:'',subject:'',message:''});
        });
    };

  return (
    <section className="contact section" id="contact">
        <h2 className="section__title text-cs">Contact Me</h2>
        <p className="section__subtitle">
            Let's <span>Talk Abouut Ideas</span>
        </p>

        <div className="contact__container container grid">
            <div className="contact__content">
                <div className="contact__card">
                    <span className="contact__card-icon">
                        <FaRegMap />
                    </span>

                    <h3 className="contact__card-title">Address</h3>
                    <p className="contact__card-data">Istanbul, Turkiye</p>
                </div>

                <div className="contact__card">
                    <span className="contact__card-icon">
                        <FaRegUser />
                    </span>

                    <h3 className="contact__card-title">Freelance</h3>
                    <p className="contact__card-data">Available Right Now</p>
                </div>

                <div className="contact__card">
                    <span className="contact__card-icon">
                        <FaRegEnvelope />
                    </span>

                    <h3 className="contact__card-title">Send an Email</h3>
                    <a className="contact__card-data" href="mailto:berkantkarakayiss@gmail.com" style={{ color: 'hsl(165, 60%, 40%)' }}>berkantkarakayiss@gmail.com</a>
                </div>

                {/* <div className="contact__card">
                    <span className="contact__card-icon">
                        <FaRegAddressBook />
                    </span>

                    <h3 className="contact__card-title">Phone</h3>
                    <a className="contact__card-data" 
                    target="_blank">+90-543-861-80-20</a><br></br>   
                    <a className="contact__card-data" href="https://api.whatsapp.com/send?phone=905438618020&text=Merhaba! Size websiteniz üzerinden ulaştım. Müsait misiniz?     |      Hello! I reached out to you through your website. Are you available?     " 
                    target="_blank" style={{ color: 'hsl(165, 60%, 40%)' }}>Whatsapp</a>         
                </div> */}
            </div>

            <form className="contact__form" onSubmit={handleSubmit}>
                <div className='contact__form-group grid'>
                    <div className="contact__form-div">
                        <label className="contact__form-tag text-cs">
                            Your Full Name <b>*</b>
                        </label>
                        <input 
                            type="text"
                            name='name'
                            onChange={handleChange} 
                            value={form.name} 
                            className="contact__form-input" 
                        />
                    </div>

                    <div className="contact__form-div">
                        <label className="contact__form-tag text-cs">
                            Your Email Address <b>*</b>
                        </label>
                        <input 
                            type="email" 
                            name='email'
                            onChange={handleChange} 
                            value={form.email} 
                            className="contact__form-input" 
                        />
                    </div>
                </div>

                <div className="contact__form-div">
                    <label className="contact__form-tag text-cs">
                         Your Subject <b>*</b>
                    </label>
                    <input 
                        type="text" 
                        name='subject'
                        onChange={handleChange} 
                        value={form.subject} 
                        className="contact__form-input" 
                    />
                </div>

                <div className="contact__form-div contact__form-area">
                    <label className="contact__form-tag text-cs">
                         Your Message <b>*</b>
                    </label>
                    <textarea 
                        name='message'
                        onChange={handleChange} 
                        value={form.message} 
                        className='contact__form-input'
                    ></textarea>
                </div>

                <div className="contact__submit">
                    <p>* Accept the terms and conditions.</p>
                    <button type='submit' className='btn tex-cs'>
                        Send Message
                    </button>
                </div>
            </form>
        </div>

        <div className="section__deco deco__left">
            <img src={shapeOne} alt='' className='shape'></img>
        </div>

        <div className="section__bg-wrapper">
            <span className="bg__title">Contact</span>
        </div>
    </section>
  )
}

export default Contact