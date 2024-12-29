import React, { useRef, useState, useEffect } from 'react';
import '../styles/tour-details.css';
import { useParams } from 'react-router-dom';
import { Col, Container, Form, ListGroup, Row } from 'reactstrap';
import calculateAvgRating from '../utils/avgRating';
import avatar from '../assets/images/avatar.jpg';
import Booking from '../components/Booking/Booking';
import Newsletter from '../shared/Newsletter';
import axios from 'axios';

const TourDetails = () => {
  const { id } = useParams();
  console.log("the id is ",id)
  const reviewMsgRef = useRef('');
  const [tourRating, setTourRating] = useState(null);
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('accessToken');
  const username = localStorage.getItem('username');
  const email =localStorage.getItem("email")
  const options = { day: 'numeric', month: 'long', year: 'numeric' };


  
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/tours/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTour(response.data.data);
        setReviews(response.data.data.reviews);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tour details.');
        setLoading(false);
      }
    };

    fetchTour();
  }, [id, token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;

    if (!tourRating) {
      alert('Please select a rating before submitting!');
      return;
    }

    const newReview = {
      productId:id,
      reviewText: reviewText,
      rating: tourRating,
      username:username
    };

    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/review/${id}`,
        newReview,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews([...reviews, response.data.data]); // Update reviews locally
      alert('Review submitted successfully!');
      reviewMsgRef.current.value = ''; // Clear the input field
      setTourRating(null); // Reset the rating
    } catch (err) {
      alert('Failed to submit the review. Please try again later.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const { photo, title, desc, price, address, city, distance, maxGroupSize } = tour || {};
  const { totalRating, avgRating } = calculateAvgRating(reviews);

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <div className="tour__content">
                <img src={photo} alt={title} />
                <div className="tour__info">
                  <h2>{title}</h2>
                  <div className="d-flex align-items-center gap-5">
                    <span className="tour__rating d-flex align-items-center gap-1">
                      <i className="ri-star-fill" style={{ color: 'var(--secondary-color)' }}></i>
                      {avgRating === 0 ? 'Not rated' : `${avgRating} (${reviews?.length} reviews)`}
                    </span>
                    <span>
                      <i className="ri-map-pin-user-fill"></i> {address}
                    </span>
                  </div>
                  <div className="tour__extra-details">
                    <span>
                      <i className="ri-map-pin-2-line"></i> {city}
                    </span>
                    <span>
                      <i className="ri-money-dollar-circle-line"></i> ${price} / person
                    </span>
                    <span>
                      <i className="ri-map-pin-time-line"></i> {distance} km
                    </span>
                    <span>
                      <i className="ri-group-line"></i> {maxGroupSize} people
                    </span>
                  </div>
                  <h5>Description</h5>
                  <p>{desc}</p>
                </div>
                <div className="tour__reviews mt-4">
                  <h4>Reviews ({reviews?.length})</h4>
                  <Form onSubmit={submitHandler}>
                    <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <span
                          key={rating}
                          onClick={() => setTourRating(rating)}
                          className={tourRating === rating ? 'active__rating' : ''}
                        >
                          {rating}
                          <i className="ri-star-fill"></i>
                        </span>
                      ))}
                    </div>
                    <div className="review__input">
                      <input
                        type="text"
                        ref={reviewMsgRef}
                        placeholder="Share your thoughts"
                        required
                      />
                      <button className="btn primary__btn text-white" type="submit">
                        Submit
                      </button>
                    </div>
                  </Form>
                  <ListGroup className="user__reviews">
                    {reviews?.map((review, index) => (
                      <div className="review__item" key={index}>
                        <img src={avatar} alt="Reviewer" />
                        <div className="w-100">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <h5>{review.user || 'Anonymous'}</h5>
                              <p>{new Date(review.date).toLocaleDateString('en-US', options)}</p>
                            </div>
                            <span className="d-flex align-items-center">
                              {review.rating}
                              <i className="ri-star-fill"></i>
                            </span>
                          </div>
                          <h6>{review.text}</h6>
                        </div>
                      </div>
                    ))}
                  </ListGroup>
                </div>
              </div>
            </Col>
            <Col lg="4">
              <Booking tour={tour} avgRating={avgRating} />
            </Col>
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default TourDetails;
