insert
	into
	chat_message_have_read
(room_id,
	message_id,
	read_member,
	create_user,
	create_date)
select
	cm.room_id,
	cm.message_id,
	${account_uid} read_member,
	${account_uid} create_user,
	now()
from
	chat_message cm
where
	cm.room_id = ${room_id}
	and send_member != ${account_uid}
	and ${account_uid} not in (
	select
		read_member
	from
		chat_message_have_read cmhr
	where
		room_id = ${room_id}
		and message_id = cm.message_id
		and read_member = ${account_uid}
	)
