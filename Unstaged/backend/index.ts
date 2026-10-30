import express from "express";
import * as sqlite from "sqlite";
import type { Database } from "sqlite";
import sqlite3 from "sqlite3";
import type { Request } from "express";

interface User {
  id: number;
  username: string;
  password: string;
}

// interface Concert {
//   id: number;
//   artist: string;
//   venue: string;
//   city: string;
//   concert_date: string;
// }

interface Review {
  id: number;
  user_id: number;
  concert_id: number;
  rating: number;
  review?: string;
  created: string;
}

interface LoginBody {
  username: string;
  password: string;
}

interface RegisterBody {
  username: string;
  password: string;
}

interface CreateConcertBody {
  artist: string;
  venue: string;
  city: string;
  concert_date: string;
}

interface CreateReviewBody {
  user_id: number;
  concert_id: number;
  rating: number;
  review?: string;
}

interface UpdateReviewBody {
  artist: string;
  venue: string;
  city: string;
  concert_date: string;
  rating: number;
  review?: string;
}

interface ReviewParams {
  id: string;
}

const app = express();
app.use(express.json());

app.use((_request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Content-Type");
  response.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

let database: Database;

(async () => {
  database = await sqlite.open({
    driver: sqlite3.Database,
    filename: "database.sqlite",
  });

  await database.run("PRAGMA foreign_keys = ON");
})();

app.get("/", (_request, response) => {
  response.redirect("http://localhost:5173/login");
});

app.post("/login", async (request: Request<any, any, LoginBody>, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    response.status(400);
    response.send("Username and password are required");
    return;
  }

  try {
    const user = await database.get<User>(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
    );

    if (!user) {
      response.status(401);
      response.send("Incorrect username and/or password");
      return;
    }

    response.status(200);
    response.send(user);
  } catch {
    response.status(500);
    response.send("Internal Server Error");
  }
});

app.post(
  "/register",
  async (request: Request<any, any, RegisterBody>, response) => {
    const { username, password } = request.body;

    if (!username || !password) {
      response.status(400);
      response.send("Please fill in all fields");
      return;
    }

    try {
      const alreadyExisting = await database.get<User>(
        "SELECT * FROM users WHERE username = ?",
        [username],
      );

      if (alreadyExisting) {
        response.status(409);
        response.send("Username already exists");
        return;
      }

      const result = await database.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
      );

      response.status(201);
      response.send({ id: result.lastID, username });
    } catch {
      response.status(500);
      response.send("Internal Server Error");
    }
  },
);

// app.get("/concerts", async (_request, response) => {
//   try {
//     const concerts = await database.all<Concert[]>(
//       "SELECT * FROM concerts ORDER BY concert_date DESC",
//     );
//     response.send(concerts);
//   } catch {
//     response.status(500);
//     response.send("Internal Server Error");
//   }
// });

app.post(
  "/concerts",
  async (request: Request<any, any, CreateConcertBody>, response) => {
    const { artist, venue, city, concert_date } = request.body;

    if (!artist || !venue || !city || !concert_date) {
      response.status(400);
      response.send("Bad Request");
      return;
    }

    try {
      const result = await database.run(
        "INSERT INTO concerts (artist, venue, city, concert_date) VALUES (?, ?, ?, ?)",
        [artist, venue, city, concert_date],
      );

      response.status(201);
      response.send({ id: result.lastID });
    } catch {
      response.status(500);
      response.send("Internal Server Error");
    }
  },
);

app.get("/reviews", async (_request, response) => {
  try {
    const reviews = await database.all<Review[]>(
      `SELECT reviews.*, users.username, concerts.artist, concerts.venue, concerts.city, concerts.concert_date
       FROM reviews
       JOIN users ON reviews.user_id = users.id
       JOIN concerts ON reviews.concert_id = concerts.id
       ORDER BY reviews.created DESC`,
    );
    response.send(reviews);
  } catch {
    response.status(500);
    response.send("Internal Server Error");
  }
});

