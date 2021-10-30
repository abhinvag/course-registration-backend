create table admin(
    userId varchar(255) PRIMARY KEY,
    name varchar(255),
    DOB Date,
    passw varchar(255)
);

create table student(
    userId varchar(255) PRIMARY KEY,
    name varchar(255),
    joining_year varchar(255),
    Student_DOB Date,
    Branch varchar(255),
    passw varchar(255)
);

create table course(
    course_id varchar(255) PRIMARY KEY,
    coursename varchar(255) UNIQUE 
);

create table courseDetail(
    coursename varchar(255)  PRIMARY KEY,
    type varchar(255),
    credits INT,
	FOREIGN KEY (coursename) REFERENCES course(coursename)
);

create table courseAvailibilty(
    course_id varchar(255),
    semester INT,
    branch varchar(255),
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    PRIMARY KEY(course_id, semester, branch)
);

create table courseEnrollment(
    course_id varchar(255) ,
    student_id varchar(255) ,
    dateofEnrollment Date, FOREIGN KEY (student_id) REFERENCES student(userId), 
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    PRIMARY KEY(course_id,student_id)
);



