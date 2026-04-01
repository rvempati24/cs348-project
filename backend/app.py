from flask import Flask, jsonify, request
from flask_cors import CORS
from db import get_db, init_db

app = Flask(__name__)
CORS(app)

CATEGORIES = [
    'greens_speed', 'greens_quality', 'fairway_quality',
    'bunker_maintenance', 'tee_boxes', 'rough_condition',
    'pace_of_play', 'staff_friendliness', 'value_for_money'
]


# ── Courses ───────────────────────────────────────────────────────────────────

@app.route('/api/courses', methods=['GET'])
def get_courses():
    db = get_db()
    courses = db.execute('SELECT * FROM Courses ORDER BY name').fetchall()
    db.close()
    return jsonify([dict(c) for c in courses])


@app.route('/api/courses', methods=['POST'])
def create_course():
    data = request.get_json()
    name = data.get('name')
    city = data.get('city')
    state = data.get('state')
    region = data.get('region')
    num_holes = data.get('num_holes')
    par = data.get('par')
    green_fees = data.get('green_fees')
    website = data.get('website', '')

    if not name or not city or not state or not region or not num_holes or not par:
        return jsonify({'error': 'name, city, state, region, num_holes, and par are required'}), 400

    db = get_db()
    try:
        cur = db.execute(
            'INSERT INTO Courses (name, city, state, region, num_holes, par, green_fees, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            (name, city, state, region, num_holes, par, green_fees, website)
        )
        course_id = cur.lastrowid
        db.commit()
    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({'error': str(e)}), 500
    db.close()
    return jsonify({'course_id': course_id, 'name': name, 'city': city, 'state': state}), 201


@app.route('/api/courses/filters', methods=['GET'])
def get_course_filters():
    db = get_db()
    states = db.execute('SELECT DISTINCT state FROM Courses ORDER BY state').fetchall()
    regions = db.execute('SELECT DISTINCT region FROM Courses ORDER BY region').fetchall()
    db.close()
    return jsonify({
        'states': [r['state'] for r in states],
        'regions': [r['region'] for r in regions]
    })


# ── Visits ────────────────────────────────────────────────────────────────────

@app.route('/api/visits', methods=['GET'])
def get_visits():
    db = get_db()
    rows = db.execute('''
        SELECT v.visit_id, v.course_id, v.visit_date,
               v.overall_score, v.comments,
               c.name AS course_name, c.city, c.state
        FROM Visits v
        JOIN Courses c ON c.course_id = v.course_id
        ORDER BY v.visit_date DESC
    ''').fetchall()
    visits = []
    for row in rows:
        visit = dict(row)
        ratings = db.execute(
            'SELECT category, score FROM ConditionRatings WHERE visit_id = ?',
            (visit['visit_id'],)
        ).fetchall()
        visit['ratings'] = {r['category']: r['score'] for r in ratings}
        visits.append(visit)
    db.close()
    return jsonify(visits)


@app.route('/api/visits', methods=['POST'])
def create_visit():
    data = request.get_json()
    course_id = data.get('course_id')
    visit_date = data.get('visit_date')
    comments = data.get('comments', '')
    ratings = data.get('ratings', {})

    if not course_id or not visit_date:
        return jsonify({'error': 'course_id and visit_date are required'}), 400
    if not ratings or len(ratings) != len(CATEGORIES):
        return jsonify({'error': 'All 9 condition categories must be rated'}), 400

    overall = round(sum(ratings.values()) / len(ratings), 1)

    db = get_db()
    try:
        cur = db.execute(
            'INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (?, ?, ?, ?)',
            (course_id, visit_date, overall, comments)
        )
        visit_id = cur.lastrowid
        for category in CATEGORIES:
            db.execute(
                'INSERT INTO ConditionRatings (visit_id, category, score) VALUES (?, ?, ?)',
                (visit_id, category, ratings[category])
            )
        db.commit()
    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({'error': str(e)}), 500
    db.close()
    return jsonify({'visit_id': visit_id, 'overall_score': overall}), 201


