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
		a."name" send_member_name,
		cm.read_member ,
		cm.create_date,
		cm.message_id,
		cm.file_id,
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
		chat_room cr ,
		accounts a
	where
		cm.send_member = a.account_uid
		and cm.room_id = cr.room_id
		and
	${room_id} = cm.room_id
	order by
		create_date desc
	limit 15) x
order by
	create_date asc