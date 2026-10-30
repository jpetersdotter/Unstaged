import { useState } from "react";
import "./ReviewForm.css";
import StarRating from "./StarRating";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from "date-fns/locale";
import { format, parseISO } from "date-fns";

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

interface NewReviewProps {
  userId: number;
  onClose: () => void;
  onCreated: () => void;
  editReview: Review | null;
}

function ReviewForm({
  userId,
  onClose,
  onCreated,
  editReview,
}: NewReviewProps) {
  const isEditing = editReview !== null;

  const [artist, setArtist] = useState(editReview?.artist ?? "");
  const [venue, setVenue] = useState(editReview?.venue ?? "");
  const [city, setCity] = useState(editReview?.city ?? "");
  const [concertDate, setConcertDate] = useState<Date | null>(
    editReview ? parseISO(editReview.concert_date) : null,
  );
  const [rating, setRating] = useState(editReview?.rating ?? 0);
  const [reviewText, setReviewText] = useState(editReview?.review ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit() {
    if (!artist || !venue || !city || !concertDate || rating === 0) {
      setErrorMessage("Please fill in all required fields and select a rating");
      return;
    }

    setErrorMessage("");

    try {
      if (isEditing) {
        const currentlyEditing = {
          artist: artist,
          venue: venue,
          city: city,
          concert_date: format(concertDate, "yyyy-MM-dd"),
          rating: rating,
          review: reviewText || undefined,
        };

        const response = await fetch(
          `http://localhost:3001/reviews/${editReview.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(currentlyEditing),
          },
        );

        if (!response.ok) {
          setErrorMessage("Something went wrong updating the review");
          return;
        }

        onCreated();
        onClose();
        return;
      }

      const addedConcert = {
        artist: artist,
        venue: venue,
        city: city,
        concert_date: format(concertDate, "yyyy-MM-dd"),
      };

      const createConcert = await fetch("http://localhost:3001/concerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addedConcert),
      });

      if (!createConcert.ok) {
        setErrorMessage("Something went wrong");
        return;
      }

      const { id: concertId } = await createConcert.json();

      const addedReview = {
        user_id: userId,
        concert_id: concertId,
        rating: rating,
        review: reviewText || undefined,
      };

      const createReview = await fetch("http://localhost:3001/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addedReview),
      });

      if (!createReview.ok) {
        setErrorMessage("Something went wrong creating the review");
        return;
      }

      onCreated();
      onClose();
    } catch {
      setErrorMessage("Something went wrong");
    }
  }

  return (
    <div className="modal_backdrop">
      <div className="modal">
        <h3>{isEditing ? "Edit Review" : "New Review"}</h3>

        <input
          type="text"
          placeholder="Artist/band *"
          value={artist}
          onChange={(event) => setArtist(event.target.value)}
        />

        <input
          type="text"
          placeholder="Venue *"
          value={venue}
          onChange={(event) => setVenue(event.target.value)}
        />

        <input
          type="text"
          placeholder="City *"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />

        <DatePicker
          selected={concertDate}
          onChange={(date: Date | null) => setConcertDate(date)}
          locale={enGB}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select date *"
        />

        <StarRating rating={rating} setRating={setRating} />

        <textarea
          placeholder="Share your thoughts... (optional)"
          value={reviewText}
          onChange={(event) => setReviewText(event.target.value)}
        />

        {errorMessage && <p className="error_message">{errorMessage}</p>}

        <div className="modal_buttons">
          <button onClick={handleSubmit}>{isEditing ? "Save" : "Post"}</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ReviewForm;
