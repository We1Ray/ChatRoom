insert
	into
	chat_message
(room_id,
	message_id,
	message_type,
	message_seq,
	message_content,
	send_member,
	read_member,
	file_id,
	create_date)
select
	${room_id},
	${message_id},
	${message_type},
	(
	select
		coalesce (max(message_seq),
		0)+ 1 message_seq
	from
		chat_message cm
	where
		room_id = ${room_id}) as message_seq,
	${message_content} ,	
	${send_member},
	null,
	${file_id},
	now()
