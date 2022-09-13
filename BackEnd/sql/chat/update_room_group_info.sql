update
	chat_room
set
	room_name = ${room_name},
	create_user = ${create_user},
	create_date = now()
where
	room_id = ${room_id}
	and room_name != ${room_name}