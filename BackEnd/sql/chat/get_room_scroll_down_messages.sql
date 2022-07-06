with cte as(
select
		*
from
	chat_message cm
where
	room_id = ${room_id}
	and message_id = ${message_id}
)
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
		cm.read_member,
		cm.create_date,
		cm.message_id,
		cm.file_id,
		case
			when (cm.read_member is not null)
			then (
			select
				count(*)
			from
				unnest (string_to_array(cm.read_member, ';')))
			else 0
		end
		as isread,
		cr.is_group
	from
		chat_message cm ,
		cte,
		chat_room cr ,
		accounts a
	where
		cm.send_member = a.account_uid
		and cm.room_id = cr.room_id
		and
	${room_id} = cm.room_id
		and cm.message_seq -15 <= cte.message_seq
		and cm.message_seq > cte.message_seq
	order by
		create_date desc )x
order by
	create_date asc