CREATE TABLE IF NOT EXISTS Courses (
    course_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    city        TEXT NOT NULL,
    state       TEXT NOT NULL,
    region      TEXT NOT NULL,
    num_holes   INTEGER NOT NULL,
    par         INTEGER NOT NULL,
    green_fees  REAL,
    website     TEXT
);

CREATE TABLE IF NOT EXISTS Visits (
    visit_id        INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id       INTEGER NOT NULL REFERENCES Courses(course_id),
    visit_date      TEXT NOT NULL,
    overall_score   REAL,
    comments        TEXT
);

CREATE TABLE IF NOT EXISTS ConditionRatings (
    rating_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    visit_id    INTEGER NOT NULL REFERENCES Visits(visit_id) ON DELETE CASCADE,
    category    TEXT NOT NULL,
    score       REAL NOT NULL CHECK(score >= 1.0 AND score <= 10.0)
);
