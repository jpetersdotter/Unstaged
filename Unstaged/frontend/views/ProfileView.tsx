import { useEffect, useState } from "react";
import Header from "../components/Header";
import StarRating from "../components/StarRating";
import ReviewForm from "../components/ReviewForm";
import "./ProfileView.css";

interface Review {
  id: number;
  rating: number;
  review?: string;
  created: string;
  artist: string;
  venue: string;
  city: string;
  concert_date: string;
}

interface User {
  id: number;
  username: string;
}

function ProfileView() {
  const currentUser: User = JSON.parse(sessionStorage.getItem("currentUser")!);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [chosenReview, setChosenReview] = useState<Review | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getReviews();
  }, []);

  async function getReviews() {
    const response = await fetch(
      `http://localhost:3001/reviews/user/${currentUser.id}`,
    );

    const data = await response.json();

    setReviews(data);
  }

  const deleteReview = async (review: Review) => {
    setErrorMessage("");

    try {
      const response = await fetch(
        `http://localhost:3001/reviews/${review.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        setErrorMessage("Couldn't delete the review");
        return;
      }

      setReviews((reviews) =>
        reviews.filter((currentReview) => currentReview.id !== review.id),
      );
    } catch {
      setErrorMessage("Something went wrong");
    }
  };

  const chooseReview = (review: Review) => {
    setChosenReview(review);
    setShowModal(true);
  };

  const newReview = () => {
    setChosenReview(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setChosenReview(null);
  };

  return (
    <>
      <Header
        searchText={searchText}
        setSearchText={setSearchText}
        showSearch={false}
      />

      <main className="profile_page">
        <section className="profile_header">
          <img src="/profilepicture.png" className="profile_picture" />

          <h1>{currentUser.username}</h1>

          <p>{reviews.length} reviews</p>

          <button onClick={newReview}>+ New Review</button>
        </section>

        <section className="user_reviews">
          {reviews.map((review) => (
            <article className="review_card" key={review.id}>
              <h2>{review.artist}</h2>

              <p>
                {review.venue}, {review.city}
              </p>

              <p>{review.concert_date}</p>

              <StarRating rating={review.rating} />

              {review.review && <p>{review.review}</p>}

              <p className="username">Posted {review.created}</p>

              {errorMessage && <p className="error_message">{errorMessage}</p>}

              <div className="review_buttons">
                <button onClick={() => chooseReview(review)}>Edit</button>
                <button onClick={() => deleteReview(review)}>Delete</button>
              </div>
            </article>
          ))}
        </section>
      </main>

      {showModal && (
        <ReviewForm
          userId={currentUser.id}
          editReview={chosenReview}
          onClose={closeModal}
          onCreated={getReviews}
        />
      )}
    </>
  );
}

export default ProfileView;
