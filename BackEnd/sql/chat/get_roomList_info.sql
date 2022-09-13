select
	cr.*,
	coalesce(NRM.message_count, 0) not_read_message_count,
	LM.last_sender,
	LM.message_id,
	LM.last_message,
	LM.last_date,
	LM.last_d,
	LM.last_hm
from
	(
	select
		NG.room_member,
		NG.room_id,
		a.name || '(' || a.account || ')' room_name,
		NG.create_date,
		to_char(NG.create_date, 'yyyy/mm/dd') create_d,
		to_char(NG.create_date, 'hh24:mi') create_hm,
		NG.is_group,
		NG.create_user
	from
		(
		select
				cr2.*,
				crm.room_member
		from
				chat_room cr2,
			(
			select
					room_id ,
					array_agg(room_member) room_member
			from
					chat_room_member crm
			group by
					room_id
			) crm
		where
			cr2.room_id = crm.room_id
			and is_group = 'N'
		) NG,
		accounts a
	where
		 a.account_uid = any(NG.room_member)
		and a.account_uid != ${account_uid}
union
	select
		crm2.room_member,
		cr3.room_id,
		cr3.room_name,
		cr3.create_date,
		to_char(cr3.create_date, 'yyyy/mm/dd') create_d,
		to_char(cr3.create_date, 'hh24:mi') create_hm,
		cr3.is_group,
		cr3.create_user
	from
		chat_room cr3,
		(
		select
					room_id ,
					array_agg(room_member) room_member
		from
					chat_room_member crm
		group by
					room_id
		) crm2
	where
		cr3.room_id = crm2.room_id
		and is_group = 'Y'
		and ${account_uid} = any(crm2.room_member)) cr
left outer join (
	select
		cm.room_id ,
		count(*) message_count
	from
		chat_message cm
	where
		 send_member != ${account_uid}
		and ${account_uid} not in (
		select
			cmhr.read_member
		from
			chat_message_have_read cmhr
		where
			cmhr.room_id = cm.room_id
			and cmhr.message_id = cm.message_id)
	group by
		cm.room_id) NRM on
	cr.room_id = NRM.room_id
left outer join(
	select
		x.room_id ,
		a.name || ' (' || a.account || ')' last_sender,
		x.message_id ,
		x.message_content last_message,
		x.create_date last_date,
		to_char(x.create_date, 'yyyy/mm/dd') last_d,
		to_char(x.create_date, 'hh24:mi') last_hm
	from
		(
		select
			row_number() over (partition by room_id
		order by
			create_date desc) as r,
			t.*
		from
			chat_message t
		where
			send_member != 'system') x,
		accounts a
	where
		x.r <= 1
		and x.send_member = a.account_uid
				)LM on
	cr.room_id = LM.room_id
where
	${account_uid} = any (cr.room_member)
order by
	last_date desc nulls last,
	create_date desc nulls last