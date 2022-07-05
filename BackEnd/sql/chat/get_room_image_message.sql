select
	f.*,
	cm.message_id ,
	to_char( cm.create_date,'yyyy/mm/dd HH24:mm') create_date
from
	chat_message cm,
	file f
where
	room_id = ${room_id}
	and message_type like '%image%'
	and cm.file_id = f.file_id