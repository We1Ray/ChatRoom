select
	cm.*,
	a.name || ' (' || a.account || ')' send_member_name
from
	chat_message cm,
	accounts a
where
	message_id = ${message_id}
	and cm.send_member = a.account_uid