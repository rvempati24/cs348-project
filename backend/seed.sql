-- Courses
INSERT INTO Courses (name, city, state, region, num_holes, par, green_fees, website) VALUES
('Pebble Beach Golf Links',      'Pebble Beach',    'CA', 'West',      18, 72, 595.00, 'https://www.pebblebeach.com'),
('Augusta National Golf Club',   'Augusta',         'GA', 'Southeast', 18, 72, NULL,   NULL),
('Pinehurst No. 2',              'Pinehurst',       'NC', 'Southeast', 18, 70, 395.00, 'https://www.pinehurst.com'),
('TPC Sawgrass',                 'Ponte Vedra',     'FL', 'Southeast', 18, 72, 250.00, 'https://www.tpc.com/sawgrass'),
('Bethpage Black',               'Farmingdale',     'NY', 'Northeast', 18, 71,  50.00, 'https://www.nysparks.com'),
('Torrey Pines Golf Course',     'La Jolla',        'CA', 'West',      18, 72,  60.00, 'https://www.torreypinesgolfcourse.com'),
('Whistling Straits',            'Sheboygan',       'WI', 'Midwest',   18, 72, 395.00, 'https://www.americanclubresort.com'),
('Bandon Dunes Golf Resort',     'Bandon',          'OR', 'West',      18, 72, 295.00, 'https://www.bandondunesgolf.com'),
('Kiawah Island Ocean Course',   'Kiawah Island',   'SC', 'Southeast', 18, 72, 390.00, 'https://www.kiawahresort.com'),
('Erin Hills',                   'Erin',            'WI', 'Midwest',   18, 72, 195.00, 'https://www.erinhills.com'),
('Chambers Bay',                 'University Place','WA', 'West',      18, 72, 200.00, 'https://www.chambersbaygolf.com'),
('Liberty National Golf Club',   'Jersey City',     'NJ', 'Northeast', 18, 71, 350.00, 'https://www.libertynationalgolf.com');

