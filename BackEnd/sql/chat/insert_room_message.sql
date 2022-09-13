insert
	into
	chat_message
(room_id,
	message_id,
	message_type,
	message_seq,
	send_member,
	message_content,
	file_id,
	reply_message_id,
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
	${send_member},
	${message_content} ,
	${file_id},
	${reply_message_id},
	now()