app.get("/reviews/:id", async (request: Request<ReviewParams>, response) => {
  try {
    const review = await database.get<Review>(
      `SELECT reviews.*, users.username, concerts.artist, concerts.venue, concerts.city, concerts.concert_date
       FROM reviews
       JOIN users ON reviews.user_id = users.id
       JOIN concerts ON reviews.concert_id = concerts.id
       WHERE reviews.id = ?`,
      [request.params.id],
    );

    if (!review) {
      response.status(404);
      response.send("Not Found");
      return;
    }

    response.send(review);
  } catch {
    response.status(500);
    response.send("Internal Server Error");
  }
});

app.get(
  "/reviews/user/:id",
  async (request: Request<ReviewParams>, response) => {
    try {
      const user = await database.get<User>(
        "SELECT * FROM users WHERE id = ?",
        [request.params.id],
      );

      if (!user) {
        response.status(404);
        response.send("User not found");
        return;
      }

      const reviews = await database.all<Review[]>(
        `SELECT reviews.*, concerts.artist, concerts.venue, concerts.city, concerts.concert_date
         FROM reviews
         JOIN concerts ON reviews.concert_id = concerts.id
         WHERE reviews.user_id = ?
         ORDER BY reviews.created DESC`,
        [request.params.id],
      );

      response.send(reviews);
    } catch {
      response.status(500);
      response.send("Internal Server Error");
    }
  },
);

app.post(
  "/reviews",
  async (request: Request<any, any, CreateReviewBody>, response) => {
    const { user_id, concert_id, rating, review } = request.body;

    if (!user_id || !concert_id || rating === undefined) {
      response.status(400);
      response.send("Bad Request");
      return;
    }

    if (rating < 1 || rating > 5) {
      response.status(400);
      response.send("Rating must be between 1 and 5");
      return;
    }

    try {
      const alreadyExisting = await database.get<Review>(
        "SELECT * FROM reviews WHERE user_id = ? AND concert_id = ?",
        [user_id, concert_id],
      );

      if (alreadyExisting) {
        response.status(409);
        response.send("You have already reviewed this concert");
        return;
      }

      await database.run(
        "INSERT INTO reviews (user_id, concert_id, rating, review) VALUES (?, ?, ?, ?)",
        [user_id, concert_id, rating, review ?? null],
      );

      response.status(201);
      response.send("Review created");
    } catch {
      response.status(500);
      response.send("Internal Server Error");
    }
  },
);

app.patch(
  "/reviews/:id",
  async (request: Request<ReviewParams, any, UpdateReviewBody>, response) => {
    const { artist, venue, city, concert_date, rating, review } = request.body;

    if (!artist || !venue || !city || !concert_date || rating === undefined) {
      response.status(400);
      response.send("Bad Request");
      return;
    }

    if (rating < 1 || rating > 5) {
      response.status(400);
      response.send("Rating must be between 1 and 5");
      return;
    }

    try {
      const alreadyExisting = await database.get<Review>(
        `SELECT reviews.*, concerts.id AS concert_id
         FROM reviews
         JOIN concerts ON reviews.concert_id = concerts.id
         WHERE reviews.id = ?`,
        [request.params.id],
      );

      if (!alreadyExisting) {
        response.status(404);
        response.send("Review not found");
        return;
      }

      await database.run(
        `UPDATE concerts
         SET artist = ?, venue = ?, city = ?, concert_date = ?
         WHERE id = ?`,
        [artist, venue, city, concert_date, alreadyExisting.concert_id],
      );

      await database.run(
        `UPDATE reviews
         SET rating = ?, review = ?
         WHERE id = ?`,
        [rating, review ?? null, request.params.id],
      );

      response.status(200);
      response.send("Review updated");
    } catch {
      response.status(500);
      response.send("Internal Server Error");
    }
  },
);

app.delete("/reviews/:id", async (request: Request<ReviewParams>, response) => {
  try {
    const result = await database.run("DELETE FROM reviews WHERE id = ?", [
      request.params.id,
    ]);

    if (result.changes === 0) {
      response.status(404);
      response.send("Not Found");
    } else {
      response.status(200);
      response.send("Review deleted");
    }
  } catch {
    response.status(500);
    response.send("Internal Server Error");
  }
});

app.listen(3001, () => {
  console.log("Ready on http://localhost:3001/");
});
