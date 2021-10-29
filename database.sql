create table login(
    usertype varchar(100),
    userId varchar(100) PRIMARY KEY,
    passw varchar(100)
);

create table admin(
    userId varchar(100) PRIMARY KEY,
    name varchar(100),
    DOB Date
);

create table student(
    userId varchar(100) PRIMARY KEY,
    name varchar(100),
    joining_year varchar(100),
    Student_DOB Date,
    Branch varchar(100)
);

create table course(
    course_id varchar(100) PRIMARY KEY,
    coursename varchar(100),
    type varchar(100),
    credits INT
);

create table courseEnrollment(
    course_id varchar(100) ,
    student_id varchar(100) ,
    dateofEnrollment Date, FOREIGN KEY (student_id) REFERENCES student(userId), 
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    PRIMARY KEY(course_id,student_id)
);



