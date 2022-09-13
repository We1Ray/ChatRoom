select
	distinct cr.*
from
	(
	select
		row_number() over() as row_num_id,
		cr2.*
	from
		chat_room cr2) cr,
	chat_room_member crm
where
	cr.room_id = crm.room_id
	and crm.room_member = ${account_uid}