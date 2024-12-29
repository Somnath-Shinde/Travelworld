import React, { useState } from 'react';
import './booking.css';
import { Button, Form, FormGroup, ListGroup, ListGroupItem } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Booking = ({ tour, avgRating }) => {
  const { price, reviews } = tour;
  const navigate = useNavigate();
  const id = localStorage.getItem("userId")
  const email =localStorage.getItem("email")
  const [credentials, setCredentials] = useState({
    userID: id,
    userEmail:email,
    fullName: '',
    phone: '',
    guestSize: 1,
    bookAt: '',
  });

  const handleChange = e => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const serviceFee = 10;
  const totalCost = Number(price) * Number(credentials.guestSize) + Number(serviceFee);
  const token = localStorage.getItem("accessToken")


 const handleClick = async (e) => {
  e.preventDefault();

  if (!token) {
    alert("Login to book");
    return;
  }

  try {
    const res = await axios.post(
      'http://localhost:4000/api/v1/book',
      credentials, // Your payload
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Ensure cookies are sent with the request
      }
    );
    alert(res.data.message);
    navigate('/thank-you');
  } catch (err) {
    alert(err.response?.data?.msg || 'Something went wrong. Please try again.');
    console.error(err);
  }
};


  return (
    <div className="booking">
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
          ${price}
          <span>/per person</span>
        </h3>
        <span className="tour__rating d-flex align-items-center">
          <i className="ri-star-fill"></i>
          {avgRating === 0 ? null : avgRating} ({reviews?.length})
        </span>
      </div>

      <div className="booking__form">
        <h5>Information</h5>
        <Form className="booking__info-form" onSubmit={handleClick}>
          <FormGroup>
            <input type="text" placeholder="Full Name" id="fullName" required onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <input type="number" placeholder="Phone" id="phone" required onChange={handleChange} />
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3">
            <input type="date" id="bookAt" required onChange={handleChange} />
            <input type="number" placeholder="Guest" id="guestSize" required onChange={handleChange} />
          </FormGroup>
        </Form>
      </div>

      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">
              ${price}
              <i className="ri-close-line"></i> {credentials.guestSize} person(s)
            </h5>
            <span>${price * credentials.guestSize}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0">
            <h5>Service charge</h5>
            <span>${serviceFee}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>Total</h5>
            <span>${totalCost}</span>
          </ListGroupItem>
        </ListGroup>
        <Button className="btn primary__btn w-100 mt-4" onClick={handleClick}>
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default Booking;
