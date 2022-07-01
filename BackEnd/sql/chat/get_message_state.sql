select
		cm.room_id ,
		cm.message_id , 
		cm.send_member, 
		cm.read_member ,
		case
			when (cm.read_member is not null)
			then (
		select
				count(*)
		from
				unnest (string_to_array(read_member, ';')))
		else 0
	end
		as isread,
		cr.is_group
from
		chat_message cm ,
		chat_room cr
where
	cm.room_id = cr.room_id
	and
	${room_id} = cm.room_id
	and ${message_id} = cm.message_id