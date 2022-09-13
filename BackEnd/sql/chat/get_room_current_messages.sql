select
	x.*,
	to_char(create_date, 'yyyy/mm/dd') d,
	to_char(create_date, 'hh24:mi') hm
from
	(
	select
		cm.room_id ,
		cm.message_seq,
		cm.message_type,
		cm.message_content, 
		cm.send_member, 
		a.name || ' (' || a.account || ')' send_member_name,
		cm.create_date,
		cm.message_id,
		cm.file_id,
		(
		select
			count(*)
		from
			chat_message_have_read cmhr
		where
			room_id = ${room_id}
			and message_id = cm.message_id
		) isread,
		cm.reply_message_id,
		cr.is_group
	from
		chat_message cm
	join chat_room cr on
		cm.room_id = cr.room_id
	left outer join (
		select
			*
		from
			accounts) a on
		a.account_uid = cm.send_member
	where
		cm.room_id = ${room_id}
	order by
		create_date desc
	limit 15) x
order by
	create_date asc