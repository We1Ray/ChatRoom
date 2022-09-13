select
		cm.room_id ,
		cm.message_id , 
		cm.send_member, 
		(
	select
		count(*)
	from
		chat_message_have_read cmhr
	where
		room_id = ${room_id}
		and message_id = ${message_id} ) isread,
		cr.is_group
from
		chat_message cm ,
		chat_room cr
where
	cm.room_id = cr.room_id
	and
	${room_id} = cm.room_id
	and ${message_id} = cm.message_id