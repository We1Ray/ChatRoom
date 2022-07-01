select
	*
from
	chat_message cm
where
	room_id = ${room_id}
	and message_content like '%' || ${keyWord} || '%'
order by
	create_date asc