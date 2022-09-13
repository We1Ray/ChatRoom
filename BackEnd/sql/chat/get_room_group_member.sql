select
	account_uid ,
	name || ' (' || account || ')' "name"
from
	accounts a,
	chat_room cr,
	chat_room_member crm
where
	cr.room_id = ${room_id}
	and cr.room_id = crm.room_id
	and account_uid = crm.room_member