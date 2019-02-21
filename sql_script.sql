
set SQL_SAFE_UPDATES  = 0;


drop table if exists survey;

create table survey (
id int primary key auto_increment,
name varchar(20),
age varchar(20)
);


insert into survey (name, age) values ('Siyuan','13');

-- insert into survey (name, age) values (?,?);


update survey set name = 'Xinyuan' where age = '13';

select * from survey where age = '13';

-- select * from survey where age = ?;


delete from survey where name = 'Siyuan';
