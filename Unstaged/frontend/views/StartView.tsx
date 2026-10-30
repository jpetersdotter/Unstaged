import { useEffect, useState } from "react";
import "./StartView.css";
import StarRating from "../components/StarRating";
import Header from "../components/Header";

interface Review {
  id: number;
  rating: number;
  review?: string;
  created: string;
  username: string;
  artist: string;
  venue: string;
  city: string;
  concert_date: string;
}

function StartView() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchText, setSearchText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getReviews();
  }, []);

  async function getReviews() {
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:3001/reviews");
      if (!response.ok) {
        setErrorMessage("Something went wrong");
        return;
      }
      const data = await response.json();
      setReviews(data);
    } catch {
      setErrorMessage("Something went wrong");
    }
  }

  const filteredReviews = reviews.filter(
    (review) =>
      review.artist.toLowerCase().includes(searchText.toLowerCase()) ||
      review.venue.toLowerCase().includes(searchText.toLowerCase()) ||
      review.city.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <>
      <Header searchText={searchText} setSearchText={setSearchText} />

      <div id="reviews">
        <div className="feed">
          {errorMessage && <p className="error_message">{errorMessage}</p>}

          {filteredReviews.length === 0 && searchText && !errorMessage && (
            <p className="no_result">
              Couldn't find any reviews for "{searchText}"
            </p>
          )}

          {filteredReviews.map((review) => (
            <div className="review_card" key={review.id}>
              <h2>{review.artist}</h2>

              <p className="concert_info">
                {review.venue}, {review.city}, {review.concert_date}
              </p>

              <StarRating rating={review.rating} />

              {review.review && <p className="review_text">{review.review}</p>}

              <p className="username">
                Posted by {review.username}, {review.created}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default StartView;