@app.route('/api/visits/<int:visit_id>', methods=['PUT'])
def update_visit(visit_id):
    data = request.get_json()
    course_id = data.get('course_id')
    visit_date = data.get('visit_date')
    comments = data.get('comments', '')
    ratings = data.get('ratings', {})

    if not course_id or not visit_date:
        return jsonify({'error': 'course_id and visit_date are required'}), 400
    if not ratings or len(ratings) != len(CATEGORIES):
        return jsonify({'error': 'All 9 condition categories must be rated'}), 400

    overall = round(sum(ratings.values()) / len(ratings), 1)

    db = get_db()
    try:
        db.execute(
            'UPDATE Visits SET course_id=?, visit_date=?, overall_score=?, comments=? WHERE visit_id=?',
            (course_id, visit_date, overall, comments, visit_id)
        )
        db.execute('DELETE FROM ConditionRatings WHERE visit_id=?', (visit_id,))
        for category in CATEGORIES:
            db.execute(
                'INSERT INTO ConditionRatings (visit_id, category, score) VALUES (?, ?, ?)',
                (visit_id, category, ratings[category])
            )
        db.commit()
    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({'error': str(e)}), 500
    db.close()
    return jsonify({'visit_id': visit_id, 'overall_score': overall})


@app.route('/api/visits/<int:visit_id>', methods=['DELETE'])
def delete_visit(visit_id):
    db = get_db()
    try:
        db.execute('DELETE FROM Visits WHERE visit_id=?', (visit_id,))
        db.commit()
    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({'error': str(e)}), 500
    db.close()
    return jsonify({'deleted': visit_id})


# ── Report ────────────────────────────────────────────────────────────────────

@app.route('/api/report', methods=['GET'])
def get_report():
    state = request.args.get('state', '')
    region = request.args.get('region', '')
    date_from = request.args.get('date_from', '')
    date_to = request.args.get('date_to', '')
    min_score = request.args.get('min_score', 0, type=float)

    filters = []
    params = []

    if state:
        filters.append('c.state = ?')
        params.append(state)
    if region:
        filters.append('c.region = ?')
        params.append(region)
    if date_from:
        filters.append('v.visit_date >= ?')
        params.append(date_from)
    if date_to:
        filters.append('v.visit_date <= ?')
        params.append(date_to)

    where = ('WHERE ' + ' AND '.join(filters)) if filters else ''

    # Compute previous period for trend
    if date_from and date_to:
        from datetime import date, timedelta
        d_from = date.fromisoformat(date_from)
        d_to = date.fromisoformat(date_to)
        delta = d_to - d_from
        prev_from = (d_from - delta - timedelta(days=1)).isoformat()
        prev_to = (d_from - timedelta(days=1)).isoformat()
        non_date_filters = [(f, p) for f, p in zip(filters, params) if 'visit_date' not in f]
        prev_filters = [f for f, _ in non_date_filters] + ['v.visit_date >= ?', 'v.visit_date <= ?']
        prev_params = [p for _, p in non_date_filters] + [prev_from, prev_to]
        prev_where = 'WHERE ' + ' AND '.join(prev_filters)
    else:
        prev_where = where
        prev_params = list(params)

    db = get_db()

    main_query = f'''
        SELECT c.course_id, c.name, c.city, c.state, c.region,
               ROUND(AVG(v.overall_score), 1) AS avg_score,
               COUNT(v.visit_id) AS visit_count
        FROM Courses c
        JOIN Visits v ON v.course_id = c.course_id
        {where}
        GROUP BY c.course_id
        HAVING avg_score >= ?
        ORDER BY avg_score DESC
    '''
    rows = db.execute(main_query, params + [min_score]).fetchall()

    cat_query = f'''
        SELECT c.course_id, cr.category,
               ROUND(AVG(cr.score), 1) AS avg_cat_score
        FROM Courses c
        JOIN Visits v ON v.course_id = c.course_id
        JOIN ConditionRatings cr ON cr.visit_id = v.visit_id
        {where}
        GROUP BY c.course_id, cr.category
    '''
    cat_rows = db.execute(cat_query, params).fetchall()
    cat_map = {}
    for r in cat_rows:
        cat_map.setdefault(r['course_id'], {})[r['category']] = r['avg_cat_score']

    prev_query = f'''
        SELECT c.course_id,
               ROUND(AVG(v.overall_score), 1) AS prev_avg_score
        FROM Courses c
        JOIN Visits v ON v.course_id = c.course_id
        {prev_where}
        GROUP BY c.course_id
    '''
    prev_rows = db.execute(prev_query, prev_params).fetchall()
    prev_map = {r['course_id']: r['prev_avg_score'] for r in prev_rows}

    db.close()

    results = []
    for row in rows:
        d = dict(row)
        cid = d['course_id']
        d['category_averages'] = cat_map.get(cid, {})
        prev = prev_map.get(cid)
        if prev is None:
            d['trend'] = 'new'
        elif d['avg_score'] > prev:
            d['trend'] = 'up'
        elif d['avg_score'] < prev:
            d['trend'] = 'down'
        else:
            d['trend'] = 'stable'
        d['prev_avg_score'] = prev
        results.append(d)

    return jsonify(results)


if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=8080)
