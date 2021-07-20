-- DB 생성 --
create database web;

-- 글 관련 table 생성 --
create table topic(
    id int(11) not null auto_increment,
    title varchar(100) not null,
    description text null,
    created DATETIME not null,
    user_id varchar(100) null,
    primary key(id)
);

-- 저자 table 생성 --
create table auth( 
    count varchar(100) not null,     
    id varchar(30) not null,
    password varchar(100) not null,
    nickname varchar(100) not null,
    primary key(id)
);

-- topic & author left join --
select * from topic left join auth on user_name=count;