-- Visits
INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (1,  '2025-10-05', NULL, 'Stunning views, greens were perfect.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(1,'greens_speed',9.5),(1,'greens_quality',9.2),(1,'fairway_quality',8.8),
(1,'bunker_maintenance',8.5),(1,'tee_boxes',9.0),(1,'rough_condition',8.7),
(1,'pace_of_play',7.5),(1,'staff_friendliness',9.5),(1,'value_for_money',6.0);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (4,  '2025-10-12', NULL, 'Island green was thrilling. Fairways in great shape.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(2,'greens_speed',8.5),(2,'greens_quality',8.8),(2,'fairway_quality',9.0),
(2,'bunker_maintenance',8.0),(2,'tee_boxes',8.5),(2,'rough_condition',8.2),
(2,'pace_of_play',7.0),(2,'staff_friendliness',8.5),(2,'value_for_money',7.5);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (5,  '2025-10-20', NULL, 'Brutal but fair. Greens were lightning fast.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(3,'greens_speed',9.0),(3,'greens_quality',8.5),(3,'fairway_quality',7.5),
(3,'bunker_maintenance',7.0),(3,'tee_boxes',8.0),(3,'rough_condition',7.8),
(3,'pace_of_play',6.5),(3,'staff_friendliness',7.5),(3,'value_for_money',9.0);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (6,  '2025-11-03', NULL, 'Ocean views incredible. South course in top shape.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(4,'greens_speed',8.0),(4,'greens_quality',8.5),(4,'fairway_quality',8.8),
(4,'bunker_maintenance',8.2),(4,'tee_boxes',8.0),(4,'rough_condition',8.5),
(4,'pace_of_play',7.5),(4,'staff_friendliness',8.8),(4,'value_for_money',8.5);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (3,  '2025-11-10', NULL, 'Classic Donald Ross design. Turtleback greens are devilish.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(5,'greens_speed',8.8),(5,'greens_quality',9.0),(5,'fairway_quality',8.5),
(5,'bunker_maintenance',8.8),(5,'tee_boxes',9.0),(5,'rough_condition',8.0),
(5,'pace_of_play',7.8),(5,'staff_friendliness',9.2),(5,'value_for_money',7.0);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (7,  '2025-11-18', NULL, 'Fescue rough was thick. Wind made it a real test.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(6,'greens_speed',8.5),(6,'greens_quality',8.0),(6,'fairway_quality',7.5),
(6,'bunker_maintenance',8.5),(6,'tee_boxes',8.0),(6,'rough_condition',7.0),
(6,'pace_of_play',7.5),(6,'staff_friendliness',8.5),(6,'value_for_money',7.0);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (8,  '2025-12-01', NULL, 'Links golf at its finest. Course in immaculate shape.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(7,'greens_speed',9.0),(7,'greens_quality',9.5),(7,'fairway_quality',9.2),
(7,'bunker_maintenance',9.0),(7,'tee_boxes',9.5),(7,'rough_condition',8.8),
(7,'pace_of_play',8.0),(7,'staff_friendliness',9.5),(7,'value_for_money',8.5);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (9,  '2025-12-08', NULL, 'Marsh views stunning. Greens were a bit bumpy.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(8,'greens_speed',7.0),(8,'greens_quality',7.5),(8,'fairway_quality',8.0),
(8,'bunker_maintenance',7.8),(8,'tee_boxes',8.0),(8,'rough_condition',7.5),
(8,'pace_of_play',6.5),(8,'staff_friendliness',8.5),(8,'value_for_money',6.0);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (10, '2025-12-15', NULL, 'Wide fairways but the fescue is penal. Great value.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(9,'greens_speed',8.0),(9,'greens_quality',8.2),(9,'fairway_quality',8.5),
(9,'bunker_maintenance',8.0),(9,'tee_boxes',8.5),(9,'rough_condition',7.5),
(9,'pace_of_play',7.8),(9,'staff_friendliness',8.0),(9,'value_for_money',8.8);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (11, '2026-01-05', NULL, 'Fescue fairways unique. Views of Puget Sound are unreal.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(10,'greens_speed',7.5),(10,'greens_quality',7.8),(10,'fairway_quality',8.0),
(10,'bunker_maintenance',7.5),(10,'tee_boxes',8.0),(10,'rough_condition',7.8),
(10,'pace_of_play',7.5),(10,'staff_friendliness',8.2),(10,'value_for_money',8.0);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (1,  '2026-01-12', NULL, 'Second visit, even better than the first.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(11,'greens_speed',9.0),(11,'greens_quality',9.5),(11,'fairway_quality',9.0),
(11,'bunker_maintenance',9.2),(11,'tee_boxes',9.0),(11,'rough_condition',9.0),
(11,'pace_of_play',8.0),(11,'staff_friendliness',9.5),(11,'value_for_money',6.5);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (4,  '2026-01-20', NULL, 'Tough day but the course was in great shape.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(12,'greens_speed',8.8),(12,'greens_quality',8.5),(12,'fairway_quality',8.8),
(12,'bunker_maintenance',8.5),(12,'tee_boxes',8.2),(12,'rough_condition',8.0),
(12,'pace_of_play',7.5),(12,'staff_friendliness',8.0),(12,'value_for_money',7.8);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (12, '2026-01-28', NULL, 'NYC skyline views are extraordinary. Top tier conditions.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(13,'greens_speed',9.2),(13,'greens_quality',9.0),(13,'fairway_quality',9.5),
(13,'bunker_maintenance',9.0),(13,'tee_boxes',9.5),(13,'rough_condition',9.0),
(13,'pace_of_play',8.5),(13,'staff_friendliness',9.5),(13,'value_for_money',7.0);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (6,  '2026-02-03', NULL, 'Greens were a bit slow after rain but overall great.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(14,'greens_speed',7.0),(14,'greens_quality',7.5),(14,'fairway_quality',8.2),
(14,'bunker_maintenance',7.8),(14,'tee_boxes',8.0),(14,'rough_condition',8.0),
(14,'pace_of_play',7.2),(14,'staff_friendliness',8.5),(14,'value_for_money',8.0);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (5,  '2026-02-10', NULL, 'Much better conditions than my last visit!');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(15,'greens_speed',9.2),(15,'greens_quality',9.0),(15,'fairway_quality',8.5),
(15,'bunker_maintenance',8.5),(15,'tee_boxes',8.8),(15,'rough_condition',8.5),
(15,'pace_of_play',7.5),(15,'staff_friendliness',8.0),(15,'value_for_money',9.2);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (2,  '2026-02-18', NULL, 'Got lucky with a member invite. Truly flawless.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(16,'greens_speed',10.0),(16,'greens_quality',10.0),(16,'fairway_quality',10.0),
(16,'bunker_maintenance',10.0),(16,'tee_boxes',10.0),(16,'rough_condition',10.0),
(16,'pace_of_play',9.5),(16,'staff_friendliness',10.0),(16,'value_for_money',10.0);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (8,  '2026-02-25', NULL, 'Rain made it tough but conditions held up well.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(17,'greens_speed',8.5),(17,'greens_quality',8.8),(17,'fairway_quality',8.5),
(17,'bunker_maintenance',8.0),(17,'tee_boxes',9.0),(17,'rough_condition',8.2),
(17,'pace_of_play',8.0),(17,'staff_friendliness',9.0),(17,'value_for_money',8.5);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (3,  '2026-03-03', NULL, 'Spring prep underway, a few bare patches but still great.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(18,'greens_speed',8.0),(18,'greens_quality',8.2),(18,'fairway_quality',7.8),
(18,'bunker_maintenance',8.5),(18,'tee_boxes',8.0),(18,'rough_condition',7.5),
(18,'pace_of_play',7.5),(18,'staff_friendliness',9.0),(18,'value_for_money',7.2);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (10, '2026-03-10', NULL, 'Course is really coming into form for spring.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(19,'greens_speed',8.5),(19,'greens_quality',8.8),(19,'fairway_quality',9.0),
(19,'bunker_maintenance',8.5),(19,'tee_boxes',9.0),(19,'rough_condition',8.2),
(19,'pace_of_play',8.0),(19,'staff_friendliness',8.5),(19,'value_for_money',9.0);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (12, '2026-03-18', NULL, 'Perfect spring day. Course was impeccable.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(20,'greens_speed',9.0),(20,'greens_quality',9.2),(20,'fairway_quality',9.5),
(20,'bunker_maintenance',9.0),(20,'tee_boxes',9.5),(20,'rough_condition',9.0),
(20,'pace_of_play',8.5),(20,'staff_friendliness',9.5),(20,'value_for_money',7.5);

INSERT INTO Visits (course_id, visit_date, overall_score, comments) VALUES (11, '2026-03-25', NULL, 'Conditions improving nicely heading into spring.');
INSERT INTO ConditionRatings (visit_id, category, score) VALUES
(21,'greens_speed',8.0),(21,'greens_quality',8.2),(21,'fairway_quality',8.5),
(21,'bunker_maintenance',8.0),(21,'tee_boxes',8.2),(21,'rough_condition',8.0),
(21,'pace_of_play',7.8),(21,'staff_friendliness',8.5),(21,'value_for_money',8.2);

-- Compute overall_score for all visits
UPDATE Visits SET overall_score = ROUND((
    SELECT AVG(score) FROM ConditionRatings WHERE visit_id = Visits.visit_id
), 1);
