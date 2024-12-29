import React, { useEffect, useState } from 'react';
import CommonSection from '../shared/CommonSection';
import '../styles/tour.css';
import { Col, Container, Row } from 'reactstrap';
import SearchBar from '../shared/SearchBar';
import TourCard from '../shared/TourCard';
import Newsletter from '../shared/Newsletter';
import axios from 'axios';

const Tours = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [tourData, setTourData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('accessToken');

  // Calculate page count based on data count (assumed 5 here for demonstration)
  useEffect(() => {
    const pages = Math.ceil(5 / 4); // Replace `5` with backend-provided total count
    setPageCount(pages);
  }, []);

  // Fetch tours from API
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/tours`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("The response i s",response.data.data)
        setTourData(response.data?.data || []);
      } catch (err) {
        setError('Failed to fetch tour details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [token]);

  return (
    <>
      <CommonSection title="All Tours" />
      <section>
        <Container>
          <Row>
            <SearchBar />
          </Row>
        </Container>
      </section>
      <section className="pt-0">
        <Container>
          <Row>
            {loading && <p>Loading tours...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading &&
              !error &&
              tourData.map((tour) => (
                <Col lg="3" className="mb-4" key={tour._id}>
                  <TourCard tour={tour} />
                </Col>
              ))}

            <Col lg="12">
              <div
                className="pagination d-flex align-items-center justify-content-center mt-4 gap-3"
              >
                {[...Array(pageCount).keys()].map((number) => (
                  <span
                    key={number}
                    onClick={() => setPage(number)}
                    className={page === number ? 'active__page' : ''}
                  >
                    {number + 1}
                  </span>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default Tours;
