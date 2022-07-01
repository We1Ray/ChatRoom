 select
	distinct cr.*
from
	(
	select
		row_number() over() as row_num_id,
		cr2.*
	from
		chat_room cr2) cr 
where
	${account_uid} = any(string_to_array(cr.room_member, ';'))