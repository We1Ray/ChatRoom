update
	chat_message
set
	message_type = 'string',
	send_member = 'system',
	message_content = ${message_content},
	file_id = null,
	reply_message_id = null
where
	room_id = ${room_id}
	and message_id = ${message_id}