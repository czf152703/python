﻿DROP TABLE IF EXISTS student;
CREATE TABLE IF NOT EXISTS student  (
    sn       INTEGER,     --序号
    no       VARCHAR(10), --学号
    name     TEXT,        --姓名
    gender   CHAR(1),     --性别(F/M/O)
    enrolled DATE,        --入学时间
    PRIMARY KEY(sn)
);

-- 给sn创建一个自增序号
CREATE SEQUENCE seq_student_sn 
    START 10000 INCREMENT 1 OWNED BY student.sn;
ALTER TABLE student ALTER sn 
    SET DEFAULT nextval('seq_student_sn');
-- 学号唯一
CREATE UNIQUE INDEX idx_student_no ON student(no);

-- === 课程表
DROP TABLE IF EXISTS course;
CREATE TABLE IF NOT EXISTS course  (
    sn       INTEGER,     --序号
    no       VARCHAR(10), --课程号
    name     TEXT,        --课程名称
    PRIMARY KEY(sn)
);
CREATE SEQUENCE seq_course_sn 
    START 10000 INCREMENT 1 OWNED BY course.sn;
ALTER TABLE course ALTER sn 
    SET DEFAULT nextval('seq_course_sn');
CREATE UNIQUE INDEX idx_course_no ON course(no);



DROP TABLE IF EXISTS plan;
CREATE TABLE IF NOT EXISTS plan  (
    sn INTEGER,         -- 序号 
    plan_xueqi TEXT,     -- 学期
    plan_name INTEGER,    --课程序号
    plan_time TEXT,      -- 上课时间
    plan_jieci TEXT,
    plan_didian TEXT,    -- 上课地点
    PRIMARY KEY(sn)
);
CREATE SEQUENCE seq_plan_sn 
    START 10000 INCREMENT 1 OWNED BY plan.sn;
ALTER TABLE plan ALTER sn 
    SET DEFAULT nextval('seq_plan_sn');
ALTER TABLE plan
    ADD CONSTRAINT plan_name_fk FOREIGN KEY (plan_name) REFERENCES course(sn);




DROP TABLE IF EXISTS course_grade;
CREATE TABLE IF NOT EXISTS course_grade  (
    stu_sn INTEGER,     -- 学生序号
    cou_sn INTEGER,     -- 课程序号
    grade  NUMERIC(5,2), -- 最终成绩
    PRIMARY KEY(stu_sn, cou_sn)
);

ALTER TABLE course_grade 
    ADD CONSTRAINT stu_sn_fk FOREIGN KEY (stu_sn) REFERENCES student(sn);
ALTER TABLE course_grade 
    ADD CONSTRAINT cou_sn_fk FOREIGN KEY (cou_sn) REFERENCES course(sn);


DROP TABLE IF EXISTS xuanke;
CREATE TABLE IF NOT EXISTS xuanke (
    xstu_sn INTEGER,     -- 学生序号
    plan_sn INTEGER,     --教学计划序号
    PRIMARY key(xstu_sn, plan_sn)
);
ALTER TABLE xuanke
    ADD CONSTRAINT xstu_sn_fk FOREIGN KEY (xstu_sn) REFERENCES student(sn);
ALTER TABLE xuanke 
    ADD CONSTRAINT plan_sn_fk FOREIGN KEY (plan_sn) REFERENCES plan(sn);