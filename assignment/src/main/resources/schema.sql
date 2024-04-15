drop table if exists item CASCADE;
CREATE TABLE item
(
    id        bigint AUTO_INCREMENT PRIMARY KEY,
    item_name varchar(10),
    price     integer,
    quantity  integer
);

drop table if exists todo cascade;
create table todo
(
    tno bigint not null auto_increment primary key,
    title varchar(255),
    writer varchar(255),
    complete bit not null default 0,
    due_date date
);

