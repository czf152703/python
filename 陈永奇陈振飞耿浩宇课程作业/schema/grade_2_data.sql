DELETE FROM course_grade;
DELETE FROM course;
DELETE FROM student;
DELETE FROM plan;

INSERT INTO student (sn, no, name)  VALUES
    (101, 'S001',  '张三'),
    (102, 'S002',  '李四'), 
    (103, 'S003',  '王五'),
    (104, 'S004',  '马六');

INSERT INTO course (sn, no, name)  VALUES 
    (101, 'C01',  '高数'), 
    (102, 'C02',  '外语'),
    (103, 'C03',  '线代');


INSERT INTO course_grade (stu_sn, cou_sn, grade)  VALUES 
    (101, 101,  91), 
    (102, 101,  89),
    (103, 101,  90),
    (101, 102,  89);

INSERT INTO plan (sn,plan_xueqi,plan_name,plan_time,plan_jieci,plan_didian)  VALUES 
    ( 101,'大二上',101,'周一','第一节','第一公教'),
    ( 102,'大二上',102,'周二','第三节','第一公教'),
    ( 103,'大二下',103,'周三','第四节','第一公教');

INSERT INTO xuanke(xstu_sn,plan_sn) VALUES
    (101,101);
    


    