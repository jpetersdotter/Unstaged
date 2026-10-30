DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS concerts;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

INSERT INTO users (username, password) VALUES
('NeonLight', 'glowinthedark'),
('PopPrinsessan', 'pinkglitter'),
('MoshpitMike', 'metal123');

CREATE TABLE concerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artist TEXT NOT NULL,
    venue TEXT NOT NULL,
    city TEXT NOT NULL,
    concert_date TEXT NOT NULL
);

INSERT INTO concerts (artist, venue, city, concert_date) VALUES
('AC/DC', 'Ullevi', 'Gothenburg', '2009-06-21'),
('Depeche Mode', 'Scandinavium', 'Gothenburg', '2013-12-11'),
('Håkan Hellström', 'Ullevi', 'Gothenburg', '2014-07-07'),
('Miriam Bryant', 'Liseberg', 'Gothenburg', '2016-05-26'),
('Coldplay',' Friends Arena', 'Stockholm', '2016-07-03'),
('The Cure',' Scandinavium', 'Gothenburg', '2016-10-13'),
('Marilyn Manson', 'Scandinavian Congress Center', 'Aarhus', '2018-06-04'),
('Ed Sheeran', 'Ullevi', 'Gothenburg','2018-07-10'),
('Måneskin', 'Royal Arena', 'Copenhagen', '2023-05-02'),
('Rammstein', 'Olympiastadion', 'Berlin', '2023-07-16'),
('Kite', 'Dalhalla', 'Rättvik', '2023-09-02'),
('The Soundtrack Of Our Lives', 'Pustervik', 'Gothenburg', '2024-03-19'),
('Timo Räisänen & Oljudet', 'Pustervik', 'Gothenburg', '2024-10-12'),
('Alestorm', 'Pustervik', 'Gothenburg', '2025-06-23'),
('Carbon Based Lifeforms', 'Pustervik', 'Gothenburg', '2026-03-06'),
('Queens of the Stone Age/System of a Down', 'Strawberry Arena', 'Stockholm', '2026-06-29');

CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    concert_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    review TEXT,
    created TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(concert_id) REFERENCES concerts(id),
    UNIQUE(user_id, concert_id)
);

INSERT INTO reviews (user_id, concert_id, rating, review, created) VALUES
(1, 2, 5, 'Absolute perfection. The synthesizers sounded incredible and the pulsing neon strobe lights made the whole venue feel like a futuristic dream.', '2013-12-12 10:30:00'),
(1, 5, 4, 'An outstanding visual production! The light show was perfectly synced with every beat. Truly a mesmerizing experience.', '2016-07-04 09:15:00'),
(1, 11, 3, 'The performance, magnificent light show and sound quality were all top tier, but I didn''t expect it to be so freezing cold!', '2023-09-03 14:22:00'),
(1, 12, 4, 'The intimate club lighting created a fantastic atmosphere. Their massive rock soundscape hit beautifully in the dark.', '2024-03-20 11:05:00'),
(1, 15, 4, 'A mesmerizing and immersive experience. Layers of electronic sound filled the room and created an atmosphere that felt almost otherworldly. The music was hypnotic without ever becoming dull, while the visual elements added even more depth to the experience. Beautiful from beginning to end.', '2026-03-07 13:10:00'),
(2, 3, 5, 'The atmosphere under the open sky was pure magic. Everyone was singing along, crying and dancing together. An unforgettable night!', '2014-07-08 13:40:00'),
(2, 4, 4, 'Such a lovely summer night vibe. The crowd energy was so warm, sweet and full of love from the very first song.', '2016-05-27 08:50:00'),
(2, 6, 3, 'The band was incredible and played all the classics, but a three hour setlist felt a bit too long and draining after a while.', '2016-10-14 16:10:00'),
(2, 8, 5, 'The whole stadium turned into one enormous singalong. The combination of the music, the incredible crowd and the warm summer evening created such a special atmosphere. Despite the size of the venue, there were moments that felt surprisingly personal. A beautiful night and a concert I will remember for a very long time.', '2018-07-11 10:05:00'),
(2, 13, 5, 'A fantastic evening at Pustervik! The smaller venue made everything feel incredibly intimate and there was a wonderful connection between the band and the audience. Emotional, energetic and full of great moments. One of those concerts where you leave feeling genuinely happy that you were there.', '2024-10-13 11:45:00'),
(3, 1, 2, 'Honestly quite disappointing. The sound was terrible, the band felt exhausted and the crowd was surprisingly flat.', '2009-06-22 11:18:00'),
(3, 7, 5, 'I have seen Manson a few times before, but this was easily the best performance I have experienced from him. The atmosphere was dark, intense and completely captivating from start to finish. The Aarhus show had an incredible energy and everything from the vocals to the stage presence felt stronger than ever. Definitely my favorite Manson concert so far.', '2018-06-05 11:20:00'),
(3, 9, 5, 'Insane energy! The bass was so heavy it was shaking the entire floor and the crowd was moving non-stop. Pure adrenaline.', '2023-05-03 00:45:00'),
(3, 10, 5, 'Absolutely brutal! Total madness in the pit, roaring bass and massive bursts of fire shooting from the stage. The ultimate live show.', '2023-07-17 02:15:00'),
(3, 14, 4, 'Exactly the kind of chaotic and ridiculously fun evening I was hoping for. The crowd was wild, the energy never seemed to drop and the whole place felt like one enormous party. Not the most sophisticated concert experience, perhaps, but incredibly entertaining and impossible not to enjoy.', '2025-06-24 12:30:00'),
(3, 16, 3, 'The concert had a bit of a rocky start when Queens of the Stone Age entered the stage, as the sound quality was not the best and felt a bit muddy. However, things turned around completely when System of a Down performed. The sound cleared right up and their energy was absolutely insane!', '2026-06-30 10:00:00');
