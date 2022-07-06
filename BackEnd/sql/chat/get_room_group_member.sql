select
	account_uid ,
	name || ' (' || account || ')' name
from
	accounts a,
	chat_room cr
where
	room_id = ${room_id}
	and account_uid = any(string_to_array(room_member, ';'))