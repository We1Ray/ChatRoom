select
	row_number() over() as ROW_NUM_ID,
	account,
	account_uid,
	email,
	name || ' (' || account || ')' name
from
	accounts a
where
	 account_uid not in (
	select
		distinct unnest(string_to_array(room_member , ';')) account_uid
	from
		chat_room cr
	where
		is_group = 'N'
		and ${account_uid} = any(string_to_array(cr.room_member, ';')))
	and case
		when ${searchAccount} is not null then (account like '%' || ${searchAccount} || '%'
			or "name" like '%' || ${searchAccount} || '%' )
		else true
	end
order by
	name