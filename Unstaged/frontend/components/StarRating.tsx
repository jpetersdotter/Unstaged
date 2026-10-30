interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
}

function StarRating({ rating, setRating }: StarRatingProps) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => {
            if (setRating) {
              setRating(star);
            }
          }}
          style={{
            color: star <= rating ? "#ffdd00" : "#d3d3d3",
            fontSize: "22px",
            cursor: setRating ? "pointer" : "default",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
