delete
from
	chat_room_member
where
	room_id = ${room_id}
	and room_member not in (
	select
		unnest(string_to_array(${room_member}, ',')));