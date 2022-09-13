insert
	into
	chat_room_member
(room_id,
	room_member,
	create_user,
	create_date)
select
	distinct 
	${room_id},
	${room_member},
	${create_user},
	now()
from
	chat_room_member
where 
	(room_id = ${room_id}
		and ${room_member} not in (
		select
			room_member
		from
			chat_room_member
		where
			room_id = ${room_id}
		))
	or (
	${room_id} not in (
	select
		distinct room_id
	from
		chat_room_member)
	)