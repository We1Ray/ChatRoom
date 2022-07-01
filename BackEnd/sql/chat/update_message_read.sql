update
	chat_message
set
	read_member = case
		when read_member is null then ${account_uid}
		else read_member || ';' ||${account_uid}
	end
where
	room_id =${room_id}
	and (${account_uid} != any(string_to_array(read_member, ';'))
		or read_member is null)
	and send_member !=${account_uid};