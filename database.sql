-- add table queries in this file

create table login(
    usertype varchar(5),
    userId varchar(8) PRIMARY KEY,
    passw varchar(10)
);

create table admin(
    userId varchar(8) PRIMARY KEY,
    name varchar(10),
    DOB Date
);

create table student(
    userId varchar(8) PRIMARY KEY,
    name varchar(10),
    joining_year varchar(4),
    Student_DOB Date,
    Branch varchar(10)
);

create table courseEnrollment(
    course_id varchar(8) PRIMARY KEY,
    student_id varchar(8) PRIMARY KEY,
    dateofEnrollment Date, FOREIGN KEY (student_id) REFERENCES student(userId), 
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);

create table course(
    course_id varchar(8) PRIMARY KEY,
    coursename varchar(20),
    type varchar(10),
    credits INT
);


