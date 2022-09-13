select
	row_number() over() as ROW_NUM_ID,
	account,
	account_uid,
	email,
	name || ' (' || account || ')' "name"
from
	accounts a
where
	 account_uid not in (
	select
		room_member
	from
		chat_room cr ,
		chat_room_member crm
	where
		cr.room_id = crm.room_id
		and is_group = 'N'
		and room_member = ${account_uid}
	)
	and case
		when ${searchAccount} is not null then (account like '%' || ${searchAccount} || '%'
			or "name" like '%' || ${searchAccount} || '%' )
		else true
	end
order by
	name