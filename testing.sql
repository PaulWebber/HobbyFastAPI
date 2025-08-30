--delete all data
delete from hobby;
delete from field;
delete from combo_option;
delete from item;
delete from item_value;

--all tables 
select * from hobby;
select * from field;
select * from combo_option;
select * from item;
select * from item_value;

--show Hobby and Fields
select *
from hobby h
left join field f on h.id = f.hobby_id;

--see fields that are added
select h.name, f.name, f.type
from hobby h
left join field f on h.id = f.hobby_id;