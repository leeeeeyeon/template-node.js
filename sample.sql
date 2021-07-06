-- DB 생성 --
create database web;

-- 글 관련 table 생성 --
create table topic(
    id int(11) not null auto_increment,
    title varchar(100) not null,
    description text null,
    created DATETIME not null,
    author_id int(11) null,
    primary key(id)
);

-- topic table의 내용 --
insert into topic (title, description, created, author_id) values('mysql', 'mysql is...', now(), 1);
insert into topic (title, description, created, author_id) values('mongodb', 'mongodb is...', now(), 2);
insert into topic (title, description, created, author_id) values('node.js', 'node.js is...', now(), 3);

-- 저자 table 생성 --
create table author( 
    id int(11) not null auto_increment,     
    name varchar(30) null,
    primary key(id)
);

-- author table의 내용 --
insert into author (name) values ('lee');
insert into author (name) values ('kim');
insert into author (name) values ('park');

-- topic & author left join --
select * from topic left join author on topic.author_id=author.id;