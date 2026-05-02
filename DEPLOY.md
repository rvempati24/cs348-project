# CS 348 Stage 3 — Demo Recording & GCP App Engine Deployment

---

## Part 1: Recording the Demo (on localhost)

### Start the app locally

**Terminal 1 — Backend**
```bash
cd backend
pip install -r requirements.txt   # first time only
python app.py
# Flask starts on http://127.0.0.1:8080
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm install                        # first time only
npm run dev
# Next.js starts on http://localhost:3000
```

Open http://localhost:3000 in your browser.

---

### What to cover in the demo (match to rubric)

#### 1. SQL Injection Protection (7%)
- Open `backend/app.py`
- Show any `db.execute('... WHERE x = ?', (value,))` call — all user input goes
  through `?` placeholders, never string concatenation.
- Best example: the `/api/report` endpoint (lines ~190–237) — it dynamically
  builds a `WHERE` clause by appending to a `filters` list and a separate
  `params` list, then passes both to `db.execute(query, params)`. Even with
  dynamic SQL construction, user values are never injected into the string.

#### 2. Indexes (6%)
- Open `backend/schema.sql` and scroll to the bottom — show all 4 indexes.
- For each index, explain which query benefits:

  | Index | File | Benefit |
  |---|---|---|
  | `idx_visits_course_id` | `app.py` GET /api/visits + GET /api/report | Speeds up `JOIN Visits v ON v.course_id = c.course_id` |
  | `idx_visits_visit_date` | `app.py` GET /api/report | Speeds up `v.visit_date >= ? AND v.visit_date <= ?` date filter |
  | `idx_conditionratings_visit_id` | `app.py` GET /api/visits + report cat_query | Speeds up `JOIN ConditionRatings cr ON cr.visit_id = v.visit_id` |
  | `idx_courses_state_region` | `app.py` GET /api/report + GET /api/courses/filters | Speeds up `c.state = ?` and `c.state = ? AND c.region = ?` filters |

- Open the Analytics Report page in the browser. Filter by state and date range
  to show the report — these are the exact queries the indexes support.

#### 3. Transactions & Isolation Levels (6%)
- Open `backend/db.py` — show the `get_db(transaction_mode)` function and its
  docstring explaining DEFERRED vs IMMEDIATE.
- Open `backend/app.py` and show two contrasting examples:
  - `get_courses()` uses `get_db()` (DEFERRED) — read-only, no write lock needed.
  - `create_visit()` uses `get_db('IMMEDIATE')` — acquires write lock up front
    because it must write a Visits row AND 9 ConditionRatings rows atomically.
    Show the `try / db.commit() / except db.rollback()` block.
- Explain the concurrent access scenario: if two users log a visit at the same
  time, DEFERRED could allow interleaved writes (Visit row from user A, ratings
  from user B). IMMEDIATE prevents this by locking at BEGIN.

#### 4. Live demo of CRUD
- On the Visits page: log a new visit for any course, set ratings, save it.
- Go to the Analytics Report page — show the new visit reflected in the scores.
- Edit the visit (change a rating), return to the report — show the updated score.
- Delete the visit — show it disappears from the report.

#### 5. AI Usage (6%)
- Discuss which tools you used (e.g. Claude Code / Claude) and which tasks AI
  assisted with: schema design, API endpoint code, frontend components,
  parameterized query patterns, index selection, transaction isolation choices.

---

## Part 2: Deploying to GCP App Engine

### Prerequisites

1. **Install the Google Cloud CLI**
   - Download from https://cloud.google.com/sdk/docs/install
   - Run the installer, then open a new terminal.

2. **Log in and set your project**
   ```bash
   gcloud auth login
   # A browser window opens — sign in with your Google account.

   gcloud projects create fairwaycheck-cs348 --name="FairwayCheck CS348"
   # OR use an existing project:
   gcloud config set project YOUR_EXISTING_PROJECT_ID

   # Enable billing for the project (required for App Engine).
   # Go to console.cloud.google.com → Billing → Link account to project.

   gcloud app create --region=us-central
   # Choose a region when prompted (us-central is fine).
   ```

3. **Enable the App Engine API**
   ```bash
   gcloud services enable appengine.googleapis.com
   ```

---

### Step 1 — Deploy the Backend

```bash
cd backend
gcloud app deploy app.yaml --project=YOUR_PROJECT_ID
```

- When prompted `Do you want to continue? (Y/n)` → type `Y`
- This uploads your Flask code, installs `requirements.txt`, and starts the service.
- Wait for it to finish (1–3 minutes).

**Get the backend URL:**
```bash
gcloud app browse --service=backend --project=YOUR_PROJECT_ID
# Prints something like:
# https://backend-dot-YOUR_PROJECT_ID.appspot.com
```

Copy that URL — you'll need it for the next step.

---

### Step 2 — Set the Backend URL in the Frontend Config

Open `frontend/app.yaml` and replace the placeholder:

```yaml
env_variables:
  NEXT_PUBLIC_API_URL: https://backend-dot-YOUR_PROJECT_ID.appspot.com
```

Replace `YOUR_PROJECT_ID` with your actual project ID (e.g. `fairwaycheck-cs348`).

---

### Step 3 — Deploy the Frontend

```bash
cd ../frontend
gcloud app deploy app.yaml --project=YOUR_PROJECT_ID
```

- App Engine will automatically run `npm install` then `npm run build` then
  `npm start` on their servers.
- This takes 3–5 minutes because it builds Next.js in the cloud.
- When prompted → type `Y`.

**Get the frontend URL:**
```bash
gcloud app browse --project=YOUR_PROJECT_ID
# Prints: https://YOUR_PROJECT_ID.appspot.com
```

This is the URL to submit for extra credit.

---

### Step 4 — Verify it works

1. Open `https://YOUR_PROJECT_ID.appspot.com` in your browser.
2. Go to the Visits page — log a new visit.
3. Go to the Analytics Report page — confirm the new visit appears.
4. Edit and delete the visit to confirm full CRUD works.

---

### Step 5 — After the demo (stop billing)

App Engine Standard charges for running instances. After your demo/grading:

```bash
# Scale the backend down to 0 (stops the instance, stops charges).
gcloud app versions stop $(gcloud app versions list --service=backend --format="value(id)" --limit=1) --service=backend --project=YOUR_PROJECT_ID

# Or just delete both services entirely:
gcloud app services delete backend --project=YOUR_PROJECT_ID
gcloud app services delete default --project=YOUR_PROJECT_ID
```

---

### Troubleshooting

**Build fails with memory error:**
App Engine Standard F1 instances have 256MB RAM. If `npm run build` runs out of
memory, add this to `frontend/app.yaml`:
```yaml
instance_class: F2
```
Then redeploy.

**Backend returns 500 / database errors:**
Check the logs:
```bash
gcloud app logs tail --service=backend --project=YOUR_PROJECT_ID
```
The database auto-seeds on first request. If you see "no such table", the
instance restarted and `/tmp/golf.db` was wiped — just refresh the page; the
`init_db()` call will recreate and reseed it automatically.

**Frontend shows "Failed to fetch":**
Make sure `frontend/app.yaml` has the correct backend URL (Step 2), then
redeploy the frontend.
